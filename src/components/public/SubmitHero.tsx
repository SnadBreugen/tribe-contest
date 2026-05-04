import { Plus } from 'lucide-react';

interface Props {
  accentColor?: string;
  accentColor2?: string;
  onSubmit: () => void;
}

export function SubmitHero({ accentColor, accentColor2, onSubmit }: Props) {
  const gradient = accentColor && accentColor2
    ? `linear-gradient(135deg, ${accentColor}, ${accentColor2})`
    : `linear-gradient(135deg, #a78bfa, #ec4899)`;

  return (
    <div
      className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
      style={{ background: gradient }}
    >
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to enter?</h2>
        <p className="text-white/90 text-base md:text-lg mb-6">
          Drop your acid-fueled 303 track and join the contest. One submission per artist.
        </p>
        <button
          onClick={onSubmit}
          className="bg-white text-bg font-semibold px-6 py-3 rounded-full hover:scale-105 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Submit your track
        </button>
      </div>

      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}