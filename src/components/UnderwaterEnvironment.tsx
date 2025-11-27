// Minimal environment - basic lighting and floor only
export function UnderwaterEnvironment() {
  return (
    <>
      {/* Basic ambient lighting */}
      <ambientLight intensity={0.5} />
      
      {/* Single directional light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.0}
        castShadow
      />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a2332" />
      </mesh>
      
      {/* Grid for spatial reference */}
      <gridHelper 
        args={[20, 20, '#2a3a5c', '#1f2d45']} 
        position={[0, -1.45, 0]}
      />
    </>
  );
}
