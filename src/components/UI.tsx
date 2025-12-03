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
    history,
    beamReachesTarget
  } = useGameStore();

  const level = LEVELS.find(l => l.id === currentLevel);
  
  if (!level) return null;

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="level-info">
          <h2>Level {level.id}: {level.name}</h2>
          <div className={`progress-indicator ${beamReachesTarget ? 'complete' : ''}`}>
            {beamReachesTarget ? '✓ Beam Connected!' : '○ Route the Light'}
          </div>
        </div>
        
        <div className="moves-counter" title={level.starThresholds ? `⭐⭐⭐ Gold: ≤${level.starThresholds.gold} moves\n⭐⭐ Silver: ≤${level.starThresholds.silver} moves\n⭐ Bronze: ≤${level.starThresholds.bronze} moves` : undefined}>
          <div className="moves-label">Moves</div>
          <div className="moves-value">{movesRemaining}</div>
          {level.starThresholds && (
            <div className="star-hint">⭐ ≤{level.starThresholds.gold}</div>
          )}
        </div>
      </div>
      
      <div className="hud-bottom">
        <div className="hud-hint">
          💡 Click prism to rotate (+ neighbors ripple) • Right-click = counter-clockwise
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
                <>
                  <div className="efficiency-stats">
                    {movesUsed <= level.starThresholds.gold && (
                      <div className="efficiency-message gold">
                        🎯 Optimal Solution! You're a master architect!
                      </div>
                    )}
                    {movesUsed > level.starThresholds.gold && movesUsed <= level.starThresholds.silver && (
                      <div className="efficiency-message silver">
                        💎 Great job! Try for gold with ≤{level.starThresholds.gold} moves
                      </div>
                    )}
                    {movesUsed > level.starThresholds.silver && movesUsed <= level.starThresholds.bronze && (
                      <div className="efficiency-message bronze">
                        ⚡ Nice work! Aim for silver with ≤{level.starThresholds.silver} moves
                      </div>
                    )}
                    {movesUsed > level.starThresholds.bronze && (
                      <div className="efficiency-message">
                        💪 You did it! Try using fewer moves for stars
                      </div>
                    )}
                    <div className="efficiency-bar">
                      <div 
                        className={`efficiency-fill ${starsEarned >= 3 ? 'gold' : starsEarned >= 2 ? 'silver' : 'bronze'}`}
                        style={{ width: `${Math.min(100, (level.starThresholds.gold / movesUsed) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="star-thresholds">
                    <div className="threshold">⭐⭐⭐ Gold: ≤ {level.starThresholds.gold} moves</div>
                    <div className="threshold">⭐⭐ Silver: ≤ {level.starThresholds.silver} moves</div>
                    <div className="threshold">⭐ Bronze: ≤ {level.starThresholds.bronze} moves</div>
                  </div>
                </>
              )}
              {levelBestScores[currentLevel] && (
                <p className="best-score">
                  🏆 Personal Best: {levelBestScores[currentLevel]} moves
                </p>
              )}
            </div>
            
            <div className="win-buttons">
              {starsEarned < 3 ? (
                <>
                  <button onClick={restartLevel} className="win-button primary">
                    ⚡ Retry for Gold
                  </button>
                  <button onClick={nextLevel} className="win-button secondary">
                    Next Level →
                  </button>
                </>
              ) : (
                <>
                  <button onClick={nextLevel} className="win-button primary">
                    Next Level →
                  </button>
                  <button onClick={restartLevel} className="win-button secondary">
                    Play Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {levelFailed && !levelComplete && (
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
