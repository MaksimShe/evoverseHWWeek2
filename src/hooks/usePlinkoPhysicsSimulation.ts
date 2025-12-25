import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { PLINKO_GAME_CONFIG } from '../constants/gameConfig';
import { checkPegCollision } from '../helper/plinko/checkPegCollision';
import { roundBalance } from '../helper/roundBalance';
import type { Ball, Peg } from '../interfaces/plinko';

interface UsePlinkoPhysicsSimulationProps {
  balls: Ball[];
  setBalls: Dispatch<SetStateAction<Ball[]>>;
  pegs: Peg[];
  rows: number;
  boardHeight: number;
  multipliers: number[];
  bet: number;
  getNearbyPegs: (ballY: number) => Peg[];
  highlightPeg: (pegId: string) => void;
  onBallComplete: (winAmount: number, finalSlot: number) => void;
}

export const usePlinkoPhysicsSimulation = ({
  balls,
  setBalls,
  pegs,
  rows,
  boardHeight,
  multipliers,
  bet,
  getNearbyPegs,
  highlightPeg,
  onBallComplete,
}: UsePlinkoPhysicsSimulationProps): void => {
  useEffect(() => {
    if (balls.length === 0 || balls.every((b) => b.isComplete)) {
      return;
    }

    let animationId: number;

    const simulate = () => {
      setBalls((prevBalls) => {
        return prevBalls.map((ball) => {
          if (ball.isComplete) {
            return ball;
          }
          let newVX = ball.vx * PLINKO_GAME_CONFIG.FRICTION;
          let newVY = ball.vy + PLINKO_GAME_CONFIG.GRAVITY;
          let newX = ball.x + newVX;
          let newY = ball.y + newVY;

          const nearbyPegs = getNearbyPegs(newY);
          for (const peg of nearbyPegs) {
            const collision = checkPegCollision(newX, newY, peg);
            if (collision) {
              const angle = Math.atan2(collision.dy, collision.dx);
              const speed =
                Math.sqrt(newVX * newVX + newVY * newVY) * PLINKO_GAME_CONFIG.BOUNCE_DAMPING;

              newVX = Math.cos(angle) * speed;
              newVY = Math.sin(angle) * speed;
              const pegRadius =
                peg.row === -1
                  ? PLINKO_GAME_CONFIG.SPAWNER_PEG_RADIUS
                  : PLINKO_GAME_CONFIG.PEG_RADIUS;
              const overlap = PLINKO_GAME_CONFIG.BALL_RADIUS + pegRadius - collision.distance;
              newX += (collision.dx / collision.distance) * overlap;
              newY += (collision.dy / collision.distance) * overlap;

              highlightPeg(peg.id);
              break;
            }
          }

          const currentRow = Math.max(0, Math.min(rows, newY / 50));

          const wallPadding = 50; // Padding beyond pegs
          const leftBoundary = -(currentRow / 2) * 40 - wallPadding;
          const rightBoundary = (currentRow / 2) * 40 + wallPadding;

          if (newX - PLINKO_GAME_CONFIG.BALL_RADIUS < leftBoundary) {
            newX = leftBoundary + PLINKO_GAME_CONFIG.BALL_RADIUS;
            newVX = Math.abs(newVX) * PLINKO_GAME_CONFIG.BOUNCE_DAMPING;
          } else if (newX + PLINKO_GAME_CONFIG.BALL_RADIUS > rightBoundary) {
            newX = rightBoundary - PLINKO_GAME_CONFIG.BALL_RADIUS;
            newVX = -Math.abs(newVX) * PLINKO_GAME_CONFIG.BOUNCE_DAMPING;
          }

          const slotAreaY = boardHeight - 100;
          if (newY >= slotAreaY) {
            const slotWidth = 40;
            const gapWidth = 4;
            const totalSlotsWidth =
              multipliers.length * slotWidth + (multipliers.length - 1) * gapWidth;
            const slotStartX = -totalSlotsWidth / 2;
            for (let i = 1; i < multipliers.length; i++) {
              const gapCenterX = slotStartX + i * slotWidth + (i - 0.5) * gapWidth;
              const distanceToGap = Math.abs(newX - gapCenterX);

              if (distanceToGap < gapWidth / 2 + PLINKO_GAME_CONFIG.BALL_RADIUS) {
                if (newX < gapCenterX) {
                  newX = gapCenterX - gapWidth / 2 - PLINKO_GAME_CONFIG.BALL_RADIUS;
                  newVX = -Math.abs(newVX) * PLINKO_GAME_CONFIG.BOUNCE_DAMPING;
                } else {
                  newX = gapCenterX + gapWidth / 2 + PLINKO_GAME_CONFIG.BALL_RADIUS;
                  newVX = Math.abs(newVX) * PLINKO_GAME_CONFIG.BOUNCE_DAMPING;
                }
                break;
              }
            }
          }

          if (newY >= boardHeight) {
            const slotWidth = 40;
            const gapWidth = 4;
            const slotPitch = slotWidth + gapWidth;
            const totalSlotsWidth =
              multipliers.length * slotWidth + (multipliers.length - 1) * gapWidth;
            const slotStartX = -totalSlotsWidth / 2;

            const relativeX = newX - slotStartX;
            const slotIndex = Math.floor(relativeX / slotPitch);
            const finalSlot = Math.max(0, Math.min(multipliers.length - 1, slotIndex));
            const multiplier = multipliers[finalSlot];
            const winAmount = roundBalance(bet * multiplier);

            onBallComplete(winAmount, finalSlot);

            return {
              ...ball,
              y: boardHeight,
              isComplete: true,
              finalMultiplier: multiplier,
              finalSlot,
            };
          }

          return { ...ball, x: newX, y: newY, vx: newVX, vy: newVY };
        });
      });

      animationId = requestAnimationFrame(simulate);
    };

    animationId = requestAnimationFrame(simulate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    balls,
    setBalls,
    pegs,
    boardHeight,
    rows,
    multipliers,
    bet,
    highlightPeg,
    getNearbyPegs,
    onBallComplete,
  ]);
};
