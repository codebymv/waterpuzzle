import { LEVELS } from '../data/levels';
import { Level, PuzzleElement } from '../types/game';

// Create a visual grid representation
function createGrid(level: Level): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`LEVEL ${level.id}: ${level.name} - SPATIAL LAYOUT`);
  console.log(`${'='.repeat(60)}`);
  
  // Find grid bounds
  let minX = 0, maxX = 0, minZ = 0, maxZ = 0;
  
  level.elements.forEach(el => {
    minX = Math.min(minX, el.position[0]);
    maxX = Math.max(maxX, el.position[0]);
    minZ = Math.min(minZ, el.position[2]);
    maxZ = Math.max(maxZ, el.position[2]);
  });
  
  minX = Math.min(minX, level.runePosition[0]);
  maxX = Math.max(maxX, level.runePosition[0]);
  minZ = Math.min(minZ, level.runePosition[2]);
  maxZ = Math.max(maxZ, level.runePosition[2]);
  
  // Add padding
  minX -= 1;
  maxX += 1;
  minZ -= 1;
  maxZ += 1;
  
  const width = maxX - minX + 1;
  const height = maxZ - minZ + 1;
  
  console.log(`Grid bounds: X[${minX}, ${maxX}], Z[${minZ}, ${maxZ}]`);
  console.log(`Grid size: ${width}x${height}`);
  
  // Create grid
  const grid: string[][] = [];
  for (let z = minZ; z <= maxZ; z++) {
    const row: string[] = [];
    for (let x = minX; x <= maxX; x++) {
      row.push('·');
    }
    grid.push(row);
  }
  
  // Place elements on grid
  const elementMap = new Map<string, PuzzleElement>();
  level.elements.forEach(el => {
    elementMap.set(el.id, el);
    const gridX = el.position[0] - minX;
    const gridZ = el.position[2] - minZ;
    
    let symbol = '?';
    if (el.type === 'rune') {
      symbol = 'R';
    } else if (el.locked || el.type === 'locked-prism') {
      symbol = '█'; // Locked prism
    } else if (level.chain.includes(el.id)) {
      const chainIndex = level.chain.indexOf(el.id);
      symbol = (chainIndex + 1).toString();
    } else {
      symbol = '○'; // Other prism
    }
    
    // Check for overlap
    if (grid[gridZ][gridX] !== '·') {
      console.log(`⚠️  OVERLAP at [${el.position[0]}, ${el.position[2]}]: ${grid[gridZ][gridX]} and ${symbol}`);
    }
    
    grid[gridZ][gridX] = symbol;
  });
  
  // Place rune
  const runeX = level.runePosition[0] - minX;
  const runeZ = level.runePosition[2] - minZ;
  if (grid[runeZ][runeX] !== '·') {
    console.log(`⚠️  OVERLAP at rune position [${level.runePosition[0]}, ${level.runePosition[2]}]: ${grid[runeZ][runeX]}`);
  }
  grid[runeZ][runeX] = 'R';
  
  // Print grid (inverted Z axis for visual clarity)
  console.log('\nGrid Layout (1-9=chain prisms, █=locked, ○=unused, R=rune):');
  console.log('   ' + Array.from({length: width}, (_, i) => {
    const x = minX + i;
    return x.toString().padStart(2);
  }).join(' '));
  
  for (let z = maxZ; z >= minZ; z--) {
    const gridZ = z - minZ;
    const rowLabel = z.toString().padStart(2);
    const rowData = grid[gridZ].map(cell => cell.padStart(2)).join(' ');
    console.log(`${rowLabel} ${rowData}`);
  }
  
  // Chain path visualization
  console.log(`\nChain Path: ${level.chain.join(' → ')} → rune`);
  
  // Calculate distances and angles
  console.log('\n--- CHAIN CONNECTIONS ---');
  for (let i = 0; i < level.chain.length; i++) {
    const prismId = level.chain[i];
    const prism = elementMap.get(prismId);
    if (!prism) continue;
    
    // Determine target
    let targetId: string;
    let targetPos: [number, number, number];
    
    if (i < level.chain.length - 1) {
      targetId = level.chain[i + 1];
      const targetPrism = elementMap.get(targetId);
      if (!targetPrism) continue;
      targetPos = targetPrism.position;
    } else {
      targetId = 'rune';
      targetPos = level.runePosition;
    }
    
    const dx = targetPos[0] - prism.position[0];
    const dz = targetPos[2] - prism.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz) * (180 / Math.PI);
    const normalizedAngle = ((angle % 360) + 360) % 360;
    
    // Get closest 45° angle
    const closest45 = Math.round(normalizedAngle / 45) * 45;
    const angleError = Math.abs(normalizedAngle - closest45);
    
    console.log(`${prismId} → ${targetId}:`);
    console.log(`  Vector: [${dx}, ${dz}]`);
    console.log(`  Distance: ${distance.toFixed(2)} units`);
    console.log(`  Exact angle: ${normalizedAngle.toFixed(1)}°`);
    console.log(`  Closest 45°: ${closest45}°`);
    
    if (angleError > 5) {
      console.log(`  ⚠️  Angle error: ${angleError.toFixed(1)}° from nearest 45° increment`);
    } else {
      console.log(`  ✓ Angle snaps well to 45° grid`);
    }
    
    // Check for reasonable distance
    if (distance < 1.5) {
      console.log(`  ⚠️  Very close together (${distance.toFixed(2)} units)`);
    } else if (distance > 5) {
      console.log(`  ⚠️  Very far apart (${distance.toFixed(2)} units)`);
    }
  }
  
  // Check for isolated elements
  console.log('\n--- ELEMENT CONNECTIVITY ---');
  const usedElements = new Set(level.chain);
  usedElements.add('rune1'); // Rune is always used
  
  const unusedPrisms = level.elements.filter(
    el => el.type === 'prism' && !el.locked && !usedElements.has(el.id)
  );
  
  if (unusedPrisms.length > 0) {
    console.log(`⚠️  ${unusedPrisms.length} unused unlocked prism(s):`);
    unusedPrisms.forEach(p => {
      console.log(`  ${p.id} at [${p.position.join(', ')}]`);
    });
  } else {
    console.log('✓ All unlocked prisms are used in the chain');
  }
  
  const lockedCount = level.elements.filter(el => el.locked || el.type === 'locked-prism').length;
  console.log(`Locked obstacles: ${lockedCount}`);
  
  // Check spacing - warn if elements too close
  console.log('\n--- SPACING ANALYSIS ---');
  const positions: Array<{id: string, pos: [number, number, number]}> = [];
  level.elements.forEach(el => positions.push({id: el.id, pos: el.position}));
  positions.push({id: 'rune', pos: level.runePosition});
  
  let tooCloseCount = 0;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[j].pos[0] - positions[i].pos[0];
      const dz = positions[j].pos[2] - positions[i].pos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist < 0.5) {
        console.log(`⚠️  CRITICAL: ${positions[i].id} and ${positions[j].id} overlap! (distance: ${dist.toFixed(2)})`);
        tooCloseCount++;
      } else if (dist < 1.0) {
        console.log(`⚠️  ${positions[i].id} and ${positions[j].id} very close (distance: ${dist.toFixed(2)})`);
        tooCloseCount++;
      }
    }
  }
  
  if (tooCloseCount === 0) {
    console.log('✓ All elements have good spacing');
  }
}

// Run grid audit for all levels
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║         WATER PUZZLE - GRID LAYOUT AUDIT                  ║');
console.log('╚════════════════════════════════════════════════════════════╝');

LEVELS.forEach(level => {
  createGrid(level);
});

console.log('\n\n╔════════════════════════════════════════════════════════════╗');
console.log('║                    AUDIT COMPLETE                          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');
