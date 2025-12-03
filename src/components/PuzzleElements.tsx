import React from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { PuzzleElement, Level } from '../types/game';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

interface PuzzleElementProps {
  element: PuzzleElement;
}

export function PuzzleElementComponent({ element }: PuzzleElementProps) {
  if (element.type === 'prism') {
    return <CrystalPrism element={element} />;
  }
  return null;
}

// Light Source - emits the beam
export function LightSource({ level }: { level: Level }) {
  if (!level.lightSource) return null;
  
  const { position, direction } = level.lightSource;
  const angleRad = (direction * Math.PI) / 180;
  
  return (
    <group position={position}>
      {/* Emitter base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
        <meshStandardMaterial
          color="#ffba08"
          emissive="#ffba08"
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Glowing orb */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#fffbe6"
          emissive="#ffba08"
          emissiveIntensity={2}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Direction indicator arrow */}
      <mesh 
        position={[Math.sin(angleRad) * 0.6, 0, Math.cos(angleRad) * 0.6]}
        rotation={[Math.PI / 2, 0, -angleRad]}
      >
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial
          color="#ffba08"
          emissive="#ffba08"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// Target Crystal - goal for the beam
export function TargetCrystal({ level }: { level: Level }) {
  const levelComplete = useGameStore(state => state.levelComplete);
  
  if (!level.target) return null;
  
  const { position } = level.target;
  const pulseRef = React.useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const scale = levelComplete 
        ? 1.3 + Math.sin(clock.elapsedTime * 4) * 0.2
        : 1.0 + Math.sin(clock.elapsedTime * 2) * 0.08;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.25, 6]} />
        <meshStandardMaterial color="#2a3a5c" />
      </mesh>
      
      {/* Crystal */}
      <mesh ref={pulseRef} castShadow>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={levelComplete ? '#06ffa5' : '#7b2cbf'}
          emissive={levelComplete ? '#06ffa5' : '#7b2cbf'}
          emissiveIntensity={levelComplete ? 2 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Ring around crystal */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.06, 8, 32]} />
        <meshStandardMaterial
          color={levelComplete ? '#06ffa5' : '#4a5568'}
          emissive={levelComplete ? '#06ffa5' : '#7b2cbf'}
          emissiveIntensity={levelComplete ? 1.5 : 0.3}
        />
      </mesh>
    </group>
  );
}

// Helper: Ray to point intersection distance
function rayToPointDistance(
  rayOrigin: [number, number, number],
  rayDir: [number, number, number],
  point: [number, number, number],
  radius: number
): number | null {
  const ox = rayOrigin[0], oz = rayOrigin[2];
  const dx = rayDir[0], dz = rayDir[2];
  const px = point[0], pz = point[2];
  
  const fx = px - ox;
  const fz = pz - oz;
  
  const dot = fx * dx + fz * dz;
  
  if (dot < 0) return null;
  
  const closestX = ox + dx * dot;
  const closestZ = oz + dz * dot;
  
  const distSq = (closestX - px) ** 2 + (closestZ - pz) ** 2;
  
  if (distSq <= radius * radius) {
    return dot;
  }
  
  return null;
}

// Helper: Normalize angle to 0-360
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

// Light Beam - traces path from source through prisms to target
export function LightBeam({ level }: { level: Level }) {
  const elementsState = useGameStore(state => state.elementsState);
  const setBeamReachesTarget = useGameStore(state => state.setBeamReachesTarget);
  
  if (!level.lightSource) return null;
  
  // Trace the beam path
  const beamPath = React.useMemo(() => {
    const path: Array<{ 
      from: [number, number, number], 
      to: [number, number, number],
      hitsTarget: boolean 
    }> = [];
    
    const source = level.lightSource;
    if (!source) return path;
    
    let currentPos: [number, number, number] = [...source.position];
    let currentDirection = source.direction;
    const maxBounces = 20;
    const visited = new Set<string>();
    
    for (let i = 0; i < maxBounces; i++) {
      const angleRad = (currentDirection * Math.PI) / 180;
      const dirX = Math.sin(angleRad);
      const dirZ = Math.cos(angleRad);
      
      let closestHit: { 
        type: 'prism' | 'target' | 'miss',
        element?: PuzzleElement,
        position: [number, number, number],
        distance: number
      } | null = null;
      
      // Check target
      if (level.target) {
        const targetDist = rayToPointDistance(
          currentPos, [dirX, 0, dirZ], 
          level.target.position, 0.5
        );
        if (targetDist !== null && targetDist > 0.1) {
          closestHit = {
            type: 'target',
            position: level.target.position,
            distance: targetDist
          };
        }
      }
      
      // Check prisms
      for (const element of elementsState) {
        if (element.type !== 'prism') continue;
        
        const dist = rayToPointDistance(
          currentPos, [dirX, 0, dirZ],
          element.position, 0.4
        );
        
        if (dist !== null && dist > 0.1) {
          if (!closestHit || dist < closestHit.distance) {
            closestHit = {
              type: 'prism',
              element,
              position: element.position,
              distance: dist
            };
          }
        }
      }
      
      if (!closestHit || closestHit.distance > 10) {
        const endX = currentPos[0] + dirX * 3;
        const endZ = currentPos[2] + dirZ * 3;
        path.push({
          from: [...currentPos],
          to: [endX, currentPos[1], endZ],
          hitsTarget: false
        });
        break;
      }
      
      path.push({
        from: [...currentPos],
        to: [...closestHit.position],
        hitsTarget: closestHit.type === 'target'
      });
      
      if (closestHit.type === 'target') {
        break;
      }
      
      if (closestHit.type === 'prism' && closestHit.element) {
        const visitKey = closestHit.element.id + '-' + currentDirection;
        if (visited.has(visitKey)) break;
        visited.add(visitKey);
        
        const prism = closestHit.element;
        const prismRotation = prism.rotation || 0;
        
        const receiveDirection = (prismRotation + 180) % 360;
        const incomingDirection = (currentDirection + 180) % 360;
        
        const angleDiff = Math.abs(normalizeAngle(receiveDirection) - normalizeAngle(incomingDirection));
        const canReceive = angleDiff < 45 || angleDiff > 315;
        
        if (canReceive) {
          currentPos = [...closestHit.position];
          currentDirection = prismRotation;
        } else {
          break;
        }
      }
    }
    
    return path;
  }, [level, elementsState]);
  
  // Check if beam reaches target
  const beamReachesTarget = beamPath.some(segment => segment.hitsTarget);
  
  // Update game state based on beam
  React.useEffect(() => {
    if (setBeamReachesTarget) {
      setBeamReachesTarget(beamReachesTarget);
    }
  }, [beamReachesTarget, setBeamReachesTarget]);
  
  return (
    <>
      {beamPath.map((segment, index) => (
        <BeamSegment 
          key={index}
          from={segment.from}
          to={segment.to}
          isConnected={segment.hitsTarget || index < beamPath.length - 1}
          index={index}
        />
      ))}
    </>
  );
}

