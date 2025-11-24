import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../data/levels';
import './UI.css';

export function GameUI() {
  const {
    currentLevel,
    movesRemaining,
    jewelsCollectedThisLevel,
    levelComplete,
    levelFailed,
    score,
    undoMove,
    restartLevel,
    nextLevel,
    history
  } = useGameStore();

  const level = LEVELS.find(l => l.id === currentLevel);
  
  if (!level) return null;

  return (
    <>
      <HUD
        levelName={level.name}
        movesRemaining={movesRemaining}
        jewelsCollectedThisLevel={jewelsCollectedThisLevel}
        canUndo={history.length > 0}
        onUndo={undoMove}
        onRestart={restartLevel}
      />
      
      {levelComplete && (
        <LevelCompleteModal
          level={level}
          movesUsed={level.maxMoves - movesRemaining}
          score={score}
          onNext={nextLevel}
          onRestart={restartLevel}
        />
      )}
      
      {levelFailed && (
        <LevelFailedModal
          onRestart={restartLevel}
        />
      )}
    </>
  );
}

interface HUDProps {
  levelName: string;
  movesRemaining: number;
  jewelsCollectedThisLevel: number;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
}

function HUD({ levelName, movesRemaining, jewelsCollectedThisLevel, canUndo, onUndo, onRestart }: HUDProps) {
  return (
    <div className="hud">
      <div className="hud-top">
        <div className="level-info">
          <h2>{levelName}</h2>
        </div>
        
        <div className="moves-counter">
          <div className="moves-label">Moves</div>
          <div className="moves-value">{movesRemaining}</div>
        </div>
        
        {jewelsCollectedThisLevel > 0 && (
          <div className="jewels-collected">
            <span className="jewel-icon">💎</span>
            <span className="jewel-count">+{jewelsCollectedThisLevel}</span>
          </div>
        )}
      </div>
      
      <div className="hud-bottom">
        <div className="demo-hint">
          💡 Green arrow = rotate right • Red arrow = rotate left • Orange arrows = move blocks • Demo: Press 'C'
        </div>
        
        <div className="hud-buttons-row">
          <button
            className="hud-button"
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↶ Undo
          </button>
          
          <button
            className="hud-button restart"
            onClick={onRestart}
          >
            ⟲ Restart
          </button>
        </div>
      </div>
    </div>
  );
}

interface LevelCompleteModalProps {
  level: any;
  movesUsed: number;
  score: number;
  onNext: () => void;
  onRestart: () => void;
}

function LevelCompleteModal({ level, movesUsed, score, onNext, onRestart }: LevelCompleteModalProps) {
  const { calculateJewelRating } = useGameStore();
  const jewel = calculateJewelRating(movesUsed);
  
  const getJewelEmoji = (rating: string) => {
    switch(rating) {
      case 'gold': return '💎💎💎';
      case 'silver': return '💎💎';
      case 'bronze': return '💎';
      default: return '';
    }
  };

  const getJewelLabel = (rating: string) => {
    switch(rating) {
      case 'gold': return 'Gold Jewel - Perfect!';
      case 'silver': return 'Silver Jewel - Efficient!';
      case 'bronze': return 'Bronze Jewel - Complete!';
      default: return '';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal level-complete">
        <h2>🌊 Chamber Unlocked! 🌊</h2>
        
        <div className="jewel-display">
          <div className="jewel-earned">{getJewelEmoji(jewel)}</div>
          <div className="jewel-label">{getJewelLabel(jewel)}</div>
        </div>
        
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Moves Used:</span>
            <span className="stat-value">{movesUsed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Par:</span>
            <span className="stat-value">{level.parMoves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Expert:</span>
            <span className="stat-value">{level.expertMoves}</span>
          </div>
          <div className="stat highlight">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="modal-button primary" onClick={onNext}>
            Next Level →
          </button>
          <button className="modal-button secondary" onClick={onRestart}>
            Retry for Better Jewel
          </button>
        </div>
      </div>
    </div>
  );
}

interface LevelFailedModalProps {
  onRestart: () => void;
}

function LevelFailedModal({ onRestart }: LevelFailedModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal level-failed">
        <h2>Out of Moves</h2>
        <p>The ancient mechanism remains sealed...</p>
        <p className="hint">Try a different approach to unlock the chamber.</p>
        
        <div className="modal-actions">
          <button className="modal-button primary" onClick={onRestart}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
