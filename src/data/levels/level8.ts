import { Level } from '../../types/game';

// Level 8: The Cross
// 5 prisms in a + shape. Center connects to ALL 4!
// Clicking center = massive cascade. Clicking edge = 2 prisms.
export const level8: Level = {
  id: 8,
  name: 'The Cross',
  maxMoves: 8,
  lightSource: {
    position: [-3.5, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [3.5, 0, 0]
  },
  elements: [
    // Center - THE HUB
    {
      id: 'center',
      type: 'prism',
      position: [0, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    // West - beam entry
    {
      id: 'west',
      type: 'prism',
      position: [-1.2, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW (same as center!)
      prismType: 'normal'
    },
    // East - beam exit
    {
      id: 'east',
      type: 'prism',
      position: [1.2, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW (same as center!)
      prismType: 'normal'
    },
    // North - distractor
    {
      id: 'north',
      type: 'prism',
      position: [0, 0, -1.2],
      rotation: 0,   // Will rotate with center
      prismType: 'normal'
    },
    // South - distractor
    {
      id: 'south',
      type: 'prism',
      position: [0, 0, 1.2],
      rotation: 0,   // Will rotate with center
      prismType: 'normal'
    }
  ],
  // ALL 5 start at 0°, all need 90°!
  // Click CENTER: ALL 5 rotate together! 0°→90° = 2 CW clicks
  // Gold: 2 (the elegant solution - click center twice)
  starThresholds: {
    gold: 2,
    silver: 4,
    bronze: 8
  }
};
