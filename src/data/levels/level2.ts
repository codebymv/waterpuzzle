import { Level } from '../../types/game';

/**
 * LEVEL 2: MULTIPLE PATHS - "Two Roads"
 * 
 * Teaching: Multiple valid solutions exist
 * - Different paths can reach the same goal
 * - Encourages experimentation
 * 
 * Design: Y-fork where BOTH upper and lower paths reach the rune
 * Solution: prism2 can be 45° (upper) OR 315° (lower) - both work!
 */
export const level2: Level = {
  id: 2,
  name: 'Two Roads',
  maxMoves: 12,
  runePosition: [4, 0, 0],
  chain: ['prism1', 'prism2', 'prism3'],
  solution: {
    prism1: 90,   // Point right to prism2
    prism2: 45,   // Upper path (315° also works for lower path)
    prism3: 315   // Point to rune from upper
  },
  starThresholds: {
    gold: 4,    // Efficient: found path quickly
    silver: 7,  // Good: some exploration
    bronze: 10  // Complete: tried both paths
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
      position: [0, 0, 0],
      rotation: 0
    },
    // Upper path
    {
      id: 'prism3',
      type: 'prism',
      position: [2, 0, 2],
      rotation: 0
    },
    // Lower path (alternate - not in main chain but valid)
    {
      id: 'prism4',
      type: 'prism',
      position: [2, 0, -2],
      rotation: 0
    },
    {
      id: 'rune1',
      type: 'rune',
      position: [4, 0, 0]
    }
  ]
};
