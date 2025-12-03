import { Level } from '../../types/game';

// Level 10: The Gauntlet
// Multiple groups, locked anchors, and tight move limit!
// The ultimate test of ripple mastery.
export const level10: Level = {
  id: 10,
  name: 'The Gauntlet',
  maxMoves: 12,
  lightSource: {
    position: [-4, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [4, 0, 0]
  },
  elements: [
    // === LEFT GROUP (adjacent pair) ===
    {
      id: 'l1',
      type: 'prism',
      position: [-2.4, 0, 0],
      rotation: 180, // Needs 90° = -2 CCW
      prismType: 'normal'
    },
    {
      id: 'l2',
      type: 'prism',
      position: [-1.2, 0, 0],
      rotation: 180, // Needs 90° = -2 CCW (same as l1!)
      prismType: 'normal'
    },
    
    // === LOCKED ANCHOR ===
    {
      id: 'anchor',
      type: 'prism',
      position: [0, 0, 0],
      rotation: 90,  // Already correct - LOCKED!
      prismType: 'normal',
      locked: true
    },
    
    // === RIGHT GROUP (triangle - all adjacent!) ===
    {
      id: 'r1',
      type: 'prism',
      position: [1.2, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'r2',
      type: 'prism',
      position: [2.4, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'r3',
      type: 'prism',
      position: [1.8, 0, -1],  // Forms triangle with r1, r2
      rotation: 0,   // Will rotate with r1 and r2
      prismType: 'normal'
    }
  ],
  // Left pair: 180°→90° = 2 CCW clicks on either
  // Right triangle: 0°→90° = 2 CW clicks on any
  // Anchor blocks ripple between groups!
  // Gold: 4 (2 left + 2 right)
  starThresholds: {
    gold: 4,
    silver: 6,
    bronze: 10
  }
};
