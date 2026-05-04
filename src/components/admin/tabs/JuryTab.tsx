import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, PrimaryButton, SecondaryButton, Input, Textarea, Field, Toggle } from '../AdminUI';
import { Trash2, Plus, User } from 'lucide-react';
import type { Judge } from '../../../types';

export function JuryTab() {
  const { judges, setJudges, addAudit } = useStore();
  const [editing, setEditing] = useState<Judge | null>(null);
  const [creating, setCreating] = useState(false);

  const startNew = () => {
    setEditing({
      id: `judge-${Date.now()}`,
      name: '',
      title: '',
      bio: '',
      links: [],
      isAudiotoolMember: false,
    });
    setCreating(true);
  };

  const save = () => {
    if (!editing) return;
    if (creating) {
      setJudges([...judges, editing]);
      addAudit({ actorName: 'admin', action: 'added_judge', details: editing.name, targetId: editing.id });
    } else {
      setJudges(judges.map(j => j.id === editing.id ? editing : j));
      addAudit({ actorName: 'admin', action: 'edited_judge', details: editing.name, targetId: editing.id });
    }
    setEditing(null);
    setCreating(false);
  };

  const remove = (j: Judge) => {
    if (!confirm(`Remove judge "${j.name}"?`)) return;
    setJudges(judges.filter(x => x.id !== j.id));
    addAudit({ actorName: 'admin', action: 'removed_judge', details: j.name, targetId: j.id });
  };

  return (
    <div className="space-y-6">
      <Section
        title="Jury"
        description="Members of the jury panel. Shown on the public page if 'Show jury section' is enabled, or always for jury voting."
        action={
          <PrimaryButton onClick={startNew}>
            <Plus className="w-4 h-4 inline mr-1" /> Add judge
          </PrimaryButton>
        }
      >
        {judges.length === 0 ? (
          <div className="text-center text-text-muted py-8">No judges yet.</div>
        ) : (
          <div className="space-y-3">
            {judges.map(j => (
              <div key={j.id} className="bg-bg rounded-xl border border-border p-4 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-bg-elevated flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {j.photoUrl ? (
                    <img src={j.photoUrl} alt={j.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-text-dim" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center gap-2">
                    {j.name || '(Unnamed)'}
                    {j.isAudiotoolMember && (
                      <span className="text-[9px] uppercase tracking-wider bg-accent/20 text-accent px-1.5 py-0.5 rounded">AT Member</span>
                    )}
                  </div>
                  <div className="text-sm text-text-muted">{j.title}</div>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">{j.bio}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <SecondaryButton onClick={() => { setEditing(j); setCreating(false); }}>Edit</SecondaryButton>
                  <button onClick={() => remove(j)} className="p-2 text-text-muted hover:text-accent-red transition">
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
            <h2 className="text-xl font-bold mb-5">{creating ? 'New judge' : 'Edit judge'}</h2>
            <div className="space-y-4">
              <Field label="Name">
                <Input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Title / Role">
                <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. 'Producer' or 'Acid House Pioneer'" />
              </Field>
              <Field label="Bio">
                <Textarea rows={4} value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} />
              </Field>
              <Field label="Photo URL">
                <Input value={editing.photoUrl ?? ''} onChange={e => setEditing({ ...editing, photoUrl: e.target.value })} placeholder="https://..." />
              </Field>
              <Toggle
                checked={editing.isAudiotoolMember}
                onChange={v => setEditing({ ...editing, isAudiotoolMember: v })}
                label="This judge is an Audiotool community member"
              />
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