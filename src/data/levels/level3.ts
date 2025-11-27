import { Level } from '../../types/game';

/**
 * LEVEL 3: LOCKED INFRASTRUCTURE - "Guided Path"
 * 
 * Teaching: Some prisms are pre-placed (locked) infrastructure
 * - Gray prisms = locked (can't rotate)
 * - Cyan prisms = controllable
 * - Locked prisms automatically form correct connections
 * 
 * Design: Only player-controllable prisms in chain
 * Challenge: Identify which prisms you control (only those in chain)
 * 
 * Path: prism1(player) → prism2(locked) → prism3(player) → prism4(locked) → rune
 * Chain: Only includes player-controlled prisms [prism1, prism3]
 */
export const level3: Level = {
  id: 3,
  name: 'Guided Path',
  maxMoves: 15,
  runePosition: [6, 0, 0],
  chain: ['prism1', 'prism3'],  // Only player-controlled prisms
  solution: {
    prism1: 45,   // Point to locked prism2
    prism3: 315   // Point to locked prism4
  },
  starThresholds: {
    gold: 2,    // Optimal: 2 prisms × 1 click each = 2 moves
    silver: 5,  // Good: some exploration
    bronze: 10  // Complete: figured it out
  },
  elements: [
    {
      id: 'prism1',
      type: 'prism',
      position: [-2, 0, 0],
      rotation: 0  // Player controls this
    },
    {
      id: 'prism2',
      type: 'prism',
      position: [0, 0, 2],
      rotation: 90,
      locked: true  // Pre-aimed connector (automatically correct)
    },
    {
      id: 'prism3',
      type: 'prism',
      position: [2, 0, 2],
      rotation: 0  // Player controls this
    },
    {
      id: 'prism4',
      type: 'prism',
      position: [4, 0, 0],
      rotation: 270,
      locked: true  // Final redirect to rune (automatically correct)
    },
    {
      id: 'rune1',
      type: 'rune',
      position: [6, 0, 0]
    }
  ]
};
