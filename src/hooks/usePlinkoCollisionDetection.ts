import { useCallback } from 'react';
import { PLINKO_GAME_CONFIG } from '../constants/gameConfig';
import type { Peg } from '../interfaces/plinko';

interface UsePlinkoCollisionDetectionProps {
  pegs: Peg[];
  rows: number;
}

interface UsePlinkoCollisionDetectionReturn {
  getNearbyPegs: (ballY: number) => Peg[];
}

export function usePlinkoCollisionDetection({
  pegs,
  rows,
}: UsePlinkoCollisionDetectionProps): UsePlinkoCollisionDetectionReturn {
  const getNearbyPegs = useCallback(
    (ballY: number): Peg[] => {
      const currentRow = Math.floor((ballY - PLINKO_GAME_CONFIG.SPAWNER_GAP) / 50);
      const nearbyPegs: Peg[] = [];

      if (ballY < PLINKO_GAME_CONFIG.SPAWNER_GAP + 50) {
        nearbyPegs.push(pegs[0]);
      }

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        const checkRow = currentRow + rowOffset;
        if (checkRow >= 0 && checkRow < rows) {
          const pegsInRow = checkRow + 3;
          for (let col = 0; col < pegsInRow; col++) {
            const pegIndex = pegs.findIndex((p) => p.row === checkRow && p.col === col);
            if (pegIndex !== -1) {
              nearbyPegs.push(pegs[pegIndex]);
            }
          }
        }
      }

      return nearbyPegs;
    },
    [pegs, rows]
  );

  return { getNearbyPegs };
}
