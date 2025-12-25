import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PlinkoGame.css';
import { useAppStore } from '../../store/useAppStore';
import useSound from 'use-sound';
import clickSound from '../../assets/sounds/clickMenu.mp3';
import cashSound from '../../assets/sounds/cashAdd.mp3';
import { roundBalance } from '../../helper/roundBalance';
import { GameStatus } from '../../enums/enums.ts';
import { PLINKO_GAME_CONFIG } from '../../constants/gameConfig.ts';
import type { Peg, Ball } from '../../interfaces/plinko.ts';
import { getPosition } from '../../helper/plinko/getPosition.ts';
import { generateMultipliers } from '../../helper/plinko/generateMultipliers.ts';
import { generatePegs } from '../../helper/plinko/generatePegs.ts';
import { usePlinkoPhysicsSimulation } from '../../hooks/usePlinkoPhysicsSimulation';
import { usePlinkoCollisionDetection } from '../../hooks/usePlinkoCollisionDetection';
import { usePlinkoPegHighlight } from '../../hooks/usePlinkoPegHighlight';
import { usePlinkoSlotHighlight } from '../../hooks/usePlinkoSlotHighlight';
import { usePlinkoBallSpawner } from '../../hooks/usePlinkoBallSpawner';

const AnimatedBall = React.memo<{ ball: Ball }>(({ ball }) => {
  return (
    <motion.div
      className="plinko-ball"
      animate={{
        x: ball.x,
        y: ball.y,
        scale: ball.isComplete ? 0 : 1,
      }}
      transition={{
        x: {
          type: 'tween',
          duration: 0.036,
          ease: 'linear',
        },
        y: {
          type: 'tween',
          duration: 0.036, // +-30fps
          ease: 'linear',
        },
        scale: {
          delay: ball.isComplete ? 1 : 0,
          duration: 0.3,
          ease: 'easeOut',
        },
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
      }}
    />
  );
});

AnimatedBall.displayName = 'AnimatedBall';

const Peg = React.memo<{
  pegId: string;
  x: number;
  y: number;
  isHit: boolean;
  isSpawner: boolean;
}>(({ pegId, x, y, isHit, isSpawner }) => {
  return (
    <motion.div
      key={pegId}
      className={`plinko-peg ${isSpawner ? 'plinko-peg-spawner' : ''} ${isHit ? 'plinko-peg-hit' : ''}`}
      animate={{
        scale: isHit ? [1, 1.3, 1] : 1,
        backgroundColor: isHit ? '#f59e0b' : isSpawner ? '#3b82f6' : '#cfd6df',
      }}
      transition={{
        scale: { duration: 0.3 },
        backgroundColor: { duration: 0.3 },
      }}
      style={{
        top: 0,
        x,
        y,
      }}
    />
  );
});

Peg.displayName = 'Peg';

