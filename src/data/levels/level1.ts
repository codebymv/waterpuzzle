import { Level } from '../../types/game';

/**
 * LEVEL 1: TUTORIAL - "First Light"
 * 
 * Teaching: Basic beam redirection mechanics
 * - Click prism to rotate 45°
 * - Green beam shows correct connections
 * - Connect start → rune
 * 
 * Design: Simple 2-prism chain
 * Solution: Both prisms point right (90°)
 */
export const level1: Level = {
  id: 1,
  name: 'First Light',
  maxMoves: 10,
  runePosition: [4, 0, 0],
  chain: ['prism1', 'prism2'],
  solution: {
    prism1: 90,  // Point right
    prism2: 90   // Point right
  },
  starThresholds: {
    gold: 2,    // Perfect: 2 clicks (each prism rotated twice)
    silver: 4,  // Good: some exploration
    bronze: 6   // Complete: lots of clicking
  },
  elements: [
    {
      id: 'prism1',
      type: 'prism',
      position: [-2, 0, 0],
      rotation: 0  // Start facing north
    },
    {
      id: 'prism2',
      type: 'prism',
      position: [0, 0, 0],
      rotation: 0  // Start facing north
    },
    {
      id: 'rune1',
      type: 'rune',
      position: [4, 0, 0]
    }
  ]
};
