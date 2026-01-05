export function coeffMinesCounter(minesCount: number, openedCount: number): number {
  const totalCells = 25;
  const safeCells = totalCells - minesCount;

  if (minesCount < 1 || minesCount >= totalCells) {
    throw new Error('Mines count must be between 1 and 24');
  }

  if (openedCount < 0 || openedCount - 1 > safeCells) {
    throw new Error(`Opened count must be between 0 and ${safeCells}`);
  }

  if (openedCount === 0) {
    return 1.0;
  }

  let coefficient = 1.0;

  for (let i = 0; i < openedCount; i++) {
    coefficient *= (totalCells - i) / (safeCells - i);
  }

  return Math.round(coefficient * 100) / 100;
}
