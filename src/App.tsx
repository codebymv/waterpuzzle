import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { UnderwaterEnvironment } from './components/UnderwaterEnvironment';
import { PuzzleElementComponent, ConnectionLines, ObstacleComponent } from './components/PuzzleElements';
import { GameUI } from './components/UI';
import { useGameStore } from './store/gameStore';
import { LEVELS } from './data/levels';

function Scene() {
  const elementsState = useGameStore(state => state.elementsState);
  const currentLevel = useGameStore(state => state.currentLevel);
  const level = LEVELS.find(l => l.id === currentLevel);

  return (
    <>
      <UnderwaterEnvironment />
      
      {elementsState.map(element => (
        <PuzzleElementComponent key={element.id} element={element} />
      ))}
      
      {level?.obstacles?.map(obstacle => (
        <ObstacleComponent key={obstacle.id} obstacle={obstacle} />
      ))}
      
      <ConnectionLines />
    </>
  );
}

function App() {
  const { loadLevel } = useGameStore();

  useEffect(() => {
    loadLevel(1);
  }, [loadLevel]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a1628' }}>
      <Canvas
        orthographic
        camera={{
          position: [0, 15, 0],
          zoom: 50,
          up: [0, 0, -1],
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Scene />
      </Canvas>
      
      <GameUI />
    </div>
  );
}

export default App;
