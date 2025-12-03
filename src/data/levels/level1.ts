import { Level } from '../../types/game';

// Level 1: First Light
// Tutorial: Two prisms that ripple together
// Easy start - both need the same rotation
export const level1: Level = {
  id: 1,
  name: 'First Light',
  maxMoves: 4,
  lightSource: {
    position: [-3, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [3, 0, 0]
  },
  elements: [
    {
      id: 'left',
      type: 'prism',
      position: [-0.6, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'right',
      type: 'prism',
      position: [0.6, 0, 0],  // Adjacent to left!
      rotation: 0,   // Needs 90° = +2 CW (same!)
      prismType: 'normal'
    }
  ],
  // Both start at 0°, both need 90°
  // Click either, both rotate! 2 CW clicks.
  // Teaches: adjacent prisms move together
  starThresholds: {
    gold: 2,
    silver: 3,
    bronze: 4
  }
};
