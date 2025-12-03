import { Level } from '../../types/game';

// Level 6: Triangle
// 3 prisms in a triangle - ALL adjacent to each other!
// Clicking ANY one rotates ALL THREE!
export const level6: Level = {
  id: 6,
  name: 'Triangle',
  maxMoves: 6,
  lightSource: {
    position: [-3, 0, 0.5],
    direction: 90  // Beam travels east
  },
  target: {
    position: [3, 0, 0.5]
  },
  elements: [
    {
      id: 'left',
      type: 'prism',
      position: [-0.7, 0, 0.5],  // Triangle vertex
      rotation: 180, // All start at 180°, need 90°
      prismType: 'normal'
    },
    {
      id: 'right',
      type: 'prism',
      position: [0.7, 0, 0.5],   // Triangle vertex
      rotation: 180, // -2 CCW or +6 CW to reach 90°
      prismType: 'normal'
    },
    {
      id: 'top',
      type: 'prism',
      position: [0, 0, -0.7],    // Triangle vertex (all within 1.5 of each other)
      rotation: 180, // They ALL ripple together!
      prismType: 'normal'
    }
  ],
  // All 3 are adjacent! Click any = all rotate!
  // 180° → 90° = 2 CCW clicks on ANY prism
  // Gold: 2 (the elegant solution)
  starThresholds: {
    gold: 2,
    silver: 4,
    bronze: 6
  }
};
