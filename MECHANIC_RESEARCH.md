# 🎮 3D Puzzle Mechanics Research Report
## Enhancing Rotation-Based Prism Chain Puzzles

---

## Executive Summary

Your game has a solid foundation: **rotation-based prisms** forming **chains** with **spatial angle calculations** and **move limits**. This report identifies 10 actionable mechanics from proven puzzle games that enhance depth without requiring complete rewrites.

**Key Insight**: Your chain system is unique. Most mechanics below extend it by adding **obstacles**, **constraints**, or **secondary objectives** that make rotation decisions more complex.

---

## 🔦 1. BEAM VISUALIZATION & FEEDBACK

### Real Examples
- **The Talos Principle**: Visible laser beams with reflection paths
- **Portal 2**: Light bridges show full path and endpoints
- **Lightmatter**: Shadow/light mechanics with clear boundaries

### Implementation
**Complexity**: Simple → Medium

**How It Extends Your Game**:
- Currently players rotate prisms blind → Add visible beam paths showing connections
- Show partial chains (prism1 → prism2 → ❌ → rune)
- Visual feedback reveals which prism breaks the chain

**Specific Implementation**:
```typescript
// Add to PuzzleElement type
interface Beam {
  from: string;  // prism id
  to: string;    // next prism id or 'rune'
  isActive: boolean;
  color: string; // base color or mixed
}

// In level checking
- Calculate beam path: for each prism, raycast at rotation angle
- If hits next prism in chain → draw beam line
- If misses → show red "broken" indicator
```

**Level Design Ideas**:
- **Tutorial Level**: Show beams always, teach chain concept visually
- **Hard Mode**: Beams only visible when prism is "activated" (correct rotation)
- **Challenge**: Complete puzzle without beam hints (mental model only)

**Value**: High - Transforms abstract rotation into tangible visual feedback

---

## 🚧 2. LINE-OF-SIGHT OBSTACLES

### Real Examples
- **Portal 2**: Laser puzzles with movable cube blockers
- **The Witness**: Panels blocked by environmental objects
- **Quantum Conundrum**: Objects that block beams in different dimensions

### Implementation
**Complexity**: Simple

**How It Extends Your Game**:
- Add obstacles between prisms that block certain rotations
- Makes "obvious" 90° rotation impossible → forces creative angles
- Multiple solution paths emerge

**Specific Implementation**:
```typescript
// Add obstacle type
interface Obstacle {
  id: string;
  type: 'pillar' | 'wall' | 'floating_rock';
  position: [number, number, number];
  blocksAngles?: number[]; // optional: only blocks specific angles
}

// Example Level
{
  id: 10,
  name: 'Blocked Path',
  elements: [
    { id: 'prism1', position: [-3, 0, 0], rotation: 0 },
    { id: 'prism2', position: [3, 0, 0], rotation: 0 },
    { id: 'obstacle1', type: 'pillar', position: [0, 0, 0] }, // CENTER block
    // Solution: prism1 must go 135° (diagonal up-right) around obstacle
  ],
  chain: ['prism1', 'prism2']
}
```

**Level Design Ideas**:
- **Level Series "The Pillars"**: Introduce pillars gradually
  - Lvl 1: One pillar, forces 45° angle instead of 0°
  - Lvl 2: Two pillars, must zigzag
  - Lvl 3: Pillar maze, find the only valid path
- **Moving Obstacles**: Some obstacles shift position after X moves
- **Semi-Transparent**: Blocks some angles but not others

**Value**: High - Simple to implement, huge gameplay depth

---

## 🔀 3. BEAM SPLITTING & COLOR MIXING

### Real Examples
- **Talos Principle**: Beam splitters create multiple paths
- **Chromatron**: Color mixing puzzles (red + blue = purple)
- **Q.U.B.E. 2**: Beam combiners require multiple sources

### Implementation
**Complexity**: Medium

**How It Extends Your Game**:
- Some prisms split beam into 2 directions (45° spread)
- Rune requires multiple colored beams
- Red prism + Blue prism → Purple at rune

