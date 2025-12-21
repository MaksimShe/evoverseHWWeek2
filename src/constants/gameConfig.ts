// Game configuration constants
export const GAME_CONFIG = {
  MAX_BET: 1000,
  MIN_BET: 1,
  INITIAL_BALANCE: 1000,
  MINES: {
    GRID_SIZE: 25,
  },
  CRASH: {
    MIN_AUTO_STOP: 1.25,
    STEP_AUTO_STOP: 0.25,
    RESET_DELAY_MS: 1300,
  },
} as const;
