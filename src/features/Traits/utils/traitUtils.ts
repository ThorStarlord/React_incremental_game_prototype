// This file contains utility functions related to traits in the game.

import { TraitDefinition } from '../../../context/initialStates/TraitsInitialState';

/**
 * Interface for a trait with active status
 */
export interface ActiveTrait extends TraitDefinition {
  isActive: boolean;
}

/**
 * Interface for trait filtering criteria
 */
export interface TraitFilters {
  type?: string;
  maxCost?: number;
  searchTerm?: string;
}

/**
 * Trait Utilities
 * 
 * This module provides utility functions for working with traits in the game.
 * These utilities help with filtering, sorting, checking requirements,
 * and calculating effects of traits.
 */

/**
 * Calculates a value modified by a trait effect
 * 
 * @param baseValue - The base value before trait modification
 * @param traitModifier - The modifier value from the trait
 * @returns The modified value after applying the trait effect
 */
export const calculateTraitEffect = (baseValue: number, traitModifier: number): number => {
    return baseValue * (1 + traitModifier);
};

/**
 * Gets the description of a trait
 * 
 * @param trait - The trait object
 * @returns The trait's description or a default message if none exists
 */
export const getTraitDescription = (trait: TraitDefinition): string => {
    return trait.description || "No description available.";
};

/**
 * Checks if a trait is active
 * 
 * @param trait - The trait object
 * @returns Whether the trait is currently active
 */
export const isTraitActive = (trait: ActiveTrait): boolean => {
    return trait.isActive === true;
};

/**
 * Activates a trait
 * 
 * @param trait - The trait to activate
 */
export const activateTrait = (trait: ActiveTrait): void => {
    trait.isActive = true;
};

/**
 * Deactivates a trait
 * 
 * @param trait - The trait to deactivate
 */
export const deactivateTrait = (trait: ActiveTrait): void => {
    trait.isActive = false;
};

/**
 * Checks if a player can afford to acquire a trait
 * 
 * @param trait - The trait object with cost information
 * @param availableEssence - The player's current essence amount
 * @returns Whether the player can afford the trait
 */
export const canAffordTrait = (trait: TraitDefinition, availableEssence: number): boolean => {
  return trait.costPerLevel <= availableEssence;
};

/**
 * Filters traits based on specified criteria
 * 
 * @param traits - Object containing all traits
 * @param filters - Filtering criteria
 * @returns Filtered traits object
 */
export const filterTraits = (
  traits: { [id: string]: TraitDefinition }, 
  filters: TraitFilters = {}
): { [id: string]: TraitDefinition } => {
  const { type, maxCost, searchTerm } = filters;
  
  return Object.entries(traits).reduce((filtered, [id, trait]) => {
    let include = true;
    
    if (type && trait.category !== type) {
      include = false;
    }
    
    if (maxCost !== undefined && trait.costPerLevel > maxCost) {
      include = false;
    }
    
    if (searchTerm && !trait.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !trait.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      include = false;
    }
    
    if (include) {
      filtered[id] = trait;
    }
    
    return filtered;
  }, {} as { [id: string]: TraitDefinition });
};

/**
 * Sorts traits by a specified property
 * 
 * @param traits - Object containing traits
 * @param sortBy - Property to sort by (e.g., 'costPerLevel', 'name')
 * @param ascending - Whether to sort in ascending order
 * @returns Array of trait entries sorted as specified
 */
export const sortTraits = (
  traits: { [id: string]: TraitDefinition }, 
  sortBy: keyof TraitDefinition = 'name', 
  ascending: boolean = true
): [string, TraitDefinition][] => {
  return Object.entries(traits).sort(([idA, traitA], [idB, traitB]) => {
    const valueA = traitA[sortBy];
    const valueB = traitB[sortBy];
    
    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // Handle number comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return ascending 
        ? valueA - valueB
        : valueB - valueA;
    }
    
    // Default case
    return 0;
  });
};

/**
 * Calculates the total effect value from all acquired traits for a specific effect type
 * 
 * @param traits - All available traits
 * @param acquiredTraitIds - IDs of traits the player has acquired
 * @param effectType - The type of effect to calculate
 * @returns The total effect value
 */
export const calculateTraitEffectTotal = (
  traits: { [id: string]: TraitDefinition }, 
  acquiredTraitIds: string[], 
  effectType: string
): number => {
  return acquiredTraitIds.reduce((total, traitId) => {
    const trait = traits[traitId];
    if (trait) {
      // Check single effect
      if (trait.effect && trait.effect.type === effectType) {
        return total + trait.effect.value;
      }
      
      // Check multiple effects array
      if (trait.effects) {
        const matchingEffect = trait.effects.find(effect => effect.type === effectType);
        if (matchingEffect) {
          return total + matchingEffect.value;
        }
      }
    }
    return total;
  }, 0);
};

/**
 * Gets traits that are available to be acquired based on prerequisites
 * 
 * @param traits - All traits
 * @param acquiredTraitIds - IDs of traits the player has acquired
 * @returns Traits that are available to acquire
 */
export const getAvailableTraits = (
  traits: { [id: string]: TraitDefinition }, 
  acquiredTraitIds: string[]
): { [id: string]: TraitDefinition } => {
  return Object.entries(traits).reduce((available, [id, trait]) => {
    // Skip if already acquired
    if (acquiredTraitIds.includes(id)) {
      return available;
    }
    
    // Check prerequisites if any
    if (trait.requirements) {
      const meetsPrerequisites = Object.entries(trait.requirements).every(([prereqId, level]) => {
        // Special case for totalTraitPoints
        if (prereqId === 'totalTraitPoints') {
          return acquiredTraitIds.length >= level;
        }
        
        // Check if player has the prerequisite trait
        const prereqTrait = traits[prereqId];
        return acquiredTraitIds.includes(prereqId) && prereqTrait && prereqTrait.level >= level;
      });
      
      if (!meetsPrerequisites) {
        return available;
      }
    }
    
    available[id] = trait;
    return available;
  }, {} as { [id: string]: TraitDefinition });
};

/**
 * Formats a trait's effects into a readable string
 * 
 * @param effects - The effects object from a trait
 * @returns Formatted string describing the effects
 */
export const formatTraitEffects = (effects: { [type: string]: number } | null | undefined): string => {
  if (!effects || Object.keys(effects).length === 0) {
    return 'No effects';
  }
  
  return Object.entries(effects)
    .map(([type, value]) => {
      const sign = value > 0 ? '+' : '';
      return `${type}: ${sign}${value}`;
    })
    .join(', ');
};
