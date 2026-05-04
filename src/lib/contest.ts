import type { Contest, Phase, Submission, Vote, Winner } from '../types';

/**
 * Determine the current phase of a contest based on dates and vote count.
 * Can be overridden for dev/preview purposes.
 */
export function computePhase(contest: Contest, now: Date = new Date()): Phase {
  const subStart = contest.submissionStart ? new Date(contest.submissionStart) : null;
  const subEnd = new Date(contest.submissionEnd);
  const voteEnd = contest.votingEnd ? new Date(contest.votingEnd) : null;
  const contestEnd = new Date(contest.contestEnd);

  if (subStart && now < subStart) return 'coming';
  if (now < subEnd) return 'open';
  if (voteEnd && now < voteEnd) return 'voting';
  if (now < contestEnd) return 'pending';
  return 'winners';
}

/**
 * Format remaining time until a target date as "Xd Yh" or "Yh Zm".
 */
export function formatCountdown(target: string | Date, now: Date = new Date()): string {
  const tgt = typeof target === 'string' ? new Date(target) : target;
  const diff = tgt.getTime() - now.getTime();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Compute total points for each submission. Returns a Map of submissionId → points.
 */
export function computeScores(submissions: Submission[], votes: Vote[]): Map<string, number> {
  const scores = new Map<string, number>();
  for (const s of submissions) {
    if (s.status === 'active') scores.set(s.id, 0);
  }
  for (const v of votes) {
    if (scores.has(v.submissionId)) {
      scores.set(v.submissionId, (scores.get(v.submissionId) || 0) + v.points);
    }
  }
  return scores;
}

/**
 * Sort active submissions by score (descending). For ties, preserve insertion order.
 */
export function rankedSubmissions(submissions: Submission[], votes: Vote[]): Submission[] {
  const active = submissions.filter(s => s.status === 'active');
  const scores = computeScores(active, votes);
  return [...active].sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0));
}

/**
 * Compute winners from current scores, top N (default 3).
 */
export function computeWinners(submissions: Submission[], votes: Vote[], topN = 3): Winner[] {
  const ranked = rankedSubmissions(submissions, votes);
  return ranked.slice(0, topN).map((s, i) => ({ position: i + 1, submissionId: s.id }));
}

/**
 * Get all votes by a specific voter for a contest.
 */
export function getUserVotes(votes: Vote[], voterId: string): Vote[] {
  return votes.filter(v => v.voterId === voterId);
}

/**
 * Format an ISO date as "Mar 17, 2026"
 */
export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
