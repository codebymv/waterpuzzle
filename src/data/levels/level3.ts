import { Level } from '../../types/game';

// Level 3: Chain Reaction
// 4 prisms in a line - all adjacent!
// The MIDDLES need more rotation than the ENDS.
// Requires insight: click the middles to give them extra rotation!
export const level3: Level = {
  id: 3,
  name: 'Chain Reaction',
  maxMoves: 8,
  lightSource: {
    position: [-4, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [4, 0, 0]
  },
  elements: [
    {
      id: 'p1',
      type: 'prism',
      position: [-1.8, 0, 0],
      rotation: 45,  // Needs 90° = +1 CW
      prismType: 'normal'
    },
    {
      id: 'p2', 
      type: 'prism',
      position: [-0.6, 0, 0],  // Adjacent to p1 AND p3
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'p3',
      type: 'prism', 
      position: [0.6, 0, 0],   // Adjacent to p2 AND p4
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'p4',
      type: 'prism',
      position: [1.8, 0, 0],   // Adjacent to p3
      rotation: 45,  // Needs 90° = +1 CW
      prismType: 'normal'
    }
  ],
  // Ends need +1, Middles need +2
  // 
  // Clicking p1: rotates p1, p2
  // Clicking p2: rotates p1, p2, p3
  // Clicking p3: rotates p2, p3, p4
  // Clicking p4: rotates p3, p4
  //
  // SOLUTION: Click p2 once, then click p3 once!
  //   Start:  p1=45, p2=0,  p3=0,  p4=45
  //   +p2 CW: p1=90✓ p2=45, p3=45, p4=45
  //   +p3 CW: p1=90✓ p2=90✓ p3=90✓ p4=90✓
  //
  // Gold: 2 moves! The "aha!" is realizing middles get hit twice.
  starThresholds: {
    gold: 2,
    silver: 4,
    bronze: 8
  }
};
