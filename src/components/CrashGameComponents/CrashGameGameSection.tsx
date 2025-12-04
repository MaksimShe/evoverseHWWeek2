import cn from "classnames";
import rocket from '../../assets/rocket.png';
import boom from '../../assets/boom.png';
import bgRocket from "../../images/galaxy.gif";
import clickSound from '../../assets/sounds/crash-click.mp3'
import { type FC, useEffect, useState } from "react";
import { Counter } from "../elements/Counter.tsx";
import useSound from "use-sound";
import { useAppContext } from "../../hooks/UseAppContext.tsx";
import {roundBalance} from "../../helper/roundBalance.ts";
import { GameStatus } from "../../enums/enums.ts";
import {useCrashGameLogic} from "../../hooks/useCrashGameLogic.ts";

export type CounterStatus = GameStatus;
const minAutoStop = 1.25;
const stepAutoStop = 0.25;

type Props = {
  gameStatus: CounterStatus,
  bet: number,
  balance: number,
  maxMltp: number,

  handleGameStatus: (gameStatus: CounterStatus) => void,
  handleBet: (newBet: number) => void,
  handleWin: (mltp: number) => void,
  handleLose: (mltp: number) => void,
  handleMaxMltp: (mltp: number) => void,
}

export const CrashGameGameSection: FC<Props> = (
  {
    gameStatus,
    bet,
    balance,
    maxMltp,

    handleGameStatus,
    handleBet,
    handleWin,
    handleLose,
    handleMaxMltp,
  }) => {

  const [isFinished, setIsFinished] = useState(false);
  const [counterKey, setCounterKey] = useState(0);
  const [autoStopStatus, setAutoStopStatus] = useState(false)
  const [autoStop, setAutoStop] = useState(minAutoStop);

  const { hasSound } = useAppContext()

  const [playClick] = useSound(clickSound);

  const addTenPercentFromBalance = () => {
    if (hasSound) playClick();
    const increment = roundBalance(balance * 0.1);
    if (balance > bet + 5) {
      handleBet(bet + increment);
    } else {
      handleBet(balance);
    }
  }

  const addAll = () => {
    if (hasSound) playClick();
    if (balance > 1) {
      handleBet(balance)
    }
  }

  const { startCounter, finishCounter, changeAutoStopGame, changeAutoStop, betValidator } = useCrashGameLogic(
    {
      autoStopStatus,
      minAutoStop,
      autoStop,
      stepAutoStop,
      balance,
      handleIsFinished: setIsFinished,
      handleMaxMltp,
      handleGameStatus,
      handleCounterKey: setCounterKey,
      handleAutoStopStatus: setAutoStopStatus,
      handleBet,
      handleAutoStop: setAutoStop,
      playClick,
    }
  );

  useEffect(() => {
    if (gameStatus === GameStatus.lose && bet > balance) {
      handleBet(balance);
    }
  }, [balance, gameStatus]);

  return (
    <section className="crash-game-section">
      <img
        className={"crash-game-bg-rocket"}
        src={bgRocket}
      />
      <div
        className={cn("crash-game-rocket-wrapper",
          {'fly' : gameStatus === GameStatus.active},
          {'reset' : gameStatus === GameStatus.lose},
        )}>
        {gameStatus === GameStatus.lose ?
          <img src={boom} className="crash-game-boom" alt="boom" />
          :
          <img src={rocket} className="crash-game-rocket" alt="rocket" />
        }
      </div>

      {gameStatus !== GameStatus.active &&
        <button
          onClick={startCounter}
          disabled={gameStatus === GameStatus.lose|| bet <= 0}
          className='crash-game-play-btn'
        >
          Start Game
        </button>
      }

      {gameStatus === GameStatus.active &&
        <>
          <button
            onClick={finishCounter}
            className='crash-game-play-btn'
          >
            Cashout!
          </button>
          <div className="crash-game-multiplier">
            <Counter
              key={counterKey}
              growsTo={maxMltp}
              finish={isFinished}
              handleWin={handleWin}
              handleLose={handleLose}
              autoStopValue={autoStopStatus ? autoStop : null}
            />
          </div>
        </>
      }

      <div className='crash-game-bet'>
        <input
          type="number"
          className="crash-game-bet-input"
          placeholder="Bet"
          disabled={gameStatus === GameStatus.active}
          value={bet ?? ''}
          onChange={(e) => betValidator(+e.target.value)}
          max={balance || undefined}
        />

        <button
          className='crash-game-bet-btn'
          disabled={gameStatus === GameStatus.active}
          onClick={addTenPercentFromBalance}
        >
          +10%
        </button>
        <button
          className='crash-game-bet-btn'
          disabled={gameStatus === GameStatus.active}
          onClick={addAll}
        >
          All
        </button>
      </div>

      <div className='crash-game-auto'>
        <button
          disabled={!autoStopStatus || autoStop === minAutoStop}
          className="crash-game-auto-btn"
          onClick={() => changeAutoStop(-stepAutoStop)}
        >
          -
        </button>
        <p className={cn("crash-game-auto-mltp",
          {
            'crash-game-auto-mltp-disabled': !autoStopStatus,
          }
        )}
        >
          {roundBalance(autoStop)}
        </p>
        <button
          disabled={!autoStopStatus}
          className="crash-game-auto-btn"
          onClick={() => changeAutoStop(stepAutoStop)}
        >
          +
        </button>
        <button
          className={cn("crash-game-auto-btn",
            {
              'crash-game-auto-btn-active': autoStopStatus,
              'crash-game-auto-btn-disabled': !autoStopStatus,
            }
            )}
          onClick={changeAutoStopGame}
        >
          {autoStopStatus ? 'On' : 'Off' }
        </button>
      </div>

    </section>
  )
}