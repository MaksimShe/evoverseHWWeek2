import cn from 'classnames';
import { coeffMinesCounter } from '../../helper/coeffMinesCounter';
import { roundBalance } from '../../helper/roundBalance';
import { MinesCounter } from '../../enums/enums.ts';

enum BetQuickSelector {
  haveBMW = 10,
  juniorDev = 50,
  haveApartment = 100,
  rich = 500,
}

const riskBtns = [
  MinesCounter.One,
  MinesCounter.Three,
  MinesCounter.Five,
  MinesCounter.Ten,
  MinesCounter.Fifteen,
];

const betsQuick = [
  BetQuickSelector.haveBMW,
  BetQuickSelector.juniorDev,
  BetQuickSelector.haveApartment,
  BetQuickSelector.rich,
];

type Props = {
  bet: number;
  betError: boolean;
  minesCount: MinesCounter;
  openedCounter: number;
  safeTilesLeft: number;
  userBalance: number;
  isPlaying: boolean;

  onBetChange: (value: string) => void;
  onQuickBet: (value: number) => void;
  onMinesCountChange: (value: MinesCounter) => void;
  onStartGame: () => void;
  onCashout: () => void;
};

export const GameControllers = ({
  bet,
  betError,
  minesCount,
  openedCounter,
  safeTilesLeft,
  userBalance,
  isPlaying,
  onBetChange,
  onQuickBet,
  onMinesCountChange,
  onStartGame,
  onCashout,
}: Props) => {
  return (
    <aside className="mines-game-controls-main">
      <div className="mines-game-controls-main-container">
        <section className="mines-game-bet-controls">
          <h2>Bet amount:</h2>

          <input
            type="number"
            placeholder="Your bet"
            value={bet || ''}
            max={userBalance}
            disabled={isPlaying}
            onChange={(e) => onBetChange(e.target.value)}
            className={cn('mines-game-bet-input', {
              'mines-game-bet-input-error': betError,
            })}
          />

          <div className="mines-game-bet-btns">
            {betsQuick.map((value) => (
              <button
                key={value}
                className="mines-game-bet-btn"
                onClick={() => onQuickBet(value)}
                disabled={isPlaying}
              >
                {value}$
              </button>
            ))}
          </div>
        </section>

        <section className="mines-game-chances-control">
          <h2>Mines: {minesCount}</h2>

          <div className="mines-game-bet-btns">
            {riskBtns.map((value) => (
              <button
                key={value}
                disabled={isPlaying}
                onClick={() => onMinesCountChange(value)}
                className={cn('mines-game-bet-btn', {
                  'mines-game-counter-selected': value === minesCount,
                })}
              >
                {value}
              </button>
            ))}
          </div>
        </section>

        <button
          className={cn('mines-game-game-start', {
            'mines-game-game-cashout': isPlaying,
          })}
          disabled={isPlaying && openedCounter === 0}
          onClick={isPlaying ? onCashout : onStartGame}
        >
          {!isPlaying
            ? 'Start game!'
            : `$ Cashout $${roundBalance(bet * coeffMinesCounter(minesCount, openedCounter))} $`}
        </button>
      </div>

      <section className="mines-game-current-game">
        <h2>Current game</h2>

        <div className="mines-game-current-info-container">
          <span>Bet amount:</span>
          <span>${bet}</span>
        </div>

        <div className="mines-game-current-info-container">
          <span>Current value:</span>
          <span>${roundBalance(bet * coeffMinesCounter(minesCount, openedCounter))}</span>
        </div>

        <div className="mines-game-current-info-container">
          <span>Next tile:</span>
          <span>x{roundBalance(coeffMinesCounter(minesCount, openedCounter + 1))}</span>
        </div>

        <div className="mines-game-current-info-container">
          <span>Safe tiles left:</span>
          <span>{safeTilesLeft}</span>
        </div>
      </section>

      <section className="mines-game-tips">
        <h2>💡 Tips</h2>
        <p>
          • More mines = higher multiplier
          <br />
          • Cash out anytime
          <br />
          • Each safe tile increases payout
          <br />• One mine ends the game
        </p>
      </section>
    </aside>
  );
};