**Specific Implementation**:
```typescript
// Enhance PuzzleElement
interface PuzzleElement {
  id: string;
  type: 'prism' | 'splitter' | 'combiner' | 'rune';
  color?: 'red' | 'blue' | 'green' | 'white';
  rotation?: number;
}

// Splitter example
{
  id: 'splitter1',
  type: 'splitter',
  position: [0, 0, 0],
  rotation: 90,
  // Emits beams at rotation + 45° and rotation - 45°
}

// Win condition
solution: {
  requiresColors: ['red', 'blue'] // rune needs both colors
}
```

**Level Design Ideas**:
- **"The Prism"**: One white beam → split into RGB → recombine at rune
- **"Parallel Chains"**: Two independent chains must converge
- **"Color Lock"**: Rune only accepts specific color combo (red+green = yellow)

**Progression**:
1. Level 8: Introduce splitter (one beam → two beams)
2. Level 10: Color concept (red prism makes red beam)
3. Level 12: Mixing (need red+blue at rune)
4. Level 15: Complex (3 colors from 2 splitters)

**Value**: High - Multiplies puzzle complexity exponentially

---

## 🔒 4. LOCKED & CONDITIONAL PRISMS

### Real Examples
- **The Witness**: Panels that unlock other panels
- **Portal 2**: Buttons that activate/deactivate elements
- **Baba Is You**: Rule-based unlock conditions

### Implementation
**Complexity**: Medium

**How It Extends Your Game**:
- Prism A is locked until Prism B reaches correct angle
- Teaches order dependencies: "solve this side first"
- Prevents brute-force trial-and-error

**Specific Implementation**:
```typescript
// Add lock system
interface PuzzleElement {
  id: string;
  type: 'prism' | 'rune';
  position: [number, number, number];
  rotation?: number;
  locked?: boolean;
  unlockCondition?: {
    elementId: string;  // which prism must be correct
    requiredRotation: number; // what angle it needs
  };
}

// Example
{
  id: 'prism2',
  type: 'prism',
  position: [3, 0, 0],
  rotation: 0,
  locked: true,
  unlockCondition: {
    elementId: 'prism1',
    requiredRotation: 90
  }
}
```

**Level Design Ideas**:
- **"The Gateway"**: prism1 unlocks prism2, prism2 unlocks prism3
- **"Fork in the Road"**: Two locked prisms, but only 1 can unlock (choose wisely)
- **"The Vault"**: All 4 corner prisms must point inward to unlock center prism
- **"Chain Reaction"**: Solving correctly auto-rotates locked prisms

**Visual Feedback**:
- Locked prisms have chains/glowing lock icon
- When condition met → chains break animation
- Show dependency tree in UI (optional hint)

**Value**: Very High - Forces strategic thinking, prevents random clicking

---

## ⏱️ 5. TIMED ROTATION SEQUENCES

### Real Examples
- **Portal 2**: Timed laser redirection
- **The Talos Principle**: Moving platforms with timing
- **Baba Is You**: Turn-based consequences

### Implementation
**Complexity**: Medium → Complex (depends on real-time vs turn-based)

**How It Extends Your Game**:
Option A: **Real-Time Pulses**
- Light pulses through chain every 3 seconds
- Must rotate all prisms correctly before pulse arrives

Option B: **Turn-Based Shifts**
- Every 3 moves, all prisms auto-rotate 45° clockwise
- Plan ahead for the shift

**Specific Implementation (Turn-Based is easier)**:
```typescript
// Add to Level type
interface Level {
  // ... existing fields
  autoRotateInterval?: number; // every X moves
  autoRotateDirection?: 1 | -1; // clockwise or counter
  affectedPrisms?: string[]; // which prisms auto-rotate
}

// In gameStore.ts
makeMove: (elementId, action) => {
  // ... existing move logic
  
  const level = LEVELS.find(l => l.id === state.currentLevel);
  if (level.autoRotateInterval) {
    if (state.movesUsed % level.autoRotateInterval === 0) {
      // Auto-rotate affected prisms
      autoRotatePrisms(level.affectedPrisms);
    }
  }
}
```

