
import './CrashGame.css';

import { useRef, useState} from "react";

import {type CounterStatus, CrashGameGameSection} from "../../components/CrashGameComponents/CrashGameGameSection.tsx";
import {CrashGameHistorySaver} from "../../components/CrashGameComponents/CrashGameHistorySaver.tsx";
import {useSaveHistory} from "../../hooks/useSaveHistory.ts";
import {useAppContext} from "../../hooks/UseAppContext.tsx";
import useSound from "use-sound";
import winSound from "../../assets/sounds/crash-win.mp3";
import loseSound from "../../assets/sounds/crash-lose.mp3";

export const CrashGame = () => {
  const [gameStatus, setGameStatus] = useState<CounterStatus>('disabled');
  const [bet, setBet] = useState<number>(0);
  const [maxMltp, setMaxMltp] = useState<number>(1);
  const timeoutRef = useRef<number | null>(null);

  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  const { user, addMoney, hasSound } = useAppContext();

  const {saveHistory} = useSaveHistory();

  const setStatusWin = (mltp: number) => {
    if (hasSound) playWin();
    setGameStatus('win');
    saveHistory(mltp, 'won', bet, maxMltp);
    addMoney((mltp * bet) - bet);
  }

  const setStatusLose = (mltp: number) => {
    if (hasSound) playLose();
    setGameStatus('lose');
    setStatusDisabled();
    saveHistory(mltp, 'lost', bet, maxMltp);
    addMoney(-bet);
  }

  const setStatusDisabled = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setGameStatus('disabled');
    }, 1300);
  }

  return (
    <main className="crash-game-main">

      <CrashGameGameSection
        gameStatus={gameStatus}
        bet={bet}
        balance={user?.balance || 0}
        maxMltp={maxMltp}
        handleGameStatus={setGameStatus}
        handleBet={setBet}
        handleWin={setStatusWin}
        handleLose={setStatusLose}
        handleMaxMltp={setMaxMltp}
      />

      <CrashGameHistorySaver />
    </main>
  );
};
