import { Trophy, Quote as QuoteIcon } from 'lucide-react';
import { useStore } from '../../lib/store';
import { computeWinners } from '../../lib/contest';

interface Props {
  accentColor?: string;
  accentColor2?: string;
}

export function WinnersHero({ accentColor, accentColor2 }: Props) {
  const { submissions, votes, quotes, judges, contest } = useStore();

  const winners = computeWinners(submissions, votes, 3);

  const gradient = accentColor && accentColor2
    ? `linear-gradient(135deg, ${accentColor}22, ${accentColor2}22)`
    : `linear-gradient(135deg, #a78bfa22, #ec489922)`;

  if (winners.length === 0) {
    return (
      <div className="bg-bg-card rounded-3xl p-8 text-center border border-border">
        <p className="text-text-muted">Winners will be announced soon.</p>
      </div>
    );
  }

  const podium = winners.map(w => ({
    ...w,
    submission: submissions.find(s => s.id === w.submissionId)!,
    quotes: quotes.filter(q => q.submissionId === w.submissionId && q.contestId === contest.id),
  }));

  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <div className="space-y-6">
      <div
        className="rounded-3xl p-8 md:p-10 border border-border text-center"
        style={{ background: gradient }}
      >
        <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: accentColor || '#a78bfa' }} />
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Winners Announced</h2>
        <p className="text-text-muted">Congratulations to our top tracks</p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 items-end">
        {podiumOrder.map((p, idx) => {
          if (!p) return <div key={idx} />;
          const heights = ['h-40 md:h-52', 'h-52 md:h-72', 'h-32 md:h-44'];
          const colors = ['from-zinc-400 to-zinc-600', 'from-amber-400 to-amber-600', 'from-amber-700 to-amber-900'];
          const order = [2, 1, 3];
          const placeIdx = order[idx] - 1;
          const emojis = ['🥇', '🥈', '🥉'];
          return (
            <div key={p.submission.id} className="flex flex-col">
              <div className="bg-bg-card rounded-t-2xl p-3 md:p-4 text-center border border-border border-b-0">
                <div className="text-3xl mb-1">{emojis[placeIdx]}</div>
                <div className="font-semibold text-sm md:text-base truncate">{p.submission.trackTitle}</div>
                <div className="text-xs text-text-muted truncate">{p.submission.artistName}</div>
              </div>
              <div className={`${heights[idx]} bg-gradient-to-b ${colors[placeIdx]} rounded-b-2xl flex items-center justify-center text-white font-bold text-xl md:text-2xl`}>
                {placeIdx + 1}
              </div>
            </div>
          );
        })}
      </div>

      {contest.showJurySection && podium.some(p => p.quotes.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <QuoteIcon className="w-5 h-5" />
            Jury Comments
          </h3>
          {podium.map(p => p.quotes.map(q => {
            const judge = judges.find(j => j.id === q.judgeId);
            if (!judge) return null;
            return (
              <div key={q.id} className="bg-bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-pink flex-shrink-0 flex items-center justify-center font-bold">
                    {judge.photoUrl ? (
                      <img src={judge.photoUrl} alt={judge.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      judge.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-text-muted mb-1">
                      On <span className="text-white font-medium">{p.submission.trackTitle}</span> by {p.submission.artistName}
                    </div>
                    <p className="text-text leading-relaxed mb-3 italic">"{q.text}"</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{judge.name}</span>
                      <span className="text-text-dim text-xs">·</span>
                      <span className="text-text-muted text-xs">{judge.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      )}
    </div>
  );
}