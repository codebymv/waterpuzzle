import { Level } from '../../types/game';

// Level 4: The Obstacle
// Three prisms in a row - all adjacent!
// BUT the middle needs OPPOSITE rotation from the ends!
// This creates a CONFLICT - you can't just click one and solve all.
export const level4: Level = {
  id: 4,
  name: 'The Obstacle',
  maxMoves: 10,
  lightSource: {
    position: [-4, 0, 0],
    direction: 90  // Beam travels east
  },
  target: {
    position: [4, 0, 0]
  },
  elements: [
    {
      id: 'left',
      type: 'prism',
      position: [-1.2, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    },
    {
      id: 'middle',
      type: 'prism',
      position: [0, 0, 0],      // Adjacent to BOTH!
      rotation: 180, // Needs 90° = -2 CCW (OPPOSITE!)
      prismType: 'normal'
    },
    {
      id: 'right',
      type: 'prism',
      position: [1.2, 0, 0],
      rotation: 0,   // Needs 90° = +2 CW
      prismType: 'normal'
    }
  ],
  // left: 0°→90° = +2 CW
  // middle: 180°→90° = -2 CCW (or +6 CW)
  // right: 0°→90° = +2 CW
  //
  // THE PUZZLE: Ends need CW, middle needs CCW!
  // But they're all adjacent - every click affects neighbors!
  //
  // Click left: left+middle rotate
  // Click middle: all 3 rotate
  // Click right: middle+right rotate
  //
  // SOLUTION (requires thinking!):
  //   Need: L+2, M-2, R+2
  //   
  //   Strategy: Over-rotate, then correct
  //   Click left 4x CW: L=180, M=360(0)
  //   Click right 4x CW: M=180, R=180
  //   Click middle 2x CCW: L=90✓, M=90✓, R=90✓
  //   Total: 10 moves!
  //
  //   Better strategy:
  //   Click left 2x CW: L=90✓, M=270
  //   Click right 2x CW: M=360(0), R=90✓
  //   Click middle 2x CW: L=180, M=90✓, R=180  -- broke L and R!
  //   
  //   The trick: 8 states means going +6 = going -2
  //   Click middle 6x CW (same as 2x CCW): all three +270
  //     L: 0+270=270, M: 180+270=450(90)✓, R: 0+270=270
  //   Now L and R need +180 (4 CW) each
  //   Click left 4x: L=90✓, M=270 -- broke M!
  //
  //   Real solution:
  //   L needs net +2, M needs net +6 (=-2), R needs net +2
  //   
  //   Clicks add: L affects L,M. M affects L,M,R. R affects M,R.
  //   Let a=left clicks, b=middle clicks, c=right clicks
  //   L gets: a + b
  //   M gets: a + b + c  
  //   R gets: b + c
  //   
  //   Need: a+b=2, a+b+c=6, b+c=2 (mod 8, in units of 45°)
  //   From first and third: a+b=2, b+c=2 → a=c
  //   Middle: a+b+c=6 → 2+c=6 → c=4
  //   So a=4, b=-2, c=4 → Total: 4+2+4=10 (using CCW for middle)
  //
  // This is an ACTUAL PUZZLE requiring math thinking!
  starThresholds: {
    gold: 6,
    silver: 8,
    bronze: 10
  }
};
