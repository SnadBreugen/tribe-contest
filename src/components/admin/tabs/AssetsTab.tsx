import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, PrimaryButton, Input, Field } from '../AdminUI';
import { ImageIcon } from 'lucide-react';

export function AssetsTab() {
  const { contest, setContest, addAudit } = useStore();
  const [draft, setDraft] = useState(contest);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(contest);

  const save = () => {
    setContest(draft);
    addAudit({ actorName: 'admin', action: 'edited_assets', details: 'Updated banner/assets' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Section
        title="Banner & assets"
        description="The banner image is the visual identity of the contest."
        action={
          <PrimaryButton disabled={!dirty} onClick={save}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </PrimaryButton>
        }
      >
        <div className="space-y-5">
          <Field label="Banner preview">
            <div className="aspect-video rounded-2xl bg-bg-elevated overflow-hidden border border-border">
              {draft.bannerUrl ? (
                <img src={draft.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-dim">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}
            </div>
          </Field>

          <Field
            label="Banner image URL"
            hint="Hosted image URL. Use 16:9 aspect for best results. The colors are auto-extracted for accents."
          >
            <Input
              value={draft.bannerUrl}
              onChange={e => setDraft({ ...draft, bannerUrl: e.target.value })}
              placeholder="https://..."
            />
          </Field>

          <Field label="Banner video URL (optional)" hint="If set, replaces the banner image with a looping video.">
            <Input
              value={draft.bannerVideoUrl ?? ''}
              onChange={e => setDraft({ ...draft, bannerVideoUrl: e.target.value })}
              placeholder="https://..."
            />
          </Field>

          <Field label="Logo URL (optional)" hint="Custom logo for this contest.">
            <Input
              value={draft.logoUrl ?? ''}
              onChange={e => setDraft({ ...draft, logoUrl: e.target.value })}
              placeholder="https://..."
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}