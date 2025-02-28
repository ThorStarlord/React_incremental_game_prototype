import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

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
      
      return {
        ...newState,
        essence: state.essence + modifiedAmount
      };
    }
    
    case ACTION_TYPES.SPEND_ESSENCE: {
      const { amount, reason } = action.payload;
      
      if (state.essence < amount) {
        return {
          ...state,
          notifications: [
            ...(state.notifications || []),
            {
              id: Date.now(),
              message: `Not enough essence to ${reason || 'perform this action'}`,
              type: 'error',
              duration: 3000
            }
          ]
        };
      }
      
      return {
        ...state,
        essence: state.essence - amount
      };
    }
    
    default:
      return state;
  }
};