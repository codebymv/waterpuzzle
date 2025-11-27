// Simplified types for barebone puzzle game
export type PrismType = 'normal' | 'splitter' | 'mirror' | 'amplifier';

export interface PuzzleElement {
  id: string;
  type: 'prism' | 'rune';
  position: [number, number, number];
  rotation?: number;
  prismType?: PrismType; // Type of prism (normal, splitter, mirror, amplifier)
  requiredBeams?: number; // For runes: how many beams needed to activate
  locked?: boolean; // If true, prism cannot be rotated by player
}

export interface Obstacle {
  id: string;
  type: 'pillar' | 'wall' | 'crystal';
  position: [number, number, number];
  height?: number;
}

export interface Level {
  id: number;
  name: string;
  maxMoves: number;
  runePosition: [number, number, number];
  solution: Record<string, number>; // prismId -> target rotation in degrees
  chain: string[]; // Ordered array of prism IDs showing the path (last one points to rune)
  secondaryChains?: string[][]; // Additional chains for multi-beam puzzles
  elements: PuzzleElement[];
  obstacles?: Obstacle[]; // Optional obstacles that block line of sight
  starThresholds?: {
    gold: number;   // moves needed for gold star
    silver: number; // moves needed for silver star
    bronze: number; // moves needed for bronze star
  };
}

export interface GameState {
  currentLevel: number;
  movesRemaining: number;
  movesUsed: number;
  elementsState: PuzzleElement[];
  levelComplete: boolean;
  levelFailed: boolean;
  starsEarned: 0 | 1 | 2 | 3; // Star rating for current level completion
  levelBestScores: Record<number, number>; // levelId -> best moves used
  history: Array<{
    elementsState: PuzzleElement[];
    movesRemaining: number;
  }>;
}
