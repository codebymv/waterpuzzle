import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../data/levels/index';
import './UI.css';

export function GameUI() {
  const {
    currentLevel,
    movesRemaining,
    movesUsed,
    levelComplete,
    levelFailed,
    starsEarned,
    levelBestScores,
    undoMove,
    restartLevel,
    nextLevel,
    history
  } = useGameStore();

  const level = LEVELS.find(l => l.id === currentLevel);
  const elementsState = useGameStore(state => state.elementsState);
  
  if (!level) return null;

  // Count how many prisms are at correct angles
  const correctCount = Object.entries(level.solution || {}).filter(([prismId, targetAngle]) => {
    const prism = elementsState.find(el => el.id === prismId);
    return prism && (prism.rotation || 0) === targetAngle;
  }).length;
  const totalPrisms = Object.keys(level.solution || {}).length;

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="level-info">
          <h2>Level {level.id}: {level.name}</h2>
          <div className="progress-indicator">
            {correctCount}/{totalPrisms} Correct
          </div>
        </div>
        
        <div className="moves-counter">
          <div className="moves-label">Moves</div>
          <div className="moves-value">{movesRemaining}</div>
        </div>
      </div>
      
      <div className="hud-bottom">
        <div className="hud-hint">
          {level.secondaryChains && level.secondaryChains.length > 0 ? (
            <>🔀 Multi-beam puzzle • Converge {(level.secondaryChains.length + 1)} beams at rune</>
          ) : (
            <>💡 Connect prisms in a chain • Last prism points to rune</>
          )}
        </div>
        
        <div className="hud-buttons">
          <button
            className="hud-button"
            onClick={undoMove}
            disabled={history.length === 0}
          >
            ↶ Undo
          </button>
          
          <button
            className="hud-button"
            onClick={restartLevel}
          >
            ⟲ Restart
          </button>
        </div>
      </div>
      
      {levelComplete && (
        <div className="win-message">
          <div className="win-content">
            <h1>🎉 Puzzle Complete!</h1>
            
            {/* Star Rating Display */}
            <div className="star-rating">
              {[1, 2, 3].map(starNum => (
                <span 
                  key={starNum}
                  className={`star ${starNum <= starsEarned ? 'earned' : 'unearned'}`}
                >
                  {starNum <= starsEarned ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            
            <div className="completion-stats">
              <p>Moves Used: <strong>{movesUsed}</strong></p>
              {level?.starThresholds && (
                <div className="star-thresholds">
                  <div className="threshold">⭐⭐⭐ Gold: ≤ {level.starThresholds.gold} moves</div>
                  <div className="threshold">⭐⭐ Silver: ≤ {level.starThresholds.silver} moves</div>
                  <div className="threshold">⭐ Bronze: ≤ {level.starThresholds.bronze} moves</div>
                </div>
              )}
              {levelBestScores[currentLevel] && (
                <p className="best-score">
                  🏆 Personal Best: {levelBestScores[currentLevel]} moves
                </p>
              )}
            </div>
            
            <div className="win-buttons">
              <button onClick={nextLevel} className="win-button primary">
                Next Level →
              </button>
              <button onClick={restartLevel} className="win-button secondary">
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {levelFailed && (
        <div className="win-message">
          <div className="win-content fail">
            <h1>😅 Out of Moves!</h1>
            <p>Try a different approach</p>
            <button onClick={restartLevel} className="win-button">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