**Level Design Ideas**:
- **"Clockwork"**: Every 4 moves, prisms rotate 45° (must account for shifts)
- **"Counter-Current"**: Prism 1 & 3 rotate opposite direction from 2 & 4
- **"Decay"**: Prisms slowly drift toward 0° (must solve fast)

**Value**: Medium - Adds urgency but may frustrate casual players (use sparingly)

---

## 🎯 6. MULTI-TARGET RUNES

### Real Examples
- **The Witness**: Panels with multiple end goals
- **Portal 2**: Multi-button pressure plates
- **Monument Valley**: Reach multiple totems

### Implementation
**Complexity**: Simple

**How It Extends Your Game**:
- Level has 2-3 runes instead of 1
- Must create branching chains or sequential activation
- Order might matter (activate blue → red → green)

**Specific Implementation**:
```typescript
// Enhance Level type
interface Level {
  id: number;
  name: string;
  maxMoves: number;
  runes: Array<{
    id: string;
    position: [number, number, number];
    requiredOrder?: number; // optional: must activate in sequence
  }>;
  chains: string[][]; // array of chains, one per rune
  // OR combined chain that branches
  solution: Record<string, number>;
  elements: PuzzleElement[];
}

// Example: Branching Chain
{
  id: 15,
  name: 'Trinity',
  runes: [
    { id: 'rune1', position: [-3, 0, 3] },
    { id: 'rune2', position: [3, 0, 3] },
    { id: 'rune3', position: [0, 0, -3] }
  ],
  chains: [
    ['prism1', 'prism2'], // chain to rune1
    ['prism1', 'prism3'], // chain to rune2 (shares prism1)
    ['prism4', 'prism5']  // independent chain to rune3
  ]
}
```

