import bomb from '../../assets/bomb.png';
import diamond from '../../assets/diamond.png';
import cn from "classnames";
import {roundBalance} from "../../helper/roundBalance.ts";
import {coeffMinesCounter} from "../../helper/coeffMinesCounter.ts";
import {GameStatus} from "../../enums/enums.ts";

interface GameTableProps {
  gameTable: boolean[][];
  openedTiles: boolean[][];
  gameStatus: GameStatus;
  minesCount: number;
  openedCounter: number;
  bet: number;
  onTileClick: (rowIndex: number, colIndex: number) => void;
  onNewGame: () => void;
  isPlaying: boolean;
}

export const GameTable = ({
  gameTable,
  openedTiles,
  gameStatus,
  minesCount,
  openedCounter,
  bet,
  onTileClick,
  onNewGame,
  isPlaying,
}: GameTableProps) => {

  const showAllTiles = gameStatus === GameStatus.win || gameStatus === GameStatus.lose;

  return (
    <div>
      <table className="mines-game-table">
        <tbody>
        {gameTable.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {
              row.map((cell, colIndex) => {
                const isOpened = openedTiles[rowIndex]?.[colIndex];
                const isSafe = cell;

                return (
                  <td
                    className={cn("mines-game-table-cell", {
                      'mines-game-cell-opened-safe': isOpened && isSafe,
                      'mines-game-cell-opened-mine': isOpened && !isSafe,
                      'mines-game-cell-disabled': isOpened || !isPlaying
                    })}
                    key={colIndex}
                    onClick={() => onTileClick(rowIndex, colIndex)}
                  >
                    <div className="mines-game-cell-content">
                      {isOpened || showAllTiles ? (
                        <img className="mines-game-cell-img" src={isSafe ? diamond : bomb} alt='cell' />
                      ) : (
                        <div className="mines-game-cell-placeholder" />
                      )}
                    </div>
                  </td>
                );
              })
            }
          </tr>
        ))}
        </tbody>
      </table>
      {(gameStatus === GameStatus.lose || gameStatus === GameStatus.win) && (
        <div className={cn("mines-game-status", {
          'mines-game-status-win': gameStatus === GameStatus.win,
          'mines-game-status-lose': gameStatus === GameStatus.lose
        })}>
          {gameStatus === GameStatus.win ? (
            <h2>🎉 You Won ${roundBalance(bet * coeffMinesCounter(minesCount, openedCounter))}!</h2>
          ) : (
            <h2>💥 Game Over! You lost ${bet}</h2>
          )}
          <button
            className="mines-game-new-game-btn"
            onClick={onNewGame}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};