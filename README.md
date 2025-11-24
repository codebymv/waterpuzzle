# ⚱️ Sunken Ruins - Ancient Underwater Puzzle Game

An innovative React + Three.js puzzle game set in mysterious submerged temple ruins. Solve strategic spatial puzzles with limited moves to unlock ancient chambers and collect precious jewels in a breathtaking underwater environment.

![Sunken Ruins](https://img.shields.io/badge/Made%20with-React%20%2B%20Three.js-blue)
![Status](https://img.shields.io/badge/Status-Playable%20Demo-green)

## 🌊 Game Overview

Explore ancient underwater ruins filled with bioluminescent flora, mysterious mechanisms, and spatial puzzles. Each level challenges you to efficiently direct light energy to central runes using limited moves. Master the ancient technology to earn jewels and unlock deeper chambers.

### Core Features

- **Move-Limited Strategic Puzzles**: Each level provides fixed moves - find the optimal solution path
- **Interactive Puzzle Elements**: 
  - 🔷 Crystal prisms that refract light beams
  - 🗿 Movable stone blocks
  - ⚡ Pressure plates that restore moves
  - 💎 Ancient jewels that grant bonus moves
  - 🌀 Central runes to activate
- **Jewel Rating System**: Earn Bronze/Silver/Gold jewels based on efficiency
- **Progressive Difficulty**: 5 tutorial levels teaching mechanics incrementally
- **Beautiful Underwater Atmosphere**: Dynamic lighting, caustics effects, floating particles

## 🎮 How to Play

### Controls

- **Mouse Drag**: Rotate camera around puzzle
- **Scroll Wheel**: Zoom in/out
- **Click**: Interact with puzzle elements
  - Click prisms to rotate them
  - Click blocks to move them
  - Click jewels to collect them
  - Click pressure plates to activate them

### Game Mechanics

1. **Moves**: Each level starts with limited moves. Every action costs 1 move
2. **Goal**: Direct light/energy to the central rune to complete the level
3. **Bonuses**:
   - 💎 **Jewels**: Collect for +2 moves and +50 points
   - ⚡ **Pressure Plates**: Activate for +5 moves
4. **Undo**: Free undo button to experiment without penalty
5. **Restart**: Instant level restart anytime

### Scoring System

**Per Level:**
- Base completion: 1,000 points
- Efficiency bonus: +100 points per move saved under par
- Jewel collection: +50 points each

**Jewel Ratings:**
- 💎 **Bronze**: Complete the puzzle (any moves)
- 💎💎 **Silver**: Complete under Par moves
- 💎💎💎 **Gold**: Complete under Expert moves

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ and npm

### Quick Start

```bash
# Clone or download the repository
cd waterpuzzle

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏛️ Level Design

### Chamber 1: Tutorial (5 Levels)

1. **First Light** - Learn prism rotation
   - Max: 8 moves | Par: 5 | Expert: 3
   
2. **Moving Stones** - Introduce movable blocks
   - Max: 12 moves | Par: 8 | Expert: 6
   
3. **Ancient Mechanisms** - Add pressure plates
   - Max: 15 moves | Par: 10 | Expert: 7
   
4. **Hidden Treasure** - Find collectible jewels
   - Max: 15 moves | Par: 11 | Expert: 8
   
5. **Chamber Master** - Combine all mechanics
   - Max: 18 moves | Par: 12 | Expert: 9

## 🎨 Theme & Atmosphere

**Visual Design:**
- Deep blues and teals for water depth
- Bioluminescent accents (cyan, amber, gold, purple)
- Dynamic caustics creating dancing light patterns
- Floating particles simulating underwater environment
- Ancient stone textures with mystical inscriptions

**Atmosphere:**
- Peaceful and meditative
- Moments of discovery and achievement
- No time pressure - strategic thinking over reflexes
- Encourages experimentation and optimization

## 🛠️ Technical Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics engine
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for R3F
- **Zustand** - State management
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

## 🎯 Project Structure

```
waterpuzzle/
├── src/
│   ├── components/
│   │   ├── UnderwaterEnvironment.tsx  # Scene lighting & effects
│   │   ├── PuzzleElements.tsx         # Interactive 3D objects
│   │   ├── UI.tsx                     # HUD and modals
│   │   ├── UI.css                     # UI styling
│   │   ├── Menu.tsx                   # Main menu & level select
│   │   └── Menu.css                   # Menu styling
│   ├── store/
│   │   └── gameStore.ts               # Game state management
│   ├── data/
│   │   └── levels.ts                  # Level definitions
│   ├── types/
│   │   └── game.ts                    # TypeScript types
│   ├── App.tsx                        # Main app component
│   └── main.tsx                       # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎪 Debug Features

- **Press 'C' key**: Instantly complete current level (for testing)
- Progress saved to browser localStorage
- Undo/restart available anytime

## 🚀 Future Enhancements

Potential additions for full game:

1. **Light Beam Physics**: Real ray-traced light paths with prism refraction
2. **More Chambers**: 30-40 total levels across 6-8 chambers
3. **Advanced Elements**: 
   - Water current redirectors
   - Mirror surfaces
   - Colored light mixing
   - Time-based mechanics
4. **Cosmetic Unlocks**: Different bioluminescent themes
5. **Online Leaderboards**: Per-level move count competition
6. **Sound Design**: Ambient underwater audio, interaction sounds
7. **Particle Effects**: Enhanced water ripples, completion animations
8. **Mobile Controls**: Touch-optimized interactions
9. **Hints System**: Optional hints for stuck players
10. **Story Elements**: Narrative through inscriptions and discoveries

## 📝 Game Design Philosophy

**Innovation Goals:**
- Make players feel like underwater archaeologists
- Strategic thinking over reflexes
- "Just one more try" optimization loop
- Satisfying puzzle solutions with elegant efficiency
- Beautiful, calming aesthetic contrasting action games
- Accessible but challenging to master

## 🐛 Known Limitations

This is a playable demo/prototype:

- Light beam mechanics are simplified (no real ray tracing yet)
- Block movement is basic (single direction on click)
- Level completion triggered manually with 'C' key for testing
- 5 levels in Chamber 1 (designed for 30-40 total)
- No sound effects or ambient audio yet
- Simplified collision detection

## 🎮 Playing the Game

1. **Start the dev server**: `npm run dev`
2. **Open in browser**: Navigate to http://localhost:3000
3. **Main Menu**: Click "Continue Adventure" or "Select Level"
4. **In-Game**: 
   - Interact with puzzle elements by clicking
   - Watch your move counter
   - Collect jewels for bonus moves
   - Press 'C' to complete level (demo mode)
   - Use Undo/Restart buttons as needed
5. **Complete Levels**: Earn jewels based on efficiency
6. **Progress**: Unlock new chambers by collecting jewels

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built with modern web technologies to demonstrate:
- Advanced 3D web game development
- Strategic puzzle game design
- Immersive underwater environments
- Progressive difficulty systems
- State management for complex games

---

**Ready to explore the depths?** Start the dev server and dive into the sunken ruins! 🌊⚱️💎