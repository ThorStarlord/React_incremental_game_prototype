import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Essence Reducer
 * 
 * Purpose: Manages the game's primary resource - essence
 * - Handles gaining essence from various game activities
 * - Handles spending essence for upgrades, abilities, etc.
 * - Tracks lifetime essence statistics for achievements
 * - Applies trait modifiers to essence gains
 * 
 * Essence serves as the core progression currency in the game,
 * allowing players to advance their character and unlock new features.
 * This reducer ensures proper tracking of this critical resource.
 * 
 * Actions:
 * - GAIN_ESSENCE: Increases player's essence by specified amount
 * - SPEND_ESSENCE: Decreases player's essence if sufficient funds
 */
export const essenceReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_ESSENCE: {
      const { amount, source } = action.payload;
      
      // Apply traits that affect essence gain
      const equippedTraitIds = Object.values(state.player.equippedTraits || {});
      let multiplier = 1;
      if (equippedTraitIds.includes('EssenceAffinity')) {
        multiplier += 0.2; // 20% bonus
      }
      if (equippedTraitIds.includes('SpiritualConnection')) {
        multiplier += 0.3; // 30% bonus
      }
      
      const modifiedAmount = Math.round(amount * multiplier);
      
      // Only show notification for significant gains
      let newState = state;
      if (modifiedAmount >= 10) {
        newState = addNotification(state, {
          message: `Gained ${modifiedAmount} essence${source ? ` from ${source}` : ''}`,
          type: "info"
        });
      }
      
      // Update both current amount and lifetime statistics
      return {
        ...newState,
        essence: {
          ...state.essence,
          amount: state.essence.amount + modifiedAmount,
          // Track lifetime essence for achievements
          lifetimeEarned: (state.essence.lifetimeEarned || 0) + modifiedAmount,
          // Track sources for analytics
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
          // Track spending stats
          lifetimeSpent: (state.essence.lifetimeSpent || 0) + amount
        }
      };
    }
    
    default:
      return state;
  }
};