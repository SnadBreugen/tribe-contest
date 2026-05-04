import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LogOut, ArrowLeft, ShieldAlert, FileText, Calendar, Trophy, ImageIcon, Music, Users, Award, Scale, Settings as SettingsIcon, History, Eye } from 'lucide-react';
import { BasicsTab } from './tabs/BasicsTab';
import { TimelineTab } from './tabs/TimelineTab';
import { RulesTab } from './tabs/RulesTab';
import { TermsTab } from './tabs/TermsTab';
import { PrizesTab } from './tabs/PrizesTab';
import { AssetsTab } from './tabs/AssetsTab';
import { SubmissionsTab } from './tabs/SubmissionsTab';
import { JuryTab } from './tabs/JuryTab';
import { WinnersTab } from './tabs/WinnersTab';
import { SettingsTab } from './tabs/SettingsTab';

type TabId =
  | 'basics' | 'rules' | 'timeline' | 'prizes' | 'assets'
  | 'submissions' | 'jury' | 'winners' | 'terms' | 'settings'
  | 'audit';

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: 'basics', label: 'Basics', icon: FileText },
  { id: 'rules', label: 'Rules', icon: ShieldAlert },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'prizes', label: 'Prizes', icon: Trophy },
  { id: 'assets', label: 'Assets', icon: ImageIcon },
  { id: 'submissions', label: 'Submissions', icon: Music },
  { id: 'jury', label: 'Jury', icon: Users },
  { id: 'winners', label: 'Winners', icon: Award },
  { id: 'terms', label: 'Terms', icon: Scale },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'audit', label: 'Audit log', icon: History },
];

export function AdminPage() {
  const { contest, auditLog } = useStore();
  const [, setAuth] = useLocalStorage<boolean>('tribe-contest:adminAuth', false);
  const [active, setActive] = useState<TabId>('basics');

  const logout = () => {
    setAuth(false);
    window.location.href = '/tribe-contest/admin';
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to public</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-text-dim uppercase tracking-wider">Admin</div>
            <div className="text-sm font-semibold truncate">{contest.name}</div>
          </div>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <aside className="lg:sticky lg:top-20 self-start">
            <nav className="bg-bg-card rounded-2xl p-2 border border-border">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active === t.id
                        ? 'bg-accent/20 text-accent'
                        : 'text-text-muted hover:bg-bg-elevated hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0">
            {active === 'basics' && <BasicsTab />}
            {active === 'rules' && <RulesTab />}
            {active === 'timeline' && <TimelineTab />}
            {active === 'prizes' && <PrizesTab />}
            {active === 'assets' && <AssetsTab />}
            {active === 'submissions' && <SubmissionsTab />}
            {active === 'jury' && <JuryTab />}
            {active === 'winners' && <WinnersTab />}
            {active === 'terms' && <TermsTab />}
            {active === 'settings' && <SettingsTab />}
            {active === 'audit' && (
              <div className="bg-bg-card rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-1">Audit log</h2>
                <p className="text-sm text-text-muted mb-5">Every admin action is recorded here.</p>
                {auditLog.length === 0 ? (
                  <div className="text-center text-text-muted py-8">No actions yet.</div>
                ) : (
                  <div className="space-y-2">
                    {auditLog.map(entry => (
                      <div key={entry.id} className="bg-bg rounded-xl border border-border p-3 text-sm">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs text-text-dim">{new Date(entry.timestamp).toLocaleString()}</span>
                          <span className="text-white">{entry.actorName}</span>
                          <span className="text-text-muted">{entry.action}</span>
                        </div>
                        {entry.details && <div className="text-text-muted mt-1 text-xs">{entry.details}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}