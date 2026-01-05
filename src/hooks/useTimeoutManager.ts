import { useRef, useEffect } from 'react';

interface TimeoutManager {
  addTimeout: (callback: () => void, delay: number) => number;
  addKeyedTimeout: (key: string, callback: () => void, delay: number) => void;
  clearTimeout: (id: number) => void;
  clearKeyedTimeout: (key: string) => void;
  clearAll: () => void;
}

export function useTimeoutManager(): TimeoutManager {
  const timeoutIds = useRef<Set<number>>(new Set());
  const keyedTimeouts = useRef<Map<string, number>>(new Map());

  const addTimeout = (callback: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
      callback();
      timeoutIds.current.delete(id);
    }, delay);

    timeoutIds.current.add(id);
    return id;
  };

  const addKeyedTimeout = (key: string, callback: () => void, delay: number): void => {
    const existingId = keyedTimeouts.current.get(key);
    if (existingId !== undefined) {
      window.clearTimeout(existingId);
      timeoutIds.current.delete(existingId);
    }

    const id = window.setTimeout(() => {
      callback();
      timeoutIds.current.delete(id);
      keyedTimeouts.current.delete(key);
    }, delay);

    timeoutIds.current.add(id);
    keyedTimeouts.current.set(key, id);
  };

  const clearTimeout = (id: number): void => {
    window.clearTimeout(id);
    timeoutIds.current.delete(id);
  };

  const clearKeyedTimeout = (key: string): void => {
    const id = keyedTimeouts.current.get(key);
    if (id !== undefined) {
      window.clearTimeout(id);
      timeoutIds.current.delete(id);
      keyedTimeouts.current.delete(key);
    }
  };

  const clearAll = (): void => {
    timeoutIds.current.forEach((id) => window.clearTimeout(id));
    timeoutIds.current.clear();

    keyedTimeouts.current.forEach((id) => window.clearTimeout(id));
    keyedTimeouts.current.clear();
  };

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, []);

  return {
    addTimeout,
    addKeyedTimeout,
    clearTimeout,
    clearKeyedTimeout,
    clearAll,
  };
}
