import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { PuzzleElement, Obstacle } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../data/levels/index';

interface PuzzleElementProps {
  element: PuzzleElement;
}

export function PuzzleElementComponent({ element }: PuzzleElementProps) {
  switch (element.type) {
    case 'prism':
      return <CrystalPrism element={element} />;
    case 'rune':
      return <CentralRune element={element} />;
    default:
      return null;
  }
}

// Obstacles that block line of sight
export function ObstacleComponent({ obstacle }: { obstacle: Obstacle }) {
  const height = obstacle.height || 1.5;
  
  return (
    <group position={obstacle.position}>
      {obstacle.type === 'pillar' && (
        <>
          {/* Main pillar */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.5, height, 8]} />
            <meshStandardMaterial
              color="#2a3a5c"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>
          
          {/* Glowing rings */}
          <mesh position={[0, height / 3, 0]}>
            <torusGeometry args={[0.45, 0.05, 8, 16]} />
            <meshStandardMaterial
              color="#4dd8e8"
              emissive="#4dd8e8"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0, -height / 3, 0]}>
            <torusGeometry args={[0.45, 0.05, 8, 16]} />
            <meshStandardMaterial
              color="#4dd8e8"
              emissive="#4dd8e8"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}
      
      {obstacle.type === 'wall' && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, height, 2]} />
          <meshStandardMaterial
            color="#1a2332"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      )}
      
      {obstacle.type === 'crystal' && (
        <mesh castShadow>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color="#7b2cbf"
            emissive="#7b2cbf"
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

// Connection lines showing spatial relationships
export function ConnectionLines() {
  const currentLevel = useGameStore(state => state.currentLevel);
  const elementsState = useGameStore(state => state.elementsState);
  const level = LEVELS.find(l => l.id === currentLevel);
  
  if (!level || !level.chain) return null;
  
  const rune = elementsState.find(e => e.type === 'rune');
  
  if (!rune) return null;

  // Helper: Check if beam path is blocked by obstacles
  const isPathBlocked = (from: [number, number, number], to: [number, number, number]) => {
    if (!level.obstacles) return false;
    
    for (const obstacle of level.obstacles) {
      const obstaclePos = obstacle.position;
      const obstacleRadius = obstacle.type === 'pillar' ? 0.5 : 
                           obstacle.type === 'wall' ? 1.0 : 0.6;
      
      // Check if line segment from->to intersects with obstacle circle
      const dx = to[0] - from[0];
      const dz = to[2] - from[2];
      const fx = from[0] - obstaclePos[0];
      const fz = from[2] - obstaclePos[2];
      
      const a = dx * dx + dz * dz;
      const b = 2 * (fx * dx + fz * dz);
      const c = (fx * fx + fz * fz) - obstacleRadius * obstacleRadius;
      
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant >= 0) {
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        
        if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
          return true; // Path is blocked
        }
      }
    }
    
    return false;
  };

  // Helper: Check if prism is pointing at target
  const isPointingAt = (prism: any, targetPos: [number, number, number], angleOffset = 0) => {
    const angleToTarget = Math.atan2(
      targetPos[0] - prism.position[0],
      targetPos[2] - prism.position[2]
    ) * (180 / Math.PI);
    
    const normalizedAngle = ((angleToTarget % 360) + 360) % 360;
    const prismAngle = (((prism.rotation || 0) + angleOffset) % 360 + 360) % 360;
    
    const diff = Math.abs(normalizedAngle - prismAngle);
    const angleMatches = diff < 22.5 || diff > 337.5;
    
    // Check if path is blocked by obstacles
    if (angleMatches && isPathBlocked(prism.position, targetPos)) {
      return false;
    }
    
    return angleMatches;
  };

  // Helper: Get beam outputs for a prism based on its type
  const getBeamOutputs = (prism: any, targetPos: [number, number, number]) => {
    const prismType = prism.prismType || 'normal';
    const outputs: Array<{ targetPos: [number, number, number], angleOffset: number, isCorrect: boolean }> = [];

    if (prismType === 'splitter') {
      // Splitters output at ±45°
      outputs.push(
        { targetPos, angleOffset: -45, isCorrect: isPointingAt(prism, targetPos, -45) },
        { targetPos, angleOffset: 0, isCorrect: isPointingAt(prism, targetPos, 0) },
        { targetPos, angleOffset: 45, isCorrect: isPointingAt(prism, targetPos, 45) }
      );
    } else if (prismType === 'mirror') {
      // Mirrors bend 90°
      outputs.push({ targetPos, angleOffset: 90, isCorrect: isPointingAt(prism, targetPos, 90) });
    } else {
      // Normal prism
      outputs.push({ targetPos, angleOffset: 0, isCorrect: isPointingAt(prism, targetPos, 0) });
    }

    return outputs;
  };
  
  return (
    <>
      {level.chain.map((prismId, index) => {
        const currentPrism = elementsState.find(el => el.id === prismId);
        if (!currentPrism) return null;
        
        // Check if all previous prisms in the chain are correctly connected
        let chainValid = true;
        for (let i = 0; i < index; i++) {
          const prevPrism = elementsState.find(el => el.id === level.chain[i]);
          if (!prevPrism) {
            chainValid = false;
            break;
          }
          
          // Determine what the previous prism should point to
          const prevTarget = elementsState.find(el => el.id === level.chain[i + 1]);
          if (!prevTarget) {
            chainValid = false;
            break;
          }
          
          if (!isPointingAt(prevPrism, prevTarget.position)) {
            chainValid = false;
            break;
          }
        }
        
        // If chain is broken before this prism, don't show its line
        if (!chainValid) return null;
        
        // Determine what this prism should point to
        let targetPos: [number, number, number];
        let isLastInChain = false;
        
        if (index < level.chain.length - 1) {
          // Point to next prism
          const nextPrism = elementsState.find(el => el.id === level.chain[index + 1]);
          if (!nextPrism) return null;
          targetPos = nextPrism.position;
        } else {
          // Last prism points to rune
          targetPos = rune.position;
          isLastInChain = true;
        }
        
        // Get all beam outputs for this prism type
        const outputs = getBeamOutputs(currentPrism, targetPos);
        const hasCorrectOutput = outputs.some(out => out.isCorrect);
        
        // Only show lines if prism has at least one correct output
        if (!hasCorrectOutput) return null;
        
        return (
          <group key={`connection-${prismId}`}>
            {outputs.map((output, idx) => {
              if (!output.isCorrect) return null;
              
              // Calculate endpoint based on angle offset for visual beam
              const angleRad = ((currentPrism.rotation || 0) + output.angleOffset) * (Math.PI / 180);
              const distance = Math.sqrt(
                Math.pow(targetPos[0] - currentPrism.position[0], 2) +
                Math.pow(targetPos[2] - currentPrism.position[2], 2)
              );
              
              const endX = currentPrism.position[0] + Math.sin(angleRad) * distance;
              const endZ = currentPrism.position[2] + Math.cos(angleRad) * distance;
              
              return (
                <Line
                  key={`beam-${idx}`}
                  points={[currentPrism.position, [endX, currentPrism.position[1], endZ]]}
                  color='#06ffa5'
                  lineWidth={2}
                  opacity={0.6}
                  transparent
                  dashed={false}
                  dashScale={5}
                />
              );
            })}
          </group>
        );
      })}

      {/* Render secondary chains */}
      {level.secondaryChains?.map((chain, chainIndex) => 
        chain.map((prismId, index) => {
          const currentPrism = elementsState.find(el => el.id === prismId);
          if (!currentPrism) return null;
          
          // Check if all previous prisms in THIS secondary chain are correct
          let chainValid = true;
          for (let i = 0; i < index; i++) {
            const prevPrism = elementsState.find(el => el.id === chain[i]);
            if (!prevPrism) {
              chainValid = false;
              break;
            }
            
            const prevTarget = elementsState.find(el => el.id === chain[i + 1]);
            if (!prevTarget) {
              chainValid = false;
              break;
            }
            
            if (!isPointingAt(prevPrism, prevTarget.position)) {
              chainValid = false;
              break;
            }
          }
          
          if (!chainValid) return null;
          
          // Determine target for this prism
          let targetPos: [number, number, number];
          if (index < chain.length - 1) {
            const nextPrism = elementsState.find(el => el.id === chain[index + 1]);
            if (!nextPrism) return null;
            targetPos = nextPrism.position;
          } else {
            targetPos = rune.position;
          }
          
          const outputs = getBeamOutputs(currentPrism, targetPos);
          const hasCorrectOutput = outputs.some(out => out.isCorrect);
          
          if (!hasCorrectOutput) return null;
          
          return (
            <group key={`secondary-${chainIndex}-${prismId}`}>
              {outputs.map((output, idx) => {
                if (!output.isCorrect) return null;
                
                const angleRad = ((currentPrism.rotation || 0) + output.angleOffset) * (Math.PI / 180);
                const distance = Math.sqrt(
                  Math.pow(targetPos[0] - currentPrism.position[0], 2) +
                  Math.pow(targetPos[2] - currentPrism.position[2], 2)
                );
                
                const endX = currentPrism.position[0] + Math.sin(angleRad) * distance;
                const endZ = currentPrism.position[2] + Math.cos(angleRad) * distance;
                
                // Use different color for secondary chains
                const chainColor = ['#06ffa5', '#00d4ff', '#ff6b9d'][chainIndex % 3];
                
                return (
                  <Line
                    key={`beam-sec-${idx}`}
                    points={[currentPrism.position, [endX, currentPrism.position[1], endZ]]}
                    color={chainColor}
                    lineWidth={2}
                    opacity={0.6}
                    transparent
                    dashed={false}
                    dashScale={5}
                  />
                );
              })}
            </group>
          );
        })
      )}
    </>
  );
}

