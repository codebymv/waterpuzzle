import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

export function LightBeams() {
  const lightBeams = useGameStore(state => state.lightBeams);
  
  return (
    <>
      {lightBeams.map(beam => (
        <LightBeam key={beam.id} beam={beam} />
      ))}
    </>
  );
}

interface LightBeamProps {
  beam: {
    id: string;
    start: [number, number, number];
    end: [number, number, number];
    active: boolean;
  };
}

function LightBeam({ beam }: LightBeamProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current && beam.active) {
      // Pulsing glow effect
      const intensity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
    }
  });

  if (!beam.active) return null;

  const points = [
    new THREE.Vector3(...beam.start),
    new THREE.Vector3(...beam.end)
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const midpoint = new THREE.Vector3(
    (beam.start[0] + beam.end[0]) / 2,
    (beam.start[1] + beam.end[1]) / 2,
    (beam.start[2] + beam.end[2]) / 2
  );
  
  const length = Math.sqrt(
    Math.pow(beam.end[0] - beam.start[0], 2) +
    Math.pow(beam.end[1] - beam.start[1], 2) +
    Math.pow(beam.end[2] - beam.start[2], 2)
  );
  
  // Calculate rotation to align cylinder with beam direction
  const direction = new THREE.Vector3(
    beam.end[0] - beam.start[0],
    beam.end[1] - beam.start[1],
    beam.end[2] - beam.start[2]
  ).normalize();
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <group>
      {/* Main beam line using primitive */}
      <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: '#4dd8e8',
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      }))} />

      {/* Glow effect */}
      <mesh 
        ref={glowRef} 
        position={[midpoint.x, midpoint.y, midpoint.z]}
        quaternion={quaternion}
      >
        <cylinderGeometry args={[0.08, 0.08, length, 8, 1]} />
        <meshBasicMaterial
          color="#4dd8e8"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
