import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { createNotification } from '../utils/notificationHelpers';
import { ExtendedGameState } from '../../types/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing random combat encounters
 */
export const useEncounterSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const encounterInterval = setInterval(() => {
      // Skip if player is already in combat
      if (gameState.inCombat) return;
      
      // Calculate encounter chance based on area danger level
      const currentArea = gameState.currentArea || { id: 'unknown', dangerLevel: 0, possibleEnemies: [] };
      const dangerLevel = currentArea.dangerLevel || 0;
      const encounterChance = dangerLevel * 0.05; // 5% per danger level
      
      if (Math.random() < encounterChance) {
        triggerRandomEncounter(currentArea, dispatch);
      }
    }, 120000); // Check for encounters every 2 minutes
    
    return () => clearInterval(encounterInterval);
  }, [dispatch, gameState.inCombat, gameState.currentArea]);
};

/**
 * Trigger a random encounter based on the current area
 */
function triggerRandomEncounter(
  currentArea: { id: string; possibleEnemies: string[] },
  dispatch: React.Dispatch<GameAction>
) {
  const areaEnemies = currentArea.possibleEnemies || [];
  if (areaEnemies.length > 0) {
    const randomEnemyIndex = Math.floor(Math.random() * areaEnemies.length);
    const enemyType = areaEnemies[randomEnemyIndex];
    
    dispatch({
      type: ACTION_TYPES.START_ENCOUNTER,
      payload: {
        enemyType,
        area: currentArea.id
      }
    });
    
    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: createNotification(
        `You've encountered a ${enemyType}!`,
        'warning',
        5000
      )
    });
  }
}
