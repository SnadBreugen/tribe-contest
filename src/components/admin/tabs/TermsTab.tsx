import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, PrimaryButton, Input } from '../AdminUI';
import { Trash2, Plus } from 'lucide-react';
import type { TermItem } from '../../../types';

export function TermsTab() {
  const { terms, setTerms, addAudit } = useStore();
  const [newText, setNewText] = useState('');

  const sorted = [...terms].sort((a, b) => a.order - b.order);

  const add = () => {
    if (!newText.trim()) return;
    const item: TermItem = {
      id: `term-${Date.now()}`,
      text: newText.trim(),
      isDefault: false,
      order: (sorted[sorted.length - 1]?.order ?? 0) + 1,
    };
    setTerms([...terms, item]);
    addAudit({ actorName: 'admin', action: 'added_term', details: item.text });
    setNewText('');
  };

  const remove = (id: string) => {
    const t = terms.find(x => x.id === id);
    if (!t) return;
    if (t.isDefault && !confirm('This is a default term. Remove it for this contest?')) return;
    setTerms(terms.filter(x => x.id !== id));
    addAudit({ actorName: 'admin', action: 'removed_term', details: t.text });
  };

  const updateText = (id: string, text: string) => {
    setTerms(terms.map(t => t.id === id ? { ...t, text } : t));
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = sorted.findIndex(t => t.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    setTerms(terms.map(t => {
      if (t.id === id) return { ...t, order: swap.order };
      if (t.id === swap.id) return { ...t, order: sorted[idx].order };
      return t;
    }));
  };

  return (
    <div className="space-y-6">
      <Section
        title="Terms & Conditions"
        description="Legal disclaimers and contest terms. Shown in the sidebar of the public page."
      >
        <div className="space-y-2 mb-5">
          {sorted.map((term, idx) => (
            <div key={term.id} className="flex items-start gap-2">
              <div className="flex flex-col mt-2">
                <button
                  onClick={() => move(term.id, -1)}
                  disabled={idx === 0}
                  className="text-text-dim hover:text-white disabled:opacity-30 text-xs"
                >▲</button>
                <button
                  onClick={() => move(term.id, 1)}
                  disabled={idx === sorted.length - 1}
                  className="text-text-dim hover:text-white disabled:opacity-30 text-xs"
                >▼</button>
              </div>
              <Input
                value={term.text}
                onChange={e => updateText(term.id, e.target.value)}
                className="flex-1"
              />
              <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded mt-2 ${term.isDefault ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted'}`}>
                {term.isDefault ? 'Default' : 'Custom'}
              </span>
              <button
                onClick={() => remove(term.id)}
                className="p-2.5 text-text-muted hover:text-accent-red transition rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Input
            placeholder="Add a term..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          />
          <PrimaryButton onClick={add}>
            <Plus className="w-4 h-4 inline mr-1" /> Add
          </PrimaryButton>
        </div>
      </Section>
    </div>
  );
}