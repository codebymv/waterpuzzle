import { useRef, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { PuzzleElement } from '../types/game';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

interface PuzzleElementProps {
  element: PuzzleElement;
}

export function PuzzleElementComponent({ element }: PuzzleElementProps) {
  switch (element.type) {
    case 'prism':
      return <CrystalPrism element={element} />;
    case 'block':
      return <StoneBlock element={element} />;
    case 'plate':
      return <PressurePlate element={element} />;
    case 'jewel':
      return <AncientJewel element={element} />;
    case 'rune':
      return <CentralRune element={element} />;
    default:
      return null;
  }
}

// Crystal Prism - rotatable light refractor
function CrystalPrism({ element }: PuzzleElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetRotationRef = useRef((element.rotation || 0) * (Math.PI / 180));
  const makeMove = useGameStore(state => state.makeMove);
  const levelComplete = useGameStore(state => state.levelComplete);
  const levelFailed = useGameStore(state => state.levelFailed);
  const movesRemaining = useGameStore(state => state.movesRemaining);
  
  // Get current rotation from store only for THIS specific element
  const currentRotation = useGameStore(state => 
    state.elementsState.find(e => e.id === element.id)?.rotation || 0
  );
  
  // Update target only when THIS element's rotation actually changes
  useEffect(() => {
    targetRotationRef.current = currentRotation * (Math.PI / 180);
  }, [currentRotation]);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation animation
      const diff = targetRotationRef.current - meshRef.current.rotation.y;
      if (Math.abs(diff) > 0.001) {
        meshRef.current.rotation.y += diff * 0.15; // Smooth interpolation
      }
      
      // Gentle floating animation
      meshRef.current.position.y = element.position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!levelComplete && !levelFailed && movesRemaining > 0) {
      const worldPos = meshRef.current?.position;
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔷 PRISM BODY CLICKED (default clockwise):', element.id);
      console.log('   Store Position:', element.position);
      console.log('   World Position:', worldPos ? [worldPos.x, worldPos.y, worldPos.z] : 'N/A');
      console.log('   Click Point:', [e.point.x.toFixed(2), e.point.y.toFixed(2), e.point.z.toFixed(2)]);
      console.log('   Current Rotation:', currentRotation + '°');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      makeMove(element.id, 'rotate', { direction: 1 });
    }
  };

  return (
    <group position={element.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <octahedronGeometry args={[0.4, 0]} />
        <meshPhysicalMaterial
          color={hovered ? '#00ffff' : '#4dd8e8'}
          transparent
          opacity={hovered ? 0.95 : 0.8}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={1}
          emissive={hovered ? '#00ffff' : '#4dd8e8'}
          emissiveIntensity={hovered ? 0.8 : 0.2}
        />
        {hovered && (
          <>
            <mesh scale={1.3} raycast={() => null}>
              <octahedronGeometry args={[0.4, 0]} />
              <meshBasicMaterial
                color="#00ffff"
                transparent
                opacity={0.4}
                wireframe
              />
            </mesh>
            <pointLight position={[0, 0, 0]} intensity={1} color="#00ffff" distance={2} />
          </>
        )}
      </mesh>
    
      
      {/* Rotation arrows - shown on hover */}
      {hovered && !levelComplete && !levelFailed && movesRemaining > 0 && (
        <>
          {/* Clockwise rotation arrow (+45°) */}
          <group position={[0.7, 0, 0]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🔄 CLOCKWISE ARROW CLICKED');
              console.log('   Prism:', element.id);
              console.log('   Current:', currentRotation + '°');
              console.log('   New:', ((currentRotation + 45) % 360) + '°');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              makeMove(element.id, 'rotate', { direction: 1 });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <torusGeometry args={[0.25, 0.05, 8, 16, Math.PI * 1.2]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.9} />
          </mesh>
          {/* Arrow tip */}
          <mesh 
            position={[0, 0.2, 0.12]} 
            rotation={[0, Math.PI / 4, 0]}
            onClick={(e) => {
              e.stopPropagation();
              makeMove(element.id, 'rotate', { direction: 1 });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
          >
            <coneGeometry args={[0.08, 0.15, 3]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        </group>
        
        {/* Counter-clockwise rotation arrow (-45°) */}
        <group position={[-0.7, 0, 0]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🔄 COUNTER-CLOCKWISE ARROW CLICKED');
              console.log('   Prism:', element.id);
              console.log('   Current:', currentRotation + '°');
              console.log('   New:', ((currentRotation - 45 + 360) % 360) + '°');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              makeMove(element.id, 'rotate', { direction: -1 });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
            rotation={[0, 0, Math.PI / 2]}
          >
            <torusGeometry args={[0.25, 0.05, 8, 16, Math.PI * 1.2]} />
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.9} />
          </mesh>
          {/* Arrow tip */}
          <mesh 
            position={[0, -0.2, 0.12]} 
            rotation={[0, -Math.PI / 4, 0]}
            onClick={(e) => {
              e.stopPropagation();
              makeMove(element.id, 'rotate', { direction: -1 });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
          >
            <coneGeometry args={[0.08, 0.15, 3]} />
            <meshBasicMaterial color="#ff6b6b" />
          </mesh>
        </group>
        </>
      )}
    </group>
  );
}

// Stone Block - movable obstacle
function StoneBlock({ element }: PuzzleElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetPosRef = useRef<[number, number, number]>(element.position);
  const makeMove = useGameStore(state => state.makeMove);
  const levelComplete = useGameStore(state => state.levelComplete);
  const levelFailed = useGameStore(state => state.levelFailed);
  const movesRemaining = useGameStore(state => state.movesRemaining);
  
  // Get current position from store only for THIS specific block
  const currentPosition = useGameStore(state => 
    state.elementsState.find(e => e.id === element.id)?.position || element.position
  );
  
  // Check if this block is blocking any light beam
  const lightBeams = useGameStore(state => state.lightBeams);
  const isBlockingLight = lightBeams.some(beam => 
    beam.blocked && 
    Math.abs(beam.end[0] - currentPosition[0]) < 0.5 &&
    Math.abs(beam.end[2] - currentPosition[2]) < 0.5
  );
  
  // Update target only when THIS block's position actually changes
  useEffect(() => {
    targetPosRef.current = currentPosition;
  }, [currentPosition[0], currentPosition[1], currentPosition[2]]);
  
  useFrame(() => {
    if (meshRef.current) {
      // Smooth position interpolation
      const targetPos = targetPosRef.current;
      const dx = targetPos[0] - meshRef.current.position.x;
      const dy = targetPos[1] - meshRef.current.position.y;
      const dz = targetPos[2] - meshRef.current.position.z;
      
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001 || Math.abs(dz) > 0.001) {
        meshRef.current.position.x += dx * 0.15;
        meshRef.current.position.y += dy * 0.15;
        meshRef.current.position.z += dz * 0.15;
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!levelComplete && !levelFailed && movesRemaining > 0) {
      const worldPos = meshRef.current?.position;
      const clickPoint = e.point;
      const blockPos = currentPosition;
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🗿 BLOCK CLICKED:', element.id);
      console.log('   Store Position:', currentPosition);
      console.log('   World Position:', worldPos ? [worldPos.x, worldPos.y, worldPos.z] : 'N/A');
      console.log('   Click Point:', [clickPoint.x.toFixed(2), clickPoint.y.toFixed(2), clickPoint.z.toFixed(2)]);
      
      // Simple directional logic based on click point relative to block center
      const dx = clickPoint.x - blockPos[0];
      const dz = clickPoint.z - blockPos[2];
      
      // Determine primary direction
      let direction: [number, number, number];
      if (Math.abs(dx) > Math.abs(dz)) {
        // Move in X direction
        direction = dx > 0 ? [1, 0, 0] : [-1, 0, 0];
      } else {
        // Move in Z direction
        direction = dz > 0 ? [0, 0, 1] : [0, 0, -1];
      }
      
      const dirName = direction[0] !== 0 ? (direction[0] > 0 ? 'RIGHT' : 'LEFT') : (direction[2] > 0 ? 'FORWARD' : 'BACK');
      console.log('   Direction:', dirName, direction);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      makeMove(element.id, 'move', { direction });
    }
  };

  return (
    <group position={element.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#ffaa00' : isBlockingLight ? '#ff6b6b' : '#3d4a68'}
          roughness={0.9}
          metalness={0.1}
          emissive={hovered ? '#ffaa00' : isBlockingLight ? '#ff6b6b' : '#000000'}
          emissiveIntensity={hovered ? 0.6 : isBlockingLight ? 0.3 : 0.1}
        />
        {/* Ancient carvings on the block */}
        <lineSegments raycast={() => null}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.8, 0.8)]} />
          <lineBasicMaterial color={hovered ? '#ffaa00' : isBlockingLight ? '#ff9999' : '#7b8ba8'} linewidth={hovered ? 3 : 1} />
        </lineSegments>
        {hovered && (
          <pointLight position={[0, 0, 0]} intensity={0.8} color="#ffaa00" distance={2} raycast={() => null} />
        )}
      </mesh>
    
    {/* Directional movement arrows - shown on hover */}
    {hovered && !levelComplete && !levelFailed && movesRemaining > 0 && (
      <>
        {/* Right arrow (+X) */}
        <group position={[1.0, 0, 0]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('➡️ ARROW CLICKED: Move +X (RIGHT)');
              console.log('   Block:', element.id);
              console.log('   New Position: [', currentPosition[0] + 1, ',', currentPosition[1], ',', currentPosition[2], ']');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              makeMove(element.id, 'move', { direction: [1, 0, 0] });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.7} />
          </mesh>
        </group>
        
        {/* Left arrow (-X) */}
        <group position={[-1.0, 0, 0]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('⬅️ ARROW CLICKED: Move -X (LEFT)');
              console.log('   Block:', element.id);
              console.log('   New Position: [', currentPosition[0] - 1, ',', currentPosition[1], ',', currentPosition[2], ']');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              makeMove(element.id, 'move', { direction: [-1, 0, 0] });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.7} />
          </mesh>
        </group>
        
        {/* Forward arrow (+Z) */}
        <group position={[0, 0, 1.0]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('⬆️ ARROW CLICKED: Move +Z (FORWARD)');
              console.log('   Block:', element.id);
              console.log('   New Position: [', currentPosition[0], ',', currentPosition[1], ',', currentPosition[2] + 1, ']');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              makeMove(element.id, 'move', { direction: [0, 0, 1] });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          >
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.7} />
          </mesh>
        </group>
        
        {/* Back arrow (-Z) */}
        <group position={[0, 0, -1.0]}>
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('⬇️ ARROW CLICKED: Move -Z (BACK)');
              console.log('   Block:', element.id);
              console.log('   New Position: [', currentPosition[0], ',', currentPosition[1], ',', currentPosition[2] - 1, ']');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
              makeMove(element.id, 'move', { direction: [0, 0, -1] });
            }}
            onPointerOver={(e) => { e.stopPropagation(); }}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
          >
            <coneGeometry args={[0.2, 0.4, 4]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.7} />
          </mesh>
        </group>
      </>
    )}
    </group>
  );
}

// Pressure Plate - restores moves when activated
function PressurePlate({ element }: PuzzleElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const activatePressurePlate = useGameStore(state => state.activatePressurePlate);
  const elementsState = useGameStore(state => state.elementsState);
  const levelComplete = useGameStore(state => state.levelComplete);
  const levelFailed = useGameStore(state => state.levelFailed);
  
  // Get current state from store
  const currentElement = elementsState.find(e => e.id === element.id);
  const isActivated = currentElement?.isActivated || false;

  useFrame((state) => {
    if (meshRef.current && !isActivated) {
      // Pulsing glow when not activated
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  // Check for objects on the plate (simplified - would use raycasting in full implementation)
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isActivated && !levelComplete && !levelFailed) {
      const worldPos = meshRef.current?.position;
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚡ PRESSURE PLATE CLICKED:', element.id);
      console.log('   Store Position:', element.position);
      console.log('   World Position:', worldPos ? [worldPos.x, worldPos.y, worldPos.z] : 'N/A');
      console.log('   Click Point:', [e.point.x.toFixed(2), e.point.y.toFixed(2), e.point.z.toFixed(2)]);
      console.log('   FREE ACTION - No move cost');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      activatePressurePlate(element.id);
    }
  };

  return (
    <group position={element.position}>
      <mesh ref={meshRef} onClick={handleClick} receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <meshStandardMaterial
          color={isActivated ? '#06ffa5' : '#ffba08'}
          roughness={0.4}
          metalness={0.6}
          emissive={isActivated ? '#06ffa5' : '#ffba08'}
          emissiveIntensity={isActivated ? 0.5 : 0.3}
        />
      </mesh>
      {!isActivated && (
        <pointLight
          position={[0, 0.3, 0]}
          intensity={0.5}
          color="#ffba08"
          distance={3}
        />
      )}
      {isActivated && (
        <pointLight
          position={[0, 0.3, 0]}
          intensity={0.8}
          color="#06ffa5"
          distance={3}
        />
      )}
    </group>
  );
}

// Ancient Jewel - collectible that grants bonus moves
function AncientJewel({ element }: PuzzleElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const collectJewel = useGameStore(state => state.collectJewel);
  const elementsState = useGameStore(state => state.elementsState);
  const levelComplete = useGameStore(state => state.levelComplete);
  const levelFailed = useGameStore(state => state.levelFailed);
  
  // Get current state from store
  const currentElement = elementsState.find(e => e.id === element.id);
  const isActivated = currentElement?.isActivated || false;

  useFrame((state) => {
    if (meshRef.current && !isActivated) {
      // Rotate and float
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      meshRef.current.position.y = element.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isActivated && !levelComplete && !levelFailed) {
      const worldPos = meshRef.current?.position;
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💎 JEWEL CLICKED:', element.id);
      console.log('   Store Position:', element.position);
      console.log('   World Position:', worldPos ? [worldPos.x, worldPos.y, worldPos.z] : 'N/A');
      console.log('   Click Point:', [e.point.x.toFixed(2), e.point.y.toFixed(2), e.point.z.toFixed(2)]);
      console.log('   FREE ACTION - Grants +2 moves');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
      collectJewel(element.id);
    }
  };

  if (isActivated) return null; // Hide when collected

  return (
    <group position={element.position}>
      <mesh ref={meshRef} onClick={handleClick}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshPhysicalMaterial
          color="#ffba08"
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.8}
          emissive="#ffba08"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        color="#ffba08"
        distance={2}
      />
    </group>
  );
}

// Central Rune - the goal of each puzzle
function CentralRune({ element }: PuzzleElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const levelComplete = useGameStore(state => state.levelComplete);
  const lightBeams = useGameStore(state => state.lightBeams);
  
  // Check if any light beam is near this rune
  const isLightNearby = lightBeams.some(beam => {
    const dx = beam.end[0] - element.position[0];
    const dy = beam.end[1] - element.position[1];
    const dz = beam.end[2] - element.position[2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return dist < 2.0;
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      if (glowRef.current) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        glowRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  const triggerCompletion = useGameStore(state => state.triggerCompletion);
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!levelComplete) {
      console.log('🌀 Clicking rune to complete level (demo mode)');
      triggerCompletion();
    }
  };

  return (
    <group position={element.position}>
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]} receiveShadow onClick={handleClick} raycast={() => null}>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 8]} />
        <meshStandardMaterial
          color="#2a3a5c"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Rune symbol */}
      <mesh ref={meshRef} onClick={handleClick} raycast={() => null}>
        <torusGeometry args={[0.5, 0.15, 8, 6]} />
        <meshStandardMaterial
          color={levelComplete ? '#06ffa5' : isLightNearby ? '#4dd8e8' : '#7b2cbf'}
          roughness={0.3}
          metalness={0.7}
          emissive={levelComplete ? '#06ffa5' : isLightNearby ? '#4dd8e8' : '#7b2cbf'}
          emissiveIntensity={levelComplete ? 1 : isLightNearby ? 0.8 : 0.5}
        />
      </mesh>
      
      {/* Inner glow - non-interactive */}
      <mesh ref={glowRef} raycast={() => null}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={levelComplete ? '#06ffa5' : '#7b2cbf'}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={levelComplete ? 2 : isLightNearby ? 1.5 : 0.8}
        color={levelComplete ? '#06ffa5' : isLightNearby ? '#4dd8e8' : '#7b2cbf'}
        distance={5}
      />
    </group>
  );
}
