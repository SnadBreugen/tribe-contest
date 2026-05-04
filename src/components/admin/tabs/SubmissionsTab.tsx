import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, SecondaryButton, DangerButton, Textarea, Field, Select } from '../AdminUI';
import { ExternalLink, Trash2, RotateCcw } from 'lucide-react';
import type { Submission, RemovalReason } from '../../../types';
import { computeScores } from '../../../lib/contest';

const REASONS: { value: RemovalReason; label: string }[] = [
  { value: 'rule_violation', label: 'Rule violation' },
  { value: 'copyright', label: 'Copyright issue' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'duplicate', label: 'Duplicate submission' },
  { value: 'requested_by_artist', label: 'Requested by artist' },
  { value: 'other', label: 'Other' },
];

export function SubmissionsTab() {
  const { submissions, setSubmissions, votes, addAudit } = useStore();
  const [removing, setRemoving] = useState<Submission | null>(null);
  const [reason, setReason] = useState<RemovalReason>('rule_violation');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'removed'>('all');

  const scores = computeScores(submissions, votes);
  const visible = submissions.filter(s => filter === 'all' ? true : s.status === filter);

  const removeSubmission = () => {
    if (!removing) return;
    setSubmissions(submissions.map(s => s.id === removing.id ? {
      ...s,
      status: 'removed' as const,
      removalReason: reason,
      internalNote: note,
      removedAt: new Date().toISOString(),
      removedBy: 'admin',
    } : s));
    addAudit({
      actorName: 'admin',
      action: 'removed_submission',
      targetId: removing.id,
      details: `Reason: ${reason}${note ? `. Note: ${note}` : ''}`,
    });
    setRemoving(null);
    setReason('rule_violation');
    setNote('');
  };

  const restore = (s: Submission) => {
    if (!confirm(`Restore "${s.trackTitle}" to active?`)) return;
    setSubmissions(submissions.map(x => x.id === s.id ? {
      ...x,
      status: 'active' as const,
      removalReason: undefined,
      internalNote: undefined,
      removedAt: undefined,
      removedBy: undefined,
    } : x));
    addAudit({ actorName: 'admin', action: 'restored_submission', targetId: s.id, details: s.trackTitle });
  };

  return (
    <div className="space-y-6">
      <Section
        title="Submissions"
        description="All tracks submitted to this contest. Remove tracks that violate the rules."
        action={
          <Select value={filter} onChange={e => setFilter(e.target.value as 'all' | 'active' | 'removed')}>
            <option value="all">All ({submissions.length})</option>
            <option value="active">Active ({submissions.filter(s => s.status === 'active').length})</option>
            <option value="removed">Removed ({submissions.filter(s => s.status === 'removed').length})</option>
          </Select>
        }
      >
        {visible.length === 0 ? (
          <div className="text-center text-text-muted py-8">No submissions match the filter.</div>
        ) : (
          <div className="space-y-2">
            {visible.map(s => (
              <div key={s.id} className={`bg-bg rounded-xl border p-4 flex items-center gap-4 ${s.status === 'removed' ? 'border-accent-red/30 opacity-70' : 'border-border'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold truncate">{s.trackTitle}</div>
                    {s.status === 'removed' && (
                      <span className="text-[10px] uppercase tracking-wider bg-accent-red/20 text-accent-red px-2 py-0.5 rounded">Removed</span>
                    )}
                  </div>
                  <div className="text-sm text-text-muted">{s.artistName}</div>
                  {s.status === 'removed' && (
                    <div className="text-xs text-accent-red mt-1">
                      Reason: {s.removalReason}{s.internalNote ? ` — ${s.internalNote}` : ''}
                    </div>
                  )}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-lg font-bold text-accent">{scores.get(s.id) ?? 0}</div>
                  <div className="text-[10px] uppercase tracking-wider text-text-dim">points</div>
                </div>
                <a href={s.trackUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-accent transition" title="Open track">
                  <ExternalLink className="w-4 h-4" />
                </a>
                {s.status === 'active' ? (
                  <DangerButton onClick={() => setRemoving(s)}>
                    <Trash2 className="w-4 h-4" />
                  </DangerButton>
                ) : (
                  <SecondaryButton onClick={() => restore(s)}>
                    <RotateCcw className="w-4 h-4 inline mr-1" /> Restore
                  </SecondaryButton>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {removing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setRemoving(null)}>
          <div className="bg-bg-card rounded-3xl max-w-md w-full border border-border p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">Remove submission</h2>
            <p className="text-sm text-text-muted mb-5">
              Removing <span className="text-white font-medium">"{removing.trackTitle}"</span> by {removing.artistName}.
            </p>
            <div className="space-y-4">
              <Field label="Reason">
                <Select value={reason} onChange={e => setReason(e.target.value as RemovalReason)}>
                  {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </Select>
              </Field>
              <Field label="Internal note (visible only to admins)">
                <Textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional details..." />
              </Field>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <SecondaryButton onClick={() => setRemoving(null)}>Cancel</SecondaryButton>
              <DangerButton onClick={removeSubmission}>Remove submission</DangerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}