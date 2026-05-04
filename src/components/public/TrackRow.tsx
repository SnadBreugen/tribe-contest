import { Play, Heart, Share2, Repeat2 } from 'lucide-react';
import type { Submission, Phase, VotingMode } from '../../types';
import { useStore } from '../../lib/store';

interface Props {
  submission: Submission;
  phase: Phase;
  votingMode: VotingMode;
  rank?: number;
  totalPoints?: number;
  showPoints?: boolean;
  accentColor?: string;
}

export function TrackRow({ submission, phase, votingMode, rank, totalPoints, showPoints, accentColor }: Props) {
  const { currentUser, votes, setVotes, contest } = useStore();
  const isCurrentUser = submission.artistId === currentUser.id;
  const userVotes = votes.filter(v => v.voterId === currentUser.id && v.contestId === contest.id);
  const myVoteOnThis = userVotes.find(v => v.submissionId === submission.id);

  const canVote = phase === 'voting' && votingMode === 'community' && !isCurrentUser;

  const castVote = (points: 1 | 2 | 3) => {
    setVotes(prev => {
      let next = prev.filter(v => !(v.voterId === currentUser.id && v.submissionId === submission.id));
      next = next.filter(v => !(v.voterId === currentUser.id && v.contestId === contest.id && v.points === points));
      next.push({
        id: `vote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        contestId: contest.id,
        voterId: currentUser.id,
        voterType: 'community',
        submissionId: submission.id,
        points,
        createdAt: new Date().toISOString(),
      });
      return next;
    });
  };

  const removeVote = () => {
    setVotes(prev => prev.filter(v => !(v.voterId === currentUser.id && v.submissionId === submission.id)));
  };

  const accent = accentColor || '#a78bfa';

  return (
    <div className={`bg-bg-card hover:bg-bg-elevated transition rounded-2xl p-4 flex items-center gap-4 border border-border ${rank && rank <= 3 && phase === 'winners' ? 'border-accent/40' : ''}`}>
      <div className="flex-shrink-0">
        {rank ? (
          <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center">
            {rank <= 3 && phase === 'winners' ? (
              <span className="text-lg">{['🥇', '🥈', '🥉'][rank - 1]}</span>
            ) : (
              <span className="text-text-muted font-mono text-sm">#{rank}</span>
            )}
          </div>
        ) : (
          <button className="w-10 h-10 rounded-xl bg-accent/20 hover:bg-accent/30 flex items-center justify-center transition">
            <Play className="w-4 h-4 text-accent fill-accent" />
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate flex items-center gap-2">
          {submission.trackTitle}
          {isCurrentUser && phase === 'voting' && votingMode === 'community' && (
            <span className="text-[10px] uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5 rounded-full">
              Your submission
            </span>
          )}
        </div>
        <div className="text-sm text-text-muted truncate">{submission.artistName}</div>
      </div>

      {showPoints && totalPoints !== undefined && (
        <div className="text-right hidden sm:block">
          <div className="text-lg font-bold" style={{ color: accent }}>{totalPoints}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim">points</div>
        </div>
      )}

      {canVote && (
        <div className="flex items-center gap-1.5">
          {([3, 2, 1] as const).map(points => {
            const isActive = myVoteOnThis?.points === points;
            return (
              <button
                key={points}
                onClick={() => isActive ? removeVote() : castVote(points)}
                className={`w-9 h-9 rounded-lg font-bold text-sm transition ${
                  isActive
                    ? 'text-white scale-110'
                    : 'bg-bg text-text-muted hover:bg-bg-elevated hover:text-white'
                }`}
                style={isActive ? { backgroundColor: accent } : {}}
                title={`Give ${points} point${points > 1 ? 's' : ''}`}
              >
                {points}
              </button>
            );
          })}
        </div>
      )}

      {!canVote && (
        <div className="flex items-center gap-1 text-text-muted">
          <button className="p-2 hover:text-accent-pink transition" title="Like">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 hover:text-accent transition" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:text-accent transition hidden sm:inline-flex" title="Remix">
            <Repeat2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}