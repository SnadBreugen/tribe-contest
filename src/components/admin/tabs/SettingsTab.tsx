import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Field, Input, Section, PrimaryButton, Toggle, Select } from '../AdminUI';

export function SettingsTab() {
  const { contest, setContest, addAudit } = useStore();
  const [draft, setDraft] = useState(contest);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(contest);

  const save = () => {
    setContest(draft);
    addAudit({ actorName: 'admin', action: 'edited_settings', details: 'Updated contest settings' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Section
        title="Voting & jury"
        description="How winners are determined."
        action={
          <PrimaryButton disabled={!dirty} onClick={save}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </PrimaryButton>
        }
      >
        <div className="space-y-5">
          <Field label="Voting mode" hint="Community: users pick top 3 (3/2/1 points). Jury: panel decides.">
            <Select value={draft.votingMode} onChange={e => setDraft({ ...draft, votingMode: e.target.value as 'community' | 'jury' })}>
              <option value="community">Community vote</option>
              <option value="jury">Jury vote</option>
            </Select>
          </Field>

          <Toggle
            checked={draft.showJurySection}
            onChange={v => setDraft({ ...draft, showJurySection: v })}
            label="Show jury section on public page (always visible if jury voting)"
          />

          <Toggle
            checked={draft.preModeration}
            onChange={v => setDraft({ ...draft, preModeration: v })}
            label="Pre-moderation: submissions need admin approval before showing publicly"
          />
        </div>
      </Section>

      <Section title="Track rules" description="Limits on what users can submit.">
        <div className="space-y-5">
          <Field label="Max tracks per user" hint="How many submissions one user can make.">
            <Input
              type="number"
              min={1}
              max={10}
              value={draft.maxTracksPerUser}
              onChange={e => setDraft({ ...draft, maxTracksPerUser: parseInt(e.target.value) || 1 })}
            />
          </Field>

          <Toggle
            checked={draft.allowRemixes}
            onChange={v => setDraft({ ...draft, allowRemixes: v })}
            label="Allow remixes / collaborative tracks"
          />
        </div>
      </Section>
    </div>
  );
}