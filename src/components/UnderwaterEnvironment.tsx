import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function UnderwaterEnvironment() {
  return (
    <>
      <WaterParticles />
      <UnderwaterLighting />
      <CausticsEffect />
      <OceanFloor />
      <CompassIndicators />
    </>
  );
}

// Compass indicators to show world directions
function CompassIndicators() {
  return (
    <group position={[0, -1.4, 0]}>
      {/* +X axis marker (right when looking from default camera) */}
      <mesh position={[8, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.4} />
      </mesh>
      
      {/* -X axis marker (left) */}
      <mesh position={[-8, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshBasicMaterial color="#4ecdc4" transparent opacity={0.4} />
      </mesh>
      
      {/* +Z axis marker (forward) */}
      <mesh position={[0, 0, 8]}>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <meshBasicMaterial color="#95e1d3" transparent opacity={0.4} />
      </mesh>
      
      {/* -Z axis marker (back) */}
      <mesh position={[0, 0, -8]}>
        <boxGeometry args={[0.1, 0.1, 0.3]} />
        <meshBasicMaterial color="#f38181" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Floating particles effect
function WaterParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 1000;

  const [positions, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      scales[i] = Math.random() * 0.5 + 0.1;
    }

    return [positions, scales];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
        positions[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.0005;
        
        // Wrap particles
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;
        if (positions[i * 3 + 1] < -10) positions[i * 3 + 1] = 10;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4dd8e8"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Underwater lighting setup
function UnderwaterLighting() {
  return (
    <>
      {/* Ambient ocean color */}
      <ambientLight intensity={0.3} color="#1e4d6b" />
      
      {/* Sun rays from above */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#4dd8e8"
        castShadow
      />
      
      {/* Secondary light for depth */}
      <directionalLight
        position={[-5, 8, -3]}
        intensity={0.5}
        color="#2b7a9e"
      />
      
      {/* Bioluminescent glow */}
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#7b2cbf" distance={10} />
      <pointLight position={[-4, 1, 4]} intensity={0.6} color="#06ffa5" distance={8} />
      <pointLight position={[4, 1, -4]} intensity={0.6} color="#ffba08" distance={8} />
      
      {/* Fog for underwater atmosphere */}
      <fog attach="fog" args={['#0a1628', 10, 40]} />
    </>
  );
}

// Animated caustics effect
function CausticsEffect() {
  const planeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (planeRef.current) {
      const material = planeRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[50, 50, 32, 32]} />
      <meshBasicMaterial
        color="#4dd8e8"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Ocean floor with ancient stone texture
function OceanFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#1a2332"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Subtle grid for spatial awareness */}
      <gridHelper 
        args={[20, 20, '#2a3a5c', '#1f2d45']} 
        position={[0, -1.45, 0]}
        rotation={[0, 0, 0]}
      />
    </>
  );
}
