import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for syncing state with localStorage. Acts like useState but persists.
 * If a value is in localStorage, it overrides the initial value on first load.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;
      return JSON.parse(stored) as T;
    } catch (err) {
      console.warn(`useLocalStorage: failed to parse ${key}`, err);
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      setValue(prev => {
        const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (err) {
          console.warn(`useLocalStorage: failed to save ${key}`, err);
        }
        return next;
      });
    },
    [key]
  );

  // Sync if another tab changes the value
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue) as T);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  return [value, setStoredValue];
}

/**
 * Reset all our localStorage keys (for the "Reset prototype" admin action).
 */
export function resetAllPrototypeData() {
  const keys = [
    'tribe-contest:contest',
    'tribe-contest:submissions',
    'tribe-contest:votes',
    'tribe-contest:prizes',
    'tribe-contest:judges',
    'tribe-contest:quotes',
    'tribe-contest:rules',
    'tribe-contest:terms',
    'tribe-contest:auditLog',
    'tribe-contest:currentUser',
    'tribe-contest:devPhase',
    'tribe-contest:devVotingMode',
    'tribe-contest:adminAuth',
  ];
  keys.forEach(k => window.localStorage.removeItem(k));
}
