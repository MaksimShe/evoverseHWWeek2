export const generateMultipliers = (num: number): number[] => {
  const n = num + 2;

  const base = Math.max(0.1, 1.2 - 0.1 * n);
  const step = 0.3 * n + 0.1;

  const center = (n - 1) / 2;

  const result = Array.from({ length: n }, (_, i) => base * Math.pow(step, Math.abs(i - center)));

  return result.map((v) => +v.toFixed(1));
};