// Individual beam segment with glow effect
function BeamSegment({ 
  from, to, isConnected, index 
}: { 
  from: [number, number, number], 
  to: [number, number, number],
  isConnected: boolean,
  index: number
}) {
  const materialRef = React.useRef<THREE.LineBasicMaterial>(null);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      const pulse = 0.7 + Math.sin(clock.elapsedTime * 3 + index * 0.5) * 0.3;
      materialRef.current.opacity = pulse;
    }
  });
  
  const points = React.useMemo(() => {
    return new Float32Array([
      from[0], from[1], from[2],
      to[0], to[1], to[2]
    ]);
  }, [from, to]);
  
  return (
    <group>
      {/* Main beam line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={materialRef}
          color={isConnected ? '#06ffa5' : '#ffba08'}
          linewidth={2}
          transparent
          opacity={0.8}
        />
      </line>
      
      {/* Glow effect */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array(points)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isConnected ? '#06ffa5' : '#ffba08'}
          linewidth={6}
          transparent
          opacity={0.2}
        />
      </line>
    </group>
  );
}

// Legacy compatibility
export function ConnectionLines() {
  return null;
}

export function ObstacleComponent() {
  return null;
}

// Crystal Prism - simple rotatable element
function CrystalPrism({ element }: PuzzleElementProps) {
  const makeMove = useGameStore(state => state.makeMove);
  const levelComplete = useGameStore(state => state.levelComplete);
  const movesRemaining = useGameStore(state => state.movesRemaining);
  
  const currentRotation = useGameStore(state => 
    state.elementsState.find(e => e.id === element.id)?.rotation || 0
  );

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (element.locked) return;
    if (!levelComplete && movesRemaining > 0) {
      const direction = (e.button === 2 || e.nativeEvent.shiftKey) ? -1 : 1;
      makeMove(element.id, 'rotate', { direction });
    }
  };
  
  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.nativeEvent.preventDefault();
  };

  // Smooth rotation animation
  const groupRef = React.useRef<THREE.Group>(null);
  const targetRotation = React.useRef(currentRotation);
  const animatedRotation = React.useRef(currentRotation);
  
  React.useEffect(() => {
    targetRotation.current = currentRotation;
  }, [currentRotation]);
  
  useFrame(() => {
    if (groupRef.current && Math.abs(targetRotation.current - animatedRotation.current) > 0.1) {
      animatedRotation.current += (targetRotation.current - animatedRotation.current) * 0.25;
      groupRef.current.rotation.y = animatedRotation.current * (Math.PI / 180);
    } else if (groupRef.current) {
      animatedRotation.current = targetRotation.current;
      groupRef.current.rotation.y = targetRotation.current * (Math.PI / 180);
    }
  });

  return (
    <group position={element.position}>
      <group ref={groupRef}>
        {/* Locked indicator */}
        {element.locked && (
          <group position={[0, 0.8, 0]}>
            <mesh>
              <boxGeometry args={[0.2, 0.25, 0.15]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <torusGeometry args={[0.12, 0.04, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        )}
        
        {/* Main prism body */}
        <mesh onPointerDown={handlePointerDown} onContextMenu={handleContextMenu} castShadow>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={element.locked ? '#94a3b8' : '#4a5568'}
            emissive={element.locked ? '#64748b' : '#2d3748'}
            emissiveIntensity={element.locked ? 0.3 : 0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Direction marker - shows which way beam will exit */}
        <mesh position={[0, 0, 0.5]} onPointerDown={handlePointerDown}>
          <boxGeometry args={[0.15, 0.15, 0.2]} />
          <meshStandardMaterial
            color={element.locked ? '#cbd5e1' : '#ffba08'}
            emissive={element.locked ? '#94a3b8' : '#ffba08'}
            emissiveIntensity={element.locked ? 0.3 : 0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
