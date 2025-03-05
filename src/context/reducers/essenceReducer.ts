import { ACTION_TYPES } from '../actions/actionTypes';
import { GameState } from './types';
import { withNotification } from './utils';

// Simplified essence payload type
interface EssencePayload {
  amount: number;
  source?: string;
  reason?: string;
}

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
      
      // Only show notification for significant gains
      const newState = modifiedAmount >= 10 ? 
        withNotification(state, `Gained ${modifiedAmount} essence${source ? ` from ${source}` : ''}`, "info") : 
        state;
      
      // Update both current amount and statistics
      return {
        ...newState,
        essence: {
          ...state.essence,
          amount: state.essence.amount + modifiedAmount,
          lifetimeEarned: (state.essence.lifetimeEarned || 0) + modifiedAmount,
          sourceStats: {
            ...(state.essence.sourceStats || {}),
            [source || 'unknown']: ((state.essence.sourceStats || {})[source || 'unknown'] || 0) + modifiedAmount
          }
        }
      };
    }
    
    case ACTION_TYPES.SPEND_ESSENCE: {
      const { amount, reason } = action.payload;
      
      if (state.essence.amount < amount) {
        return withNotification(
          state, 
          `Not enough essence to ${reason || 'perform this action'}`,
          'error',
          3000
        );
      }
      
      return {
        ...state,
        essence: {
          ...state.essence,
          amount: state.essence.amount - amount,
          lifetimeSpent: (state.essence.lifetimeSpent || 0) + amount
        }
      };
    }
    
    default:
      return state;
  }
};
