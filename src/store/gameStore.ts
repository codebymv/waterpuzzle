import { create } from 'zustand';
import { GameState, PuzzleElement } from '../types/game';
import { LEVELS } from '../data/levels/index';

interface GameStore extends GameState {
  // Actions
  loadLevel: (levelId: number) => void;
  makeMove: (elementId: string, action: 'rotate', data?: any) => void;
  undoMove: () => void;
  restartLevel: () => void;
  completeLevel: () => void;
  checkWinCondition: () => boolean;
  nextLevel: () => void;
  setBeamReachesTarget: (reaches: boolean) => void;
  beamReachesTarget: boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentLevel: 1,
  movesRemaining: 0,
  movesUsed: 0,
  elementsState: [],
  levelComplete: false,
  levelFailed: false,
  starsEarned: 0,
  levelBestScores: {},
  history: [],
  beamReachesTarget: false,

  loadLevel: (levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;
    set({
      currentLevel: levelId,
      movesRemaining: level.maxMoves,
      movesUsed: 0,
      elementsState: JSON.parse(JSON.stringify(level.elements)),
      levelComplete: false,
      levelFailed: false,
      starsEarned: 0,
      history: [],
      beamReachesTarget: false
    });
  },

  setBeamReachesTarget: (reaches: boolean) => {
    const state = get();
    
    // Only trigger win if beam reaches target and level not already complete
    if (reaches && !state.levelComplete) {
      // Calculate star rating based on moves used
      const level = LEVELS.find(l => l.id === state.currentLevel);
      let stars: 0 | 1 | 2 | 3 = 1; // Default: bronze (completed)
      
      if (level?.starThresholds) {
        const movesUsed = state.movesUsed;
        if (movesUsed <= level.starThresholds.gold) stars = 3;
        else if (movesUsed <= level.starThresholds.silver) stars = 2;
        else if (movesUsed <= level.starThresholds.bronze) stars = 1;
      }
      
      // Update best score if better than previous
      const bestScores = { ...state.levelBestScores };
      const currentBest = bestScores[state.currentLevel];
      if (!currentBest || state.movesUsed < currentBest) {
        bestScores[state.currentLevel] = state.movesUsed;
      }
      
      set({ 
        beamReachesTarget: reaches,
        levelComplete: true,
        starsEarned: stars,
        levelBestScores: bestScores
      });
    } else {
      set({ beamReachesTarget: reaches });
    }
  },

  makeMove: (elementId: string, _action: 'rotate', data?: any) => {
    const state = get();
    if (state.levelComplete || state.movesRemaining <= 0) return;

    // Find the clicked prism
    const clickedPrism = state.elementsState.find(el => el.id === elementId && el.type === 'prism');
    if (!clickedPrism || clickedPrism.locked) return;

    // Save state to history for undo
    set({
      history: [
        ...state.history,
        {
          elementsState: JSON.parse(JSON.stringify(state.elementsState)),
          movesRemaining: state.movesRemaining,
        }
      ]
    });

    // Find all adjacent prisms (within distance of ~1.5 units)
    const getAdjacentPrisms = (prism: PuzzleElement): string[] => {
      const [px, py, pz] = prism.position;
      return state.elementsState
        .filter(el => {
          if (el.type !== 'prism' || el.id === prism.id) return false;
          const [ex, ey, ez] = el.position;
          const distance = Math.sqrt((px - ex) ** 2 + (py - ey) ** 2 + (pz - ez) ** 2);
          return distance <= 1.5; // Adjacent = within 1.5 units
        })
        .map(el => el.id);
    };

    const adjacentIds = getAdjacentPrisms(clickedPrism);
    const affectedIds = [elementId, ...adjacentIds];

    // RIPPLE ROTATION: Rotate clicked prism AND all adjacent prisms
    const direction = data?.direction || 1;
    const newElements = state.elementsState.map(el => {
      if (el.type === 'prism' && affectedIds.includes(el.id) && !el.locked) {
        const newRotation = ((el.rotation || 0) + (45 * direction) + 360) % 360;
        return { ...el, rotation: newRotation };
      }
      return el;
    });

    set({
      elementsState: newElements,
      movesRemaining: state.movesRemaining - 1,
      movesUsed: state.movesUsed + 1
    });

    // Check for level failure (out of moves)
    const currentState = get();
    if (currentState.movesRemaining === 0 && !currentState.levelComplete) {
      set({ levelFailed: true });
    }
  },

  undoMove: () => {
    const state = get();
    if (state.history.length === 0) return;

    const lastState = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    set({
      elementsState: lastState.elementsState,
      movesRemaining: lastState.movesRemaining,
      movesUsed: state.movesUsed - 1,
      history: newHistory
    });
  },

  restartLevel: () => {
    const state = get();
    get().loadLevel(state.currentLevel);
  },

  completeLevel: () => {
    set({ levelComplete: true });
  },

  checkWinCondition: () => {
    // Win condition is now handled by setBeamReachesTarget
    return get().beamReachesTarget;
  },

  nextLevel: () => {
    const state = get();
    const nextLevelId = state.currentLevel + 1;
    const nextLevel = LEVELS.find(l => l.id === nextLevelId);
    
    if (nextLevel) {
      get().loadLevel(nextLevelId);
    } else {
      // Loop back to first level or show completion
      get().loadLevel(1);
    }
  },
}));
