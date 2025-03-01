import React from 'react';
import { usePlayerContext, PLAYER_ACTIONS } from '../../context/PlayerContext';

/**
 * PlayerStats Container Component
 * 
 * @description 
 * A container component that displays and manages player statistics.
 * This component renders the player's vital information including name,
 * level, health, and energy with visual indicators.
 * 
 * @example
 * // Usage (must be within a PlayerProvider)
 * <PlayerStats />
 * 
 * @returns {JSX.Element} A component that displays player stats
 */
const PlayerStats = () => {
  // Get player state from context
  const { state, dispatch } = usePlayerContext();
  const playerStats = state.player;
  
  /**
   * Calculates the percentage for progress bars
   * @param {number} current - Current value
   * @param {number} max - Maximum value
   * @returns {string} Percentage string for CSS width
   */
  const calculatePercentage = (current, max) => `${(current / max) * 100}%`;

  /**
   * Updates the player's health
   * @param {number} amount - Amount to change health by
   */
  const modifyHealth = (amount) => {
    dispatch({
      type: PLAYER_ACTIONS.UPDATE_HEALTH,
      payload: playerStats.health + amount
    });
  };

  /**
   * Updates the player's energy
   * @param {number} amount - Amount to change energy by
   */
  const modifyEnergy = (amount) => {
    dispatch({
      type: PLAYER_ACTIONS.UPDATE_ENERGY,
      payload: playerStats.energy + amount
    });
  };

  return (
    <div className="player-stats-container" data-testid="player-stats-container">
      <h2>Player Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Name:</span>
          <span className="stat-value">{playerStats.name}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Level:</span>
          <span className="stat-value">{playerStats.level}</span>
          <button 
            onClick={() => dispatch({ type: PLAYER_ACTIONS.LEVEL_UP })}
            className="small-button"
          >
            Level Up
          </button>
        </div>
        
        <div className="stat-item full-width">
          <div className="stat-header">
            <span className="stat-label">Health:</span>
            <span className="stat-value">{playerStats.health}/{playerStats.maxHealth}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill health" 
              style={{ width: calculatePercentage(playerStats.health, playerStats.maxHealth) }}
              aria-valuenow={playerStats.health}
              aria-valuemin="0"
              aria-valuemax={playerStats.maxHealth}
            />
          </div>
          <div className="stat-controls">
            <button onClick={() => modifyHealth(-10)}>-10</button>
            <button onClick={() => modifyHealth(10)}>+10</button>
          </div>
        </div>
        
        <div className="stat-item full-width">
          <div className="stat-header">
            <span className="stat-label">Energy:</span>
            <span className="stat-value">{playerStats.energy}/{playerStats.maxEnergy}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill energy" 
              style={{ width: calculatePercentage(playerStats.energy, playerStats.maxEnergy) }}
              aria-valuenow={playerStats.energy}
              aria-valuemin="0"
              aria-valuemax={playerStats.maxEnergy}
            />
          </div>
          <div className="stat-controls">
            <button onClick={() => modifyEnergy(-5)}>-5</button>
            <button onClick={() => modifyEnergy(5)}>+5</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;