import { GameStatus } from "../enums/enums";
import { roundBalance } from "../helper/roundBalance";
import { useAppContext } from "./UseAppContext";

type Props = {
  autoStopStatus: boolean;
  minAutoStop: number;
  autoStop: number;
  stepAutoStop: number;
  balance: number;

  handleIsFinished: (status: boolean) => void;
  handleMaxMltp: (num: number) => void;
  handleGameStatus: (status: GameStatus) => void;
  handleCounterKey: (key: number) => void;
  playClick: () => void;
  handleAutoStopStatus: (status: boolean) => void;
  handleBet: (bet: number) => void;
  handleAutoStop: (num: number | ((prev: number) => number)) => void;
};

type UseCrashGameLogicReturn = {
  finishCounter: () => void;
  startCounter: () => void;
  betValidator: (value: number) => void;
  changeAutoStop: (val: number) => void;
  changeAutoStopGame: () => void;
};

export const useCrashGameLogic = (
  {
    autoStopStatus,
    minAutoStop,
    autoStop,
    stepAutoStop,
    balance,

    handleIsFinished,
    handleMaxMltp,
    handleGameStatus,
    handleCounterKey,
    handleAutoStopStatus,
    handleBet,
    handleAutoStop,
    playClick,
  }: Props): UseCrashGameLogicReturn => {
  const { hasSound } = useAppContext();

  const finishCounter = () => {
    handleIsFinished(true);
  };

  const startCounter = () => {
    const random = generateMultiplier();
    handleMaxMltp(random);
    handleGameStatus(GameStatus.active);
    handleIsFinished(false);
    handleCounterKey((prev: number) => prev + 1);
  };

  const generateMultiplier = () => {
    const r = Math.random();
    const m = 1 / (1 - r);
    return roundBalance(Math.min(m, 50));
  };

  const betValidator = (value: number) => {
    if (hasSound) playClick();
    if (value > (balance || 0)) {
      handleBet(balance || 0);
    } else if (value < 0) {
      handleBet(0);
    } else {
      handleBet(value);
    }
  };

  const changeAutoStop = (val: number) => {
    if (hasSound) playClick();
    if (autoStop < minAutoStop + stepAutoStop && val < 0) {
      handleAutoStop(minAutoStop);
    } else {
      handleAutoStop((prev: number) => prev + val);
    }
  };

  const changeAutoStopGame = () => {
    if (hasSound) playClick();
    handleAutoStopStatus(!autoStopStatus);
  };

  return {
    finishCounter,
    startCounter,
    betValidator,
    changeAutoStop,
    changeAutoStopGame,
  };
};