// Arrow showing which direction the prism is "pointing"
function DirectionArrow({ position, rotation, targetPos, isCorrect }: { 
  position: [number, number, number], 
  rotation: number,
  targetPos: [number, number, number],
  isCorrect: boolean 
}) {
  const arrowLength = 0.8;
  const angleRad = (rotation * Math.PI) / 180;
  
  // Calculate arrow endpoint based on rotation
  const endX = position[0] + Math.sin(angleRad) * arrowLength;
  const endZ = position[2] + Math.cos(angleRad) * arrowLength;
  
  return (
    <Line
      points={[
        position,
        [endX, position[1], endZ]
      ]}
      color={isCorrect ? '#06ffa5' : '#ffba08'}
      lineWidth={3}
      opacity={0.8}
      transparent
    />
  );
}

// Line component using Three.js Line2
function Line({ points, color, lineWidth, opacity, transparent, dashed, dashScale }: {
  points: [number, number, number][];
  color: string;
  lineWidth: number;
  opacity?: number;
  transparent?: boolean;
  dashed?: boolean;
  dashScale?: number;
}) {
  const ref = React.useRef<any>();
  
  React.useEffect(() => {
    if (ref.current) {
      ref.current.computeLineDistances();
    }
  }, [points]);
  
  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        linewidth={lineWidth}
        opacity={opacity}
        transparent={transparent}
        linecap="round"
        linejoin="round"
      />
    </line>
  );
}

