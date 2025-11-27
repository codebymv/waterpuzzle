import { Level } from '../../types/game';

/**
 * LEVEL 4: EFFICIENCY - "Shortest Path"
 * 
 * Teaching: Move count matters - stars reward efficiency
 * - Multiple solutions exist
 * - Some require fewer moves than others
 * - Introduces strategic thinking
 * 
 * Design: 5 prisms with optimal 3-prism solution
 * Challenge: Find the most efficient path
 */
export const level4: Level = {
  id: 4,
  name: 'Shortest Path',
  maxMoves: 20,
  runePosition: [6, 0, 0],
  chain: ['prism1', 'prism2', 'prism3'],
  solution: {
    prism1: 90,   // Right
    prism2: 90,   // Right  
    prism3: 90    // Right to rune (optimal)
  },
  starThresholds: {
    gold: 6,    // Perfect: found straight path (3 prisms × 2 clicks)
    silver: 10, // Good: some detours
    bronze: 16  // Complete: took scenic route
  },
  elements: [
    {
      id: 'prism1',
      type: 'prism',
      position: [-2, 0, 0],
      rotation: 0
    },
    // Straight path (optimal)
    {
      id: 'prism2',
      type: 'prism',
      position: [0, 0, 0],
      rotation: 0
    },
    {
      id: 'prism3',
      type: 'prism',
      position: [2, 0, 0],
      rotation: 0
    },
    // Detour prisms (valid but less efficient)
    {
      id: 'prism4',
      type: 'prism',
      position: [0, 0, 3],
      rotation: 0
    },
    {
      id: 'prism5',
      type: 'prism',
      position: [2, 0, 3],
      rotation: 0
    },
    {
      id: 'rune1',
      type: 'rune',
      position: [6, 0, 0]
    }
  ]
};
