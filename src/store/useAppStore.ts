import { create } from 'zustand';
import type { Account } from '../hooks/useAuth';
import { supabase } from '../helper/supabaseClient';

interface AppState {
  // State
  isDarkMode: boolean;
  hasSound: boolean;
  user: Account | null;

  // Actions
  toggleDarkMode: () => void;
  toggleSound: () => void;
  playSound: (play: () => void) => void;
  setUser: (user: Account | null) => void;
  addMoney: (add: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isDarkMode: false,
  hasSound: false,
  user: null,

  // Actions
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  toggleSound: () => set((state) => ({ hasSound: !state.hasSound })),

  playSound: (play) => {
    const { hasSound } = get();
    if (hasSound) {
      play();
    }
  },

  setUser: (user) => set({ user }),

  addMoney: async (addMoney) => {
    const { user } = get();
    if (!user) {
      return;
    }

    const newBalance = user.balance + addMoney;

    const { data, error } = await supabase
      .from('profiles')
      .update({ balance: +newBalance.toFixed(2) })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Balance update error:', error);
      return;
    }

    if (data) {
      set({ user: data });
    }
  },
}));
