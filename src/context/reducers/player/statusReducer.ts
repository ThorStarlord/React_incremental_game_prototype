import { PlayerState, StatusEffect } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Status effects reducer - manages temporary effects on the player
 * 
 * Responsible for:
 * - Adding status effects to the player
 * - Removing status effects
 * - Handling effect stacking and replacement
 */
export const statusReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.ADD_STATUS_EFFECT:
      // Type guard for ADD_STATUS_EFFECT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_STATUS_EFFECT)) {
        return state;
      }
      
      // Now TypeScript knows action.payload is a StatusEffect
      const newEffect = action.payload;
      
      // Check if effect already exists (to replace it)
      const existingEffectIndex = state.activeEffects?.findIndex(
        effect => effect.id === newEffect.id
      ) ?? -1;
      const updatedEffects = [...(state.activeEffects || [])];
      
      if (existingEffectIndex >= 0) {
        // Replace existing effect
        updatedEffects[existingEffectIndex] = newEffect;
      } else {
        // Add new effect
        updatedEffects.push(newEffect);
      }
      return {
        ...state,
        activeEffects: updatedEffects
      };

    case PLAYER_ACTIONS.REMOVE_STATUS_EFFECT:
      const effectId = action.payload;
      return {
        ...state,
        activeEffects: state.activeEffects?.filter(effect => effect.id !== effectId) || []
      };

    default:
      return state;
  }
};
