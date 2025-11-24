# 🎮 Gameplay Fundamentals - Sunken Ruins

## Core Game Loop

### Objective
Direct light/energy to the central rune to unlock the chamber using limited moves.

---

## Move System

### Actions That COST Moves (1 move each)
1. **🔷 Rotate Prism** - Click to rotate 45° clockwise
2. **🗿 Push Block** - Click to move block (currently +Z direction)

### Actions That Are FREE (No move cost)
1. **💎 Collect Jewel** - Click jewel to collect
   - **Effect:** +2 moves, +50 points
   - **Strategy:** Find jewels early to extend your move budget

2. **⚡ Activate Pressure Plate** - Click plate to activate
   - **Effect:** +5 moves restored
   - **Strategy:** Strategic checkpoints for complex puzzles

### Always Free Actions
- **↶ Undo** - No cost, experiment freely
- **⟲ Restart** - Reset level anytime
- **🎥 Camera** - Rotate and zoom without penalty

---

## Scoring System

### Base Points
- **Level Completion:** 1,000 points

### Efficiency Bonus
- **+100 points** per move saved under Par
- Example: Par is 10, you finish in 7 = +300 bonus

### Collectible Bonus
- **+50 points** per jewel collected

### Jewel Ratings
Earned based on move efficiency:

| Rating | Requirement | Display |
|--------|-------------|---------|
| **Gold** | ≤ Expert Moves | 💎💎💎 |
| **Silver** | ≤ Par Moves | 💎💎 |
| **Bronze** | Any completion | 💎 |

**Example Level:**
- Max: 15 moves
- Par: 10 moves  
- Expert: 7 moves

If you complete in:
- 7 moves → Gold 💎💎💎
- 9 moves → Silver 💎💎
- 14 moves → Bronze 💎

---

## Level Progression

### Chamber Unlocking
- Collect jewels to unlock deeper chambers
- Don't need perfect scores to progress
- Can replay levels for better ratings

### Optimal Strategy
1. **First Pass:** Complete levels (Bronze is fine)
2. **Explore:** Find all jewels in each level
3. **Optimize:** Return for Silver/Gold ratings
4. **Master:** Perfect Expert solutions

---

## Puzzle Elements

### 🔷 Crystal Prisms
- **Action:** Click to rotate 45°
- **Cost:** 1 move per rotation
- **Purpose:** Redirect light beams to the rune
- **Tip:** Plan rotation sequence before starting

### 🗿 Stone Blocks
- **Action:** Click to push
- **Cost:** 1 move per push
- **Purpose:** Create platforms, block paths, trigger plates
- **Tip:** Blocks can activate pressure plates

### ⚡ Pressure Plates
- **Action:** Click or place block on top
- **Cost:** FREE (bonus action)
- **Effect:** +5 moves restored
- **Tip:** Save these for when you're running low on moves

### 💎 Ancient Jewels
- **Action:** Click to collect
- **Cost:** FREE (bonus action)
- **Effect:** +2 moves, +50 points
- **Tip:** Collect early for maximum benefit

### 🌀 Central Rune
- **Purpose:** Target for light/energy
- **Goal:** Activate to complete level
- **Visual:** Glows when activated

---

## Current Implementation Notes

### Demo Features
- Press **'C' key** to manually complete level (testing)
- Progress auto-saves to localStorage
- 5 tutorial levels in Chamber 1

### Simplified Mechanics
- Light beam physics are placeholder
- Block movement is single direction
- No collision detection yet
- Manual level completion for testing

### Full Game Would Include
- Real light ray tracing through prisms
- Multi-direction block pushing
- Collision and physics
- 30-40 total levels across 6-8 chambers
- Sound effects and ambient audio

---

## Tips for Players

1. **Use Undo Freely** - It doesn't cost moves!
2. **Collect Jewels First** - More moves = more flexibility
3. **Save Pressure Plates** - Use when needed
4. **Experiment** - Restart has no penalty
5. **Think Ahead** - Plan your move sequence
6. **Optimize Later** - Bronze completion unlocks next levels

---

## Debugging

When testing, console logs show:
- `🏛️` Level loading
- `🔷` Prism rotations
- `📦` Block movements  
- `💎` Jewel collections
- `⚡` Plate activations
- `✅` Move tracking

Open browser DevTools Console (F12) to see gameplay events!
