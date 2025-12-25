import type { Peg } from '../../interfaces/plinko.ts';
import { PLINKO_GAME_CONFIG } from '../../constants/gameConfig.ts';

export const checkPegCollision = (
  ballX: number,
  ballY: number,
  peg: Peg
): { dx: number; dy: number; distance: number } | null => {
  const dx = ballX - peg.x;
  const dy = ballY - peg.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const pegRadius =
    peg.row === -1 ? PLINKO_GAME_CONFIG.SPAWNER_PEG_RADIUS : PLINKO_GAME_CONFIG.PEG_RADIUS;
  const minDistance = PLINKO_GAME_CONFIG.BALL_RADIUS + pegRadius;

  return distance < minDistance ? { dx, dy, distance } : null;
};
