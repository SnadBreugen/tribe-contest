import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, PrimaryButton, SecondaryButton, Textarea, Field, Select } from '../AdminUI';
import { Trash2, Plus, Quote as QuoteIcon } from 'lucide-react';
import { computeWinners } from '../../../lib/contest';
import type { Quote } from '../../../types';

export function WinnersTab() {
  const { submissions, votes, contest, judges, quotes, setQuotes, addAudit } = useStore();
  const [editing, setEditing] = useState<Quote | null>(null);
  const [creating, setCreating] = useState(false);

  const winners = computeWinners(submissions, votes, 3);
  const activeSubmissions = submissions.filter(s => s.status === 'active');

  const startNew = () => {
    setEditing({
      id: `quote-${Date.now()}`,
      contestId: contest.id,
      judgeId: judges[0]?.id ?? '',
      submissionId: activeSubmissions[0]?.id ?? '',
      text: '',
    });
    setCreating(true);
  };

  const save = () => {
    if (!editing || !editing.text.trim()) return;
    if (creating) {
      setQuotes([...quotes, editing]);
      addAudit({ actorName: 'admin', action: 'added_quote', targetId: editing.id });
    } else {
      setQuotes(quotes.map(q => q.id === editing.id ? editing : q));
      addAudit({ actorName: 'admin', action: 'edited_quote', targetId: editing.id });
    }
    setEditing(null);
    setCreating(false);
  };

  const remove = (q: Quote) => {
    if (!confirm('Delete this quote?')) return;
    setQuotes(quotes.filter(x => x.id !== q.id));
    addAudit({ actorName: 'admin', action: 'removed_quote', targetId: q.id });
  };

  return (
    <div className="space-y-6">
      <Section
        title="Current standings"
        description="Top 3 by community votes (or jury votes). Updates live."
      >
        {winners.length === 0 ? (
          <div className="text-center text-text-muted py-6">No standings yet — no votes cast.</div>
        ) : (
          <div className="space-y-2">
            {winners.map(w => {
              const sub = submissions.find(s => s.id === w.submissionId);
              if (!sub) return null;
              const emoji = ['🥇', '🥈', '🥉'][w.position - 1];
              return (
                <div key={w.submissionId} className="bg-bg rounded-xl border border-border p-4 flex items-center gap-4">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{sub.trackTitle}</div>
                    <div className="text-sm text-text-muted">{sub.artistName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section
        title="Jury quotes"
        description="Comments from jury members about specific tracks. Shown on the winners page."
        action={
          <PrimaryButton onClick={startNew} disabled={judges.length === 0 || activeSubmissions.length === 0}>
            <Plus className="w-4 h-4 inline mr-1" /> Add quote
          </PrimaryButton>
        }
      >
        {judges.length === 0 ? (
          <div className="text-center text-text-muted py-6">Add judges first in the Jury tab.</div>
        ) : quotes.length === 0 ? (
          <div className="text-center text-text-muted py-6">No quotes yet.</div>
        ) : (
          <div className="space-y-3">
            {quotes.map(q => {
              const judge = judges.find(j => j.id === q.judgeId);
              const sub = submissions.find(s => s.id === q.submissionId);
              return (
                <div key={q.id} className="bg-bg rounded-xl border border-border p-4">
                  <div className="flex items-start gap-4">
                    <QuoteIcon className="w-5 h-5 text-text-dim flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="italic text-text">"{q.text}"</p>
                      <div className="text-xs text-text-muted mt-2">
                        — <span className="text-white">{judge?.name ?? 'Unknown judge'}</span>
                        {sub && ` on "${sub.trackTitle}" by ${sub.artistName}`}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <SecondaryButton onClick={() => { setEditing(q); setCreating(false); }}>Edit</SecondaryButton>
                      <button onClick={() => remove(q)} className="p-2 text-text-muted hover:text-accent-red transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setEditing(null); setCreating(false); }}>
          <div className="bg-bg-card rounded-3xl max-w-xl w-full border border-border p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-5">{creating ? 'New quote' : 'Edit quote'}</h2>
            <div className="space-y-4">
              <Field label="Judge">
                <Select value={editing.judgeId} onChange={e => setEditing({ ...editing, judgeId: e.target.value })}>
                  {judges.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                </Select>
              </Field>
              <Field label="About track">
                <Select value={editing.submissionId} onChange={e => setEditing({ ...editing, submissionId: e.target.value })}>
                  {activeSubmissions.map(s => <option key={s.id} value={s.id}>{s.trackTitle} — {s.artistName}</option>)}
                </Select>
              </Field>
              <Field label="Quote">
                <Textarea rows={4} value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} placeholder="What the judge said about this track..." />
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