import { useState } from 'react';
import { useStore } from '../../lib/store';
import { computePhase } from '../../lib/contest';
import { TopNav } from './TopNav';
import { Banner } from './Banner';
import { StatusBar } from './StatusBar';
import { SubmitHero } from './SubmitHero';
import { TrackList } from './TrackList';
import { Sidebar } from './Sidebar';
import { WinnersHero } from './WinnersHero';
import { DevControls } from '../shared/DevControls';
import type { Phase, VotingMode } from '../../types';

export function PublicPage() {
  const { contest, devPhase, devVotingMode } = useStore();
  const [colors, setColors] = useState<{ primary: string; secondary: string; tertiary: string } | null>(null);

  const phase: Phase = devPhase ?? computePhase(contest);
  const votingMode: VotingMode = devVotingMode ?? contest.votingMode;

  const handleSubmit = () => {
    alert('Track submission requires Audiotool platform integration. In the live version, this would open the submission flow with the user\'s tracks.');
  };

  return (
    <div className="min-h-screen bg-bg pb-16">
      <TopNav />

      <main className="max-w-[1280px] mx-auto px-6 py-6 space-y-6">
        <StatusBar phase={phase} />

        <Banner onColorsExtracted={setColors} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6 min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {contest.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs uppercase tracking-wider bg-bg-card border border-border rounded-full px-3 py-1 text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{contest.name}</h1>
              <p className="text-text-muted leading-relaxed text-base md:text-lg">
                {contest.description}
              </p>
            </div>

            {phase === 'open' && (
              <SubmitHero
                accentColor={colors?.primary}
                accentColor2={colors?.secondary}
                onSubmit={handleSubmit}
              />
            )}

            {phase === 'winners' && (
              <WinnersHero
                accentColor={colors?.primary}
                accentColor2={colors?.secondary}
              />
            )}

            {phase === 'coming' && (
              <div className="bg-bg-card rounded-3xl p-8 md:p-10 text-center border border-border">
                <h2 className="text-2xl font-bold mb-2">Coming soon</h2>
                <p className="text-text-muted">
                  Submissions open {contest.submissionStart && new Date(contest.submissionStart).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
                </p>
              </div>
            )}

            {phase === 'pending' && (
              <div className="bg-bg-card rounded-3xl p-8 text-center border border-border">
                <h2 className="text-xl font-bold mb-2">Voting closed</h2>
                <p className="text-text-muted">
                  Final results will be announced shortly.
                </p>
              </div>
            )}

            {phase !== 'coming' && (
              <TrackList
                phase={phase}
                votingMode={votingMode}
                accentColor={colors?.primary}
              />
            )}
          </div>

          <Sidebar phase={phase} votingMode={votingMode} accentColor={colors?.primary} />
        </div>
      </main>

      <DevControls />
    </div>
  );
}