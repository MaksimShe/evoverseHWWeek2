import { PLINKO_GAME_CONFIG } from '../../constants/gameConfig.ts';

export const getPosition = (row: number, col: number, isSpawner: boolean = false) => {
  if (isSpawner) {
    return { x: 0, y: 0 };
  }
  const pegsInRow = row + PLINKO_GAME_CONFIG.COUNTER_START_PEGS;
  const x = (col - (pegsInRow - 1) / 2) * 40;
  const y = row * 50 + PLINKO_GAME_CONFIG.SPAWNER_GAP;
  return { x, y };
};
