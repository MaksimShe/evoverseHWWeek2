import {type ReactNode, useCallback, useState} from "react";
import { AppContext } from "./AppContext.tsx";
import { useAuth } from "./hooks/useAuth.ts";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasSound, setHasSound] = useState(false);
  const {user, addMoney} = useAuth();

  const playSound = useCallback(
    (play: () => void) => {
      if (!hasSound) return;
      play();
    },
    [hasSound]
  );

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleSound = () => setHasSound(prev => !prev);
  return (

    <AppContext value={{ isDarkMode, hasSound, user, addMoney, toggleDarkMode, toggleSound, playSound }}>
      {children}
    </AppContext>

  );
};
