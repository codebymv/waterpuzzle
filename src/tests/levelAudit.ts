import { LEVELS } from '../data/levels';

// Helper to calculate required angle between two points
function calculateAngle(from: [number, number, number], to: [number, number, number]): number {
  const deltaX = to[0] - from[0];
  const deltaZ = to[2] - from[2];
  const angleRad = Math.atan2(deltaX, deltaZ);
  const angleDeg = angleRad * (180 / Math.PI);
  return ((angleDeg % 360) + 360) % 360;
}

// Helper to calculate distance
function calculateDistance(from: [number, number, number], to: [number, number, number]): number {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  return Math.sqrt(dx * dx + dz * dz);
}

// Round to nearest 45° increment
function roundToNearest45(angle: number): number {
  return Math.round(angle / 45) * 45 % 360;
}

console.log('═══════════════════════════════════════════════════');
console.log('   🔍 LEVEL GEOMETRY AUDIT');
console.log('═══════════════════════════════════════════════════\n');

LEVELS.forEach(level => {
  console.log(`\n📍 LEVEL ${level.id}: ${level.name}`);
  console.log('─'.repeat(50));
  
  const prisms = level.elements.filter(el => el.type === 'prism');
  const rune = level.elements.find(el => el.type === 'rune');
  
  if (!rune) {
    console.log('⚠️  WARNING: No rune found!\n');
    return;
  }
  
  // Check primary chain
  console.log('\n🔗 PRIMARY CHAIN:');
  level.chain.forEach((prismId, index) => {
    const prism = prisms.find(p => p.id === prismId);
    if (!prism) {
      console.log(`  ❌ ${prismId}: NOT FOUND`);
      return;
    }
    
    let target;
    let targetName;
    
    if (index < level.chain.length - 1) {
      const nextId = level.chain[index + 1];
      target = prisms.find(p => p.id === nextId);
      targetName = nextId;
    } else {
      target = { position: level.runePosition };
      targetName = 'RUNE';
    }
    
    if (!target) {
      console.log(`  ❌ ${prismId}: Target not found`);
      return;
    }
    
    const requiredAngle = calculateAngle(prism.position, target.position);
    const roundedRequired = roundToNearest45(requiredAngle);
    const solutionAngle = level.solution[prismId] || 0;
    const startAngle = prism.rotation || 0;
    const distance = calculateDistance(prism.position, target.position);
    const prismType = prism.prismType || 'normal';
    
    console.log(`\n  ${prismId} → ${targetName}:`);
    console.log(`    Position: [${prism.position.join(', ')}]`);
    console.log(`    Type: ${prismType}`);
    console.log(`    Start Angle: ${startAngle}°`);
    console.log(`    Solution: ${solutionAngle}°`);
    console.log(`    Required (calculated): ${requiredAngle.toFixed(1)}° (≈${roundedRequired}°)`);
    console.log(`    Distance: ${distance.toFixed(2)} units`);
    
    // Check if solution matches required (with tolerance for splitters/mirrors)
    let angleMatch = false;
    if (prismType === 'splitter') {
      // Splitters can hit at -45, 0, or +45
      const angles = [solutionAngle - 45, solutionAngle, solutionAngle + 45].map(a => ((a % 360) + 360) % 360);
      angleMatch = angles.some(a => Math.abs(a - roundedRequired) < 23 || Math.abs(a - roundedRequired) > 337);
    } else if (prismType === 'mirror') {
      // Mirrors bend 90°
      const mirrorAngle = (solutionAngle + 90) % 360;
      angleMatch = Math.abs(mirrorAngle - roundedRequired) < 23 || Math.abs(mirrorAngle - roundedRequired) > 337;
    } else {
      angleMatch = Math.abs(solutionAngle - roundedRequired) < 23 || Math.abs(solutionAngle - roundedRequired) > 337;
    }
    
    if (angleMatch) {
      console.log(`    ✅ Angle matches!`);
    } else {
      console.log(`    ⚠️  ANGLE MISMATCH! Solution says ${solutionAngle}° but geometry requires ${roundedRequired}°`);
    }
    
    // Calculate optimal moves
    let moveDistance = Math.min(
      Math.abs(solutionAngle - startAngle),
      360 - Math.abs(solutionAngle - startAngle)
    );
    const optimalMoves = Math.round(moveDistance / 45);
    console.log(`    Optimal moves: ${optimalMoves} (${startAngle}° → ${solutionAngle}°)`);
  });
  
  // Check secondary chains
  if (level.secondaryChains && level.secondaryChains.length > 0) {
    level.secondaryChains.forEach((chain, chainIdx) => {
      console.log(`\n🔗 SECONDARY CHAIN ${chainIdx + 1}:`);
      chain.forEach((prismId, index) => {
        const prism = prisms.find(p => p.id === prismId);
        if (!prism) return;
        
        let target;
        let targetName;
        
        if (index < chain.length - 1) {
          const nextId = chain[index + 1];
          target = prisms.find(p => p.id === nextId);
          targetName = nextId;
        } else {
          target = { position: level.runePosition };
          targetName = 'RUNE';
        }
        
        if (!target) return;
        
        const requiredAngle = calculateAngle(prism.position, target.position);
        const roundedRequired = roundToNearest45(requiredAngle);
        const solutionAngle = level.solution[prismId] || 0;
        
        console.log(`  ${prismId} → ${targetName}: Required ${roundedRequired}°, Solution ${solutionAngle}°`);
      });
    });
  }
  
  // Star threshold analysis
  if (level.starThresholds) {
    const totalOptimalMoves = level.chain.reduce((sum, prismId) => {
      const prism = prisms.find(p => p.id === prismId);
      if (!prism) return sum;
      const solutionAngle = level.solution[prismId] || 0;
      const startAngle = prism.rotation || 0;
      let moveDistance = Math.min(
        Math.abs(solutionAngle - startAngle),
        360 - Math.abs(solutionAngle - startAngle)
      );
      return sum + Math.round(moveDistance / 45);
    }, 0);
    
    console.log(`\n⭐ STAR THRESHOLDS:`);
    console.log(`    Calculated optimal: ${totalOptimalMoves} moves`);
    console.log(`    Gold: ${level.starThresholds.gold} moves`);
    console.log(`    Silver: ${level.starThresholds.silver} moves`);
    console.log(`    Bronze: ${level.starThresholds.bronze} moves`);
    console.log(`    Max allowed: ${level.maxMoves} moves`);
    
    if (totalOptimalMoves > level.starThresholds.gold) {
      console.log(`    ⚠️  WARNING: Optimal (${totalOptimalMoves}) > Gold threshold (${level.starThresholds.gold})`);
    }
  }
  
  console.log('\n' + '─'.repeat(50));
});

console.log('\n\n═══════════════════════════════════════════════════');
console.log('   ✅ AUDIT COMPLETE');
console.log('═══════════════════════════════════════════════════\n');
