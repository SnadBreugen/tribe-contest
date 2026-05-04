import { Search, Music, Trophy, GraduationCap } from 'lucide-react';
import { useStore } from '../../lib/store';

export function TopNav() {
  const { currentUser } = useStore();

  return (
    <nav className="bg-bg/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-pink flex items-center justify-center">
            <span className="text-white font-bold text-sm">t</span>
          </div>
          <span className="font-bold text-lg">tribe</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-bg-card rounded-full p-1">
          <button className="px-4 py-1.5 rounded-full text-sm text-text-muted hover:text-white transition flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" /> Music
          </button>
          <button className="px-4 py-1.5 rounded-full text-sm bg-accent/20 text-accent flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Contests
          </button>
          <button className="px-4 py-1.5 rounded-full text-sm text-text-muted hover:text-white transition flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Learn
          </button>
        </div>

        <div className="flex-1 max-w-md ml-auto relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
          <input
            type="text"
            placeholder="Search music, artists, contests..."
            className="w-full bg-bg-card border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-pink to-accent flex items-center justify-center text-sm font-bold ml-auto md:ml-0">
          {currentUser.username.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </nav>
  );
}