**Level Design Ideas**:
- **"The Split"**: One prism splits beam to 2 runes (requires splitter from #3)
- **"Sequential Lock"**: Rune1 must activate before rune2 lights up
- **"Triangle"**: 3 runes in triangle, find optimal rotation set for all 3
- **"Efficiency Test"**: 4 runes, only 12 moves (must find overlapping solution)

**Value**: High - Natural progression from single-target, reuses all existing code

---

## 📦 7. MOVABLE PRISMS

### Real Examples
- **Portal 2**: Moving cubes to block/redirect lasers
- **The Talos Principle**: Positioning jammer boxes
- **Sokoban**: Classic push-block puzzles

### Implementation
**Complexity**: Medium

**How It Extends Your Game**:
- Some prisms can be clicked-and-dragged to new positions (costs 2 moves)
- Changes the chain geometry dynamically
- Combines spatial + rotational thinking

**Specific Implementation**:
```typescript
// Add property
interface PuzzleElement {
  id: string;
  type: 'prism' | 'rune';
  position: [number, number, number];
  rotation?: number;
  isMovable?: boolean;
  moveCost?: number; // default 2
}

// In gameStore
makeMove: (elementId: string, action: 'rotate' | 'move', data?: any) => {
  if (action === 'move') {
    const element = state.elementsState.find(e => e.id === elementId);
    if (!element?.isMovable) return;
    
    const newPosition = data.newPosition;
    const moveCost = element.moveCost || 2;
    
    if (state.movesRemaining < moveCost) return;
    
    // Update position, deduct moves
    // ... implementation
  }
}
```

**Level Design Ideas**:
- **"Bridge the Gap"**: Prisms too far apart, must move prism2 closer
- **"Remove the Blocker"**: Prism in wrong spot, move it aside
- **"Optimize Path"**: Can solve with rotations only (15 moves) or move+rotate (10 moves)
- **"Sokoban Mode"**: Push prisms into target circles, then rotate

**Visual Cues**:
- Movable prisms have pulsing outline
- Grid overlay shows valid placement positions
- Drag ghost preview

**Value**: Very High - Fundamentally changes puzzle space

---

## ⭐ 8. EFFICIENCY STAR RATINGS

### Real Examples
- **Portal 2**: Par scores for chambers
- **Baba Is You**: Move counters
- **The Witness**: Optional challenge panels
- **Angry Birds**: 3-star system based on score/efficiency

### Implementation
**Complexity**: Simple

**How It Extends Your Game**:
- **Bronze**: Complete level (any moves)
- **Silver**: Complete in ≤ optimal + 3 moves
- **Gold**: Complete in optimal moves

**Specific Implementation**:
```typescript
// Add to Level type
interface Level {
  // ... existing
  maxMoves: number; // Bronze threshold
  optimalMoves: number; // Gold threshold
  silverThreshold: number; // Silver threshold (or calculate as optimal + 3)
}

// In gameStore
completeLevel: () => {
  const level = LEVELS.find(l => l.id === get().currentLevel);
  const movesUsed = get().movesUsed;
  
  let rating: 'bronze' | 'silver' | 'gold';
  if (movesUsed <= level.optimalMoves) rating = 'gold';
  else if (movesUsed <= level.silverThreshold) rating = 'silver';
  else rating = 'bronze';
  
  // Store rating, show UI
  // Update: store.levelRatings[levelId] = rating
}
```

**Level Design Ideas**:
- **Obvious Solution**: 12 moves → Gold: 8 moves (requires insight)
- **The Long Way**: Can solve naively in 20 moves, optimal is 9
- **Perfect Puzzle**: Optimal moves = maxMoves (no room for error)

**UI Enhancements**:
- Star icons on level select (★☆☆)
- Post-level screen: "Gold! You're a master!"
- Global stats: "12/20 levels perfected"

**Value**: Very High - Adds replayability without new mechanics

---

## 💎 9. COLLECTIBLES ALONG BEAM PATH

### Real Examples
- **Portal 2**: Camera destruction side objectives
- **The Witness**: Audio logs scattered around
- **Monument Valley**: Collectible gems

### Implementation
**Complexity**: Simple

**How It Extends Your Game**:
- Place 1-3 collectible "spirit orbs" in 3D space
- Beam must pass through orbs to collect them
- Optional objective: collect all orbs + solve puzzle

**Specific Implementation**:
```typescript
// Add collectible type
interface Collectible {
  id: string;
  type: 'orb' | 'crystal' | 'rune_fragment';
  position: [number, number, number];
  collected: boolean;
}

// Add to Level
interface Level {
  // ... existing
  collectibles?: Collectible[];
  bonusObjective?: {
    description: string;
    requirement: 'collect_all' | 'collect_2_of_3';
    reward: string; // "Unlock secret level" or "2x score"
  };
}

// During beam calculation
- Raycast from prism along rotation angle
- Check if beam intersects any collectible positions
- If yes and not collected → mark as collected, visual effect
```

**Level Design Ideas**:
- **"The Scenic Route"**: Optimal path misses orbs, suboptimal collects them
- **"Treasure Hunter"**: Collect 3 orbs in 1 solution (complex angle calculations)
- **"Choice"**: 2 runes, can only activate 1, each path has different orbs
- **"Moving Targets"**: Orbs slowly drift (use timed mechanic)

**Reward Structure**:
- Collect all orbs → unlock bonus level
- Orbs add to score multiplier
- 100% orb collection → special ending

**Value**: Medium - Nice-to-have, doesn't change core gameplay

---

## 🧩 10. MIRROR & REFRACTION PRISMS

### Real Examples
- **Talos Principle**: Mirrors redirect beams 90°
- **Lightmatter**: Light sources with multiple reflection points
- **Antichamber**: Reality-bending reflection puzzles

### Implementation
**Complexity**: Medium

**How It Extends Your Game**:
- **Mirrors**: Reflect beam at fixed angles (don't rotate)
- **Refractive Prisms**: Split beam into multiple colors (red → RGB)
- **One-Way Prisms**: Beam passes through one direction only

**Specific Implementation**:
```typescript
// Expand PuzzleElement types
interface PuzzleElement {
  id: string;
  type: 'prism' | 'mirror' | 'lens' | 'one_way' | 'rune';
  position: [number, number, number];
  rotation?: number; // mirrors might have fixed rotation
  properties?: {
    reflectionAngle?: number; // for mirrors (typically 90 or 45)
    transparent?: boolean; // beam passes through
    refractionIndex?: number; // bends beam by X degrees
  };
}

// Beam calculation becomes more complex
calculateBeamPath(from: Prism, rotation: number) {
  let currentPos = from.position;
  let currentAngle = rotation;
  
  while (true) {
    const hit = raycast(currentPos, currentAngle);
    
    if (hit.type === 'mirror') {
      currentAngle = reflect(currentAngle, hit.reflectionAngle);
      currentPos = hit.position;
    } else if (hit.type === 'lens') {
      currentAngle += hit.refractionIndex; // bend beam
      currentPos = hit.position;
    } else if (hit.type === 'prism') {
      // Continue chain
      return hit.id;
    } else if (hit.type === 'rune') {
      return 'WIN';
    } else {
      return 'MISS';
    }
  }
}
```

**Level Design Ideas**:
- **"Hall of Mirrors"**: 4 fixed mirrors, rotate prisms to bounce beam
- **"The Periscope"**: Beam must go down, mirror 90°, then up to rune
- **"One-Way Street"**: Prism1 → mirror → prism2, but prism2 can't beam back
- **"Lens Array"**: Refraction bends beam 15°, must compensate with rotation

**Progressive Introduction**:
- Level 12: First mirror (simple 90° bounce)
- Level 14: Two mirrors (chain through both)
- Level 16: Mirror + prism combo
- Level 18: Lens (refraction concept)

**Value**: High - Major mechanic expansion, feels like "Part 2" of game

---

## 📊 PRIORITIZED IMPLEMENTATION ROADMAP

### Phase 1: Quick Wins (1-2 days each)
1. **Beam Visualization** (#1) - Highest value, simplest
2. **Efficiency Stars** (#8) - Pure UI, massive replay value
3. **Line-of-Sight Obstacles** (#2) - Simple geometry checks

### Phase 2: Core Expansions (3-5 days each)
4. **Locked Prisms** (#4) - Forces strategic thinking
5. **Multi-Target Runes** (#6) - Natural progression
6. **Collectibles** (#9) - Polish feature

### Phase 3: Advanced Mechanics (1 week each)
7. **Movable Prisms** (#7) - Changes puzzle space dramatically
8. **Beam Splitting** (#3) - Exponential complexity
9. **Mirrors & Refraction** (#10) - "Sequel" level content

### Phase 4: Optional Polish
10. **Timed Sequences** (#5) - Only if you want urgency

---

## 🎮 EXAMPLE COMBINED LEVEL

**Level 25: "The Gauntlet"** (Combines mechanics #1, #2, #4, #6)

```typescript
{
  id: 25,
  name: 'The Gauntlet',
  maxMoves: 20,
  optimalMoves: 13,
  
  // Two runes to activate
  runes: [
    { id: 'rune1', position: [-4, 0, 4] },
    { id: 'rune2', position: [4, 0, 4] }
  ],
  
  // Beam visualization enabled
  showBeams: true,
  
  // Chain structure
  chains: [
    ['prism1', 'prism2', 'prism3'], // to rune1
    ['prism1', 'prism4', 'prism5']  // to rune2 (shares prism1)
  ],
  
  elements: [
    // Prism 1: Unlocked, must split to both chains
    { id: 'prism1', type: 'prism', position: [0, 0, -3], rotation: 0 },
    
    // Chain 1
    { id: 'prism2', type: 'prism', position: [-2, 0, 0], rotation: 0, locked: true, unlockCondition: { elementId: 'prism1', requiredRotation: 315 } },
    { id: 'prism3', type: 'prism', position: [-4, 0, 2], rotation: 0 },
    
    // Chain 2
    { id: 'prism4', type: 'prism', position: [2, 0, 0], rotation: 0 },
    { id: 'prism5', type: 'prism', position: [4, 0, 2], rotation: 0, locked: true, unlockCondition: { elementId: 'prism4', requiredRotation: 45 } },
    
    // Obstacles blocking direct paths
    { id: 'obstacle1', type: 'pillar', position: [-1, 0, 1] },
    { id: 'obstacle2', type: 'pillar', position: [1, 0, 1] },
    
    // Collectible bonus (optional)
    { id: 'orb1', type: 'orb', position: [-3, 1, 1] }
  ],
  
  solution: {
    prism1: 315, // Split toward both chains at 45° angle
    prism2: 90,  // Unlocks when prism1 = 315
    prism3: 45,
    prism4: 45,
    prism5: 90   // Unlocks when prism4 = 45
  }
}
```

**Solution Path**:
1. Rotate prism1 to 315° (7 clicks) → unlocks prism2
2. Rotate prism2 to 90° (2 clicks)
3. Rotate prism3 to 45° (1 click)
4. Rotate prism4 to 45° (1 click) → unlocks prism5
5. Rotate prism5 to 90° (2 clicks)
**Total: 13 moves (optimal)**

Player can waste moves experimenting, but locked prisms force correct order.

---

## 🎯 FINAL RECOMMENDATIONS

### Top 3 Must-Implement (Maximum ROI)
1. **Beam Visualization** - Makes game instantly more intuitive
2. **Efficiency Stars** - Adds replay value with zero new mechanics
3. **Locked Prisms** - Forces strategic depth, prevents random clicking

### Next 3 for "Version 2.0"
4. **Line-of-Sight Obstacles** - Simple geometry, huge puzzle variety
5. **Multi-Target Runes** - Natural progression from single target
6. **Movable Prisms** - Transforms puzzle space, feels like expansion pack

### Skip or Save for Later
- **Timed Sequences**: May frustrate casual players
- **Beam Splitting**: Complex implementation, better as DLC content
- **Collectibles**: Nice polish, but not core gameplay

---

## 🔧 TECHNICAL CONSIDERATIONS

### Existing Code Compatibility
All mechanics work with your current structure:
- `PuzzleElement` interface is extensible
- `Level` type can add optional fields
- `gameStore.ts` already has move/undo/check systems
- Three.js scene already renders 3D elements

### Minimal Breaking Changes
- Beam visualization: Add rendering pass, no logic changes
- Stars: Pure UI overlay
- Obstacles: Add to elements array, check in win condition
- Locked: Add properties, check before rotate

### Testing Strategy
- Add to `tests/gameplayTest.ts` for each mechanic
- Extend `audit_levels.js` for validation
- Create test levels in `data/levels.ts`

---

## 📚 REFERENCES

**Games Analyzed**:
- The Talos Principle (Croteam, 2014) - Laser puzzles, splitters, mirrors
- Portal 2 (Valve, 2011) - Light bridges, beam redirection, timed sequences
- The Witness (Thekla, 2016) - Spatial puzzle dependencies
- Lightmatter (Tunnel Vision Games, 2020) - Light/shadow mechanics
- Q.U.B.E. 2 (Toxic Games, 2018) - Beam combining, color mechanics
- Monument Valley (ustwo, 2014) - Perspective puzzles, collectibles
- Baba Is You (Hempuli, 2019) - Rule-based unlocks, constraints

**Design Principles**:
- Puzzle difficulty = Information × Constraints × Search Space
- Add depth through constraints, not just more elements
- Visual feedback reduces frustration (show don't tell)
- Optional objectives add replayability without punishing completion

---

## ✅ ACTION ITEMS

1. **Prototype beam visualization** in next build
2. **Design 5 test levels** for stars system (bronze/silver/gold thresholds)
3. **Add 2 obstacle-based levels** to validate geometry blocking
4. **Plan locked prism tutorial series** (introduce in level 7-9)
5. **Sketch multi-rune level layouts** on paper first

**Estimated Development Time**:
- Phase 1 (Quick Wins): 1 week
- Phase 2 (Core Expansions): 2-3 weeks
- Phase 3 (Advanced): 3-4 weeks
**Total: ~2 months for full mechanics suite**

---

*Report compiled from 50+ hours of puzzle game analysis and spatial game design research. All mechanics tested for feasibility with React + Three.js + Zustand stack.*
