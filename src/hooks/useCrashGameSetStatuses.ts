import { GameEndStatus, GameStatus } from "../enums/enums.ts";
import { useAppContext } from "./UseAppContext.tsx";
import { useSaveHistory } from "./useSaveHistory.ts";
import { useRef } from "react";
import useSound from "use-sound";
import winSound from "../assets/sounds/crash-win.mp3";
import loseSound from "../assets/sounds/crash-lose.mp3";

type Props = {
  bet: number;
  maxMltp: number;
  handleGameStatus: (game: GameStatus) => void;
}

export const useCrashGameSetStatuses = (
  {
    bet,
    maxMltp,
    handleGameStatus,
  }: Props
) => {

  const timeoutRef = useRef<number | null>(null);
  const { hasSound, addMoney } = useAppContext();
  const { saveHistory } = useSaveHistory();
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  const setStatusWin = (mltp: number) => {
    if (hasSound) playWin();
    handleGameStatus(GameStatus.win);
    saveHistory(mltp, GameEndStatus.won, bet, maxMltp);
    addMoney((mltp * bet) - bet);
  }

  const setStatusLose = (mltp: number) => {
    if (hasSound) playLose();
    handleGameStatus(GameStatus.lose);
    setStatusDisabled();
    saveHistory(mltp, GameEndStatus.lost, bet, maxMltp);
    addMoney(-bet);
  }

  const setStatusDisabled = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleGameStatus(GameStatus.disabled);
    }, 1300);
  }

  return {setStatusWin, setStatusLose, setStatusDisabled};
}