import { useMemo } from 'react';
import { TrackRow } from './TrackRow';
import { useStore } from '../../lib/store';
import { rankedSubmissions, computeScores } from '../../lib/contest';
import type { Phase, VotingMode } from '../../types';

interface Props {
  phase: Phase;
  votingMode: VotingMode;
  accentColor?: string;
}

export function TrackList({ phase, votingMode, accentColor }: Props) {
  const { submissions, votes } = useStore();

  const visible = useMemo(() => submissions.filter(s => s.status === 'active'), [submissions]);
  const showRanking = phase === 'winners' || phase === 'pending';
  const showPoints = phase === 'winners' || (phase === 'pending' && votingMode === 'community');

  const ordered = useMemo(() => {
    if (showRanking) return rankedSubmissions(submissions, votes);
    return visible;
  }, [submissions, votes, showRanking, visible]);

  const scores = useMemo(() => computeScores(submissions, votes), [submissions, votes]);

  if (visible.length === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-12 text-center border border-border">
        <p className="text-text-muted">No submissions yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-xl font-bold">
          {phase === 'winners' ? 'Final Results' : phase === 'pending' ? 'Voting Closed' : 'Submissions'}
          <span className="text-text-muted text-sm font-normal ml-2">{visible.length}</span>
        </h2>
      </div>

      {ordered.map((submission, idx) => (
        <TrackRow
          key={submission.id}
          submission={submission}
          phase={phase}
          votingMode={votingMode}
          rank={showRanking ? idx + 1 : undefined}
          totalPoints={showPoints ? scores.get(submission.id) ?? 0 : undefined}
          showPoints={showPoints}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}