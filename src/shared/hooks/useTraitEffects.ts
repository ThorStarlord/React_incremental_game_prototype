import { useCallback, useMemo } from 'react';
import { useGameState, useGameDispatch } from '../../context';

/**
 * Interface for a trait object
 */
interface Trait {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effects: TraitEffect[];
  isActive?: boolean;
  slotId?: string | null;
  [key: string]: any; // Other trait properties
}

/**
 * Interface for a trait effect
 */
interface TraitEffect {
  type: string;
  target: string;
  value: number;
  operation: 'add' | 'multiply' | 'subtract' | 'divide' | 'set';
  condition?: TraitCondition;
}

/**
 * Interface for a trait condition
 */
interface TraitCondition {
  type: string;
  value?: any;
  compare?: string;
  [key: string]: any;
}

/**
 * Interface for hook return value
 */
interface UseTraitEffectsReturn {
  calculateTraitEffectValue: (statName: string, baseValue: number) => number;
  hasTraitEffect: (effectType: string) => boolean;
  getActiveTraitsWithEffect: (effectType: string) => Trait[];
  getTraitEffectSummary: (statName: string) => TraitEffectSummary;
  checkTraitTriggers: (triggerType: string, contextData?: any) => void;
}

/**
 * Interface for trait effect summary
 */
interface TraitEffectSummary {
  baseValue: number;
  finalValue: number;
  totalBonus: number;
  percentage: number;
  effects: {
    traitId: string;
    traitName: string;
    value: number;
    operation: string;
    impact: number;
  }[];
}

/**
 * Hook to manage trait effects and calculations
 * 
 * @returns {UseTraitEffectsReturn} Functions to interact with trait effects
 */
