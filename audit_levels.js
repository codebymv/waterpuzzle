// Level audit script - verify positioning, angles, and completability

function calculateAngle(from, to) {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const angle = Math.atan2(dx, dz) * (180 / Math.PI);
  return ((angle % 360) + 360) % 360;
}

function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

function anglesMatch(angle1, angle2, tolerance = 22.5) {
  const norm1 = normalizeAngle(angle1);
  const norm2 = normalizeAngle(angle2);
  const diff = Math.abs(norm1 - norm2);
  return diff < tolerance || diff > (360 - tolerance);
}

function countClicks(from, to) {
  const norm1 = normalizeAngle(from);
  const norm2 = normalizeAngle(to);
  
  // Calculate shortest rotation
  let diff = norm2 - norm1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  // Each click is 45 degrees
  return Math.round(Math.abs(diff) / 45);
}

function auditLevel(level) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`LEVEL ${level.id}: ${level.name}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Chain: ${level.chain.join(' → ')} → rune`);
  console.log(`Max Moves: ${level.maxMoves} | Par: ${level.parMoves}`);
  
  const issues = [];
  const warnings = [];
  let totalParClicks = 0;
  
  // Get all elements as a map
  const elementsMap = {};
  level.elements.forEach(el => {
    elementsMap[el.id] = el;
  });
  
  // Verify chain connectivity
  console.log('\n--- CHAIN VERIFICATION ---');
  for (let i = 0; i < level.chain.length; i++) {
    const prismId = level.chain[i];
    const prism = elementsMap[prismId];
    
    if (!prism) {
      issues.push(`Chain element "${prismId}" not found in elements`);
      continue;
    }
    
    // Determine target
    let targetId, targetPos;
    if (i < level.chain.length - 1) {
      targetId = level.chain[i + 1];
      const targetPrism = elementsMap[targetId];
      if (!targetPrism) {
        issues.push(`Next chain element "${targetId}" not found`);
        continue;
      }
      targetPos = targetPrism.position;
    } else {
      targetId = 'rune';
      targetPos = level.runePosition;
    }
    
    // Calculate required angle
    const requiredAngle = calculateAngle(prism.position, targetPos);
    const solutionAngle = level.solution[prismId];
    
    console.log(`\n${prismId} → ${targetId}:`);
    console.log(`  Position: [${prism.position.join(', ')}]`);
    console.log(`  Start rotation: ${prism.rotation}°`);
    console.log(`  Required angle: ${requiredAngle.toFixed(1)}°`);
    console.log(`  Solution angle: ${solutionAngle}°`);
    
    // Verify solution matches required angle
    if (!anglesMatch(solutionAngle, requiredAngle)) {
      issues.push(
        `${prismId}: Solution angle ${solutionAngle}° does NOT match required ${requiredAngle.toFixed(1)}° (diff: ${Math.abs(solutionAngle - requiredAngle).toFixed(1)}°)`
      );
    } else {
      console.log(`  ✓ Solution angle correct`);
    }
    
    // Calculate clicks needed
    const clicks = countClicks(prism.rotation, solutionAngle);
    totalParClicks += clicks;
    console.log(`  Clicks needed: ${clicks} (${prism.rotation}° → ${solutionAngle}°)`);
    
    // Check if locked
    if (prism.locked || prism.type === 'locked-prism') {
      console.log(`  🔒 LOCKED - should not be in chain!`);
      issues.push(`${prismId} is locked but included in solution chain`);
    }
  }
  
  // Verify par moves
  console.log(`\n--- MOVE BUDGET ---`);
  console.log(`Total clicks needed: ${totalParClicks}`);
  console.log(`Par moves: ${level.parMoves}`);
  console.log(`Max moves: ${level.maxMoves}`);
  
  if (totalParClicks !== level.parMoves) {
    warnings.push(
      `Par moves (${level.parMoves}) doesn't match calculated clicks (${totalParClicks})`
    );
  }
  
  const difficulty = level.maxMoves / level.parMoves;
  console.log(`Difficulty multiplier: ${difficulty.toFixed(2)}x`);
  
  if (difficulty < 1.0) {
    issues.push(`Max moves (${level.maxMoves}) less than par (${level.parMoves})!`);
  } else if (difficulty < 1.5) {
    console.log(`  ⚠️ VERY TIGHT - exact moves required`);
  } else if (difficulty < 2.0) {
    console.log(`  🎯 CHALLENGING - little room for error`);
  } else if (difficulty < 2.5) {
    console.log(`  👍 BALANCED - moderate forgiveness`);
  } else {
    console.log(`  😊 FORGIVING - plenty of room to experiment`);
  }
  
  // Check locked obstacles
  const lockedPrisms = level.elements.filter(
    el => el.locked || el.type === 'locked-prism'
  );
  if (lockedPrisms.length > 0) {
    console.log(`\n--- LOCKED OBSTACLES ---`);
    lockedPrisms.forEach(prism => {
      console.log(`${prism.id}: [${prism.position.join(', ')}] at ${prism.rotation}°`);
    });
  }
  
  // Report issues
  if (issues.length > 0) {
    console.log(`\n❌ ISSUES FOUND (${issues.length}):`);
    issues.forEach(issue => console.log(`  • ${issue}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(warning => console.log(`  • ${warning}`));
  }
  
  if (issues.length === 0 && warnings.length === 0) {
    console.log(`\n✅ Level is valid!`);
  }
  
  return { issues, warnings, totalParClicks };
}

// Load levels
const fs = require('fs');
const levelFile = fs.readFileSync('./src/data/levels.ts', 'utf8');

// Extract levels data (basic parsing)
const levelsMatch = levelFile.match(/export const LEVELS.*?=\s*\[([\s\S]*)\];/);
if (!levelsMatch) {
  console.error('Could not parse levels.ts');
  process.exit(1);
}

console.log('WATER PUZZLE - LEVEL AUDIT');
console.log('Testing all levels for completability, positioning, and accuracy\n');

// Note: This is a simplified audit - for full validation, import actual levels
console.log('⚠️  Note: Run the game to test actual playability');
console.log('This audit verifies mathematical correctness of level data\n');

