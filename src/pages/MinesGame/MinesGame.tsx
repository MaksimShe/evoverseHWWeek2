import './MinesGame.css'
import { randomizeMinesTable } from "../../helper/randomizeMinesTable.ts";
import { useState } from "react";
import { coeffMinesCounter } from "../../helper/coeffMinesCounter.ts";
import { useAppContext } from "../../hooks/UseAppContext.tsx";
import { GameTable } from "../../components/MinesGameComponents/GameTable.tsx";
import { GameControllers } from "../../components/MinesGameComponents/GameControls.tsx";
import { GameStatus, MinesCounter } from "../../enums/enums.ts";
import clickSound from "../../assets/sounds/clickMenu.mp3"
import cashSound from "../../assets/sounds/cashAdd.mp3"
import loseSound from "../../assets/sounds/bmw-bong.mp3"
import tileClickSound from "../../assets/sounds/clearHistory.mp3"
import useSound from "use-sound";

const MAX_BET = 1000;
const MIN_BET = 1;

export const MinesGame = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.disabled);
  const [gameTable, setGameTable] = useState<boolean[][]>([[]]);
  const [openedTiles, setOpenedTiles] = useState<boolean[][]>([[]]);
  const [minesCount, setMinesCount] = useState<MinesCounter>(MinesCounter.One);
  const [openedCounter, setOpenedCounter] = useState<number>(0);
  const [bet, setBet] = useState<number>(10);
  const [betError, setBetError] = useState<boolean>(false);

  console.log(gameStatus);

  const [playClickSound] = useSound(clickSound);
  const [playCashSound] = useSound(cashSound);
  const [playTileSound] = useSound(tileClickSound);
  const [playLoseSound] = useSound(loseSound);

  const { addMoney, user, playSound } = useAppContext();

  const isPlaying = gameStatus === GameStatus.active;
  const safeTilesCount = 25 - minesCount;

  const handleMinesCounter = (num: number) => {
    playSound(playClickSound);

    setMinesCount(num);
  }

  const increaseOpenedCounter = () => {
    setOpenedCounter(prev => prev + 1);
    playSound(playTileSound)
  }

  const gameStarted = () => {
    if (bet < MIN_BET || bet > (user?.balance || 0)) {
      setBetError(true);
      return;
    }

    playSound(playClickSound);
    setBetError(false);
    const newTable = randomizeMinesTable(minesCount);
    setGameTable(newTable);
    setOpenedTiles(newTable.map(row => row.map(() => false)));
    setGameStatus(GameStatus.active);
    setOpenedCounter(0);
    addMoney(-bet);
  }

  const handleBetChange = (value: string) => {
    setBetError(false);
    const numValue = Number(value);

    playSound(playClickSound);
    if (value === '') {
      setBet(0);
      return;
    }

    const maxBet = Math.min(MAX_BET, user?.balance || MAX_BET);

    if (!isNaN(numValue) && numValue >= 0) {
      setBet(numValue > maxBet ? maxBet : numValue);
    }
  }

  const openTile = (rowIndex: number, colIndex: number) => {
    if (!isPlaying) return;
    if (openedTiles[rowIndex]?.[colIndex]) return;

    const tile = gameTable[rowIndex][colIndex];

    const newOpenedTiles = openedTiles.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? true : cell
      )
    );
    setOpenedTiles(newOpenedTiles);

    if (!tile) {
      setGameStatus(GameStatus.lose);
      playSound(playLoseSound);
      setOpenedTiles(gameTable.map(row => row.map(() => true)));
      return;
    }

    const newOpenedCount = openedCounter + 1;
    increaseOpenedCounter();

    if (newOpenedCount === safeTilesCount) {
      const winAmount = bet * coeffMinesCounter(minesCount, newOpenedCount);
      addMoney(winAmount);
      setOpenedTiles(gameTable.map(row => row.map(() => true)));
    }
  }

  const handleQuickBet = (amount: number) => {
    playSound(playClickSound);
    setBetError(false);
    setBet(() => {
      const newBet = amount;
      const maxBet = Math.min(MAX_BET, user?.balance || MAX_BET);
      return newBet > maxBet ? maxBet : newBet;
    });
  }

  const handleCashout = () => {
    if (openedCounter === 0) return;

    const winAmount = bet * coeffMinesCounter(minesCount, openedCounter);
    playSound(playCashSound);
    addMoney(winAmount);
    setGameStatus(GameStatus.win);
    setOpenedTiles(gameTable.map(row => row.map(() => true)));
  }

  const handleNewGame = () => {
    setGameStatus(GameStatus.disabled);
    setGameTable([[]]);
    setOpenedTiles([[]]);
    setOpenedCounter(0);
    setBetError(false);
  }

  const safeTilesLeft = safeTilesCount - openedCounter;

  return (
    <main className="mines-game-wrapper">
      <div className="mines-game-main">

        <GameTable
          gameTable={gameTable}
          openedTiles={openedTiles}
          gameStatus={gameStatus}
          minesCount={minesCount}
          openedCounter={openedCounter}
          bet={bet}
          onTileClick={openTile}
          onNewGame={handleNewGame}
          isPlaying={isPlaying}
        />

        <GameControllers
          bet={bet}
          betError={betError}
          minesCount={minesCount}
          openedCounter={openedCounter}
          safeTilesLeft={safeTilesLeft}
          userBalance={user?.balance || 0}
          isPlaying={isPlaying}
          onBetChange={handleBetChange}
          onQuickBet={handleQuickBet}
          onMinesCountChange={handleMinesCounter}
          onStartGame={gameStarted}
          onCashout={handleCashout}
        />

      </div>
    </main>
  )
}