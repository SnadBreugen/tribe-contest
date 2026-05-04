import { useStore } from '../../lib/store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LogOut } from 'lucide-react';

export function AdminPage() {
  const { contest } = useStore();
  const [, setAuth] = useLocalStorage<boolean>('tribe-contest:adminAuth', false);

  const logout = () => {
    setAuth(false);
    window.location.href = '/tribe-contest/admin';
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin · {contest.name}</h1>
        <button onClick={logout} className="flex items-center gap-2 text-text-muted hover:text-white">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
      <p className="text-text-muted">Admin page — full implementation coming next.</p>
      <a href="/tribe-contest/" className="text-accent underline mt-4 inline-block">
        ← Back to public
      </a>
    </div>
  );
}
