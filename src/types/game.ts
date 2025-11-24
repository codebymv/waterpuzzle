// Core types for the puzzle game
export type JewelRating = 'none' | 'bronze' | 'silver' | 'gold';

export interface PuzzleElement {
  id: string;
  type: 'prism' | 'block' | 'plate' | 'jewel' | 'rune';
  position: [number, number, number];
  rotation?: number; // For rotatable elements
  isActivated?: boolean; // For plates and jewels
}

export interface LightBeam {
  id: string;
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
  blocked?: boolean; // True if this beam is stopped by an obstacle
  prismId?: string; // ID of prism this beam hits
}

export interface Level {
  id: number;
  chamber: number;
  name: string;
  maxMoves: number;
  parMoves: number;
  expertMoves: number;
  elements: PuzzleElement[];
  lightSources: Array<{
    position: [number, number, number];
    direction: [number, number, number];
  }>;
  runePosition: [number, number, number];
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  bestMoves: number;
  jewel: JewelRating;
  score: number;
}

export interface GameState {
  currentLevel: number;
  currentChamber: number;
  movesRemaining: number;
  movesUsed: number;
  elementsState: PuzzleElement[];
  lightBeams: LightBeam[];
  levelComplete: boolean;
  levelFailed: boolean;
  score: number;
  jewelsCollectedThisLevel: number;
  history: Array<{
    elementsState: PuzzleElement[];
    movesRemaining: number;
    jewelsCollectedThisLevel: number;
  }>;
}

export interface GameProgress {
  levelsProgress: Record<number, LevelProgress>;
  totalJewels: number;
  unlockedChambers: number[];
  totalScore: number;
}
