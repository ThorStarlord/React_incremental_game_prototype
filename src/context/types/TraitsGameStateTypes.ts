/**
 * Type definitions for character traits system
 */

// Define a type-safe ID for traits
export type TraitId = string & { readonly _brand: unique symbol };

/**
 * Create a validated TraitId from a string
 */
export function createTraitId(id: string): TraitId {
  // Add any validation logic here if needed
  return id as TraitId;
}

/**
 * Trait acquisition sources
 */
export const TRAIT_SOURCES = {
  STARTING: 'starting',       // Traits available at character creation
  LEVEL_UP: 'level-up',       // Traits unlocked through leveling up
  QUEST_REWARD: 'quest-reward', // Traits earned by completing quests
  ACHIEVEMENT: 'achievement',  // Traits unlocked via achievements
  EVENT: 'event',             // Traits from special events
  PURCHASE: 'purchase',       // Traits that can be bought
  RARE_ENCOUNTER: 'rare-encounter', // Traits from rare gameplay encounters
  CUSTOM: 'custom',           // For custom/mod-added traits
} as const;

export type TraitSource = typeof TRAIT_SOURCES[keyof typeof TRAIT_SOURCES];

/**
 * Trait rarity levels
 */
export const TRAIT_RARITIES = {
  COMMON: 'common',       // Basic traits with minor benefits
  UNCOMMON: 'uncommon',   // Slightly better than common traits
  RARE: 'rare',           // Notable traits with significant benefits
  EPIC: 'epic',           // Powerful traits that can change gameplay style
  LEGENDARY: 'legendary', // Very powerful traits with major effects
  UNIQUE: 'unique',       // One-of-a-kind traits with special effects
} as const;

export type TraitRarity = typeof TRAIT_RARITIES[keyof typeof TRAIT_RARITIES];

/**
 * Trait categories for organization
 */
export const TRAIT_CATEGORIES = {
  COMBAT: 'combat',         // Traits affecting combat abilities
  MAGIC: 'magic',           // Traits related to spellcasting and magical abilities
  CRAFTING: 'crafting',     // Traits for creating and enhancing items
  SOCIAL: 'social',         // Traits affecting NPC interactions, trading, etc.
  EXPLORATION: 'exploration', // Traits for world exploration and discovery
  BACKGROUND: 'background', // Traits representing character history/origin
  PERSONALITY: 'personality', // Traits affecting character behavior/dialogue
  SPECIAL: 'special',       // Unique traits that don't fit other categories
} as const;

export type TraitCategory = typeof TRAIT_CATEGORIES[keyof typeof TRAIT_CATEGORIES];

/**
 * Trait activation condition types
 */
export const ACTIVATION_TYPES = {
  COMBAT_START: 'combat-start', // Triggers when combat begins
  HEALTH_BELOW: 'health-below', // Triggers when health drops below threshold
  KILL: 'kill',                 // Triggers when defeating an enemy
  LEVEL_UP: 'level-up',         // Triggers when gaining a level
  SKILL_USE: 'skill-use',       // Triggers when using a specific skill
  CUSTOM: 'custom',             // For custom activation conditions
} as const;

export type ActivationType = typeof ACTIVATION_TYPES[keyof typeof ACTIVATION_TYPES];

/**
 * Effect types for trait effects
 */
export const EFFECT_TYPES = {
  DAMAGE_MULTIPLIER: 'damage-multiplier',         // Increases damage output
  ACTION_SPEED: 'action-speed',                   // Affects action/attack speed
  MAX_HEALTH: 'max-health',                       // Increases maximum health
  MAGIC_DAMAGE: 'magic-damage',                   // Increases magical damage
  ESSENCE_GENERATION: 'essence-generation',       // Affects resource generation rate
  CRITICAL_CHANCE: 'critical-chance',             // Increases critical hit chance
  ESSENCE_COST_REDUCTION: 'essence-cost-reduction', // Reduces resource costs
  ELEMENTAL_DAMAGE: 'elemental-damage',           // Increases elemental damage
  SPELL_COOLDOWN_REDUCTION: 'spell-cooldown-reduction', // Reduces spell cooldowns
  VENDOR_PRICES: 'vendor-prices',                 // Affects buying/selling prices
  ALLY_EFFECTIVENESS: 'ally-effectiveness',       // Boosts ally/companion stats
  DROP_RATE: 'drop-rate',                         // Increases item drop chances
  CRITICAL_DAMAGE: 'critical-damage',             // Increases critical hit damage
  MAX_ESSENCE: 'max-essence',                     // Increases maximum resource pool
  DEFENSE: 'defense',                             // Increases damage resistance
  REGENERATION: 'regeneration',                   // Affects health/resource regeneration
  DISCOVERY_CHANCE: 'discovery-chance',           // Increases chance to find rare items/events
} as const;

export type EffectType = typeof EFFECT_TYPES[keyof typeof EFFECT_TYPES];

/**
 * Interface for trait effects
 */
