import { GameEndStatus, GameStatus } from '../enums/enums.ts';
import { useAppStore } from '../store/useAppStore.ts';
import { useSaveHistory } from './useSaveHistory.ts';
import { useRef, useEffect } from 'react';
import useSound from 'use-sound';
import winSound from '../assets/sounds/crash-win.mp3';
import loseSound from '../assets/sounds/crash-lose.mp3';
import { GAME_CONFIG } from '../constants/gameConfig.ts';

type Props = {
  bet: number;
  maxMltp: number;
  handleGameStatus: (game: GameStatus) => void;
};

export const useCrashGameSetStatuses = ({ bet, maxMltp, handleGameStatus }: Props) => {
  const timeoutRef = useRef<number | null>(null);
  const hasSound = useAppStore((state) => state.hasSound);
  const addMoney = useAppStore((state) => state.addMoney);
  const { saveHistory } = useSaveHistory();
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  const setStatusWin = (mltp: number) => {
    if (hasSound) {
      playWin();
    }
    handleGameStatus(GameStatus.win);
    saveHistory(mltp, GameEndStatus.won, bet, maxMltp);
    addMoney(mltp * bet - bet);
  };

  const setStatusLose = (mltp: number) => {
    if (hasSound) {
      playLose();
    }
    handleGameStatus(GameStatus.lose);
    setStatusDisabled();
    saveHistory(mltp, GameEndStatus.lost, bet, maxMltp);
    addMoney(-bet);
  };

  const setStatusDisabled = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleGameStatus(GameStatus.disabled);
    }, GAME_CONFIG.CRASH.RESET_DELAY_MS);
  };

  // Cleanup timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { setStatusWin, setStatusLose, setStatusDisabled };
};
