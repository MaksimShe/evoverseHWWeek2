import './CrashGame.css';
import { useState } from "react";
import { type CounterStatus, CrashGameGameSection } from "../../components/CrashGameComponents/CrashGameGameSection.tsx";
import { CrashGameHistorySaver } from "../../components/CrashGameComponents/CrashGameHistorySaver.tsx";
import { useAppContext } from "../../hooks/UseAppContext.tsx";

import { GameStatus } from "../../enums/enums.ts";
import { useCrashGameSetStatuses } from "../../hooks/useCrashGameSetStatuses.ts";

export const CrashGame = () => {
  const [gameStatus, setGameStatus] = useState<CounterStatus>(GameStatus.disabled);
  const [bet, setBet] = useState<number>(0);
  const [maxMltp, setMaxMltp] = useState<number>(1);

  const { setStatusWin, setStatusLose } = useCrashGameSetStatuses(
    {bet, maxMltp, handleGameStatus:setGameStatus}
  );
  const { user } = useAppContext();

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