export const PlinkoGame: React.FC = () => {
  const [bet, setBet] = useState<number>(10);
  const [betError, setBetError] = useState<boolean>(false);
  const [rows, setRows] = useState<number>(5);
  const [ballCount, setBallCount] = useState<number>(1);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.disabled);
  const [totalWinnings, setTotalWinnings] = useState<number>(0);

  const { user, addMoney, playSound } = useAppStore();
  const [playClickSound] = useSound(clickSound);
  const [playCashSound] = useSound(cashSound);

  const multipliers = generateMultipliers(rows);
  const pegs = generatePegs(rows);
  const boardHeight = (rows + 1.0) * 50 + PLINKO_GAME_CONFIG.SPAWNER_GAP;

  const { hitPegs, highlightPeg } = usePlinkoPegHighlight();
  const { highlightedSlots, highlightSlot } = usePlinkoSlotHighlight();
  const { getNearbyPegs } = usePlinkoCollisionDetection({ pegs, rows });
  const { spawnBalls } = usePlinkoBallSpawner({ setBalls });

  const handleBallComplete = useCallback(
    (winAmount: number, finalSlot: number) => {
      setTotalWinnings((prev) => roundBalance(prev + winAmount));
      addMoney(winAmount);
      playSound(playCashSound);
      highlightSlot(finalSlot);
    },
    [addMoney, playSound, playCashSound, highlightSlot]
  );

  usePlinkoPhysicsSimulation({
    balls,
    setBalls,
    pegs,
    rows,
    boardHeight,
    multipliers,
    bet,
    getNearbyPegs,
    highlightPeg,
    onBallComplete: handleBallComplete,
  });

  useEffect(() => {
    if (balls.length > 0 && balls.every((b) => b.isComplete)) {
      setTimeout(() => {
        setBalls([]);
        setGameStatus(GameStatus.disabled);
      }, 1500);
    }
  }, [balls]);

  const handleDrop = () => {
    if (gameStatus === GameStatus.active) {
      return;
    }

    const totalBet = bet * ballCount;
    if (totalBet < 1 || totalBet > (user?.balance || 0)) {
      setBetError(true);
      return;
    }

    setBetError(false);
    setGameStatus(GameStatus.active);
    setTotalWinnings(0);

    addMoney(-totalBet);
    playSound(playClickSound);

    spawnBalls(ballCount);
  };

  const renderedPegs = React.useMemo(() => {
    const pegElements = [];

    const spawnerId = 'spawner-0';
    const spawnerPos = getPosition(-1, 0, true);
    const isSpawnerHit = hitPegs.has(spawnerId);

    pegElements.push(
      <Peg
        key={spawnerId}
        pegId={spawnerId}
        x={spawnerPos.x}
        y={spawnerPos.y}
        isHit={isSpawnerHit}
        isSpawner={true}
      />
    );

    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + PLINKO_GAME_CONFIG.COUNTER_START_PEGS;
      for (let col = 0; col < pegsInRow; col++) {
        const pegId = `peg-${row}-${col}`;
        const pos = getPosition(row, col, false);
        const isHit = hitPegs.has(pegId);

        pegElements.push(
          <Peg key={pegId} pegId={pegId} x={pos.x} y={pos.y} isHit={isHit} isSpawner={false} />
        );
      }
    }
    return pegElements;
  }, [rows, hitPegs]);

  const renderedSlots = React.useMemo(() => {
    return multipliers.map((multiplier, index) => {
      const isHighlighted = highlightedSlots.has(index);

      return (
        <div
          key={`slot-${index}`}
          className={`plinko-slot ${isHighlighted ? 'plinko-slot-active' : ''}`}
        >
          <motion.span
            className="plinko-multiplier"
            animate={{
              scale: isHighlighted ? [1, 1.2, 1] : 1,
              color: isHighlighted ? '#2ecc71' : '#d7dee7',
            }}
            transition={{ duration: 0.3 }}
          >
            {multiplier}x
          </motion.span>
        </div>
      );
    });
  }, [multipliers, highlightedSlots]);

  return (
    <div className="plinko-wrapper">
      <div className="plinko-container">
        <div className="plinko-board-section">
          <motion.div
            className="plinko-board"
            style={{
              height: `${(rows + 1.0) * 50 + PLINKO_GAME_CONFIG.SPAWNER_GAP}px`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {renderedPegs}

            <AnimatePresence mode="sync">
              {balls.map((ball) => (
                <AnimatedBall key={ball.id} ball={ball} />
              ))}
            </AnimatePresence>

            <div className="plinko-slots-container">{renderedSlots}</div>
          </motion.div>
        </div>

        <div className="plinko-controls-section">
          <motion.div
            className="plinko-controls"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2
              className="plinko-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              PLINKO
            </motion.h2>

            <div className="plinko-control-group">
              <label className="plinko-label">Bet Amount</label>
              <input
                type="number"
                className={`plinko-input ${betError ? 'plinko-input-error' : ''}`}
                value={bet}
                onChange={(e) => {
                  setBet(Number(e.target.value));
                  setBetError(false);
                }}
                min={1}
                disabled={gameStatus === GameStatus.active}
              />
              <div className="plinko-quick-bets">
                {PLINKO_GAME_CONFIG.QUICK_BETS.map((amount) => (
                  <button
                    key={amount}
                    className="plinko-quick-bet"
                    onClick={() => {
                      setBet(amount);
                      setBetError(false);
                    }}
                    disabled={gameStatus === GameStatus.active}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="plinko-control-group">
              <label className="plinko-label">Rows: {rows + 2}</label>
              <motion.div
                className="plinko-slider-container"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <input
                  type="range"
                  className="plinko-slider"
                  min={PLINKO_GAME_CONFIG.ROWS_COUNTER.MIN}
                  max={PLINKO_GAME_CONFIG.ROWS_COUNTER.MAX}
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  disabled={gameStatus === GameStatus.active}
                />
                <div className="plinko-slider-labels">
                  <span>{PLINKO_GAME_CONFIG.ROWS_COUNTER.MIN + 2}</span>
                  <span>{PLINKO_GAME_CONFIG.ROWS_COUNTER.MAX + 2}</span>
                </div>
              </motion.div>
            </div>

            <div className="plinko-control-group">
              <label className="plinko-label">Number of Balls</label>
              <div className="plinko-ball-counter">
                <button
                  className="plinko-counter-btn"
                  onClick={() => setBallCount((prev) => Math.max(1, prev - 1))}
                  disabled={gameStatus === GameStatus.active}
                >
                  -
                </button>
                <span className="plinko-counter-value">{ballCount}</span>
                <button
                  className="plinko-counter-btn"
                  onClick={() =>
                    setBallCount((prev) => Math.min(PLINKO_GAME_CONFIG.MAX_BALLS, prev + 1))
                  }
                  disabled={gameStatus === GameStatus.active}
                >
                  +
                </button>
              </div>
            </div>

            <motion.div
              className="plinko-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="plinko-info-row">
                <span>Total Bet:</span>
                <span className="plinko-info-value">${roundBalance(bet * ballCount)}</span>
              </div>
              <div className="plinko-info-row">
                <span>Balance:</span>
                <motion.span
                  className="plinko-info-value"
                  key={user?.balance}
                  initial={{ scale: 1.2, color: '#00ff00' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.3 }}
                >
                  ${roundBalance(user?.balance || 0)}
                </motion.span>
              </div>
              <AnimatePresence>
                {totalWinnings > 0 && (
                  <motion.div
                    className="plinko-info-row plinko-winnings"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>Total Win:</span>
                    <motion.span
                      className="plinko-info-value"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                      }}
                    >
                      ${roundBalance(totalWinnings)}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <button
              className="plinko-drop-button"
              onClick={handleDrop}
              disabled={gameStatus === GameStatus.active}
            >
              {gameStatus === GameStatus.active ? 'DROPPING...' : 'DROP'}
            </button>

            <AnimatePresence>
              {betError && (
                <motion.div
                  className="plinko-error"
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: [0, -5, 5, -5, 5, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    x: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                    default: { duration: 0.3 },
                  }}
                >
                  Insufficient balance or invalid bet amount!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
