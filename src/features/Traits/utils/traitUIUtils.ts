import { Trait } from '../state/TraitsTypes';
import { formatTraitEffects } from './traitEffectUtils';

/**
 * Interface for a trait object formatted for UI display
 */
export interface UITrait {
  id: string;
  name: string;
  description: string;
  level: number;
  category: string;
  icon: string;
  effectsText: string; // Formatted effects string
  cost: number;
  rarity: string;
  // Add any other UI-specific properties needed
}

/**
 * Converts a core Trait object into a UITrait object suitable for display.
 *
 * @param trait - The core Trait object from the state.
 * @returns A UITrait object formatted for the UI.
 */
export const convertToUITrait = (trait: Trait): UITrait => {
  return {
    id: trait.id,
    name: trait.name,
    description: trait.description,
    level: trait.level || 1, // Default level if not present
    category: trait.category || 'General',
    icon: trait.iconPath || 'default_icon', // Provide a default icon path
    effectsText: formatTraitEffects(trait.effects), // Use the utility function
    cost: trait.essenceCost || 0, // Use essenceCost
    rarity: trait.rarity || 'common',
  };
};
