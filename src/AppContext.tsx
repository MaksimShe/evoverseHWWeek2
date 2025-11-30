import {createContext} from "react";
import type {Account} from "./hooks/useAuth.ts";

interface AppContextType {
  isDarkMode: boolean;
  hasSound: boolean;
  user: Account | null;
  addMoney: (add: number) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);