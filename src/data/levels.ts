import { Level } from '../types/game';

// Chamber 1: Tutorial levels teaching core mechanics
export const LEVELS: Level[] = [
  // Level 1: Simple light redirection
  {
    id: 1,
    chamber: 1,
    name: 'First Light',
    maxMoves: 8,
    parMoves: 5,
    expertMoves: 3,
    runePosition: [0, 0, 3],
    lightSources: [
      {
        position: [-3, 1, 0],
        direction: [1, 0, 0]
      }
    ],
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-1, 0, 0],
        rotation: 0
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [0, 0, 1.5],
        rotation: 0
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [0, 0, 3]
      }
    ]
  },
  
  // Level 2: Introduce movable blocks
  {
    id: 2,
    chamber: 1,
    name: 'Moving Stones',
    maxMoves: 12,
    parMoves: 8,
    expertMoves: 6,
    runePosition: [2, 0, 3],
    lightSources: [
      {
        position: [-3, 1, -2],
        direction: [1, 0, 0]
      }
    ],
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-1, 0, -2],
        rotation: 0
      },
      {
        id: 'block1',
        type: 'block',
        position: [0, 0, 0],
        rotation: 0
      },
      {
        id: 'block2',
        type: 'block',
        position: [1, 0, 1],
        rotation: 0
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [2, 0, 1.5],
        rotation: 0
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [2, 0, 3]
      }
    ]
  },
  
  // Level 3: Add pressure plates
  {
    id: 3,
    chamber: 1,
    name: 'Ancient Mechanisms',
    maxMoves: 15,
    parMoves: 10,
    expertMoves: 7,
    runePosition: [0, 0, 4],
    lightSources: [
      {
        position: [-4, 1, 0],
        direction: [1, 0, 0]
      }
    ],
    elements: [
      {
        id: 'prism1',
        type: 'prism',
        position: [-2, 0, 0],
        rotation: 0
      },
      {
        id: 'block1',
        type: 'block',
        position: [-1, 0, 0],
        rotation: 0
      },
      {
        id: 'plate1',
        type: 'plate',
        position: [0, -0.3, 1],
        isActivated: false
      },
      {
        id: 'block2',
        type: 'block',
        position: [1, 0, 2],
        rotation: 0
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [0, 0, 2.5],
        rotation: 0
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [0, 0, 4]
      }
    ]
  },
  
  // Level 4: Hidden jewel collectible
  {
    id: 4,
    chamber: 1,
    name: 'Hidden Treasure',
    maxMoves: 15,
    parMoves: 11,
    expertMoves: 8,
    runePosition: [3, 0, 3],
    lightSources: [
      {
        position: [-3, 1, -1],
        direction: [1, 0, 0]
      }
    ],
    elements: [
      {
        id: 'jewel1',
        type: 'jewel',
        position: [-2, 0.5, 2],
        isActivated: false
      },
      {
        id: 'prism1',
        type: 'prism',
        position: [-1, 0, -1],
        rotation: 0
      },
      {
        id: 'block1',
        type: 'block',
        position: [0, 0, 0],
        rotation: 0
      },
      {
        id: 'plate1',
        type: 'plate',
        position: [1, -0.3, 0],
        isActivated: false
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [2, 0, 1],
        rotation: 0
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [3, 0, 2],
        rotation: 0
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [3, 0, 3]
      }
    ]
  },
  
  // Level 5: Combine all mechanics
  {
    id: 5,
    chamber: 1,
    name: 'Chamber Master',
    maxMoves: 18,
    parMoves: 12,
    expertMoves: 9,
    runePosition: [0, 0, 5],
    lightSources: [
      {
        position: [-4, 1, -2],
        direction: [1, 0, 0]
      },
      {
        position: [4, 1, -1],
        direction: [-1, 0, 0]
      }
    ],
    elements: [
      {
        id: 'jewel1',
        type: 'jewel',
        position: [-3, 0.5, 1],
        isActivated: false
      },
      {
        id: 'jewel2',
        type: 'jewel',
        position: [3, 0.5, 0],
        isActivated: false
      },
      {
        id: 'prism1',
        type: 'prism',
        position: [-2, 0, -2],
        rotation: 0
      },
      {
        id: 'prism2',
        type: 'prism',
        position: [2, 0, -1],
        rotation: 0
      },
      {
        id: 'block1',
        type: 'block',
        position: [-1, 0, 0],
        rotation: 0
      },
      {
        id: 'block2',
        type: 'block',
        position: [1, 0, 1],
        rotation: 0
      },
      {
        id: 'plate1',
        type: 'plate',
        position: [0, -0.3, 2],
        isActivated: false
      },
      {
        id: 'prism3',
        type: 'prism',
        position: [0, 0, 3.5],
        rotation: 0
      },
      {
        id: 'rune1',
        type: 'rune',
        position: [0, 0, 5]
      }
    ]
  }
];

// Chamber unlock requirements
export const CHAMBER_REQUIREMENTS: Record<number, number> = {
  1: 0,  // Chamber 1 always unlocked
  2: 8,  // Need 8 jewels to unlock Chamber 2
  3: 15, // Need 15 jewels to unlock Chamber 3
  4: 25,
  5: 38,
  6: 52
};
