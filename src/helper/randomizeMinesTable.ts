export const randomizeMinesTable = (counter: number) =>  {
  const totalCells = 25;
  const falseCount = Math.min(Math.max(0, counter), totalCells);

  const arr = Array(totalCells).fill(true);
  for (let i = 0; i < falseCount; i++) {
    arr[i] = false;
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push(arr.slice(i * 5, i * 5 + 5));
  }

  return grid;
}