import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type {
  Contest,
  Submission,
  Vote,
  Prize,
  Judge,
  Quote,
  RuleItem,
  TermItem,
  AuditEntry,
  CurrentUser,
  Phase,
  VotingMode,
} from '../types';

// initial data from JSON
import contestInitial from '../data/contest.json';
import submissionsInitial from '../data/submissions.json';
import prizesInitial from '../data/prizes.json';
import judgesInitial from '../data/judges.json';
import rulesInitial from '../data/rules.json';
import termsInitial from '../data/terms.json';
import auditInitial from '../data/auditLog.json';

interface StoreContextValue {
  // data
  contest: Contest;
  submissions: Submission[];
  votes: Vote[];
  prizes: Prize[];
  judges: Judge[];
  quotes: Quote[];
  rules: RuleItem[];
  terms: TermItem[];
  auditLog: AuditEntry[];
  currentUser: CurrentUser;

  // dev controls (manual phase/mode override)
  devPhase: Phase | null;
  devVotingMode: VotingMode | null;

  // setters
  setContest: (c: Contest | ((p: Contest) => Contest)) => void;
  setSubmissions: (s: Submission[] | ((p: Submission[]) => Submission[])) => void;
  setVotes: (v: Vote[] | ((p: Vote[]) => Vote[])) => void;
  setPrizes: (p: Prize[] | ((prev: Prize[]) => Prize[])) => void;
  setJudges: (j: Judge[] | ((p: Judge[]) => Judge[])) => void;
  setQuotes: (q: Quote[] | ((p: Quote[]) => Quote[])) => void;
  setRules: (r: RuleItem[] | ((p: RuleItem[]) => RuleItem[])) => void;
  setTerms: (t: TermItem[] | ((p: TermItem[]) => TermItem[])) => void;
  setAuditLog: (a: AuditEntry[] | ((p: AuditEntry[]) => AuditEntry[])) => void;
  setCurrentUser: (u: CurrentUser | ((p: CurrentUser) => CurrentUser)) => void;
  setDevPhase: (p: Phase | null) => void;
  setDevVotingMode: (m: VotingMode | null) => void;

  // helpers
  addAudit: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'contestId'>) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const DEFAULT_USER: CurrentUser = {
  id: 'user-current',
  username: 'kr0nos',
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [contest, setContest] = useLocalStorage<Contest>('tribe-contest:contest', contestInitial as Contest);
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>('tribe-contest:submissions', submissionsInitial as Submission[]);
  const [votes, setVotes] = useLocalStorage<Vote[]>('tribe-contest:votes', []);
  const [prizes, setPrizes] = useLocalStorage<Prize[]>('tribe-contest:prizes', prizesInitial as Prize[]);
  const [judges, setJudges] = useLocalStorage<Judge[]>('tribe-contest:judges', judgesInitial as Judge[]);
  const [quotes, setQuotes] = useLocalStorage<Quote[]>('tribe-contest:quotes', []);
  const [rules, setRules] = useLocalStorage<RuleItem[]>('tribe-contest:rules', rulesInitial as RuleItem[]);
  const [terms, setTerms] = useLocalStorage<TermItem[]>('tribe-contest:terms', termsInitial as TermItem[]);
  const [auditLog, setAuditLog] = useLocalStorage<AuditEntry[]>('tribe-contest:auditLog', auditInitial as AuditEntry[]);
  const [currentUser, setCurrentUser] = useLocalStorage<CurrentUser>('tribe-contest:currentUser', DEFAULT_USER);
  const [devPhase, setDevPhase] = useLocalStorage<Phase | null>('tribe-contest:devPhase', null);
  const [devVotingMode, setDevVotingMode] = useLocalStorage<VotingMode | null>('tribe-contest:devVotingMode', null);

  const value = useMemo<StoreContextValue>(() => {
    const addAudit: StoreContextValue['addAudit'] = (entry) => {
      setAuditLog(prev => [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          contestId: contest.id,
          ...entry,
        },
        ...prev,
      ]);
    };

    return {
      contest, submissions, votes, prizes, judges, quotes, rules, terms, auditLog, currentUser,
      devPhase, devVotingMode,
      setContest, setSubmissions, setVotes, setPrizes, setJudges, setQuotes, setRules, setTerms, setAuditLog, setCurrentUser,
      setDevPhase, setDevVotingMode, addAudit,
    };
  }, [contest, submissions, votes, prizes, judges, quotes, rules, terms, auditLog, currentUser, devPhase, devVotingMode,
      setContest, setSubmissions, setVotes, setPrizes, setJudges, setQuotes, setRules, setTerms, setAuditLog, setCurrentUser, setDevPhase, setDevVotingMode]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