const useTraitEffects = (): UseTraitEffectsReturn => {
  const { traits = [], character = {}, gameState = {} } = useGameState();
  const dispatch = useGameDispatch();

  /**
   * Get all active traits from the game state
   */
  const activeTraits = useMemo(() => {
    return Array.isArray(traits) 
      ? traits.filter(trait => trait.isActive === true)
      : [];
  }, [traits]);

  /**
   * Calculate a stat value after applying all trait effects
   * 
   * @param {string} statName - The name of the stat to calculate
   * @param {number} baseValue - The base value before traits
   * @returns {number} The final value after all trait effects
   */
  const calculateTraitEffectValue = useCallback((statName: string, baseValue: number): number => {
    if (!activeTraits.length) return baseValue;
    
    let finalValue = baseValue;
    const addOperations: number[] = [];
    const multiplyOperations: number[] = [];
    
    // First pass - collect all operations
    activeTraits.forEach(trait => {
      if (!trait.effects) return;
      
      trait.effects.forEach((effect: TraitEffect) => {
        if (effect.target !== statName) return;
        
        // Check conditions if they exist
        if (effect.condition) {
          const condition = effect.condition;
          
          // Skip if condition is not met
          if (!evaluateTraitCondition(condition)) {
            return;
          }
        }
        
        if (effect.operation === 'add' || effect.operation === 'subtract') {
          const value = effect.operation === 'subtract' ? -effect.value : effect.value;
          addOperations.push(value);
        } else if (effect.operation === 'multiply') {
          multiplyOperations.push(effect.value);
        } else if (effect.operation === 'divide') {
          multiplyOperations.push(1 / effect.value);
        } else if (effect.operation === 'set') {
          // Set operations override everything but only use the highest value
          // We'll handle these later
        }
      });
    });
    
    // Apply add/subtract operations first
    addOperations.forEach(value => {
      finalValue += value;
    });
    
    // Apply multiply/divide operations
    multiplyOperations.forEach(value => {
      finalValue *= value;
    });
    
    // Handle any set operations (take highest value)
    let highestSetValue = -Infinity;
    let hasSetOperation = false;
    
    activeTraits.forEach(trait => {
      if (!trait.effects) return;
      
      trait.effects.forEach((effect: TraitEffect) => {
        if (effect.target === statName && effect.operation === 'set') {
          hasSetOperation = true;
          if (effect.value > highestSetValue) {
            highestSetValue = effect.value;
          }
        }
      });
    });
    
    if (hasSetOperation && highestSetValue > -Infinity) {
      finalValue = highestSetValue;
    }
    
    // Ensure we don't return negative values for stats that can't be negative
    return Math.max(finalValue, 0);
  }, [activeTraits]);

  /**
   * Check if any active trait has a specific effect type
   * 
   * @param {string} effectType - The type of effect to check for
   * @returns {boolean} True if any active trait has the effect
   */
  const hasTraitEffect = useCallback((effectType: string): boolean => {
    return activeTraits.some(trait => 
      trait.effects && trait.effects.some((effect: TraitEffect) => effect.type === effectType)
    );
  }, [activeTraits]);

  /**
   * Get all active traits that have a specific effect
   * 
   * @param {string} effectType - The type of effect to look for
   * @returns {Trait[]} Array of traits with the specified effect
   */
  const getActiveTraitsWithEffect = useCallback((effectType: string): Trait[] => {
    return activeTraits.filter(trait => 
      trait.effects && trait.effects.some((effect: TraitEffect) => effect.type === effectType)
    );
  }, [activeTraits]);

  /**
   * Evaluate if a trait condition is met
   * 
   * @param {TraitCondition} condition - The condition to evaluate
   * @returns {boolean} Whether the condition is met
   */
  const evaluateTraitCondition = useCallback((condition: TraitCondition): boolean => {
    switch (condition.type) {
      case 'statAbove':
        return character[condition.stat] > condition.value;
        
      case 'statBelow':
        return character[condition.stat] < condition.value;
        
      case 'hasItem':
        return (character.inventory || []).some((item: any) => item.id === condition.itemId);
        
      case 'location':
        return gameState.currentLocation === condition.locationId;
        
      case 'timeOfDay':
        const currentHour = new Date().getHours();
        return currentHour >= condition.startHour && currentHour <= condition.endHour;
        
      case 'random':
        return Math.random() < condition.chance;
        
      default:
        return true;
    }
  }, [character, gameState]);

  /**
   * Get a detailed summary of how traits affect a specific stat
   * 
   * @param {string} statName - The name of the stat to analyze
   * @returns {TraitEffectSummary} Detailed breakdown of trait effects
   */
  const getTraitEffectSummary = useCallback((statName: string): TraitEffectSummary => {
    const baseValue = character[statName] || 0;
    const finalValue = calculateTraitEffectValue(statName, baseValue);
    const totalBonus = finalValue - baseValue;
    
    const effectDetails: TraitEffectSummary['effects'] = [];
    
    // Collect details from each trait
    activeTraits.forEach(trait => {
      if (!trait.effects) return;
      
      trait.effects.forEach((effect: TraitEffect) => {
        if (effect.target !== statName) return;
        
        // Calculate the impact this effect has on the final value
        let impact = 0;
        
        if (effect.operation === 'add') {
          impact = effect.value;
        } else if (effect.operation === 'subtract') {
          impact = -effect.value;
        } else if (effect.operation === 'multiply') {
          impact = baseValue * (effect.value - 1);
        } else if (effect.operation === 'divide') {
          impact = baseValue - (baseValue / effect.value);
        }
        
        effectDetails.push({
          traitId: trait.id,
          traitName: trait.name,
          value: effect.value,
          operation: effect.operation,
          impact
        });
      });
    });
    
    return {
      baseValue,
      finalValue,
      totalBonus,
      percentage: baseValue !== 0 ? (finalValue / baseValue - 1) * 100 : 0,
      effects: effectDetails
    };
  }, [activeTraits, calculateTraitEffectValue, character]);

  /**
   * Check for traits that trigger on specific events
   * 
   * @param {string} triggerType - The type of trigger to check
   * @param {any} contextData - Additional data related to the trigger
   */
  const checkTraitTriggers = useCallback((triggerType: string, contextData?: any): void => {
    activeTraits.forEach(trait => {
      if (!trait.triggers) return;
      
      const matchingTriggers = trait.triggers.filter(
        (trigger: any) => trigger.type === triggerType
      );
      
      if (matchingTriggers.length === 0) return;
      
      matchingTriggers.forEach((trigger: any) => {
        // Check conditions if any
        if (trigger.condition && !evaluateTraitCondition(trigger.condition)) {
          return;
        }
        
        // Process the trigger
        dispatch({
          type: 'TRAIT_TRIGGERED',
          payload: {
            traitId: trait.id,
            triggerType,
            contextData,
            effects: trigger.effects || []
          }
        });
        
        // Show notification if configured
        if (trigger.notification) {
          dispatch({
            type: 'SHOW_NOTIFICATION',
            payload: {
              message: trigger.notification.replace('{traitName}', trait.name),
              severity: 'info',
              duration: 3000
            }
          });
        }
      });
    });
  }, [activeTraits, evaluateTraitCondition, dispatch]);

  return {
    calculateTraitEffectValue,
    hasTraitEffect,
    getActiveTraitsWithEffect,
    getTraitEffectSummary,
    checkTraitTriggers
  };
};

export default useTraitEffects;
