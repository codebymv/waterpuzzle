import { Level } from '../../types/game';

// Level 9: Asymmetry
// Cross pattern BUT prisms need DIFFERENT rotations!
// Naive approach fails. Must think about ripple carefully.
export const level9: Level = {
  id: 9,
  name: 'Asymmetry',
  maxMoves: 10,
  lightSource: {
    position: [-3.5, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [3.5, 0, 0]
  },
  elements: [
    // Center
    {
      id: 'center',
      type: 'prism',
      position: [0, 0, 0],
      rotation: 45,  // Needs 90° = +1 CW
      prismType: 'normal'
    },
    // West - beam entry
    {
      id: 'west',
      type: 'prism',
      position: [-1.2, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    // East - beam exit
    {
      id: 'east',
      type: 'prism',
      position: [1.2, 0, 0],
      rotation: 180, // Needs 90° = -2 CCW
      prismType: 'normal'
    },
    // North
    {
      id: 'north',
      type: 'prism',
      position: [0, 0, -1.2],
      rotation: 315, // Different starting angle
      prismType: 'normal'
    },
    // South
    {
      id: 'south',
      type: 'prism',
      position: [0, 0, 1.2],
      rotation: 225, // Different starting angle
      prismType: 'normal'
    }
  ],
  // west needs +2, center needs +1, east needs -2
  // Can't just click center! Different amounts needed.
  // Strategy: Click west 1x (+1 to west, center)
  //           Click center 1x (+1 to all 5)
  //           Now west=90, center=90, but east still wrong
  //           Click east alone... wait, it ripples to center!
  // This is HARD. Must figure out the sequence.
  starThresholds: {
    gold: 6,
    silver: 8,
    bronze: 10
  }
};
