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
      history: []
    });
  },

  makeMove: (elementId: string, action: 'rotate', data?: any) => {
    const state = get();
    if (state.levelComplete || state.movesRemaining <= 0) return;

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

    // Update element
    const newElements = state.elementsState.map(el => {
      if (el.id === elementId && el.type === 'prism') {
        const direction = data?.direction || 1;
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

    // Check win condition after move
    setTimeout(() => {
      const currentState = get();
      if (get().checkWinCondition()) {
        // Calculate star rating based on moves used
        const level = LEVELS.find(l => l.id === currentState.currentLevel);
        let stars: 0 | 1 | 2 | 3 = 1; // Default: bronze (completed)
        
        if (level?.starThresholds) {
          const movesUsed = currentState.movesUsed;
          if (movesUsed <= level.starThresholds.gold) stars = 3;
          else if (movesUsed <= level.starThresholds.silver) stars = 2;
          else if (movesUsed <= level.starThresholds.bronze) stars = 1;
        }
        
        // Update best score if better than previous
        const bestScores = { ...currentState.levelBestScores };
        const currentBest = bestScores[currentState.currentLevel];
        if (!currentBest || currentState.movesUsed < currentBest) {
          bestScores[currentState.currentLevel] = currentState.movesUsed;
        }
        
        set({ 
          levelComplete: true,
          starsEarned: stars,
          levelBestScores: bestScores
        });
      } else if (currentState.movesRemaining === 0) {
        set({ levelFailed: true });
      }
    }, 50);
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
    const state = get();
    const level = LEVELS.find(l => l.id === state.currentLevel);
    if (!level || !level.chain || !level.solution) return false;

    // Helper: Check if beam path is blocked by obstacles
    const isPathBlocked = (from: [number, number, number], to: [number, number, number]) => {
      if (!level.obstacles) return false;
      
      for (const obstacle of level.obstacles) {
        const obstaclePos = obstacle.position;
        const obstacleRadius = obstacle.type === 'pillar' ? 0.5 : 
                             obstacle.type === 'wall' ? 1.0 : 0.6;
        
        // Check if line segment from->to intersects with obstacle circle
        const dx = to[0] - from[0];
        const dz = to[2] - from[2];
        const fx = from[0] - obstaclePos[0];
        const fz = from[2] - obstaclePos[2];
        
        const a = dx * dx + dz * dz;
        const b = 2 * (fx * dx + fz * dz);
        const c = (fx * fx + fz * fz) - obstacleRadius * obstacleRadius;
        
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant >= 0) {
          const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
          const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
          
          if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
            return true;
          }
        }
      }
      
      return false;
    };

    // Helper: Check if prism A is pointing at target B within tolerance
    const isPointingAt = (prismA: any, targetPos: [number, number, number], angleOffset = 0) => {
      const angleToTarget = Math.atan2(
        targetPos[0] - prismA.position[0],
        targetPos[2] - prismA.position[2]
      ) * (180 / Math.PI);
      
      const normalizedAngle = ((angleToTarget % 360) + 360) % 360;
      const prismAngle = (((prismA.rotation || 0) + angleOffset) % 360 + 360) % 360;
      
      // Allow 22.5° tolerance (half of 45°)
      const diff = Math.abs(normalizedAngle - prismAngle);
      const angleMatches = diff < 22.5 || diff > 337.5;
      
      // Check if path is blocked
      if (angleMatches && isPathBlocked(prismA.position, targetPos)) {
        return false;
      }
      
      return angleMatches;
    };

    // Helper: Check chain validity
    const checkChain = (chain: string[]) => {
      for (let i = 0; i < chain.length; i++) {
        const currentPrismId = chain[i];
        const currentPrism = state.elementsState.find(el => el.id === currentPrismId);
        if (!currentPrism) return false;

        const prismType = currentPrism.prismType || 'normal';

        if (i < chain.length - 1) {
          // Check if this prism points to the next prism in chain
          const nextPrismId = chain[i + 1];
          const nextPrism = state.elementsState.find(el => el.id === nextPrismId);
          if (!nextPrism) return false;

          // For splitters, check both outputs (±45°)
          if (prismType === 'splitter') {
            // Splitters need at least one output to hit the next in chain
            const mainHit = isPointingAt(currentPrism, nextPrism.position);
            const leftHit = isPointingAt(currentPrism, nextPrism.position, -45);
            const rightHit = isPointingAt(currentPrism, nextPrism.position, 45);
            if (!mainHit && !leftHit && !rightHit) return false;
          } else if (prismType === 'mirror') {
            // Mirrors bend beam 90°
            if (!isPointingAt(currentPrism, nextPrism.position, 90)) return false;
          } else {
            // Normal prism
            if (!isPointingAt(currentPrism, nextPrism.position)) return false;
          }
        } else {
          // Last prism should point to the rune
          if (prismType === 'splitter') {
            const mainHit = isPointingAt(currentPrism, level.runePosition);
            const leftHit = isPointingAt(currentPrism, level.runePosition, -45);
            const rightHit = isPointingAt(currentPrism, level.runePosition, 45);
            if (!mainHit && !leftHit && !rightHit) return false;
          } else if (prismType === 'mirror') {
            if (!isPointingAt(currentPrism, level.runePosition, 90)) return false;
          } else {
            if (!isPointingAt(currentPrism, level.runePosition)) return false;
          }
        }
      }
      return true;
    };

    // Check primary chain
    if (!checkChain(level.chain)) return false;

    // Check secondary chains if they exist
    if (level.secondaryChains) {
      for (const chain of level.secondaryChains) {
        if (!checkChain(chain)) return false;
      }
    }

    // Check if rune has beam requirements
    const rune = state.elementsState.find(el => el.type === 'rune');
    if (rune?.requiredBeams) {
      // Count how many chains are complete
      let beamCount = 1; // Primary chain
      if (level.secondaryChains) {
        beamCount += level.secondaryChains.filter(chain => checkChain(chain)).length;
      }
      
      if (beamCount < rune.requiredBeams) return false;
    }

    return true;
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
