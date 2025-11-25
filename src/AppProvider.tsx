import {type ReactNode, useState} from "react";
import {AppContext as AppContext1} from "./AppContext.tsx";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasSound, setHasSound] = useState(true);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleSound = () => setHasSound(prev => !prev);

  return (
    <AppContext1 value={{ isDarkMode, hasSound, toggleDarkMode, toggleSound }}>
      {children}
    </AppContext1>
  );
};
