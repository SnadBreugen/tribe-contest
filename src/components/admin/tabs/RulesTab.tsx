import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Section, PrimaryButton, Input } from '../AdminUI';
import { Trash2, Plus } from 'lucide-react';
import type { RuleItem } from '../../../types';

export function RulesTab() {
  const { rules, setRules, addAudit } = useStore();
  const [newText, setNewText] = useState('');

  const sorted = [...rules].sort((a, b) => a.order - b.order);

  const add = () => {
    if (!newText.trim()) return;
    const item: RuleItem = {
      id: `rule-${Date.now()}`,
      text: newText.trim(),
      isDefault: false,
      order: (sorted[sorted.length - 1]?.order ?? 0) + 1,
    };
    setRules([...rules, item]);
    addAudit({ actorName: 'admin', action: 'added_rule', details: item.text });
    setNewText('');
  };

  const remove = (id: string) => {
    const r = rules.find(x => x.id === id);
    if (!r) return;
    if (r.isDefault) {
      if (!confirm('This is a default rule. Remove it for this contest?')) return;
    }
    setRules(rules.filter(x => x.id !== id));
    addAudit({ actorName: 'admin', action: 'removed_rule', details: r.text });
  };

  const updateText = (id: string, text: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, text } : r));
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = sorted.findIndex(r => r.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    setRules(rules.map(r => {
      if (r.id === id) return { ...r, order: swap.order };
      if (r.id === swap.id) return { ...r, order: sorted[idx].order };
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <Section
        title="Rules"
        description="What participants need to follow. Default rules are shared across all contests; custom rules apply only to this one."
      >
        <div className="space-y-2 mb-5">
          {sorted.map((rule, idx) => (
            <div key={rule.id} className="flex items-start gap-2 group">
              <div className="flex flex-col mt-2">
                <button
                  onClick={() => move(rule.id, -1)}
                  disabled={idx === 0}
                  className="text-text-dim hover:text-white disabled:opacity-30 text-xs"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(rule.id, 1)}
                  disabled={idx === sorted.length - 1}
                  className="text-text-dim hover:text-white disabled:opacity-30 text-xs"
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <Input
                value={rule.text}
                onChange={e => updateText(rule.id, e.target.value)}
                className="flex-1"
              />
              <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded mt-2 ${rule.isDefault ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted'}`}>
                {rule.isDefault ? 'Default' : 'Custom'}
              </span>
              <button
                onClick={() => remove(rule.id)}
                className="p-2.5 text-text-muted hover:text-accent-red transition rounded-lg"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Input
            placeholder="Add a custom rule..."
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