/**
 * @file traitsInitialState.ts
 * @description Initial state configuration for character traits in the incremental RPG.
 * Traits represent innate abilities, skills, and characteristics that provide various
 * bonuses and gameplay effects.
 * 
 * The trait system allows players to customize their character by investing trait points
 * into different attributes. Each trait provides specific benefits that enhance gameplay.
 */

/**
 * Trait Categories:
 * - PHYSICAL: Traits related to physical abilities and prowess
 * - MENTAL: Traits related to intelligence, wisdom, and mental capabilities
 * - MAGICAL: Traits related to magical affinity and abilities
 * - SOCIAL: Traits related to charisma and social interactions
 * - SPECIAL: Unique traits with special effects or requirements
 */
export const TRAIT_CATEGORIES = {
  PHYSICAL: 'physical',
  MENTAL: 'mental',
  MAGICAL: 'magical',
  SOCIAL: 'social',
  SPECIAL: 'special',
} as const;

export type TraitCategory = typeof TRAIT_CATEGORIES[keyof typeof TRAIT_CATEGORIES];

/**
 * Effect Types:
 * Constants for different effects that traits can provide
 */
export const EFFECT_TYPES = {
  DAMAGE_MULTIPLIER: 'DAMAGE_MULTIPLIER',
  ACTION_SPEED: 'ACTION_SPEED',
  MAX_HEALTH: 'MAX_HEALTH',
  MAGIC_DAMAGE: 'MAGIC_DAMAGE',
  ESSENCE_GENERATION: 'ESSENCE_GENERATION',
  CRITICAL_CHANCE: 'CRITICAL_CHANCE',
  ESSENCE_COST_REDUCTION: 'ESSENCE_COST_REDUCTION',
  ELEMENTAL_DAMAGE: 'ELEMENTAL_DAMAGE',
  SPELL_COOLDOWN_REDUCTION: 'SPELL_COOLDOWN_REDUCTION',
  VENDOR_PRICES: 'VENDOR_PRICES',
  ALLY_EFFECTIVENESS: 'ALLY_EFFECTIVENESS',
  DROP_RATE: 'DROP_RATE',
  CRITICAL_DAMAGE: 'CRITICAL_DAMAGE',
  MAX_ESSENCE: 'MAX_ESSENCE',
  DEFENSE: 'DEFENSE',
  REGENERATION: 'REGENERATION',
} as const;

export type EffectType = typeof EFFECT_TYPES[keyof typeof EFFECT_TYPES];

/**
 * Interface defining an effect provided by a trait
 */
export interface TraitEffect {
  /** Type of effect from EFFECT_TYPES */
  type: EffectType | string;
  /** Magnitude of the effect per level */
  value: number;
}

/**
 * Interface for trait requirements
 */
export interface TraitRequirement {
  [key: string]: number;
}

/**
 * Interface defining a trait in the game
 */
export interface TraitDefinition {
  /** Unique identifier for the trait */
  id: string;
  /** Display name of the trait */
  name: string;
  /** Detailed description of what the trait does */
  description: string;
  /** The category this trait belongs to */
  category: TraitCategory;
  /** Current level of the trait */
  level: number;
  /** Maximum level this trait can reach */
  maxLevel: number;
  /** Trait points required per level */
  costPerLevel: number;
  /** Effect(s) provided by this trait */
  effect?: TraitEffect;
  /** Multiple effects if trait provides more than one bonus */
  effects?: TraitEffect[];
  /** Whether the trait is available to the player */
  unlocked: boolean;
  /** Requirements to unlock this trait */
  requirements?: TraitRequirement;
  /** Icon identifier used for UI display */
  icon: string;
}

/**
 * Interface for tracking progress toward unlocking trait categories
 */
export interface CategoryProgress {
  /** Whether the category is unlocked */
  unlocked: boolean;
  /** Current progress towards unlocking */
  progress: number;
  /** Required progress to unlock */
  requirement: number;
}

/**
 * Interface for tracking trait achievement progress
 */
export interface TraitAchievements {
  /** Number of mastered categories */
  masteredCategories: number;
  /** Number of traits maxed out */
  maxedTraits: number;
  /** Total trait points ever spent */
  totalPointsEverSpent: number;
}

/**
 * Interface for the complete traits state
 */
export interface TraitsState {
  /** Points available to spend on traits */
  pointsAvailable: number;
  /** Total points spent on traits so far */
  pointsSpent: number;
  /** Maximum trait level for general traits */
  maxTraitLevel: number;
  /** Collection of all traits */
  traits: {
    [traitId: string]: TraitDefinition;
  };
  /** Progress towards unlocking trait categories */
  categoryProgress: {
    [category in TraitCategory]: CategoryProgress;
  };
  /** Currently active effects from traits */
  activeEffects: TraitEffect[];
  /** Timestamp of last trait system update */
  lastUpdateTime: number;
  /** Trait point allocation history for analytics */
  pointAllocationHistory: any[];
  /** Achievement progress related to traits */
  traitAchievements: TraitAchievements;
}

