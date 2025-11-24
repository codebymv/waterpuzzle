import { create } from 'zustand';
import { GameState, GameProgress, PuzzleElement, JewelRating, LevelProgress } from '../types/game';
import { LEVELS } from '../data/levels';

interface GameStore extends GameState {
  progress: GameProgress;
  
  // Actions
  loadLevel: (levelId: number) => void;
  makeMove: (elementId: string, action: 'rotate' | 'move', data?: any) => void;
  undoMove: () => void;
  restartLevel: () => void;
  collectJewel: (elementId: string) => void;
  activatePressurePlate: (elementId: string) => void;
  checkLevelComplete: () => boolean;
  completeLevel: () => void;
  triggerCompletion: () => void;
  calculateJewelRating: (movesUsed: number) => JewelRating;
  saveProgress: () => void;
  loadProgress: () => void;
  nextLevel: () => void;
}

const MOVES_RESTORED_BY_PLATE = 5;
const MOVES_GRANTED_BY_JEWEL = 2;
const BASE_LEVEL_SCORE = 1000;
const EFFICIENCY_BONUS = 100;
const JEWEL_BONUS = 50;

// Helper: Calculate light beams and check if they reach the rune
const calculateLightPath = (elements: PuzzleElement[], level: any): { beams: any[], reachesRune: boolean } => {
  const beams: any[] = [];
  const rune = elements.find(e => e.type === 'rune');
  if (!rune) return { beams, reachesRune: false };

  // Start from each light source
  level.lightSources?.forEach((source: any, idx: number) => {
    console.log(`\n💡 Tracing light from source ${idx}:`, source.position, '→', source.direction);
    let currentPos = source.position;
    let currentDir = source.direction;
    let pathLength = 0;
    const maxBounces = 10;
    const visitedPrisms = new Set(); // Prevent infinite loops

    // Trace light path through prisms
    for (let bounce = 0; bounce < maxBounces && pathLength < 20; bounce++) {
      // Find next intersection point
      const prisms = elements.filter(e => e.type === 'prism');
      let nearestPrism = null;
      let nearestDist = Infinity;

      // Check if any block is blocking the light path
      const blocks = elements.filter(e => e.type === 'block');
      let blockingBlock = null;
      let blockDist = Infinity;
      
      for (const block of blocks) {
        const dx = block.position[0] - currentPos[0];
        const dz = block.position[2] - currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist < 0.1) continue; // Skip if we're at this position
        
        const dotProduct = dx * currentDir[0] + dz * currentDir[2];
        if (dotProduct > 0 && dist < blockDist && dist < 3) {
          // Check if block is actually in the light path (within 0.5 units)
          const crossX = dz * currentDir[0] - dx * currentDir[2];
          if (Math.abs(crossX) < 0.5) {
            blockingBlock = block;
            blockDist = dist;
          }
        }
      }
      
      // Simple distance check to nearest prism in path
      for (const prism of prisms) {
        // Skip if we've already hit this prism (prevent loops)
        if (visitedPrisms.has(prism.id)) continue;
        
        const dx = prism.position[0] - currentPos[0];
        const dz = prism.position[2] - currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        // Skip if we're already at this prism (distance too small)
        if (dist < 0.1) continue;
        
        // Check if prism is roughly in the direction of light
        const dotProduct = dx * currentDir[0] + dz * currentDir[2];
        if (dotProduct > 0 && dist < nearestDist && dist < 3) {
          nearestPrism = prism;
          nearestDist = dist;
        }
      }
      
      // If block is closer than prism, light is blocked
      if (blockingBlock && blockDist < nearestDist) {
        console.log(`  🚧 Light blocked by ${blockingBlock.id} at distance ${blockDist.toFixed(2)}`);
        beams.push({
          id: `beam-${idx}-${bounce}-blocked`,
          start: [...currentPos],
          end: [...blockingBlock.position],
          active: true,
          blocked: true
        });
        break; // Light stops here
      }

      if (nearestPrism) {
        // Mark this prism as visited
        visitedPrisms.add(nearestPrism.id);
        
        // Create beam to this prism
        beams.push({
          id: `beam-${idx}-${bounce}`,
          start: [...currentPos],
          end: [...nearestPrism.position],
          active: true,
          prismId: nearestPrism.id
        });

        // Calculate new direction based on prism rotation
        // Each 45° rotation changes the output direction
        const rotation = (nearestPrism.rotation || 0);
        
        console.log(`  💠 Light hit ${nearestPrism.id} (rotation: ${rotation}°)`);
        
        // Prism acts like a mirror/lens at specific angles
        // 0° = straight through, 45° = 90° turn right, 90° = 180° reverse, etc.
        const rotationSteps = Math.round(rotation / 45) % 8;
        
        // Simple directional mapping based on rotation
        // This is simplified - real prisms would use Snell's law
        switch(rotationSteps) {
          case 0: // 0° - straight through
            // currentDir stays the same
            break;
          case 1: // 45° - turn right
            currentDir = [currentDir[2], 0, -currentDir[0]];
            break;
          case 2: // 90° - perpendicular right
            currentDir = [currentDir[2], 0, -currentDir[0]];
            break;
          case 3: // 135° - diagonal back-right
            currentDir = [-currentDir[2], 0, currentDir[0]];
            break;
          case 4: // 180° - reverse
            currentDir = [-currentDir[0], 0, -currentDir[2]];
            break;
          case 5: // 225° - diagonal back-left
            currentDir = [-currentDir[2], 0, currentDir[0]];
            break;
          case 6: // 270° - perpendicular left
            currentDir = [-currentDir[2], 0, currentDir[0]];
            break;
          case 7: // 315° - turn left
            currentDir = [currentDir[2], 0, -currentDir[0]];
            break;
        }
        
        console.log(`  ➜ New direction: [${currentDir[0].toFixed(2)}, ${currentDir[1]}, ${currentDir[2].toFixed(2)}]`);

        currentPos = [...nearestPrism.position];
        pathLength += nearestDist;
      } else {
        // No more prisms, extend beam forward
        const endPos = [
          currentPos[0] + currentDir[0] * 5,
          currentPos[1],
          currentPos[2] + currentDir[2] * 5
        ];
        
        beams.push({
          id: `beam-${idx}-${bounce}`,
          start: [...currentPos],
          end: endPos,
          active: true
        });
        
        currentPos = endPos;
        break;
      }
    }
  });

  // Check if any beam is actually illuminating the rune (not just nearby)
  let reachesRune = false;
  if (rune && beams.length > 0) {
    const runePos = rune.position;
    console.log(`\n🎯 Checking if light reaches rune at [${runePos[0]}, ${runePos[1]}, ${runePos[2]}]`);
    
    for (const beam of beams) {
      // Calculate beam direction vector
      const beamDirX = beam.end[0] - beam.start[0];
      const beamDirZ = beam.end[2] - beam.start[2];
      const beamLength = Math.sqrt(beamDirX * beamDirX + beamDirZ * beamDirZ);
      
      if (beamLength < 0.01) continue; // Skip zero-length beams
      
      // Normalize beam direction
      const normDirX = beamDirX / beamLength;
      const normDirZ = beamDirZ / beamLength;
      
      // Vector from beam start to rune
      const toRuneX = runePos[0] - beam.start[0];
      const toRuneZ = runePos[2] - beam.start[2];
      const distToRune = Math.sqrt(toRuneX * toRuneX + toRuneZ * toRuneZ);
      
      if (distToRune < 0.01) {
        // Beam starts at rune position
        reachesRune = true;
        console.log('  ✨✨✨ BEAM STARTS AT RUNE! ✨✨✨');
        break;
      }
      
      // Check if rune is in the direction of the beam (dot product)
      const dotProduct = (toRuneX * normDirX + toRuneZ * normDirZ) / distToRune;
      
      // Project rune position onto beam line to get perpendicular distance
      const projection = toRuneX * normDirX + toRuneZ * normDirZ;
      const perpX = toRuneX - projection * normDirX;
      const perpZ = toRuneZ - projection * normDirZ;
      const perpDist = Math.sqrt(perpX * perpX + perpZ * perpZ);
      
      console.log(`  📏 Beam ${beam.id}: dotProduct=${dotProduct.toFixed(2)}, perpDist=${perpDist.toFixed(2)}, projection=${projection.toFixed(2)}, beamLen=${beamLength.toFixed(2)}`);
      
      // Rune must be:
      // 1. In front of beam (dot product > 0.7 means roughly same direction)
      // 2. Within 0.8 units perpendicular distance (in the beam path)
      // 3. Within beam range (projection is positive and less than beam length + 1 unit tolerance)
      if (dotProduct > 0.7 && perpDist < 0.8 && projection > 0 && projection <= beamLength + 1.0) {
        reachesRune = true;
        console.log('  ✨✨✨ BEAM IS ILLUMINATING THE RUNE! ✨✨✨');
        break;
      }
    }
    
    if (!reachesRune) {
      console.log('  ❌ No beam illuminating the rune (must be in beam path and direction)');
    }
  }

  return { beams, reachesRune };
};

