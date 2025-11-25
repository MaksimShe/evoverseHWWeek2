import {createContext} from "react";

interface AppContextType {
  isDarkMode: boolean;
  hasSound: boolean;
  toggleDarkMode: () => void;
  toggleSound: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);