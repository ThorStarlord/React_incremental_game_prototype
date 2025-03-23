import { PlayerState, StatusEffect } from '../../types/gameStates/PlayerGameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Interface for add status effect payload
 */
interface AddStatusEffectPayload {
  effect: StatusEffect;
}

/**
 * Interface for remove status effect payload
 */
interface RemoveStatusEffectPayload {
  effectId: string;
  reason?: string;
}

/**
 * Helper function to check if a status effect is valid
 */
function isValidStatusEffect(effect: any): effect is StatusEffect {
  return (
    effect &&
    typeof effect === 'object' &&
    typeof effect.id === 'string' &&
    typeof effect.name === 'string' &&
    typeof effect.duration === 'number'
  );
}

/**
 * Helper function to update an existing effect with a new one
 * Handles merging certain properties like stacking effects if needed
 */
function updateStatusEffect(existingEffect: StatusEffect, newEffect: StatusEffect): StatusEffect {
  // Default replacement strategy
  return {
    ...existingEffect,
    ...newEffect,
    // If the new effect has a shorter duration, keep the longer one
    duration: Math.max(existingEffect.duration, newEffect.duration),
    // If both have strength, take the higher value
    strength: Math.max(
      existingEffect.strength ?? 0,
      newEffect.strength ?? 0
    ),
    // Update timestamp
    timestamp: newEffect.timestamp || Date.now()
  };
}

/**
 * Status effects reducer - manages temporary effects on the player
 * 
 * Responsible for:
 * - Adding status effects to the player
 * - Removing status effects
 * - Handling effect stacking and replacement
 * - Validating effect objects
 */
export const statusReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.ADD_STATUS_EFFECT: {
      // Type guard for ADD_STATUS_EFFECT action
      if (!isActionOfType(action, PLAYER_ACTIONS.ADD_STATUS_EFFECT)) {
        return state;
      }
      
      // Extract effect from payload and validate
      const payload = action.payload as AddStatusEffectPayload;
      const newEffect = payload.effect;
      
      if (!isValidStatusEffect(newEffect)) {
        console.error('Invalid status effect object', newEffect);
        return state;
      }
      
      // Initialize activeEffects array if it doesn't exist
      const activeEffects = state.activeEffects || [];
      
      // Check if effect already exists (to replace it)
      const existingEffectIndex = activeEffects.findIndex(
        effect => effect.id === newEffect.id
      );
      
      // Create a new array to avoid mutating the original
      let updatedEffects: StatusEffect[];
      
      if (existingEffectIndex >= 0) {
        // Get existing effect
        const existingEffect = activeEffects[existingEffectIndex];
        
        // Replace existing effect with merged version
        updatedEffects = [
          ...activeEffects.slice(0, existingEffectIndex),
          updateStatusEffect(existingEffect, newEffect),
          ...activeEffects.slice(existingEffectIndex + 1)
        ];
      } else {
        // Add new effect with timestamp if missing
        const timestampedEffect = {
          ...newEffect,
          timestamp: newEffect.timestamp || Date.now()
        };
        
        // Add new effect
        updatedEffects = [...activeEffects, timestampedEffect];
      }
      
      // Enforce maximum effect count (optional, can be configured)
      const MAX_EFFECTS = 10;
      if (updatedEffects.length > MAX_EFFECTS) {
        // Sort by timestamp and remove oldest effects
        updatedEffects.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        updatedEffects = updatedEffects.slice(0, MAX_EFFECTS);
      }
      
      return {
        ...state,
        activeEffects: updatedEffects as StatusEffect[]
      };
    }

    case PLAYER_ACTIONS.REMOVE_STATUS_EFFECT: {
      // Type guard for REMOVE_STATUS_EFFECT action
      if (!isActionOfType(action, PLAYER_ACTIONS.REMOVE_STATUS_EFFECT)) {
        return state;
      }
      
      // Safely extract effect ID from payload
      const payload = action.payload as RemoveStatusEffectPayload;
      const effectId = payload.effectId;
      
      if (!effectId || typeof effectId !== 'string') {
        console.error('Invalid effect ID for removal', payload);
        return state;
      }
      
      // Handle case when activeEffects doesn't exist
      if (!state.activeEffects || state.activeEffects.length === 0) {
        return state;
      }
      
      // Filter out the effect to remove
      const updatedEffects = state.activeEffects.filter(effect => effect.id !== effectId);
      
      // If no effects were removed, return unchanged state
      if (updatedEffects.length === state.activeEffects.length) {
        return state;
      }
      
      return {
        ...state,
        activeEffects: updatedEffects
      };
    }

    default:
      return state;
  }
};
