import { Level } from '../../types/game';

// Level 2: Opposite Day
// Two SEPARATE groups - one needs CW, one needs CCW!
// Teaches: right-click for counter-clockwise
export const level2: Level = {
  id: 2,
  name: 'Opposite Day',
  maxMoves: 6,
  lightSource: {
    position: [-4, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [4, 0, 0]
  },
  elements: [
    // Left prism (isolated)
    {
      id: 'left',
      type: 'prism',
      position: [-1.5, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    // Right prism (isolated - gap > 1.5 from left)
    {
      id: 'right',
      type: 'prism',
      position: [1.5, 0, 0],
      rotation: 180, // Needs 90° = -2 CCW
      prismType: 'normal'
    }
  ],
  // Left: 0°→90° = 2 CW (left-click)
  // Right: 180°→90° = 2 CCW (right-click!)
  // They're not adjacent - solve independently
  // Teaches: you need BOTH directions!
  starThresholds: {
    gold: 4,
    silver: 5,
    bronze: 6
  }
};
