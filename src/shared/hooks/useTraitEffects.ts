import { useCallback, useMemo } from 'react';
import { useGameState, useGameDispatch } from '../../context/GameStateExports';
import { calculateTraitEffect } from '../../features/Traits/utils/traitUtils';
import { TraitEffect, ExtendedTrait, createTraitId } from '../../context/types/gameStates/TraitsGameStateTypes';

/**
 * Interface for trait effects calculated from equipped traits
 */
export interface TraitEffects {
  [effectType: string]: number;
}

/**
 * Interface for the return value of the useTraitEffects hook
 */
interface UseTraitEffectsResult {
  /**
   * Calculates the effect on a base value based on trait modifiers
   * @param type - The effect type to apply
   * @param baseValue - The base value to modify
   * @returns The modified value after applying trait effects
   */
  calculateEffect: (type: string, baseValue: number) => number;
}

/**
 * Custom hook for applying and managing trait effects
 */
const useTraitEffects = (): UseTraitEffectsResult => {
  const gameState = useGameState();
  const dispatch = useGameDispatch();
  
  // Access traits safely from the game state
  const traits = gameState.traits?.copyableTraits || {};
  const equippedTraits = gameState.player?.equippedTraits || [];
  
  // Filter active traits correctly - no need to check isActive as it doesn't exist on ExtendedTrait
  const activeTraits = useMemo(() => {
    // Get trait objects for equipped trait IDs
    return equippedTraits
      .map(traitId => {
        // Convert string to TraitId using createTraitId
        const typedTraitId = createTraitId(traitId);
        return traits[typedTraitId];
      })
      .filter(trait => !!trait); // Only filter out undefined/null traits
  }, [traits, equippedTraits]);

  /**
   * Apply trait effects from equipped traits
   */
  const applyEffects = useCallback((): TraitEffects => {
    const traitEffects: TraitEffects = {};
    
    // Use type assertion to work with the traits
    activeTraits.forEach((trait) => {
      if (trait?.effects) {
        // Handle both array and record types for effects
        const effectEntries = Array.isArray(trait.effects)
          ? trait.effects.map(effect => [effect.type, effect.magnitude])
          : Object.entries(trait.effects);
          
        effectEntries.forEach(([key, value]) => {
          if (!traitEffects[key]) traitEffects[key] = 0;
          
          // Extract magnitude from the value which could be a number or an object
          let magnitude: number = 0; // Initialize with a default value
          
          // Check if value is null before trying to access properties
          if (value !== null && value !== undefined) {
            if (typeof value === 'object' && value && 'magnitude' in value) {
              // It's a TraitEffect object with magnitude property
              // Use type assertion to tell TypeScript this is safe
              magnitude = (value as { magnitude: number }).magnitude;
            } else if (typeof value === 'number') {
              // It's already a number
              magnitude = value;
            } else {
              // Skip if we can't determine the value
              return;
            }
            
            // Call calculateTraitEffect with both required parameters
            traitEffects[key] += calculateTraitEffect(1.0, magnitude);
          }
        });
      }
    });
    
    return traitEffects;
  }, [activeTraits]);
  
  const calculateEffect = useCallback((type: string, baseValue: number): number => {
    const effects = applyEffects();
    const effectValue = effects[type] || 0;
    
    // Apply the effect to the base value
    return baseValue * (1 + effectValue);
  }, [applyEffects]);
  
  return {
    calculateEffect
  };
};

export default useTraitEffects;
