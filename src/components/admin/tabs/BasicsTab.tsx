import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Field, Input, Textarea, Section, PrimaryButton } from '../AdminUI';
import { X, Plus } from 'lucide-react';

export function BasicsTab() {
  const { contest, setContest, addAudit } = useStore();
  const [draft, setDraft] = useState(contest);
  const [tagInput, setTagInput] = useState('');
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(contest);

  const save = () => {
    setContest(draft);
    addAudit({ actorName: 'admin', action: 'edited_basics', details: `Updated contest basics` });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || draft.tags.includes(t)) return;
    setDraft({ ...draft, tags: [...draft.tags, t] });
    setTagInput('');
  };

  const removeTag = (t: string) => setDraft({ ...draft, tags: draft.tags.filter(x => x !== t) });

  return (
    <div className="space-y-6">
      <Section
        title="Contest basics"
        description="Title, description, tags. These appear at the top of the public page."
        action={
          <PrimaryButton disabled={!dirty} onClick={save}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </PrimaryButton>
        }
      >
        <div className="space-y-5">
          <Field label="Contest name">
            <Input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          </Field>

          <Field label="URL slug" hint="Used in URLs. Lowercase, no spaces.">
            <Input value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
          </Field>

          <Field label="Description" hint="Shown below the title on the public page.">
            <Textarea rows={5} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
          </Field>

          <Field label="Tags" hint="Press Enter to add a tag.">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {draft.tags.map(t => (
                  <span key={t} className="bg-bg-elevated border border-border rounded-full pl-3 pr-1 py-1 text-xs uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    {t}
                    <button onClick={() => removeTag(t)} className="w-4 h-4 rounded-full hover:bg-bg flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                />
                <button onClick={addTag} className="bg-bg-elevated border border-border rounded-xl px-3 hover:border-accent transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Field>
        </div>
      </Section>
    </div>
  );
}