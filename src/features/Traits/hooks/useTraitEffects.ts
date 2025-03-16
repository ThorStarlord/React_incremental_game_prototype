import { useContext, useEffect } from 'react';
import { useGameState } from '../../../context/GameStateExports';
import { calculateTraitEffect } from '../utils/traitUtils';
import { TraitEffect } from '../../../context/types/TraitsGameStateTypes';
import { PlayerState } from '../../../context/types/PlayerGameStateTypes';

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
 * 
 * @returns Object containing trait-related utility functions
 */
const useTraitEffects = (): UseTraitEffectsResult => {
  const { player, traits } = useGameState();
  
  useEffect(() => {
    /**
     * Applies trait effects from equipped traits
     * @returns Object containing all active trait effects
     */
    const applyEffects = (): TraitEffects => {
      const traitEffects: TraitEffects = {};
      
      if (player?.equippedTraits) {
        player.equippedTraits.forEach((traitId: string) => {
          // Convert string to TraitId using createTraitId from TraitsGameStateTypes
          const trait = traits?.copyableTraits?.[traitId as any]; // Using type assertion to fix indexing
          if (trait?.effects) {
            Object.entries(trait.effects).forEach(([key, effectValue]) => {
              if (!traitEffects[key]) traitEffects[key] = 0;
              
              // Extract magnitude from TraitEffect object or use the number directly
              let magnitude: number;
              if (typeof effectValue === 'object' && 'magnitude' in effectValue) {
                // It's a TraitEffect object, extract the magnitude
                magnitude = effectValue.magnitude;
              } else if (typeof effectValue === 'number') {
                // It's already a number
                magnitude = effectValue;
              } else {
                // Skip if we can't determine the value
                return;
              }
              
              // Fix: Call calculateTraitEffect with both required parameters
              // 1.0 is used as a base value, and magnitude as the modifier
              traitEffects[key] += calculateTraitEffect(1.0, magnitude);
            });
          }
        });
      }
      
      return traitEffects;
    };
    
    applyEffects();
  }, [player?.equippedTraits, traits, player]);
  
  /**
   * Calculate the effect of traits on a base value
   * 
   * @param type - The effect type to calculate
   * @param baseValue - The base value before trait modifications
   * @returns The value after applying trait effects
   */
  const calculateEffect = (type: string, baseValue: number): number => {
    // Implementation here - placeholder for now
    // Full implementation would use the current trait effects to modify the base value
    return baseValue; // Replace with actual calculation
  };
  
  return {
    calculateEffect
  };
};

export default useTraitEffects;
