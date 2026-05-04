import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useStore } from '../../lib/store';
import { resetAllPrototypeData } from '../../hooks/useLocalStorage';
import type { Phase, VotingMode } from '../../types';

const PHASES: { value: Phase | null; label: string }[] = [
  { value: null, label: 'Auto (by date)' },
  { value: 'coming', label: 'Coming Soon' },
  { value: 'open', label: 'Open' },
  { value: 'voting', label: 'Voting' },
  { value: 'pending', label: 'Pending' },
  { value: 'winners', label: 'Winners' },
];

const MODES: { value: VotingMode | null; label: string }[] = [
  { value: null, label: 'Use contest setting' },
  { value: 'community', label: 'Community' },
  { value: 'jury', label: 'Jury' },
];

export function DevControls() {
  const [open, setOpen] = useState(false);
  const { devPhase, setDevPhase, devVotingMode, setDevVotingMode } = useStore();

  const handleReset = () => {
    if (confirm('Reset prototype to initial state? All votes, edits and removals will be cleared.')) {
      resetAllPrototypeData();
      window.location.reload();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-bg-elevated border border-border-strong rounded-full p-3 shadow-xl hover:border-accent transition"
        title="Dev controls"
      >
        <Settings className="w-4 h-4 text-text-muted" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-bg-elevated border border-border-strong rounded-2xl p-4 shadow-2xl w-72">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-muted">Dev Controls</h3>
        <button onClick={() => setOpen(false)} className="text-text-muted hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-text-dim block mb-1">Phase override</label>
          <select
            value={devPhase ?? ''}
            onChange={e => setDevPhase((e.target.value || null) as Phase | null)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          >
            {PHASES.map(p => (
              <option key={p.label} value={p.value ?? ''}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-text-dim block mb-1">Voting mode override</label>
          <select
            value={devVotingMode ?? ''}
            onChange={e => setDevVotingMode((e.target.value || null) as VotingMode | null)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          >
            {MODES.map(m => (
              <option key={m.label} value={m.value ?? ''}>{m.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          className="w-full text-xs text-text-muted hover:text-accent-red border border-border rounded-lg py-2 transition"
        >
          Reset prototype data
        </button>
      </div>

      <p className="text-[10px] text-text-dim mt-3 leading-relaxed">
        Dev controls only — devs will remove this. State persists in your browser.
      </p>
    </div>
  );
}