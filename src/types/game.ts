// Simplified types for barebone puzzle game
export type PrismType = 'normal' | 'splitter' | 'mirror' | 'amplifier';

export interface PuzzleElement {
  id: string;
  type: 'prism';
  position: [number, number, number];
  rotation?: number;
  prismType?: PrismType; // Type of prism (normal, splitter, mirror, amplifier)
  locked?: boolean; // If true, prism cannot be rotated by player
}

export interface LightSource {
  position: [number, number, number];
  direction: number; // Angle in degrees (0 = forward/north, 90 = east, etc.)
}

export interface TargetCrystal {
  position: [number, number, number];
}

export interface Level {
  id: number;
  name: string;
  maxMoves: number;
  lightSource: LightSource; // Where the beam starts
  target: TargetCrystal;    // Where beam needs to reach
  elements: PuzzleElement[];
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
