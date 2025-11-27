import { Level } from '../../types/game';

/**
 * LEVEL 5: CHAIN THINKING - "Sequence"
 * 
 * Teaching: Must solve in order - chain validation
 * - Can't skip ahead
 * - Must connect A→B→C→D in sequence
 * - Beam only propagates through correct connections
 * 
 * Design: 5-prism mandatory sequence with no shortcuts
 * Challenge: Plan the full path before starting
 */
export const level5: Level = {
  id: 5,
  name: 'Sequence',
  maxMoves: 25,
  runePosition: [8, 0, 0],
  chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5'],
  solution: {
    prism1: 45,   // Diagonal up-right
    prism2: 90,   // Right
    prism3: 315,  // Diagonal down-right
    prism4: 90,   // Right
    prism5: 90    // Right to rune
  },
  starThresholds: {
    gold: 10,   // Perfect: planned whole path
    silver: 16, // Good: some backtracking
    bronze: 22  // Complete: trial and error
  },
  elements: [
    {
      id: 'prism1',
      type: 'prism',
      position: [-2, 0, 0],
      rotation: 0
    },
    {
      id: 'prism2',
      type: 'prism',
      position: [0, 0, 2],
      rotation: 0
    },
    {
      id: 'prism3',
      type: 'prism',
      position: [2, 0, 2],
      rotation: 0
    },
    {
      id: 'prism4',
      type: 'prism',
      position: [4, 0, 0],
      rotation: 0
    },
    {
      id: 'prism5',
      type: 'prism',
      position: [6, 0, 0],
      rotation: 0
    },
    {
      id: 'rune1',
      type: 'rune',
      position: [8, 0, 0]
    }
  ]
};
