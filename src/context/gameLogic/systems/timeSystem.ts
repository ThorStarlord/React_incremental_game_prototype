import { useEffect } from 'react';
import { ACTION_TYPES } from '../../types/ActionTypes';
import { createNotification } from '../utils/notificationHelpers';
import { ExtendedGameState } from '../../types/gameLoopStateTypes';
import { GameAction } from '../../GameDispatchContext';

/**
 * Hook for managing game time progression and time-based events
 */
export const useTimeSystem = (
  gameState: ExtendedGameState,
  dispatch: React.Dispatch<GameAction>
) => {
  useEffect(() => {
    const timeInterval = setInterval(() => {
      // Advance game time
      dispatch({ 
        type: ACTION_TYPES.ADVANCE_TIME,
        payload: {} 
      });
      
      // Check for time-based events
      const { day, period } = gameState.gameTime || { day: 1, period: 'DAY' };
      if (period === 'NIGHT') {
        dispatch({
          type: ACTION_TYPES.ADD_NOTIFICATION,
          payload: createNotification(
            `Day ${day} has ended. It's now night time.`,
            'info',
            3000
          )
        });
      }
    }, 300000); // Run every 5 minutes
    
    return () => clearInterval(timeInterval);
  }, [dispatch, gameState.gameTime]);
};