// Crystal Prism - simple rotatable element
function CrystalPrism({ element }: PuzzleElementProps) {
  const makeMove = useGameStore(state => state.makeMove);
  const levelComplete = useGameStore(state => state.levelComplete);
  const movesRemaining = useGameStore(state => state.movesRemaining);
  const currentLevel = useGameStore(state => state.currentLevel);
  
  const currentRotation = useGameStore(state => 
    state.elementsState.find(e => e.id === element.id)?.rotation || 0
  );

  // Check if this prism is correctly aligned in the chain
  const level = LEVELS.find(l => l.id === currentLevel);
  const elementsState = useGameStore(state => state.elementsState);
  
  // Check if this is the first prism (starting point)
  const isFirstPrism = level?.chain[0] === element.id || 
                       level?.secondaryChains?.some(chain => chain[0] === element.id);
  
  // Helper to check if prism points at target
  const isPointingAt = (prism: any, targetPos: [number, number, number], angleOffset = 0) => {
    const angleToTarget = Math.atan2(
      targetPos[0] - prism.position[0],
      targetPos[2] - prism.position[2]
    ) * (180 / Math.PI);
    
    const normalizedAngle = ((angleToTarget % 360) + 360) % 360;
    const prismAngle = (((prism.rotation || 0) + angleOffset) % 360 + 360) % 360;
    
    const diff = Math.abs(normalizedAngle - prismAngle);
    return diff < 22.5 || diff > 337.5;
  };
  
  // Helper: Check if beam path is blocked by obstacles
  const isPathBlocked = (from: [number, number, number], to: [number, number, number]) => {
    if (!level?.obstacles) return false;
    
    for (const obstacle of level.obstacles) {
      const obstaclePos = obstacle.position;
      const obstacleRadius = obstacle.type === 'pillar' ? 0.5 : 
                           obstacle.type === 'wall' ? 1.0 : 0.6;
      
      const dx = to[0] - from[0];
      const dz = to[2] - from[2];
      const fx = from[0] - obstaclePos[0];
      const fz = from[2] - obstaclePos[2];
      
      const a = dx * dx + dz * dz;
      const b = 2 * (fx * dx + fz * dz);
      const c = (fx * fx + fz * fz) - obstacleRadius * obstacleRadius;
      
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant >= 0) {
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        
        if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Check if this prism is receiving power (beam has reached it)
  const isPowered = React.useMemo(() => {
    if (!level || !level.chain) return false;
    if (isFirstPrism) return true; // First prism is always powered
    
    // Check primary chain
    const chainIndex = level.chain.indexOf(element.id);
    if (chainIndex > 0) {
      // Check if all previous prisms in chain are correctly aligned
      for (let i = 0; i < chainIndex; i++) {
        const prevPrism = elementsState.find(el => el.id === level.chain[i]);
        if (!prevPrism) return false;
        
        const targetId = level.chain[i + 1];
        const target = elementsState.find(el => el.id === targetId);
        if (!target) return false;
        
        // Check if path is blocked
        if (isPathBlocked(prevPrism.position, target.position)) return false;
        
        const prismType = prevPrism.prismType || 'normal';
        if (prismType === 'splitter') {
          const mainHit = isPointingAt(prevPrism, target.position);
          const leftHit = isPointingAt(prevPrism, target.position, -45);
          const rightHit = isPointingAt(prevPrism, target.position, 45);
          if (!mainHit && !leftHit && !rightHit) return false;
        } else if (prismType === 'mirror') {
          if (!isPointingAt(prevPrism, target.position, 90)) return false;
        } else {
          if (!isPointingAt(prevPrism, target.position)) return false;
        }
      }
      return true;
    }
    
    // Check secondary chains
    if (level.secondaryChains) {
      for (const chain of level.secondaryChains) {
        const secIndex = chain.indexOf(element.id);
        if (secIndex > 0) {
          for (let i = 0; i < secIndex; i++) {
            const prevPrism = elementsState.find(el => el.id === chain[i]);
            if (!prevPrism) return false;
            
            const targetId = chain[i + 1];
            const target = elementsState.find(el => el.id === targetId);
            if (!target) return false;
            
            // Check if path is blocked
            if (isPathBlocked(prevPrism.position, target.position)) return false;
            
            const prismType = prevPrism.prismType || 'normal';
            if (prismType === 'splitter') {
              const mainHit = isPointingAt(prevPrism, target.position);
              const leftHit = isPointingAt(prevPrism, target.position, -45);
              const rightHit = isPointingAt(prevPrism, target.position, 45);
              if (!mainHit && !leftHit && !rightHit) return false;
            } else if (prismType === 'mirror') {
              if (!isPointingAt(prevPrism, target.position, 90)) return false;
            } else {
              if (!isPointingAt(prevPrism, target.position)) return false;
            }
          }
          return true;
        }
      }
    }
    
    return false;
  }, [level, element.id, elementsState, isFirstPrism]);
  
  const isCorrect = React.useMemo(() => {
    if (!level || !level.chain) return false;
    
    const chainIndex = level.chain.indexOf(element.id);
    if (chainIndex === -1) return false;
    
    // Determine target
    let targetPos: [number, number, number];
    if (chainIndex < level.chain.length - 1) {
      const nextPrism = elementsState.find(el => el.id === level.chain[chainIndex + 1]);
      if (!nextPrism) return false;
      targetPos = nextPrism.position;
    } else {
      targetPos = level.runePosition;
    }
    
    // Check alignment
    const angleToTarget = Math.atan2(
      targetPos[0] - element.position[0],
      targetPos[2] - element.position[2]
    ) * (180 / Math.PI);
    
    const normalizedAngle = ((angleToTarget % 360) + 360) % 360;
    const prismAngle = ((currentRotation % 360) + 360) % 360;
    
    const diff = Math.abs(normalizedAngle - prismAngle);
    return diff < 22.5 || diff > 337.5;
  }, [level, element.id, element.position, currentRotation, elementsState]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Don't allow rotation if prism is locked
    if (element.locked) return;
    if (!levelComplete && movesRemaining > 0) {
      makeMove(element.id, 'rotate', { direction: 1 });
    }
  };

  const prismType = element.prismType || 'normal';

  return (
    <group 
      position={element.position}
      rotation={[0, currentRotation * (Math.PI / 180), 0]}
    >
      {/* Main prism body - different shapes for different types */}
      {prismType === 'splitter' && (
        <>
          {/* Y-shaped splitter */}
          <mesh onClick={handleClick} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 3]} />
            <meshStandardMaterial
              color={element.locked ? '#94a3b8' : (isPowered ? (isCorrect ? '#06ffa5' : '#ffba08') : '#4a5568')}
              emissive={element.locked ? '#64748b' : (isPowered ? (isCorrect ? '#06ffa5' : '#ffba08') : '#2d3748')}
              emissiveIntensity={element.locked ? 0.3 : (isPowered ? (isCorrect ? 0.8 : 0.4) : 0.1)}
              transparent
              opacity={isPowered ? 0.85 : 0.4}
            />
          </mesh>
          {/* Three output markers */}
          <mesh position={[0, 0, 0.5]} onClick={handleClick}>
            <boxGeometry args={[0.12, 0.12, 0.15]} />
            <meshStandardMaterial color="#ffba08" emissive="#ffba08" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.35, 0, 0.35]} rotation={[0, -Math.PI/4, 0]} onClick={handleClick}>
            <boxGeometry args={[0.12, 0.12, 0.15]} />
            <meshStandardMaterial color="#ffba08" emissive="#ffba08" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.35, 0, 0.35]} rotation={[0, Math.PI/4, 0]} onClick={handleClick}>
            <boxGeometry args={[0.12, 0.12, 0.15]} />
            <meshStandardMaterial color="#ffba08" emissive="#ffba08" emissiveIntensity={0.8} />
          </mesh>
        </>
      )}

      {prismType === 'mirror' && (
        <>
          {/* L-shaped mirror */}
          <mesh onClick={handleClick} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial
              color={isPowered ? (isCorrect ? '#06ffa5' : '#7b2cbf') : '#4a5568'}
              emissive={isPowered ? (isCorrect ? '#06ffa5' : '#7b2cbf') : '#2d3748'}
              emissiveIntensity={isPowered ? (isCorrect ? 0.8 : 0.4) : 0.1}
              transparent
              opacity={isPowered ? 0.85 : 0.4}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Bent marker showing 90° redirect */}
          <mesh position={[0, 0, 0.3]} onClick={handleClick}>
            <torusGeometry args={[0.25, 0.08, 8, 6, Math.PI / 2]} />
            <meshStandardMaterial color="#7b2cbf" emissive="#7b2cbf" emissiveIntensity={0.8} />
          </mesh>
        </>
      )}

      {prismType === 'amplifier' && (
        <>
          {/* Diamond-shaped amplifier */}
          <mesh onClick={handleClick} castShadow>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color={isPowered ? (isCorrect ? '#06ffa5' : '#ff006e') : '#4a5568'}
              emissive={isPowered ? (isCorrect ? '#06ffa5' : '#ff006e') : '#2d3748'}
              emissiveIntensity={isPowered ? (isCorrect ? 0.9 : 0.5) : 0.1}
              transparent
              opacity={isPowered ? 0.85 : 0.4}
            />
          </mesh>
          {/* Pulsing ring */}
          <mesh position={[0, 0, 0]} onClick={handleClick}>
            <torusGeometry args={[0.5, 0.08, 8, 16]} />
            <meshStandardMaterial color="#ff006e" emissive="#ff006e" emissiveIntensity={0.8} />
          </mesh>
        </>
      )}

      {prismType === 'normal' && (
        <>
          <mesh onClick={handleClick} castShadow>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color={element.locked ? '#94a3b8' : (isPowered ? (isCorrect ? '#06ffa5' : '#4dd8e8') : '#4a5568')}
              emissive={element.locked ? '#64748b' : (isPowered ? (isCorrect ? '#06ffa5' : '#4dd8e8') : '#2d3748')}
              emissiveIntensity={element.locked ? 0.3 : (isPowered ? (isCorrect ? 0.6 : 0.2) : 0.1)}
              transparent
              opacity={isPowered ? 0.8 : 0.4}
            />
          </mesh>
          
          {/* Direction marker - shows which way the prism is "facing" */}
          <mesh position={[0, 0, 0.5]} onClick={handleClick}>
            <boxGeometry args={[0.15, 0.15, 0.2]} />
            <meshStandardMaterial
              color={element.locked ? '#cbd5e1' : (isPowered ? (isCorrect ? '#06ffa5' : '#ffba08') : '#4a5568')}
              emissive={element.locked ? '#94a3b8' : (isPowered ? (isCorrect ? '#06ffa5' : '#ffba08') : '#2d3748')}
              emissiveIntensity={element.locked ? 0.3 : (isPowered ? 0.8 : 0.1)}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// Central Rune - goal (visual indicator)
function CentralRune({ element }: PuzzleElementProps) {
  const levelComplete = useGameStore(state => state.levelComplete);

  return (
    <group position={element.position}>
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 8]} />
        <meshStandardMaterial color="#2a3a5c" />
      </mesh>
      
      {/* Rune symbol */}
      <mesh>
        <torusGeometry args={[0.5, 0.15, 8, 6]} />
        <meshStandardMaterial
          color={levelComplete ? '#06ffa5' : '#7b2cbf'}
          emissive={levelComplete ? '#06ffa5' : '#7b2cbf'}
          emissiveIntensity={levelComplete ? 1 : 0.5}
        />
      </mesh>
    </group>
  );
}
