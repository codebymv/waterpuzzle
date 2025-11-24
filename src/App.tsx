import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { UnderwaterEnvironment } from './components/UnderwaterEnvironment';
import { PuzzleElementComponent } from './components/PuzzleElements';
import { LightBeams } from './components/LightBeams';
import { GameUI } from './components/UI';
import { MainMenu } from './components/Menu';
import { useGameStore } from './store/gameStore';

function Scene() {
  const elementsState = useGameStore(state => state.elementsState);

  return (
    <>
      <UnderwaterEnvironment />
      
      {elementsState.map(element => (
        <PuzzleElementComponent key={element.id} element={element} />
      ))}
      
      <LightBeams />
      
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />
    </>
  );
}

function App() {
  const { loadLevel, loadProgress, triggerCompletion } = useGameStore();

  useEffect(() => {
    loadProgress();
    loadLevel(1);
  }, [loadLevel, loadProgress]);

  // Debug: Press 'C' to complete level (for testing)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        triggerCompletion();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [triggerCompletion]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a1628' }}>
      <Canvas
        camera={{
          position: [8, 6, 8],
          fov: 60
        }}
        shadows
      >
        <Scene />
      </Canvas>
      
      <GameUI />
      <MainMenu />
      
      {/* Title screen overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '40px',
        background: 'linear-gradient(180deg, rgba(10,22,40,0.9) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 50
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #4dd8e8, #2b7a9e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          textShadow: '0 0 30px rgba(77, 216, 232, 0.5)'
        }}>
          ⚱️ Sunken Ruins ⚱️
        </h1>
        <p style={{
          margin: '10px 0 0 0',
          fontSize: '14px',
          color: '#7b8ba8',
          textAlign: 'center',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Ancient Underwater Puzzles
        </p>
      </div>
    </div>
  );
}

export default App;
