export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  isComplete: boolean;
  finalMultiplier: number;
  finalSlot: number;
}

export interface Peg {
  id: string;
  x: number;
  y: number;
  row: number;
  col: number;
}
