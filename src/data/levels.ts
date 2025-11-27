import { Level } from '../types/game';

/**
 * DIFFICULTY PARAMETERS FOR PATTERN MATCHING PUZZLES:
 * 
 * 1. NUMBER OF PRISMS (3-8)
 *    - More prisms = more state to track
 * 
 * 2. TOTAL ROTATION STEPS NEEDED
 *    - Each click = 45°, so 180° = 4 clicks
 *    - Sum of all rotations needed
 * 
 * 3. STARTING ROTATIONS
 *    - All at 0° = Easy (fresh start)
 *    - Pre-rotated/scrambled = Hard (need to figure out current state)
 * 
 * 4. MOVE EFFICIENCY
 *    - Exact moves needed = Hard (no room for error)
 *    - Extra moves = Easier (can undo/experiment)
 * 
 * 5. SOLUTION PATTERN COMPLEXITY
 *    - All same angle = Easy (e.g., all to 90°)
 *    - All different angles = Medium
 *    - Similar angles = Hard to distinguish (e.g., 90° vs 135°)
 * 
 * 6. VISUAL SYMMETRY
 *    - Symmetric layout = Easier to remember
 *    - Asymmetric = Harder to track
 */

export const LEVELS: Level[] = [
  // Level 1: Simple chain - learn the concept
  {
    id: 1,
    name: 'First Connection',
    maxMoves: 15,
    runePosition: [4, 0, 2],
    chain: ['prism1', 'prism2', 'prism3'],
    solution: {
      prism1: 90,
      prism2: 90,
      prism3: 45
    },
    starThresholds: {
      gold: 5,
      silver: 7,
      bronze: 10
    },
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-2, 0, 0],
        rotation: 0
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [0, 0, 0],
        rotation: 0
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [2, 0, 0],
        rotation: 0
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [4, 0, 2]
      }
    ]
  },

  // Level 2: Simple fork - one decision point
  {
    id: 2,
    name: 'Fork',
    maxMoves: 10,
    runePosition: [4, 0, 0],
    chain: ['prism1', 'prism2'],
    solution: {
      prism1: 90,   // Locked starter
      prism2: 315   // Player chooses upper (315°) or lower (225°)
    },
    starThresholds: {
      gold: 2,
      silver: 4,
      bronze: 6
    },
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-2, 0, 0],
        rotation: 90,
        locked: true  // Pre-aimed at decision point
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [0, 0, 0],
        rotation: 0  // Player rotates to choose path
      },
      // Upper path (solution)
      {
        id: 'prism3',
        type: 'prism',
        position: [2, 0, 2],
        rotation: 90,
        locked: true
      },
      // Lower path (alternate)
      {
        id: 'prism4',
        type: 'prism',
        position: [2, 0, -2],
        rotation: 270,
        locked: true
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [4, 0, 0]
      }
    ]
  },

  // Level 3: Grid with 10 prisms - many paths possible
  {
    id: 3,
    name: 'Maze',
    maxMoves: 35,
    runePosition: [5, 0, 5],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5'],
    solution: {
      prism1: 45,
      prism2: 90,
      prism3: 45,
      prism4: 0,
      prism5: 45
    },
    starThresholds: {
      gold: 12,
      silver: 20,
      bronze: 28
    },
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-5, 0, -5],
        rotation: 180
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [-3, 0, -3],
        rotation: 270
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [0, 0, -3],
        rotation: 135
      },
      {
        id: 'prism4',
        type: 'prism',
        position: [3, 0, 0],
        rotation: 315
      },
      {
        id: 'prism5',
        type: 'prism',
        position: [3, 0, 3],
        rotation: 90
      },
      // Extra prisms for alternate routes
      {
        id: 'prism6',
        type: 'prism',
        position: [-3, 0, 0],
        rotation: 225
      },
      {
        id: 'prism7',
        type: 'prism',
        position: [0, 0, 0],
        rotation: 45
      },
      {
        id: 'prism8',
        type: 'prism',
        position: [0, 0, 3],
        rotation: 180
      },
      {
        id: 'prism9',
        type: 'prism',
        position: [-5, 0, 3],
        rotation: 0
      },
      {
        id: 'prism10',
        type: 'prism',
        position: [3, 0, -3],
        rotation: 90
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [5, 0, 5]
      }
    ]
  },

  // Level 4: 12 prisms web - multiple solution paths
  {
    id: 4,
    name: 'Web',
    maxMoves: 45,
    runePosition: [-6, 0, 4],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5', 'prism6'],
    solution: {
      prism1: 315,
      prism2: 270,
      prism3: 225,
      prism4: 270,
      prism5: 180,
      prism6: 225
    },
    starThresholds: {
      gold: 18,
      silver: 28,
      bronze: 38
    },
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [6, 0, -6],
        rotation: 90
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [4, 0, -4],
        rotation: 0
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [2, 0, -2],
        rotation: 45
      },
      {
        id: 'prism4',
        type: 'prism',
        position: [-2, 0, -2],
        rotation: 135
      },
      {
        id: 'prism5',
        type: 'prism',
        position: [-4, 0, 0],
        rotation: 315
      },
      {
        id: 'prism6',
        type: 'prism',
        position: [-4, 0, 2],
        rotation: 90
      },
      // Additional connection points
      {
        id: 'prism7',
        type: 'prism',
        position: [3, 0, -6],
        rotation: 180
      },
      {
        id: 'prism8',
        type: 'prism',
        position: [0, 0, -4],
        rotation: 270
      },
      {
        id: 'prism9',
        type: 'prism',
        position: [-3, 0, -6],
        rotation: 225
      },
      {
        id: 'prism10',
        type: 'prism',
        position: [0, 0, 0],
        rotation: 45
      },
      {
        id: 'prism11',
        type: 'prism',
        position: [-6, 0, 0],
        rotation: 315
      },
      {
        id: 'prism12',
        type: 'prism',
        position: [0, 0, 3],
        rotation: 135
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [-6, 0, 4]
      }
    ]
  },

  // Level 5: 15 prisms open field - many valid paths
  {
    id: 5,
    name: 'Field',
    maxMoves: 55,
    runePosition: [8, 0, -8],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5', 'prism6', 'prism7'],
    solution: {
      prism1: 45,
      prism2: 90,
      prism3: 45,
      prism4: 90,
      prism5: 45,
      prism6: 90,
      prism7: 315
    },
    starThresholds: {
      gold: 24,
      silver: 36,
      bronze: 48
    },
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-8, 0, 6],
        rotation: 270
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [-6, 0, 4],
        rotation: 180
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [-2, 0, 4],
        rotation: 45
      },
      {
        id: 'prism4',
        type: 'prism',
        position: [0, 0, 2],
        rotation: 315
      },
      {
        id: 'prism5',
        type: 'prism',
        position: [2, 0, 0],
        rotation: 135
      },
      {
        id: 'prism6',
        type: 'prism',
        position: [4, 0, -2],
        rotation: 225
      },
      {
        id: 'prism7',
        type: 'prism',
        position: [6, 0, -6],
        rotation: 90
      },
      // Extra prisms
      {
        id: 'prism8',
        type: 'prism',
        position: [-6, 0, 0],
        rotation: 0
      },
      {
        id: 'prism9',
        type: 'prism',
        position: [-4, 0, -2],
        rotation: 90
      },
      {
        id: 'prism10',
        type: 'prism',
        position: [0, 0, -4],
        rotation: 180
      },
      {
        id: 'prism11',
        type: 'prism',
        position: [4, 0, 4],
        rotation: 270
      },
      {
        id: 'prism12',
        type: 'prism',
        position: [-2, 0, -6],
        rotation: 45
      },
      {
        id: 'prism13',
        type: 'prism',
        position: [6, 0, 2],
        rotation: 315
      },
      {
        id: 'prism14',
        type: 'prism',
        position: [-8, 0, -4],
        rotation: 135
      },
      {
        id: 'prism15',
        type: 'prism',
        position: [2, 0, 6],
        rotation: 225
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [8, 0, -8]
      }
    ]
  },

  // Level 6: 18 prisms sprawling network
  {
    id: 6,
    name: 'Network',
    maxMoves: 65,
    runePosition: [7, 0, 7],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5', 'prism6', 'prism7', 'prism8'],
    solution: {
      prism1: 90,
      prism2: 45,
      prism3: 0,
      prism4: 315,
      prism5: 90,
      prism6: 45,
      prism7: 0,
      prism8: 45
    },
    starThresholds: {
      gold: 28,
      silver: 42,
      bronze: 56
    },
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-8, 0, -4],
        rotation: 180
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [-4, 0, -4],
        rotation: 270
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [-2, 0, -2],
        rotation: 135
      },
      {
        id: 'prism4',
        type: 'prism',
        position: [-2, 0, 2],
        rotation: 225
      },
      {
        id: 'prism5',
        type: 'prism',
        position: [0, 0, 0],
        rotation: 45
      },
      {
        id: 'prism6',
        type: 'prism',
        position: [2, 0, 2],
        rotation: 315
      },
      {
        id: 'prism7',
        type: 'prism',
        position: [2, 0, 5],
        rotation: 90
      },
      {
        id: 'prism8',
        type: 'prism',
        position: [5, 0, 5],
        rotation: 180
      },
      // Extra connection points\n      {\n        id: 'prism9',\n        type: 'prism',\n        position: [-6, 0, 0],\n        rotation: 0\n      },\n      {\n        id: 'prism10',\n        type: 'prism',\n        position: [-8, 0, 4],\n        rotation: 90\n      },\n      {\n        id: 'prism11',\n        type: 'prism',\n        position: [-4, 0, 6],\n        rotation: 180\n      },\n      {\n        id: 'prism12',\n        type: 'prism',\n        position: [0, 0, -6],\n        rotation: 270\n      },\n      {\n        id: 'prism13',\n        type: 'prism',\n        position: [4, 0, -4],\n        rotation: 45\n      },\n      {\n        id: 'prism14',\n        type: 'prism',\n        position: [6, 0, -2],\n        rotation: 315\n      },\n      {\n        id: 'prism15',\n        type: 'prism',\n        position: [6, 0, 2],\n        rotation: 135\n      },\n      {\n        id: 'prism16',\n        type: 'prism',\n        position: [-2, 0, -6],\n        rotation: 225\n      },\n      {\n        id: 'prism17',\n        type: 'prism',\n        position: [2, 0, -8],\n        rotation: 90\n      },\n      {\n        id: 'prism18',\n        type: 'prism',\n        position: [8, 0, 0],\n        rotation: 0\n      },
      {
        id: 'rune1',
        type: 'rune',
        position: [7, 0, 7]
      }
    ]
  },

  // Level 7: 22 prisms chaos field
  {
    id: 7,
    name: 'Chaos',
    maxMoves: 80,
    runePosition: [-9, 0, -9],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5', 'prism6', 'prism7', 'prism8', 'prism9', 'prism10'],
    solution: {
      prism1: 225,
      prism2: 270,
      prism3: 225,
      prism4: 180,
      prism5: 225,
      prism6: 270,
      prism7: 225,
      prism8: 270,
      prism9: 225,
      prism10: 225
    },
    starThresholds: {
      gold: 35,
      silver: 55,
      bronze: 70
    },
    elements: Array.from({ length: 22 }, (_, i) => ({
      id: `prism${i + 1}`,
      type: 'prism' as const,
      position: [
        Math.floor(Math.random() * 18) - 9,
        0,
        Math.floor(Math.random() * 18) - 9
      ] as [number, number, number],
      rotation: Math.floor(Math.random() * 8) * 45
    })).concat([{
      id: 'rune1',
      type: 'rune' as const,
      position: [-9, 0, -9] as [number, number, number]
    }] as any)
  },

  // Level 8: 26 prisms sprawling mega-puzzle
  {
    id: 8,
    name: 'Labyrinth',
    maxMoves: 90,
    runePosition: [10, 0, -10],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5', 'prism6', 'prism7', 'prism8', 'prism9', 'prism10', 'prism11'],
    solution: {
      prism1: 45,
      prism2: 90,
      prism3: 45,
      prism4: 0,
      prism5: 315,
      prism6: 90,
      prism7: 45,
      prism8: 0,
      prism9: 315,
      prism10: 90,
      prism11: 315
    },
    starThresholds: {
      gold: 42,
      silver: 65,
      bronze: 80
    },
    elements: Array.from({ length: 26 }, (_, i) => ({
      id: `prism${i + 1}`,
      type: 'prism' as const,
      position: [
        -10 + i * 0.8,
        0,
        -10 + (i % 3) * 6.67
      ] as [number, number, number],
      rotation: (i * 37) % 360
    })).concat([{
      id: 'rune1',
      type: 'rune' as const,
      position: [10, 0, -10] as [number, number, number]
    }] as any)
  },

  // Level 9: 30 prisms ultimate endgame
  {
    id: 9,
    name: 'Odyssey',
    maxMoves: 120,
    runePosition: [0, 0, -12],
    chain: ['prism1', 'prism2', 'prism3', 'prism4', 'prism5', 'prism6', 'prism7', 'prism8', 'prism9', 'prism10', 'prism11', 'prism12', 'prism13', 'prism14', 'prism15'],
    solution: {
      prism1: 45,
      prism2: 0,
      prism3: 315,
      prism4: 270,
      prism5: 225,
      prism6: 180,
      prism7: 135,
      prism8: 90,
      prism9: 45,
      prism10: 0,
      prism11: 315,
      prism12: 270,
      prism13: 225,
      prism14: 180,
      prism15: 270
    },
    starThresholds: {
      gold: 55,
      silver: 85,
      bronze: 110
    },
    elements: Array.from({ length: 30 }, (_, i) => ({
      id: `prism${i + 1}`,
      type: 'prism' as const,
      position: [
        Math.cos(i * 0.628) * 10,
        0,
        Math.sin(i * 0.628) * 10
      ] as [number, number, number],
      rotation: (i * 45 + 90) % 360
    })).concat([{
      id: 'rune1',
      type: 'rune' as const,
      position: [0, 0, -12] as [number, number, number]
    }] as any)
  }
];
