import type { Peg } from '../../interfaces/plinko.ts';
import { getPosition } from './getPosition.ts';
import { PLINKO_GAME_CONFIG } from '../../constants/gameConfig.ts';

export const generatePegs = (rows: number): Peg[] => {
  const pegs: Peg[] = [];

  const spawnerPos = getPosition(-1, 0, true);
  pegs.push({
    id: 'spawner-0',
    x: spawnerPos.x,
    y: spawnerPos.y,
    row: -1,
    col: 0,
  });

  for (let row = 0; row < rows; row++) {
    const pegsInRow = row + PLINKO_GAME_CONFIG.COUNTER_START_PEGS;
    for (let col = 0; col < pegsInRow; col++) {
      const pos = getPosition(row, col, false);
      pegs.push({
        id: `peg-${row}-${col}`,
        x: pos.x,
        y: pos.y,
        row,
        col,
      });
    }
  }
  return pegs;
};
