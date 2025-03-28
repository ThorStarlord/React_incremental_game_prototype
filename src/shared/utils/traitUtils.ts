import { ExtendedTrait, TraitEffect, TraitId } from '../../context/types/gameStates/TraitsGameStateTypes';

/**
 * Interface for player object
 */
interface Player {
  acquiredTraits: string[];
  [key: string]: any; // Additional player properties
}

/**
 * Interface for trait object
 */
interface Trait {
  id: string;
  name: string;
  essenceCost: number;
  [key: string]: any; // Additional trait properties
}

/**
 * Interface for UI-compatible trait object with stat bonuses
 */
export interface UITrait {
  id: string;
  name: string;
  description: string;
  statBonuses: Record<string, number>;
  rarity: string;
  category?: string;
  level?: number;
  icon?: string;
}

/**
 * Interface for traits collection
 */
interface TraitsCollection {
  copyableTraits: {
    [key: string]: Trait;
  };
  [key: string]: any; // Additional trait collection properties
}

/**
 * Interface for the return value of canAcquireTrait function
 */
interface AcquisitionCheck {
  canAcquire: boolean;
  reason: string;
  missingEssence?: number;
}

/**
 * Maps effect types to stat names for display
 */
const EFFECT_TO_STAT_MAP: Record<string, string> = {
  'damage-multiplier': 'attackBonus',
  'max-health': 'healthBonus',
  'magic-damage': 'magicalDamage',
  'critical-chance': 'critChance',
  'critical-damage': 'critMultiplier',
  'defense': 'defenseBonus',
  'strength': 'strength',
  'dexterity': 'dexterity',
  'intelligence': 'intelligence',
  'vitality': 'vitality',
  'wisdom': 'wisdom',
  'charisma': 'charisma',
  'luck': 'luck',
  'max-essence': 'maxEssence',
  'essence-generation': 'essenceGen',
  // Add more mappings as needed
};

/**
 * Convert ExtendedTrait to UI-compatible trait
 * 
 * @param trait ExtendedTrait from the game state
 * @returns UITrait compatible with UI components
 */
export const convertToUITrait = (trait: ExtendedTrait): UITrait => {
  // Extract stat bonuses from effects
  const statBonuses: Record<string, number> = {};
  
  if (trait.effects) {
    // Handle both array and object formats of effects
    const effectsList = Array.isArray(trait.effects) ? trait.effects : [trait.effects];
    
    effectsList.forEach(effect => {
      // Handle TraitEffect objects
      if (typeof effect === 'object' && 'type' in effect && 'magnitude' in effect) {
        const mappedStat = EFFECT_TO_STAT_MAP[effect.type] || effect.type;
        statBonuses[mappedStat] = (statBonuses[mappedStat] || 0) + effect.magnitude;
      }
      // Handle effects as direct key-value pairs
      else if (typeof effect === 'object') {
        Object.entries(effect).forEach(([key, value]) => {
          if (typeof value === 'number') {
            const mappedStat = EFFECT_TO_STAT_MAP[key] || key;
            statBonuses[mappedStat] = (statBonuses[mappedStat] || 0) + value;
          }
        });
      }
    });
  }
  
  return {
    id: trait.id as string,
    name: trait.name,
    description: trait.description || '',
    statBonuses,
    rarity: trait.rarity.toLowerCase(),
    category: trait.category,
    level: trait.level,
    icon: trait.iconPath
  };
};

/**
 * Safely get a trait by ID from traits record and convert to UI-compatible format
 * 
 * @param traitsRecord Record of traits from game state
 * @param traitId ID of the trait to retrieve
 * @returns UITrait or undefined if not found
 */
export const getUITraitById = (
  traitsRecord: Record<TraitId, ExtendedTrait> | undefined,
  traitId: string
): UITrait | undefined => {
  if (!traitsRecord) return undefined;
  
  // Convert string to TraitId safely
  const typedTraitId = traitId as unknown as TraitId;
  
  // Get the trait from the record
  const trait = traitsRecord[typedTraitId];
  if (!trait) return undefined;
  
  // Convert to UI-compatible format
  return convertToUITrait(trait);
};

/**
 * Calculate the total stat bonuses from equipped traits
 * 
 * @param equippedTraitIds Array of equipped trait IDs
 * @param traitsRecord Record of traits from game state
 * @returns Record of calculated stat bonuses
 */
export const calculateTraitStatBonuses = (
  equippedTraitIds: string[] | undefined,
  traitsRecord: Record<TraitId, ExtendedTrait> | undefined
): Record<string, number> => {
  const bonuses: Record<string, number> = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    vitality: 0,
    wisdom: 0,
    charisma: 0,
    luck: 0,
    healthBonus: 0,
    manaBonus: 0,
    attackBonus: 0,
    defenseBonus: 0,
    critChance: 0,
    critMultiplier: 0
  };

  // If no traits or trait record, return empty bonuses
  if (!equippedTraitIds || !traitsRecord) {
    return bonuses;
  }

  // Process each equipped trait
  for (const traitId of equippedTraitIds) {
    const trait = getUITraitById(traitsRecord, traitId);
    
    if (trait && trait.statBonuses) {
      Object.entries(trait.statBonuses).forEach(([stat, value]) => {
        if (stat in bonuses) {
          bonuses[stat] += value;
        } else {
          // Initialize if not already defined
          bonuses[stat] = value;
        }
      });
    }
  }

  return bonuses;
};

/**
 * Checks if a trait meets requirements for equipment
 * 
 * @param trait The trait to check
 * @param playerStats Current player stats
 * @returns True if requirements are met, false otherwise
 */
export const meetsTraitRequirements = (
  trait: ExtendedTrait | UITrait,
  playerStats: Record<string, number>
): boolean => {
  // If trait has no prerequisites, it can be equipped
  if (!('prerequisites' in trait) || !trait.prerequisites) {
    return true;
  }
  
  // For now just return true - implementation would check stat requirements
  return true;
};

/**
 * Check if player can acquire a trait
 * @param {Player} player - Player object
 * @param {number} essence - Current essence amount
 * @param {string} traitId - ID of trait to check
 * @param {TraitsCollection} traits - Traits data
 * @param {number} essenceCost - Optional override for essence cost
 * @returns {AcquisitionCheck} - { canAcquire: boolean, reason: string }
 */
export const canAcquireTrait = (
  player: Player, 
  essence: number, 
  traitId: string, 
  traits: TraitsCollection, 
  essenceCost: number | null = null
): AcquisitionCheck => {
  const trait = traits.copyableTraits[traitId];
  
  if (!trait) {
    return { canAcquire: false, reason: "Trait not found" };
  }
  
  if (player.acquiredTraits.includes(traitId)) {
    return { canAcquire: false, reason: "You already know this trait" };
  }
  
  const cost = essenceCost !== null ? essenceCost : trait.essenceCost;
  
  if (essence < cost) {
    return { 
      canAcquire: false, 
      reason: `Not enough essence (need ${cost}, have ${essence})`,
      missingEssence: cost - essence
    };
  }
  
  return { canAcquire: true, reason: "Can acquire" };
};
