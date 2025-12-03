import { Level } from '../../types/game';

// Level 7: Split Decision
// Two pairs - but they need OPPOSITE rotations!
// One pair needs CW, other needs CCW!
export const level7: Level = {
  id: 7,
  name: 'Split Decision',
  maxMoves: 8,
  lightSource: {
    position: [-4, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [4, 0, 0]
  },
  elements: [
    // Left pair (adjacent)
    {
      id: 'l1',
      type: 'prism',
      position: [-1.8, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'l2',
      type: 'prism',
      position: [-0.6, 0, 0],  // Adjacent to l1
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    // Right pair (adjacent) - GAP between pairs!
    {
      id: 'r1',
      type: 'prism',
      position: [0.6, 0, 0],   // NOT adjacent to l2 (gap > 1.5)
      rotation: 180, // Needs 90° = -2 CCW
      prismType: 'normal'
    },
    {
      id: 'r2',
      type: 'prism',
      position: [1.8, 0, 0],  // Adjacent to r1
      rotation: 180, // Needs 90° = -2 CCW
      prismType: 'normal'
    }
  ],
  // Left pair: click either, both rotate. 0°→90° = 2 CW
  // Right pair: click either, both rotate. 180°→90° = 2 CCW
  // Gold: 4 (2 on left + 2 on right)
  starThresholds: {
    gold: 4,
    silver: 6,
    bronze: 8
  }
};
