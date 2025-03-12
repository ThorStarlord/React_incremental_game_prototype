import { ACTION_TYPES } from '../actions/actionTypes';
import { GameState } from '../types/GameStateTypes';
import { 
  EssenceState, 
  EssencePayload 
} from '../types/EssenceGameStateTypes';
import { 
  createNotification, 
  addNotification, 
  NotificationType 
} from '../utils/notificationUtils';

/**
 * Essence Reducer - Manages the game's primary resource
 */
export const essenceReducer = (
  state: GameState, 
  action: { type: string; payload: EssencePayload }
): GameState => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_ESSENCE: {
      const { amount, source } = action.payload;
      
      // Apply trait multipliers
      const traits = state.player.equippedTraits || [];
      const multiplier = 1 + 
        (traits.includes?.('EssenceAffinity') ? 0.2 : 0) + 
        (traits.includes?.('SpiritualConnection') ? 0.3 : 0);
      
      const modifiedAmount = Math.round(amount * multiplier);
      
      // Create new essence state with updated values
      const updatedEssence: EssenceState = {
        ...state.essence,
        amount: state.essence.amount + modifiedAmount,
        totalCollected: state.essence.totalCollected + modifiedAmount,
      };
      
      // Only show notification for significant gains
      let newState = state;
      if (modifiedAmount >= 10) {
        const notification = createNotification(
          `Gained ${modifiedAmount} essence${source ? ` from ${source}` : ''}`,
          'info'
        );
        newState = addNotification(state, notification);
      }
      
      return {
        ...newState,
        essence: updatedEssence
      };
    }
    
    case ACTION_TYPES.SPEND_ESSENCE: {
      const { amount, reason } = action.payload;
      
      if (state.essence.amount < amount) {
        const notification = createNotification(
          `Not enough essence to ${reason || 'perform this action'}`,
          'error',
          3000
        );
        return addNotification(state, notification);
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
