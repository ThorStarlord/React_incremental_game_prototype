// This file contains utility functions related to traits in the game.

/**
 * Trait Utilities
 * 
 * This module provides utility functions for working with traits in the game.
 * These utilities help with filtering, sorting, checking requirements,
 * and calculating effects of traits.
 */

export const calculateTraitEffect = (baseValue, traitModifier) => {
    return baseValue * (1 + traitModifier);
};

export const getTraitDescription = (trait) => {
    return trait.description || "No description available.";
};

export const isTraitActive = (trait) => {
    return trait.isActive === true;
};

export const activateTrait = (trait) => {
    trait.isActive = true;
};

export const deactivateTrait = (trait) => {
    trait.isActive = false;
};

/**
 * Checks if a player can afford to acquire a trait
 * 
 * @param {Object} trait - The trait object with cost information
 * @param {number} availableEssence - The player's current essence amount
 * @returns {boolean} - Whether the player can afford the trait
 */
export const canAffordTrait = (trait, availableEssence) => {
  return trait.cost <= availableEssence;
};

/**
 * Filters traits based on specified criteria
 * 
 * @param {Object} traits - Object containing all traits
 * @param {Object} filters - Filtering criteria
 * @param {string} [filters.type] - Filter by trait type
 * @param {number} [filters.maxCost] - Maximum cost to include
 * @param {string} [filters.searchTerm] - Search term to match against name/description
 * @returns {Object} - Filtered traits object
 */
export const filterTraits = (traits, filters = {}) => {
  const { type, maxCost, searchTerm } = filters;
  
  return Object.entries(traits).reduce((filtered, [id, trait]) => {
    let include = true;
    
    if (type && trait.type !== type) {
      include = false;
    }
    
    if (maxCost !== undefined && trait.cost > maxCost) {
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
  }, {});
};

/**
 * Sorts traits by a specified property
 * 
 * @param {Object} traits - Object containing traits
 * @param {string} sortBy - Property to sort by (e.g., 'cost', 'name')
 * @param {boolean} ascending - Whether to sort in ascending order
 * @returns {Array} - Array of trait entries sorted as specified
 */
export const sortTraits = (traits, sortBy = 'name', ascending = true) => {
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
    return ascending 
      ? valueA - valueB
      : valueB - valueA;
  });
};

/**
 * Calculates the total effect value from all acquired traits for a specific effect type
 * 
 * @param {Object} traits - All available traits
 * @param {Array} acquiredTraitIds - IDs of traits the player has acquired
 * @param {string} effectType - The type of effect to calculate
 * @returns {number} - The total effect value
 */
export const calculateTraitEffectTotal = (traits, acquiredTraitIds, effectType) => {
  return acquiredTraitIds.reduce((total, traitId) => {
    const trait = traits[traitId];
    if (trait && trait.effects && trait.effects[effectType]) {
      return total + trait.effects[effectType];
    }
    return total;
  }, 0);
};

/**
 * Gets traits that are available to be acquired based on prerequisites
 * 
 * @param {Object} traits - All traits
 * @param {Array} acquiredTraitIds - IDs of traits the player has acquired
 * @returns {Object} - Traits that are available to acquire
 */
export const getAvailableTraits = (traits, acquiredTraitIds) => {
  return Object.entries(traits).reduce((available, [id, trait]) => {
    // Skip if already acquired
    if (acquiredTraitIds.includes(id)) {
      return available;
    }
    
    // Check prerequisites if any
    if (trait.prerequisites && trait.prerequisites.length > 0) {
      const meetsPrerequisites = trait.prerequisites.every(prereqId => 
        acquiredTraitIds.includes(prereqId)
      );
      
      if (!meetsPrerequisites) {
        return available;
      }
    }
    
    available[id] = trait;
    return available;
  }, {});
};

/**
 * Formats a trait's effects into a readable string
 * 
 * @param {Object} effects - The effects object from a trait
 * @returns {string} - Formatted string describing the effects
 */
export const formatTraitEffects = (effects) => {
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