import { useState } from 'react';
import { Calendar, Trophy, FileText, Vote as VoteIcon, ChevronRight, Bell } from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatCountdown, formatDate } from '../../lib/contest';
import type { Phase, VotingMode, Prize } from '../../types';
import { PrizeModal } from './PrizeModal';

interface Props {
  phase: Phase;
  votingMode: VotingMode;
  accentColor?: string;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-bg-card rounded-2xl p-5 border border-border">{children}</div>;
}

export function Sidebar({ phase, votingMode, accentColor }: Props) {
  const { contest, prizes, judges, terms } = useStore();
  const [openPrize, setOpenPrize] = useState<Prize | null>(null);
  const [notified, setNotified] = useState(false);

  const showJury = contest.showJurySection && judges.length > 0;
  const accent = accentColor || '#a78bfa';

  const labels: Record<Phase, string> = {
    coming: 'Starts in',
    open: 'Submission ends',
    voting: 'Voting ends',
    pending: 'Winners announced',
    winners: 'Contest ended',
  };
  const targets: Record<Phase, string | undefined> = {
    coming: contest.submissionStart,
    open: contest.submissionEnd,
    voting: contest.votingEnd,
    pending: contest.contestEnd,
    winners: contest.contestEnd,
  };
  const countdownLabel = labels[phase];
  const countdownTarget = targets[phase];

  return (
    <aside className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-semibold mb-3">
          <Calendar className="w-3.5 h-3.5" />
          {countdownLabel}
        </div>
        {countdownTarget && phase !== 'winners' ? (
          <>
            <div className="text-2xl font-bold mb-1">{formatCountdown(countdownTarget)}</div>
            <div className="text-sm text-text-muted">{formatDate(countdownTarget)}</div>
          </>
        ) : (
          <div className="text-base text-text-muted">{formatDate(countdownTarget)}</div>
        )}

        {phase === 'coming' && (
          <button
            onClick={() => setNotified(true)}
            disabled={notified}
            className={`w-full mt-4 rounded-xl py-2.5 text-sm font-medium transition flex items-center justify-center gap-2 ${
              notified ? 'bg-bg text-text-muted' : 'bg-accent hover:bg-accent/80 text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            {notified ? "You're on the list" : 'Notify me'}
          </button>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-semibold mb-3">
          <VoteIcon className="w-3.5 h-3.5" />
          Voting
        </div>
        {votingMode === 'community' ? (
          <>
            <div className="font-semibold mb-1">Community vote</div>
            <p className="text-sm text-text-muted leading-relaxed">
              Pick your top 3 tracks. Highest gets <span className="text-white font-medium">3 points</span>, second <span className="text-white font-medium">2</span>, third <span className="text-white font-medium">1</span>.
            </p>
          </>
        ) : (
          <>
            <div className="font-semibold mb-1">Jury vote</div>
            <p className="text-sm text-text-muted leading-relaxed">
              Winners are selected by our expert jury panel.
            </p>
          </>
        )}
      </Card>

      {prizes.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-semibold mb-4">
            <Trophy className="w-3.5 h-3.5" />
            Prizes
          </div>
          <div className="space-y-3">
            {prizes
              .slice()
              .sort((a, b) => a.position - b.position)
              .map(prize => (
                <button
                  key={prize.id}
                  onClick={() => setOpenPrize(prize)}
                  className="w-full text-left bg-bg hover:bg-bg-elevated transition rounded-xl overflow-hidden border border-border group"
                >
                  <div className="aspect-[4/3] bg-bg-elevated relative">
                    {prize.imageUrl ? (
                      <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-text-dim opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-bg/80 backdrop-blur rounded-full px-2 py-1 text-xs font-bold">
                      {prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : prize.position === 3 ? '🥉' : `#${prize.position}`}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm leading-tight truncate">{prize.name}</div>
                    {prize.subtitle && <div className="text-xs text-text-muted mt-0.5">{prize.subtitle}</div>}
                    <div className="flex items-center gap-1 text-xs mt-2 group-hover:gap-2 transition" style={{ color: accent }}>
                      View details <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </Card>
      )}

      {showJury && (
        <Card>
          <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-semibold mb-3">
            👥 Meet the Jury
          </div>
          <div className="space-y-3">
            {judges.map(judge => (
              <div key={judge.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-pink flex-shrink-0 flex items-center justify-center text-sm font-bold">
                  {judge.photoUrl ? (
                    <img src={judge.photoUrl} alt={judge.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    judge.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate flex items-center gap-1.5">
                    {judge.name}
                    {judge.isAudiotoolMember && (
                      <span className="text-[9px] uppercase tracking-wider bg-accent/20 text-accent px-1.5 py-0.5 rounded">AT</span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted truncate">{judge.title}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          Terms & Conditions
        </div>
        <ul className="space-y-2 text-xs text-text-muted leading-relaxed">
          {terms.slice().sort((a, b) => a.order - b.order).map(t => (
            <li key={t.id} className="flex gap-2">
              <span className="text-accent flex-shrink-0">·</span>
              <span>{t.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <PrizeModal prize={openPrize} onClose={() => setOpenPrize(null)} />
    </aside>
  );
}