/**
 * Initial state for the Traits feature
 */
const InitialState: TraitsState = {
  // Points available to spend on traits
  pointsAvailable: 0,
  
  // Total points spent on traits so far
  pointsSpent: 0,
  
  // Maximum trait level for general traits
  maxTraitLevel: 5,
  
  // Collection of all traits
  traits: {
    // PHYSICAL TRAITS
    strength: {
      id: 'strength',
      name: 'Strength',
      description: 'Raw physical power that increases damage with physical attacks',
      category: TRAIT_CATEGORIES.PHYSICAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.DAMAGE_MULTIPLIER,
        value: 0.1, // 10% damage increase per level
      },
      unlocked: true,
      icon: 'muscle',
    },
    agility: {
      id: 'agility',
      name: 'Agility',
      description: 'Physical quickness that improves action speed',
      category: TRAIT_CATEGORIES.PHYSICAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.ACTION_SPEED,
        value: 0.05, // 5% speed increase per level
      },
      unlocked: true,
      icon: 'running',
    },
    endurance: {
      id: 'endurance',
      name: 'Endurance',
      description: 'Physical stamina that increases health points',
      category: TRAIT_CATEGORIES.PHYSICAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.MAX_HEALTH,
        value: 0.08, // 8% max health increase per level
      },
      unlocked: true,
      icon: 'heart',
    },
    constitution: {
      id: 'constitution',
      name: 'Constitution',
      description: 'Physical resilience that increases defense against all damage',
      category: TRAIT_CATEGORIES.PHYSICAL,
      level: 0,
      maxLevel: 8,
      costPerLevel: 2,
      effect: {
        type: EFFECT_TYPES.DEFENSE,
        value: 0.06, // 6% damage reduction per level
      },
      unlocked: true,
      icon: 'shield',
    },
    recovery: {
      id: 'recovery',
      name: 'Recovery',
      description: 'Natural healing ability that increases health regeneration',
      category: TRAIT_CATEGORIES.PHYSICAL,
      level: 0,
      maxLevel: 7,
      costPerLevel: 2,
      effect: {
        type: EFFECT_TYPES.REGENERATION,
        value: 0.05, // 5% health regeneration increase per level
      },
      unlocked: false,
      requirements: {
        endurance: 2,
      },
      icon: 'bandage',
    },
    
    // MENTAL TRAITS
    intelligence: {
      id: 'intelligence',
      name: 'Intelligence',
      description: 'Mental acuity that increases magical damage',
      category: TRAIT_CATEGORIES.MENTAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.MAGIC_DAMAGE,
        value: 0.1, // 10% magic damage increase per level
      },
      unlocked: true,
      icon: 'brain',
    },
    wisdom: {
      id: 'wisdom',
      name: 'Wisdom',
      description: 'Practical knowledge that improves essence generation',
      category: TRAIT_CATEGORIES.MENTAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.ESSENCE_GENERATION,
        value: 0.07, // 7% essence generation increase per level
      },
      unlocked: true,
      icon: 'book',
    },
    focus: {
      id: 'focus',
      name: 'Focus',
      description: 'Mental concentration that increases critical hit chance',
      category: TRAIT_CATEGORIES.MENTAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.CRITICAL_CHANCE,
        value: 0.02, // 2% critical chance increase per level
      },
      unlocked: true,
      icon: 'target',
    },
    perception: {
      id: 'perception',
      name: 'Perception',
      description: 'Enhanced awareness that improves discovery of hidden elements',
      category: TRAIT_CATEGORIES.MENTAL,
      level: 0,
      maxLevel: 5,
      costPerLevel: 2,
      effect: {
        type: 'DISCOVERY_CHANCE',
        value: 0.08, // 8% increased chance to discover hidden elements
      },
      unlocked: false,
      requirements: {
        wisdom: 3,
      },
      icon: 'eye',
    },
    
    // MAGICAL TRAITS
    affinity: {
      id: 'affinity',
      name: 'Magical Affinity',
      description: 'Natural talent for magic that reduces essence costs',
      category: TRAIT_CATEGORIES.MAGICAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 2,
      effect: {
        type: EFFECT_TYPES.ESSENCE_COST_REDUCTION,
        value: 0.03, // 3% essence cost reduction per level
      },
      unlocked: false,
      requirements: {
        intelligence: 3,
      },
      icon: 'wand',
    },
    attunement: {
      id: 'attunement',
      name: 'Elemental Attunement',
      description: 'Connection to elemental forces that enhances elemental damage',
      category: TRAIT_CATEGORIES.MAGICAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 2,
      effect: {
        type: EFFECT_TYPES.ELEMENTAL_DAMAGE,
        value: 0.08, // 8% elemental damage increase per level
      },
      unlocked: false,
      requirements: {
        intelligence: 2,
        wisdom: 1,
      },
      icon: 'element',
    },
    channeling: {
      id: 'channeling',
      name: 'Channeling',
      description: 'Ability to channel magical energies more efficiently',
      category: TRAIT_CATEGORIES.MAGICAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 2,
      effect: {
        type: EFFECT_TYPES.SPELL_COOLDOWN_REDUCTION,
        value: 0.04, // 4% cooldown reduction per level
      },
      unlocked: false,
      requirements: {
        focus: 3,
      },
      icon: 'energy',
    },
    
    // SOCIAL TRAITS
    charisma: {
      id: 'charisma',
      name: 'Charisma',
      description: 'Personal magnetism that improves vendor prices',
      category: TRAIT_CATEGORIES.SOCIAL,
      level: 0,
      maxLevel: 10,
      costPerLevel: 1,
      effect: {
        type: EFFECT_TYPES.VENDOR_PRICES,
        value: 0.02, // 2% better prices per level
      },
      unlocked: true,
      icon: 'speech',
    },
    leadership: {
      id: 'leadership',
      name: 'Leadership',
      description: 'Ability to lead that enhances ally effectiveness',
      category: TRAIT_CATEGORIES.SOCIAL,
      level: 0,
      maxLevel: 5,
      costPerLevel: 2,
      effect: {
        type: EFFECT_TYPES.ALLY_EFFECTIVENESS,
        value: 0.05, // 5% ally effectiveness per level
      },
      unlocked: false,
      requirements: {
        charisma: 3,
      },
      icon: 'crown',
    },
    
    // SPECIAL TRAITS
    luck: {
      id: 'luck',
      name: 'Luck',
      description: 'Good fortune that increases drop rates and critical damage',
      category: TRAIT_CATEGORIES.SPECIAL,
      level: 0,
      maxLevel: 5,
      costPerLevel: 3,
      effects: [
        {
          type: EFFECT_TYPES.DROP_RATE,
          value: 0.05, // 5% drop rate increase per level
        },
        {
          type: EFFECT_TYPES.CRITICAL_DAMAGE,
          value: 0.1, // 10% critical damage increase per level
        }
      ],
      unlocked: false,
      requirements: {
        totalTraitPoints: 15, // Require spending 15 trait points total
      },
      icon: 'clover',
    },
    essence_bond: {
      id: 'essence_bond',
      name: 'Essence Bond',
      description: 'Special connection to essence that increases maximum storage',
      category: TRAIT_CATEGORIES.SPECIAL,
      level: 0,
      maxLevel: 3,
      costPerLevel: 5,
      effect: {
        type: EFFECT_TYPES.MAX_ESSENCE,
        value: 0.25, // 25% essence storage increase per level
      },
      unlocked: false,
      requirements: {
        totalTraitPoints: 20,
        wisdom: 5,
      },
      icon: 'energy-orb',
    },
  },
  
  // Progress towards unlocking trait categories
  categoryProgress: {
    [TRAIT_CATEGORIES.PHYSICAL]: {
      unlocked: true,
      progress: 100,
      requirement: 0,
    },
    [TRAIT_CATEGORIES.MENTAL]: {
      unlocked: true,
      progress: 100,
      requirement: 0,
    },
    [TRAIT_CATEGORIES.MAGICAL]: {
      unlocked: false,
      progress: 0,
      requirement: 50, // Requires 50 essence to unlock
    },
    [TRAIT_CATEGORIES.SOCIAL]: {
      unlocked: true,
      progress: 100,
      requirement: 0,
    },
    [TRAIT_CATEGORIES.SPECIAL]: {
      unlocked: false,
      progress: 0,
      requirement: 100, // Requires 100 essence to unlock
    },
  },
  
  // Active effects from traits - calculated at runtime based on trait levels
  activeEffects: [],
  
  // Last time traits were updated (for potential time-based trait effects)
  lastUpdateTime: Date.now(),
  
  // Trait point distribution history for analytics
  pointAllocationHistory: [],
  
  // Achievement progress related to traits
  traitAchievements: {
    masteredCategories: 0,
    maxedTraits: 0,
    totalPointsEverSpent: 0
  }
};

export default InitialState;
