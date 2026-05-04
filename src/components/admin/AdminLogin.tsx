import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Lock } from 'lucide-react';

// For prototype only — devs will replace with proper RBAC.
const ADMIN_PASSWORD = 'tribe2026';

export function AdminLogin() {
  const [, setAuth] = useLocalStorage<boolean>('tribe-contest:adminAuth', false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuth(true);
      window.location.reload();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="bg-bg-card rounded-3xl p-8 max-w-md w-full border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Admin Access</h1>
            <p className="text-sm text-text-muted">Restricted area</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-2">Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false); }}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
              autoFocus
            />
            {error && <p className="text-sm text-accent-red mt-2">Incorrect password</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/80 transition rounded-xl py-3 font-medium"
          >
            Sign in
          </button>
        </form>

        <p className="text-xs text-text-dim mt-6 text-center">
          Prototype demo — password: <code className="bg-bg px-1.5 py-0.5 rounded">tribe2026</code>
        </p>
      </div>
    </div>
  );
}
