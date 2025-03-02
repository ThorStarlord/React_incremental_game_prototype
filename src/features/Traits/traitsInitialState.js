/**
 * @file traitsInitialState.js
 * @description Initial state configuration for character traits in the incremental RPG.
 * Traits represent innate abilities, skills, and characteristics that provide various
 * bonuses and gameplay effects.
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
};

/**
 * Initial state for the Traits feature
 * @typedef {Object} TraitsState
 * @property {Object} traits - Collection of all available traits
 * @property {number} pointsAvailable - Points available to spend on traits
 * @property {number} pointsSpent - Points already spent on traits
 * @property {Object} categoryProgress - Progress towards unlocking trait categories
 * @property {Array} activeEffects - Currently active effects from traits
 */
const initialState = {
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
        type: 'DAMAGE_MULTIPLIER',
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
        type: 'ACTION_SPEED',
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
        type: 'MAX_HEALTH',
        value: 0.08, // 8% max health increase per level
      },
      unlocked: true,
      icon: 'heart',
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
        type: 'MAGIC_DAMAGE',
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
        type: 'ESSENCE_GENERATION',
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
        type: 'CRITICAL_CHANCE',
        value: 0.02, // 2% critical chance increase per level
      },
      unlocked: true,
      icon: 'target',
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
        type: 'ESSENCE_COST_REDUCTION',
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
        type: 'ELEMENTAL_DAMAGE',
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
        type: 'SPELL_COOLDOWN_REDUCTION',
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
        type: 'VENDOR_PRICES',
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
        type: 'ALLY_EFFECTIVENESS',
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
          type: 'DROP_RATE',
          value: 0.05, // 5% drop rate increase per level
        },
        {
          type: 'CRITICAL_DAMAGE',
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
        type: 'MAX_ESSENCE',
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
  
  // Active effects from traits
  activeEffects: [],
  
  // Last time traits were updated (for potential time-based trait effects)
  lastUpdateTime: Date.now(),
};

export default initialState;
