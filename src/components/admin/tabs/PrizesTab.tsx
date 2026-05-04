import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, PrimaryButton, SecondaryButton, Input, Textarea, Field, DangerButton } from '../AdminUI';
import { Trophy, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import type { Prize } from '../../../types';

export function PrizesTab() {
  const { prizes, setPrizes, addAudit, contest } = useStore();
  const [editing, setEditing] = useState<Prize | null>(null);
  const [creating, setCreating] = useState(false);

  const sorted = [...prizes].sort((a, b) => a.position - b.position);

  const startNew = () => {
    setEditing({
      id: `prize-${Date.now()}`,
      contestId: contest.id,
      position: (sorted[sorted.length - 1]?.position ?? 0) + 1,
      name: '',
      subtitle: '',
      description: '',
    });
    setCreating(true);
  };

  const save = () => {
    if (!editing) return;
    if (creating) {
      setPrizes([...prizes, editing]);
      addAudit({ actorName: 'admin', action: 'added_prize', details: editing.name, targetId: editing.id });
    } else {
      setPrizes(prizes.map(p => p.id === editing.id ? editing : p));
      addAudit({ actorName: 'admin', action: 'edited_prize', details: editing.name, targetId: editing.id });
    }
    setEditing(null);
    setCreating(false);
  };

  const remove = (p: Prize) => {
    if (!confirm(`Delete prize "${p.name}"?`)) return;
    setPrizes(prizes.filter(x => x.id !== p.id));
    addAudit({ actorName: 'admin', action: 'removed_prize', details: p.name, targetId: p.id });
  };

  const movePosition = (id: string, dir: -1 | 1) => {
    const idx = sorted.findIndex(p => p.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    setPrizes(prizes.map(p => {
      if (p.id === id) return { ...p, position: swap.position };
      if (p.id === swap.id) return { ...p, position: sorted[idx].position };
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <Section
        title="Prizes"
        description="Prizes are awarded based on final position. The order matters — first prize goes to position 1."
        action={
          <PrimaryButton onClick={startNew}>
            <Plus className="w-4 h-4 inline mr-1" /> Add prize
          </PrimaryButton>
        }
      >
        {sorted.length === 0 ? (
          <div className="text-center text-text-muted py-8">No prizes yet. Add one above.</div>
        ) : (
          <div className="space-y-3">
            {sorted.map((p, idx) => (
              <div key={p.id} className="bg-bg rounded-xl border border-border p-4 flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => movePosition(p.id, -1)} disabled={idx === 0} className="text-text-dim hover:text-white disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-text-dim font-mono text-center">#{p.position}</span>
                  <button onClick={() => movePosition(p.id, 1)} disabled={idx === sorted.length - 1} className="text-text-dim hover:text-white disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-20 h-20 rounded-lg bg-bg-elevated flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Trophy className="w-8 h-8 text-text-dim" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{p.name || '(Untitled prize)'}</div>
                  {p.subtitle && <div className="text-sm text-text-muted">{p.subtitle}</div>}
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <SecondaryButton onClick={() => { setEditing(p); setCreating(false); }}>Edit</SecondaryButton>
                  <button onClick={() => remove(p)} className="p-2 text-text-muted hover:text-accent-red transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setEditing(null); setCreating(false); }}>
          <div className="bg-bg-card rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-border p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-5">{creating ? 'New prize' : 'Edit prize'}</h2>
            <div className="space-y-4">
              <Field label="Position">
                <Input type="number" min={1} value={editing.position} onChange={e => setEditing({ ...editing, position: parseInt(e.target.value) || 1 })} />
              </Field>
              <Field label="Name">
                <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Subtitle (e.g. '1st Place')">
                <Input value={editing.subtitle ?? ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea rows={4} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </Field>
              <Field label="Image URL" hint="Optional. Paste a link to a prize image.">
                <Input value={editing.imageUrl ?? ''} onChange={e => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://..." />
              </Field>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <SecondaryButton onClick={() => { setEditing(null); setCreating(false); }}>Cancel</SecondaryButton>
              <PrimaryButton onClick={save}>{creating ? 'Create' : 'Save'}</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}