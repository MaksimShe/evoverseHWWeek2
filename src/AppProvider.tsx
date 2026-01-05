import { type ReactNode, useEffect } from 'react';
import { useAuth } from './hooks/useAuth.ts';
import { useAppStore } from './store/useAppStore.ts';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { user } = useAuth();
  const setUser = useAppStore((state) => state.setUser);

  // Sync useAuth user data with Zustand store
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
};
