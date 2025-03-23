import { ESSENCE_ACTIONS } from '../types/actions/essenceActionTypes';
import { GameState } from '../types/gameStates/GameStateTypes';
import { 
  EssenceState, 
  EssencePayload 
} from '../types/gameStates/EssenceGameStateTypes';
import { 
  createNotification, 
  addNotification, 
  NotificationType,
  GameStateWithNotifications,
  Notification
} from '../utils/notificationUtils';

/**
 * Essence Reducer - Manages the game's primary resource
 */
export const essenceReducer = (
  state: GameState, 
  action: { type: string; payload: EssencePayload }
): GameState => {
  switch (action.type) {
    case ESSENCE_ACTIONS.GAIN_ESSENCE: {
      const { amount, source } = action.payload;
      
      // Apply trait multipliers
      const traits = state.player.equippedTraits || [];
      const multiplier = 1 + 
        (traits && traits.includes('EssenceAffinity') ? 0.2 : 0) + 
        (traits && traits.includes('SpiritualConnection') ? 0.3 : 0);
      
      const modifiedAmount = Math.round(amount * multiplier);
      
      // Create new essence state with updated values
      const updatedEssence: EssenceState = {
        ...state.essence,
        amount: state.essence.amount + modifiedAmount,
        totalCollected: state.essence.totalCollected + modifiedAmount,
      };
      
      // Create the updated state with new essence values
      const updatedState = {
        ...state,
        essence: updatedEssence,
        // Ensure notifications property exists
        notifications: state.notifications || []
      };
      
      // Only show notification for significant gains
      if (modifiedAmount >= 10) {
        // First cast to GameStateWithNotifications, then back to GameState
        const notificationState = updatedState as unknown as GameStateWithNotifications;
        const resultState = addNotification(notificationState, {
          message: `Gained ${modifiedAmount} essence${source ? ` from ${source}` : ''}`,
          type: 'info'
        });
        return resultState as unknown as GameState;
      }
      
      return updatedState;
    }
    
    case ESSENCE_ACTIONS.SPEND_ESSENCE: {
      const { amount, reason } = action.payload;
      
      if (state.essence.amount < amount) {
        const stateWithNotifications = {
          ...state,
          notifications: state.notifications || []
        } as unknown as GameStateWithNotifications;
        
        const notification = createNotification(
          `Not enough essence to ${reason || 'perform this action'}`,
          'error',
          3000
        );
        return addNotification(stateWithNotifications, notification) as unknown as GameState;
      }
      
      return {
        ...state,
        essence: {
          ...state.essence,
          amount: state.essence.amount - amount
        }
      };
    }
    
    default:
      return state;
  }
};