export interface TraitEffect {
  type: EffectType | string;
  magnitude: number;      // Numeric value of the effect
  displayText?: string;   // Optional display text for UI
}

/**
 * Define specific keys for trait requirements
 */
type TraitRequirementKey = 
  | 'playerLevel' 
  | 'questCompleted' 
  | 'strength' 
  | 'dexterity' 
  | 'intelligence' 
  | 'wisdom'
  | 'charisma';

/**
 * Use mapped type for more specific trait requirements
 */
export type TraitRequirement = Partial<Record<TraitRequirementKey, number | string>>;

/**
 * Parameters for trait check functions with common fields
 */
export interface TraitCheckParameters {
  playerLevel?: number;
  currentHealth?: number;
  maxHealth?: number;
  enemyType?: string;
  skillId?: string;
  inCombat?: boolean;
  // Allow for additional custom parameters
  [key: string]: unknown;
}

/**
 * Base trait structure with essential properties
 */
export interface BaseTrait {
  id: TraitId;
  name: string;
  description: string;
  category: TraitCategory;
  effects: TraitEffect[];
  iconPath?: string;
}

/**
 * Extended trait structure with additional metadata
 */
export interface ExtendedTrait extends BaseTrait {
  // Additional properties
  rarity: TraitRarity;
  source: TraitSource;
  mutuallyExclusive?: TraitId[];
  prerequisites?: {
    traits?: TraitId[];
    level?: number;
    stats?: Record<string, number>;
    skills?: Record<string, number>;
  };
  isRemovable: boolean;
  removalCost?: number;
  lore?: string;
}

/**
 * Trait activation condition with improved typing
 */
export interface TraitActivationCondition {
  type: ActivationType;
  threshold?: number;
  skillId?: string;
  enemyType?: string;
  customCheck?: {
    // Store function reference with improved parameter typing
    checkFunction: (gameState: any, trait: ExtendedTrait, parameters: TraitCheckParameters) => boolean;
    parameters?: TraitCheckParameters;
  };
}

/**
 * Active trait with conditional effects
 */
export interface ActiveTrait extends ExtendedTrait {
  isActive: boolean;
  cooldown?: number;
  currentCooldown?: number;
  charges?: number;
  currentCharges?: number;
  activationCondition?: TraitActivationCondition;
  activeEffects?: TraitEffect[];
  passiveEffects?: TraitEffect[];
}

/**
 * Upgradeable trait with multiple tiers
 */
export interface TieredTrait extends ExtendedTrait {
  currentTier: number;
  maxTier: number;
  tierEffects: Record<number, TraitEffect[]>;
  tierUpgradeCost: Record<number, number>;
  tierNames?: Record<number, string>;
  tierDescriptions?: Record<number, string>;
}

/**
 * Requirement type for trait slot unlocking
 */
export const SLOT_REQUIREMENT_TYPES = {
  LEVEL: 'level',         // Unlock based on player level
  QUEST: 'quest',         // Unlock after completing a quest
  ACHIEVEMENT: 'achievement', // Unlock after gaining an achievement
  PURCHASE: 'purchase',   // Unlock by spending currency
} as const;

export type SlotRequirementType = typeof SLOT_REQUIREMENT_TYPES[keyof typeof SLOT_REQUIREMENT_TYPES];

/**
 * Player trait slot configuration
 */
export interface TraitSlots {
  maxTraits: number;
  unlockedSlots: number;
  lockedSlotRequirements: {
    slotIndex: number;
    requirement: {
      type: SlotRequirementType;
      id?: string;
      level?: number;
      cost?: number;
    };
  }[];
}

/**
 * Trait history entry with improved typing
 */
export type TraitHistoryAction = 'added' | 'removed' | 'upgraded';

export interface TraitHistoryEntry {
  traitId: TraitId;
  action: TraitHistoryAction;
  timestamp: string; // ISO date string
}

/**
 * Trait point allocation history entry
 */
export interface TraitPointAllocation {
  timestamp: number; // Unix timestamp (milliseconds since epoch)
  traitId: TraitId;
  pointsAllocated: number;
  remainingPoints: number;
}

/**
 * Complete trait system state
 */
export interface TraitSystem {
  copyableTraits: Record<TraitId, ExtendedTrait>;
  playerTraits: TraitId[];
  availableTraits: TraitId[];
  traitSlots: TraitSlots;
  discoveredTraits: TraitId[]; // Changed from Set to array for serialization
  favoriteTraits: TraitId[]; // Changed from Set to array for serialization
  traitPoints: number;
  traitHistory: TraitHistoryEntry[];
  /**
   * Timestamp of last trait system update in milliseconds (Date.now())
   */
  lastUpdateTime: number;
  /**
   * Detailed history of trait point allocations
   */
  pointAllocationHistory: TraitPointAllocation[];
}

/**
 * Trait interaction result
 */
export interface TraitInteractionResult {
  success: boolean;
  message: string;
  affectedTraitIds: TraitId[];
  cost?: number;
  unlockedTraits?: TraitId[];
}
