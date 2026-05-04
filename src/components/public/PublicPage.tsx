import { useStore } from '../../lib/store';
import { computePhase } from '../../lib/contest';

export function PublicPage() {
  const { contest, devPhase } = useStore();
  const phase = devPhase ?? computePhase(contest);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{contest.name}</h1>
      <p className="text-text-muted mb-2">Phase: <span className="text-white">{phase}</span></p>
      <p className="text-text-muted">Public page — full implementation coming next.</p>
      <a href="/tribe-contest/admin" className="text-accent underline mt-4 inline-block">
        Go to Admin →
      </a>
    </div>
  );
}
