import { Level } from '../../types/game';

// Level 5: Hub Chaos
// Cross pattern - center connects to ALL 4
// But each arm needs a DIFFERENT rotation!
export const level5: Level = {
  id: 5,
  name: 'Hub Chaos',
  maxMoves: 12,
  lightSource: {
    position: [-4, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [4, 0, 0]
  },
  elements: [
    // West - beam entry
    {
      id: 'west',
      type: 'prism',
      position: [-1.2, 0, 0],
      rotation: 45,  // Needs 90° = +1 CW
      prismType: 'normal'
    },
    // Center - THE HUB (adjacent to all 4!)
    {
      id: 'center',
      type: 'prism',
      position: [0, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    // East - beam exit
    {
      id: 'east',
      type: 'prism',
      position: [1.2, 0, 0],
      rotation: 45,  // Needs 90° = +1 CW
      prismType: 'normal'
    },
    // North - NOT on beam path but affects center!
    {
      id: 'north',
      type: 'prism',
      position: [0, 0, -1.2],
      rotation: 270, // Needs... anything? Or does it?
      prismType: 'normal'
    },
    // South - NOT on beam path but affects center!
    {
      id: 'south',
      type: 'prism',
      position: [0, 0, 1.2],
      rotation: 270, // Same as north
      prismType: 'normal'
    }
  ],
  // Beam path: west → center → east
  // west: 45°→90° = +1 CW
  // center: 0°→90° = +2 CW  
  // east: 45°→90° = +1 CW
  //
  // Center needs +2, but west/east only need +1!
  // Clicking center affects ALL 5.
  // Clicking west affects west+center.
  // Clicking east affects center+east.
  //
  // Strategy:
  //   Click center 1x: all +1 → west=90✓, center=45, east=90✓, n=315, s=315
  //   Now just need center +1 more without touching west/east
  //   But west/east are adjacent to center! Can't click center alone.
  //
  // Better strategy:
  //   Click west 1x: west=90✓, center=45
  //   Click east 1x: center=90✓, east=90✓
  //   Done in 2 moves!
  //
  // Gold: 2 (requires insight that edges fix center)
  starThresholds: {
    gold: 2,
    silver: 6,
    bronze: 12
  }
};
