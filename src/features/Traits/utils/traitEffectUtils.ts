import { Trait } from '../state/TraitsTypes'; // Assuming TraitDefinition is now Trait from TraitsTypes

/**
 * Calculates a value modified by a trait effect (assuming a simple multiplier)
 *
 * @param baseValue - The base value before trait modification
 * @param traitModifier - The modifier value from the trait (e.g., 0.1 for +10%)
 * @returns The modified value after applying the trait effect
 */
export const calculateTraitEffect = (baseValue: number, traitModifier: number): number => {
    // This is a placeholder implementation. Adjust based on how modifiers work.
    return baseValue * (1 + traitModifier);
};

/**
 * Calculates the total effect value from all acquired traits for a specific effect type
 *
 * @param traits - All available traits
 * @param acquiredTraitIds - IDs of traits the player has acquired
 * @param effectType - The type of effect to calculate (e.g., 'strength', 'manaRegen')
 * @returns The total effect value
 */
export const calculateTraitEffectTotal = (
  traits: { [id: string]: Trait },
  acquiredTraitIds: string[],
  effectType: string
): number => {
  return acquiredTraitIds.reduce((total, traitId) => {
    const trait = traits[traitId];
    if (trait?.effects) {
      if (Array.isArray(trait.effects)) {
        const matchingEffect = trait.effects.find(effect => effect.type === effectType);
        if (matchingEffect) {
          return total + matchingEffect.magnitude;
        }
      } else if (typeof trait.effects === 'object' && trait.effects[effectType] !== undefined) {
        // Handle effects as object { effectName: magnitude }
        const magnitude = trait.effects[effectType];
        if (typeof magnitude === 'number') {
          return total + magnitude;
        }
      }
    }
    return total;
  }, 0);
};

/**
 * Formats a trait's effects into a readable string
 *
 * @param effects - The effects array or object from a trait
 * @returns Formatted string describing the effects, or 'No effects'
 */
export const formatTraitEffects = (effects: Trait['effects'] | null | undefined): string => {
  if (!effects) {
    return 'No effects';
  }

  let effectStrings: string[] = [];

  if (Array.isArray(effects)) {
    effectStrings = effects.map(effect => {
      const sign = effect.magnitude > 0 ? '+' : '';
      // Basic formatting, could be enhanced (e.g., percentages)
      return `${effect.type}: ${sign}${effect.magnitude}`;
    });
  } else if (typeof effects === 'object' && Object.keys(effects).length > 0) {
    effectStrings = Object.entries(effects).map(([type, value]) => {
      if (typeof value === 'number') {
        const sign = value > 0 ? '+' : '';
        return `${type}: ${sign}${value}`;
      }
      return `${type}: ${value}`; // Handle non-numeric values if necessary
    });
  }

  return effectStrings.length > 0 ? effectStrings.join(', ') : 'No effects';
};
