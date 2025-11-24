import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { LEVELS, CHAMBER_REQUIREMENTS } from '../data/levels';
import './Menu.css';

export function MainMenu() {
  const [showMenu, setShowMenu] = useState(true);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const { loadLevel, progress } = useGameStore();

  if (!showMenu && !showLevelSelect) return null;

  const handleStartGame = () => {
    setShowMenu(false);
    setShowLevelSelect(false);
  };

  const handleLevelSelect = () => {
    setShowMenu(false);
    setShowLevelSelect(true);
  };

  const handleBack = () => {
    setShowLevelSelect(false);
    setShowMenu(true);
  };

  const selectLevel = (levelId: number) => {
    loadLevel(levelId);
    setShowLevelSelect(false);
  };

  const getJewelEmoji = (rating: string) => {
    switch(rating) {
      case 'gold': return '💎💎💎';
      case 'silver': return '💎💎';
      case 'bronze': return '💎';
      default: return '○○○';
    }
  };

  // Group levels by chamber
  const chambers = LEVELS.reduce((acc, level) => {
    if (!acc[level.chamber]) acc[level.chamber] = [];
    acc[level.chamber].push(level);
    return acc;
  }, {} as Record<number, typeof LEVELS>);

  return (
    <div className="menu-overlay">
      {showMenu && (
        <div className="menu-content">
          <div className="menu-header">
            <h1>⚱️ Sunken Ruins ⚱️</h1>
            <p className="subtitle">Ancient Underwater Puzzles</p>
            <p className="description">
              Explore submerged temples, solve spatial puzzles, and unlock ancient chambers.
              Guide light through crystal prisms to activate mysterious runes.
            </p>
          </div>

          <div className="menu-stats">
            <div className="stat-box">
              <div className="stat-value">{progress.totalJewels}</div>
              <div className="stat-label">Total Jewels</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{progress.totalScore}</div>
              <div className="stat-label">Total Score</div>
            </div>
          </div>

          <div className="menu-buttons">
            <button className="menu-btn primary" onClick={handleStartGame}>
              Continue Adventure
            </button>
            <button className="menu-btn secondary" onClick={handleLevelSelect}>
              Select Level
            </button>
          </div>

          <div className="menu-footer">
            <p>Controls: Click to interact • Drag to rotate camera • Scroll to zoom</p>
          </div>
        </div>
      )}

      {showLevelSelect && (
        <div className="level-select-content">
          <div className="level-select-header">
            <button className="back-button" onClick={handleBack}>← Back</button>
            <h2>Select Chamber</h2>
          </div>

          <div className="chambers">
            {Object.entries(chambers).map(([chamberNum, levels]) => {
              const chamberNumber = parseInt(chamberNum);
              const requiredJewels = CHAMBER_REQUIREMENTS[chamberNumber] || 0;
              const isUnlocked = progress.totalJewels >= requiredJewels;

              return (
                <div key={chamberNum} className={`chamber ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="chamber-header">
                    <h3>Chamber {chamberNum}</h3>
                    {!isUnlocked && (
                      <span className="lock-badge">🔒 {requiredJewels} jewels required</span>
                    )}
                  </div>

                  <div className="levels-grid">
                    {levels.map(level => {
                      const levelProgress = progress.levelsProgress[level.id];
                      const jewel = levelProgress?.jewel || 'none';

                      return (
                        <button
                          key={level.id}
                          className={`level-card ${!isUnlocked ? 'locked' : ''} ${levelProgress?.completed ? 'completed' : ''}`}
                          onClick={() => isUnlocked && selectLevel(level.id)}
                          disabled={!isUnlocked}
                        >
                          <div className="level-number">{level.id}</div>
                          <div className="level-name">{level.name}</div>
                          <div className="level-jewels">{getJewelEmoji(jewel)}</div>
                          {levelProgress?.completed && (
                            <div className="level-moves">Best: {levelProgress.bestMoves} moves</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
