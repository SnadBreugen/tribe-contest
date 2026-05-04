import { X, Trophy } from 'lucide-react';
import type { Prize } from '../../types';

interface Props {
  prize: Prize | null;
  onClose: () => void;
}

export function PrizeModal({ prize, onClose }: Props) {
  if (!prize) return null;

  const positionColor = prize.position === 1 ? 'text-amber-400' : prize.position === 2 ? 'text-zinc-300' : prize.position === 3 ? 'text-amber-700' : 'text-text-muted';
  const positionEmoji = prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : prize.position === 3 ? '🥉' : '🏆';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="aspect-[16/10] bg-bg-elevated rounded-t-3xl relative overflow-hidden">
          {prize.imageUrl ? (
            <img src={prize.imageUrl} alt={prize.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Trophy className="w-24 h-24 text-text-dim opacity-50" />
            </div>
          )}
          <div className={`absolute top-4 left-4 bg-bg/80 backdrop-blur rounded-full px-3 py-1.5 flex items-center gap-2 font-semibold ${positionColor}`}>
            <span>{positionEmoji}</span>
            <span className="text-sm">{prize.subtitle || `Place ${prize.position}`}</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-bg/80 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center hover:bg-bg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">{prize.name}</h2>
          <p className="text-text-muted leading-relaxed whitespace-pre-line">{prize.description}</p>
        </div>
      </div>
    </div>
  );
}