import cn from "classnames";

import rocket from '../../assets/rocket.png';
import boom from '../../assets/boom.png';
import videoBgRocket from "../../images/bg_rocket-crash-game.mp4";


import clickSound from '../../assets/sounds/crash-click.mp3'

import {type FC, useEffect, useState} from "react";
import {Counter} from "../elements/Counter.tsx";
import useSound from "use-sound";
import {useAppContext} from "../../hooks/UseAppContext.tsx";

export type CounterStatus = 'disabled' | 'active' | 'lose' | 'win';

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
  const [autoStop, setAutoStop] = useState(1.25);

  const { hasSound } = useAppContext()

  const [playClick] = useSound(clickSound);

  const add10PercentFromBalance = () => {
    if (hasSound) playClick();
    const increment = +(balance * 0.1).toFixed(2);
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

  const finishCounter = () => {
    setIsFinished(true);
  }

  const startCounter = () => {
    const random = generateMultiplier();
    handleMaxMltp(random);
    handleGameStatus('active');
    setIsFinished(false);
    setCounterKey(prev => prev + 1);
  }

  const generateMultiplier = () => {
    const r = Math.random();
    const m = 1 / (1 - r);
    return +(Math.min(m, 50)).toFixed(2);
  }

  const betValidator = (value: number) => {
    if (hasSound) playClick();
    if (value > (balance || 0)) {
      handleBet(balance || 0);
    } else if (value < 0) {
      handleBet(0);
    } else {
      handleBet(value);
    }
  }

  const changeAutoStop = (val: number) => {
    if (hasSound) playClick();
    if (autoStop < 1.5 && val < 0) {
      setAutoStop(1.25);
    } else {
      setAutoStop(prev => prev + val);
    }
  }

  const changeAutoStopGame = () => {
    if (hasSound) playClick();
    setAutoStopStatus(!autoStopStatus);
  }

  useEffect(() => {
    if (gameStatus === 'lose' && bet > balance) {
      handleBet(balance);
    }
  }, [balance, gameStatus]);

  return (
    <section className="crash-game-section">
      <video
        className={"crash-game-bg-rocket"}
        src={videoBgRocket}
        autoPlay
        loop
        muted
        onPause={() => gameStatus !== 'active'}
        controls={false}
      />
      <div
        className={cn("crash-game-rocket-wrapper",
          {'fly' : gameStatus === 'active'},
          {'reset' : gameStatus === 'lose'},
        )}>
        {gameStatus === 'lose' ?
          <img src={boom} className="crash-game-boom" alt="boom" />
          :
          <img src={rocket} className="crash-game-rocket" alt="rocket" />
        }
      </div>

      {gameStatus !== 'active' &&
        <button
          onClick={startCounter}
          disabled={gameStatus === 'lose'|| bet <= 0}
          className='crash-game-play-btn'
        >
          Start Game
        </button>
      }

      {gameStatus === 'active' &&
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
          disabled={gameStatus === 'active'}
          value={bet === 0 ? '' : bet}
          onChange={(e) => betValidator(+e.target.value)}
          max={balance || undefined}
        />

        <button
          className='crash-game-bet-btn'
          disabled={gameStatus === 'active'}
          onClick={() => add10PercentFromBalance()}
        >
          +10%
        </button>
        <button
          className='crash-game-bet-btn'
          disabled={gameStatus === 'active'}
          onClick={() => addAll()}
        >
          All
        </button>
      </div>

      <div className='crash-game-auto'>
        <button
          disabled={!autoStopStatus || autoStop === 1.25}
          className="crash-game-auto-btn"
          onClick={() => changeAutoStop(-0.25)}
        >
          -
        </button>
        <p className="crash-game-autu-mltp">{autoStop.toFixed(2)}</p>
        <button
          disabled={!autoStopStatus}
          className="crash-game-auto-btn"
          onClick={() => changeAutoStop(0.25)}
        >
          +
        </button>
        <button
          className="crash-game-auto-btn"
          onClick={() => changeAutoStopGame()}
        >
          {autoStopStatus ? 'Off' : 'On' }
        </button>
      </div>

    </section>
  )
}