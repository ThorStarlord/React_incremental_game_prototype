import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { ExtendedGameState } from '../../types/gameStates/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing passive resource generation
 */
export const useResourceSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const resourceInterval = setInterval(() => {
      // Generate passive resources based on player stats/buildings/etc
      const passiveGold = gameState.player.goldPerMinute || 0;
      if (passiveGold > 0) {
        dispatch({
          type: ACTION_TYPES.GAIN_GOLD,
          payload: { amount: passiveGold }
        });
      }
      
      // Additional resource generation logic can be added here
    }, 60000); // Run every minute
    
    return () => clearInterval(resourceInterval);
  }, [dispatch, gameState.player]);
};
