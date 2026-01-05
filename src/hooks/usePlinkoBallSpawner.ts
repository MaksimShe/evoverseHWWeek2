import { type Dispatch, type SetStateAction, useCallback } from 'react';
import { useTimeoutManager } from './useTimeoutManager';
import type { Ball } from '../interfaces/plinko';

interface UsePlinkoBallSpawnerProps {
  setBalls: Dispatch<SetStateAction<Ball[]>>;
}

interface UsePlinkoBallSpawnerReturn {
  spawnBalls: (count: number) => void;
}

export function usePlinkoBallSpawner({
  setBalls,
}: UsePlinkoBallSpawnerProps): UsePlinkoBallSpawnerReturn {
  const timeouts = useTimeoutManager();

  const spawnBalls = useCallback(
    (count: number) => {
      for (let i = 0; i < count; i++) {
        timeouts.addTimeout(() => {
          const ballId = Date.now() + Math.random() * 1000;

          setBalls((prevBalls) => [
            ...prevBalls,
            {
              id: ballId,
              x: 0, // Start at center
              y: 0, // Start at top
              vx: (Math.random() - 0.5) * 2, // Random horizontal velocity
              vy: 0, // No initial vertical velocity
              isComplete: false,
              finalMultiplier: 0,
              finalSlot: 0,
            },
          ]);
        }, i * 300);
      }
    },
    [setBalls, timeouts]
  );

  return { spawnBalls };
}
