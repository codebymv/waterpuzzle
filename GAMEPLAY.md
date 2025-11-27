# 🎮 Simplified Puzzle Mechanics - Pattern Matching Game

## 🎯 Core Game Loop

### Objective
Rotate all prisms to match the target pattern before running out of moves.

---

## 🕹️ Controls

- **Click Prism**: Rotate 45° clockwise (costs 1 move)
- **↶ Undo Button**: Undo last move (free)
- **⟲ Restart Button**: Reset level to starting state (free)
- **Mouse Drag**: Rotate camera around puzzle
- **Scroll Wheel**: Zoom in/out

---

## ⚙️ Game Mechanics

### Win Condition
- Each level has a **target rotation pattern** (hidden from player)
- All prisms must match their target angles simultaneously
- Game automatically checks and completes when pattern matches

### Fail Condition
- Run out of moves before completing the pattern
- Can restart and try again with no penalty

### Moves System
- Each level has a **maximum move limit**
- Every prism rotation costs **1 move**
- Undo is **free** (encourages experimentation)
- Restart is **free** (no frustration)

### Visual Feedback
- **Purple Rune**: Pattern incomplete
- **Green Rune**: Pattern complete (instant win!)
- **Moves Counter**: Shows remaining moves

---

## 📊 Difficulty Parameters

Levels can be varied using these parameters:

### 1. Number of Prisms (3-8)
- **Easy**: 3 prisms
- **Medium**: 4-5 prisms  
- **Hard**: 6-8 prisms
- More prisms = more state to track mentally

### 2. Total Rotation Steps Required
- Each click = 45° rotation
- **Easy**: 6-10 total clicks needed
- **Medium**: 11-16 total clicks
- **Hard**: 17+ total clicks

### 3. Starting Rotations
- **Easy**: All prisms start at 0° (clean slate)
- **Medium**: Some pre-rotated
- **Hard**: All scrambled (must deduce current state)

### 4. Move Budget
- **Generous**: 2x the optimal solution
- **Balanced**: 1.5x the optimal solution
- **Tight**: Exactly optimal moves (no waste allowed)

### 5. Solution Pattern Complexity
- **Easy**: All same angle (e.g., all 90°)
- **Medium**: Sequential pattern (45°, 90°, 135°...)
- **Hard**: Random different angles (harder to remember)

### 6. Spatial Layout
- **Easy**: Linear row (left to right)
- **Medium**: Grid or symmetric layout
- **Hard**: Asymmetric scattered positions

---

## 📈 Level Progression

### Level 1: First Steps
- **Difficulty**: Tutorial
- **Prisms**: 3
- **Pattern**: All 90° (simple repetition)
- **Moves**: 15 (very generous)
- **Starting**: All at 0°

### Level 2: Mixed Angles
- **Difficulty**: Easy
- **Prisms**: 3
- **Pattern**: 0°, 180°, 90° (different angles)
- **Moves**: 12
- **Starting**: All at 0°

### Level 3: Scrambled
- **Difficulty**: Medium
- **Prisms**: 3
- **Pattern**: 180°, 90°, 270°
- **Moves**: 10 (tighter)
- **Starting**: Pre-scrambled (45°, 270°, 135°)
- **Challenge**: Must figure out current state first

### Level 4: Four Corners
- **Difficulty**: Medium-Hard
- **Prisms**: 4
- **Pattern**: 135°, 225°, 315°, 45°
- **Moves**: 14
- **Layout**: Square formation around rune

### Level 5: Memory Test
- **Difficulty**: Hard
- **Prisms**: 5
- **Pattern**: 45°, 90°, 135°, 180°, 225° (all different)
- **Moves**: 20
- **Layout**: Linear row
- **Challenge**: Remember 5 different angles

---

## 🎨 Future Enhancement Ideas

Without adding complexity, you can enhance with:

### Puzzle Variations
1. **Symmetry Puzzles**: Mirror patterns (left = right)
2. **Chain Puzzles**: Prisms in sequence must add up to specific total
3. **Exclusion Puzzles**: Some angles are "forbidden" (lose if hit)
4. **Speed Puzzles**: Same moves but add time pressure

### Quality of Life
1. **Hint System**: Show one correct prism angle (costs moves)
2. **Solution Display**: After 3 fails, show target pattern
3. **Ghost Overlay**: Briefly show target pattern at level start
4. **Progress Indicator**: "2/5 prisms correct"

### Visual Enhancements (still minimal)
1. **Correct Prism Glow**: Green highlight when angle matches
2. **Rotation Trail**: Brief arc showing rotation direction
3. **Angle Markers**: Show 45° increments on prism base
4. **Target Silhouettes**: Faint overlay of target positions

### Meta Progression
1. **Level Select**: Choose any level
2. **Best Scores**: Track minimum moves per level
3. **Efficiency Rating**: ⭐⭐⭐ based on move efficiency
4. **Custom Levels**: Player-created patterns

---

## 🔧 Implementation Notes

### Current Architecture
- **Pattern matching**: Simple angle comparison
- **Auto-check**: Validates after every move
- **No physics**: Pure logic puzzle
- **Instant feedback**: Win/lose immediately upon condition met

### Why This Works
- ✅ **Deterministic**: Same solution every time
- ✅ **Testable**: Easy to verify correct patterns
- ✅ **Scalable**: Add levels with just data
- ✅ **Clear feedback**: Players know when they're close
- ✅ **Low complexity**: ~100 lines of game logic

### Key Files
- **levels.ts**: Level definitions with solutions
- **gameStore.ts**: Game logic and win condition
- **PuzzleElements.tsx**: Prism rotation mechanics
- **UI.tsx**: Win/fail screens and HUD

---

## 🎯 Design Philosophy

**Simple Core + Infinite Depth**
- One mechanic (rotate) mastered through pattern recognition
- No complex physics or timing required
- Pure spatial reasoning and memory
- Easy to learn, progressively challenging
- Minimal code, maximum replayability