const loadProgressFromStorage = (): GameProgress => {
  const stored = localStorage.getItem('waterpuzzle_progress');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    levelsProgress: {},
    totalJewels: 0,
    unlockedChambers: [1],
    totalScore: 0
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentLevel: 1,
  currentChamber: 1,
  movesRemaining: 0,
  movesUsed: 0,
  elementsState: [],
  lightBeams: [],
  levelComplete: false,
  levelFailed: false,
  score: 0,
  jewelsCollectedThisLevel: 0,
  history: [],
  progress: loadProgressFromStorage(),

  loadLevel: (levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;

    console.log(`🏛️ Loading Level ${levelId}: ${level.name}`);
    console.log(`   Max Moves: ${level.maxMoves} | Par: ${level.parMoves} | Expert: ${level.expertMoves}`);
    console.log(`   Elements:`, level.elements.map(e => `${e.type}(${e.id})`).join(', '));

    const elements = JSON.parse(JSON.stringify(level.elements));
    
    set({
      currentLevel: levelId,
      currentChamber: level.chamber,
      movesRemaining: level.maxMoves,
      movesUsed: 0,
      elementsState: elements,
      lightBeams: [],
      levelComplete: false,
      levelFailed: false,
      score: 0,
      jewelsCollectedThisLevel: 0,
      history: []
    });
    
    // Calculate initial light beams
    setTimeout(() => {
      get().checkLevelComplete();
    }, 100);
  },

  makeMove: (elementId: string, action: 'rotate' | 'move', data?: any) => {
    const state = get();
    if (state.levelComplete || state.levelFailed || state.movesRemaining <= 0) {
      console.log('❌ Cannot make move:', { levelComplete: state.levelComplete, levelFailed: state.levelFailed, movesRemaining: state.movesRemaining });
      return;
    }

    const newElements = [...state.elementsState];
    const element = newElements.find(e => e.id === elementId);
    if (!element) {
      console.log('❌ Element not found:', elementId);
      return;
    }

    // Save to history before making move
    const historyEntry = {
      elementsState: JSON.parse(JSON.stringify(state.elementsState)),
      movesRemaining: state.movesRemaining,
      jewelsCollectedThisLevel: state.jewelsCollectedThisLevel
    };

    if (action === 'rotate' && element.type === 'prism') {
      const oldRotation = element.rotation || 0;
      const rotationDirection = data?.direction || 1; // 1 for clockwise, -1 for counter-clockwise
      element.rotation = ((element.rotation || 0) + (45 * rotationDirection) + 360) % 360;
      const directionLabel = rotationDirection > 0 ? 'clockwise' : 'counter-clockwise';
      console.log(`🔄 Rotated prism ${elementId} ${directionLabel}: ${oldRotation}° → ${element.rotation}°`);
    } else if (action === 'move' && element.type === 'block' && data?.direction) {
      const [dx, dy, dz] = data.direction;
      const oldPos = [...element.position];
      element.position = [
        element.position[0] + dx,
        element.position[1] + dy,
        element.position[2] + dz
      ];
      console.log(`📦 Moved block ${elementId}:`, oldPos, '→', element.position);
    }

    const newMovesRemaining = state.movesRemaining - 1;
    const newMovesUsed = state.movesUsed + 1;

    console.log(`✅ Move made! Remaining: ${newMovesRemaining}, Used: ${newMovesUsed}`);

    set({
      elementsState: newElements,
      movesRemaining: newMovesRemaining,
      movesUsed: newMovesUsed,
      history: [...state.history, historyEntry],
      levelFailed: false // Will check after state update
    });

    // Check if level is complete after move (with slight delay for state to update)
    setTimeout(() => {
      const isComplete = get().checkLevelComplete();
      const currentMovesRemaining = get().movesRemaining;
      
      if (isComplete) {
        console.log('🎉 Level Complete!');
        get().completeLevel();
      } else if (currentMovesRemaining === 0) {
        console.log('❌ Out of moves - Level Failed');
        set({ levelFailed: true });
      }
    }, 150);
  },

  undoMove: () => {
    const state = get();
    if (state.history.length === 0) {
      console.log('↶ Nothing to undo');
      return;
    }

    const lastState = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    console.log('↶ Undoing move - restoring state');

    set({
      elementsState: lastState.elementsState,
      movesRemaining: lastState.movesRemaining,
      movesUsed: state.movesUsed - 1,
      jewelsCollectedThisLevel: lastState.jewelsCollectedThisLevel,
      history: newHistory,
      levelFailed: false
    });
    
    // Recalculate light beams after undo
    setTimeout(() => {
      get().checkLevelComplete();
    }, 50);
  },

  restartLevel: () => {
    get().loadLevel(get().currentLevel);
  },

  collectJewel: (elementId: string) => {
    const state = get();
    if (state.levelComplete || state.levelFailed) return;
    
    const newElements = [...state.elementsState];
    const jewel = newElements.find(e => e.id === elementId && e.type === 'jewel');
    
    if (jewel && !jewel.isActivated) {
      jewel.isActivated = true;
      console.log(`💎 Collected jewel ${elementId}! +${MOVES_GRANTED_BY_JEWEL} moves, +${JEWEL_BONUS} points`);
      set({
        elementsState: newElements,
        jewelsCollectedThisLevel: state.jewelsCollectedThisLevel + 1,
        movesRemaining: state.movesRemaining + MOVES_GRANTED_BY_JEWEL,
        score: state.score + JEWEL_BONUS
      });
      
      // Check if this somehow completed the level
      setTimeout(() => {
        if (get().checkLevelComplete()) {
          get().completeLevel();
        }
      }, 100);
    }
  },

  activatePressurePlate: (elementId: string) => {
    const state = get();
    if (state.levelComplete || state.levelFailed) return;
    
    const newElements = [...state.elementsState];
    const plate = newElements.find(e => e.id === elementId && e.type === 'plate');
    
    if (plate && !plate.isActivated) {
      plate.isActivated = true;
      console.log(`⚡ Activated pressure plate ${elementId}! +${MOVES_RESTORED_BY_PLATE} moves`);
      set({
        elementsState: newElements,
        movesRemaining: state.movesRemaining + MOVES_RESTORED_BY_PLATE,
        levelFailed: false // Clear failed state if we get more moves
      });
      
      // Check if this somehow completed the level
      setTimeout(() => {
        if (get().checkLevelComplete()) {
          get().completeLevel();
        }
      }, 100);
    }
  },

  checkLevelComplete: () => {
    const state = get();
    const level = LEVELS.find(l => l.id === state.currentLevel);
    if (!level) return false;

    // Calculate light path and update beams
    const { beams, reachesRune } = calculateLightPath(state.elementsState, level);
    
    // Update light beams in state
    set({ lightBeams: beams });
    
    if (reachesRune) {
      console.log('✨ Light has reached the rune!');
    }
    
    return reachesRune;
  },

  completeLevel: () => {
    const state = get();
    const level = LEVELS.find(l => l.id === state.currentLevel);
    if (!level) return;

    const jewel = get().calculateJewelRating(state.movesUsed);
    const movesSaved = Math.max(0, level.parMoves - state.movesUsed);
    const efficiencyBonus = movesSaved * EFFICIENCY_BONUS;
    const finalScore = BASE_LEVEL_SCORE + efficiencyBonus + (state.score || 0);

    // Update progress
    const currentProgress = state.progress.levelsProgress[state.currentLevel];
    const isNewBest = !currentProgress || state.movesUsed < currentProgress.bestMoves;
    
    const jewelValues = { none: 0, bronze: 1, silver: 2, gold: 3 };
    const currentJewelValue = currentProgress ? jewelValues[currentProgress.jewel] : 0;
    const newJewelValue = jewelValues[jewel];
    
    const jewelDifference = newJewelValue - currentJewelValue;

    const newProgress: LevelProgress = {
      levelId: state.currentLevel,
      completed: true,
      bestMoves: isNewBest ? state.movesUsed : (currentProgress?.bestMoves || state.movesUsed),
      jewel: newJewelValue > currentJewelValue ? jewel : currentProgress.jewel,
      score: Math.max(finalScore, currentProgress?.score || 0)
    };

    set({
      levelComplete: true,
      score: finalScore,
      progress: {
        ...state.progress,
        levelsProgress: {
          ...state.progress.levelsProgress,
          [state.currentLevel]: newProgress
        },
        totalJewels: state.progress.totalJewels + Math.max(0, jewelDifference),
        totalScore: state.progress.totalScore + (finalScore - (currentProgress?.score || 0))
      }
    });

    get().saveProgress();
  },

  calculateJewelRating: (movesUsed: number): JewelRating => {
    const level = LEVELS.find(l => l.id === get().currentLevel);
    if (!level) return 'bronze';

    if (movesUsed <= level.expertMoves) return 'gold';
    if (movesUsed <= level.parMoves) return 'silver';
    return 'bronze';
  },

  saveProgress: () => {
    const state = get();
    localStorage.setItem('waterpuzzle_progress', JSON.stringify(state.progress));
  },

  loadProgress: () => {
    const progress = loadProgressFromStorage();
    set({ progress });
  },

  nextLevel: () => {
    const state = get();
    const nextLevelId = state.currentLevel + 1;
    const nextLevel = LEVELS.find(l => l.id === nextLevelId);
    
    if (nextLevel) {
      get().loadLevel(nextLevelId);
    }
  },

  triggerCompletion: () => {
    // Manual trigger for level completion (for testing/demo purposes)
    // In full game, this would be called when light beam reaches rune
    get().completeLevel();
  }
}));
