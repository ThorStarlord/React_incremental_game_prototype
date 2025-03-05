import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Interface for the game state
 */
interface GameState {
  essence: EssenceState;
  player: PlayerState;
  [key: string]: any;
}

/**
 * Interface for essence state
 */
interface EssenceState {
  amount: number;
  lifetimeEarned?: number;
  lifetimeSpent?: number;
  sourceStats?: Record<string, number>;
}

/**
 * Interface for player state
 */
interface PlayerState {
  equippedTraits?: string[];
  [key: string]: any;
}

/**
 * Payload for essence actions
 */
interface EssencePayload {
  amount: number;
  source?: string;
  reason?: string;
}

/**
 * Essence Reducer - Manages the game's primary resource
 */
export const essenceReducer = (state: GameState, action: { type: string; payload: EssencePayload }): GameState => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_ESSENCE: {
      const { amount, source } = action.payload;
      
      // Apply trait multipliers
      const traits = state.player.equippedTraits || [];
      let multiplier = 1;
      
      if (traits.includes?.('EssenceAffinity')) multiplier += 0.2;
      if (traits.includes?.('SpiritualConnection')) multiplier += 0.3;
      
      const modifiedAmount = Math.round(amount * multiplier);
      
      // Only show notification for significant gains
      let newState = state;
      if (modifiedAmount >= 10) {
        newState = addNotification(state, {
          message: `Gained ${modifiedAmount} essence${source ? ` from ${source}` : ''}`,
          type: "info"
        });
      }
      
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
        return addNotification(state, {
          message: `Not enough essence to ${reason || 'perform this action'}`,
          type: 'error',
          duration: 3000
        });
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
