import type { Phase } from '../../types';
import { Calendar, Clock, Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';

const PHASE_CONFIG: Record<Phase, { label: string; description: string; color: string; icon: typeof Calendar }> = {
  coming: {
    label: 'Coming Soon',
    description: 'Submissions not open yet',
    color: 'text-text-muted bg-bg-card border-border',
    icon: Calendar,
  },
  open: {
    label: 'Submissions Open',
    description: 'Submit your track now',
    color: 'text-accent-green bg-accent-green/10 border-accent-green/30',
    icon: CheckCircle2,
  },
  voting: {
    label: 'Voting Active',
    description: 'Cast your votes',
    color: 'text-accent-pink bg-accent-pink/10 border-accent-pink/30',
    icon: Clock,
  },
  pending: {
    label: 'Voting Closed',
    description: 'Winners coming soon',
    color: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/30',
    icon: AlertCircle,
  },
  winners: {
    label: 'Winners Announced',
    description: 'Contest finished',
    color: 'text-accent bg-accent/10 border-accent/30',
    icon: Trophy,
  },
};

export function StatusBar({ phase }: { phase: Phase }) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;

  return (
    <div className={`border rounded-2xl px-4 py-3 flex items-center gap-3 ${config.color}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div>
        <div className="text-sm font-semibold">{config.label}</div>
        <div className="text-xs opacity-80">{config.description}</div>
      </div>
    </div>
  );
}
