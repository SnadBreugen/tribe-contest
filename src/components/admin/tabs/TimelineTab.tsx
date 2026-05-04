import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Field, Input, Section, PrimaryButton } from '../AdminUI';
import { computePhase } from '../../../lib/contest';

function isoToLocal(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
}

function localToIso(local: string): string | undefined {
  if (!local) return undefined;
  return new Date(local).toISOString();
}

export function TimelineTab() {
  const { contest, setContest, addAudit } = useStore();
  const [draft, setDraft] = useState(contest);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(contest);

  const save = () => {
    setContest(draft);
    addAudit({ actorName: 'admin', action: 'edited_timeline', details: 'Updated contest dates' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const livePhase = computePhase(draft);

  return (
    <div className="space-y-6">
      <Section
        title="Timeline"
        description="The four key dates that drive the contest phases."
        action={
          <PrimaryButton disabled={!dirty} onClick={save}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </PrimaryButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Submission start" hint="Optional. Before this: phase 'Coming Soon'.">
            <Input
              type="datetime-local"
              value={isoToLocal(draft.submissionStart)}
              onChange={e => setDraft({ ...draft, submissionStart: localToIso(e.target.value) })}
            />
          </Field>

          <Field label="Submission end" hint="Required. After this: voting begins.">
            <Input
              type="datetime-local"
              value={isoToLocal(draft.submissionEnd)}
              onChange={e => setDraft({ ...draft, submissionEnd: localToIso(e.target.value)! })}
            />
          </Field>

          <Field label="Voting end" hint="Required for community voting. Phase becomes 'Pending'.">
            <Input
              type="datetime-local"
              value={isoToLocal(draft.votingEnd)}
              onChange={e => setDraft({ ...draft, votingEnd: localToIso(e.target.value) })}
            />
          </Field>

          <Field label="Contest end (winners announced)" hint="Required. After this: phase 'Winners'.">
            <Input
              type="datetime-local"
              value={isoToLocal(draft.contestEnd)}
              onChange={e => setDraft({ ...draft, contestEnd: localToIso(e.target.value)! })}
            />
          </Field>
        </div>

        <div className="mt-6 bg-bg rounded-xl p-4 border border-border">
          <div className="text-xs text-text-dim uppercase tracking-wider mb-1">Current phase based on these dates</div>
          <div className="text-lg font-semibold">{livePhase}</div>
        </div>
      </Section>
    </div>
  );
}