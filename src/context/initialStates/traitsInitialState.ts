/**
 * Initial state configuration for character traits in the incremental RPG.
 * Traits represent innate abilities, skills, and characteristics that provide various
 * bonuses and gameplay effects.
 */

import { 
  TraitSystem,
  SLOT_REQUIREMENT_TYPES,
  TraitId,
  createTraitId
} from '../types/gameStates/TraitsGameStateTypes';

/**
 * Initial configuration for locked trait slots
 * Defines which slots are initially locked and their unlock requirements
 */
export const INITIAL_LOCKED_SLOTS = [
  {
    slotIndex: 2,
    requirement: {
      type: SLOT_REQUIREMENT_TYPES.LEVEL,
      level: 5
    }
  },
  {
    slotIndex: 3,
    requirement: {
      type: SLOT_REQUIREMENT_TYPES.LEVEL,
      level: 10
    }
  },
  {
    slotIndex: 4,
    requirement: {
      type: SLOT_REQUIREMENT_TYPES.QUEST,
      id: 'master-of-traits'
    }
  }
];

/**
 * Initial set of traits available in the game
 */
export const INITIAL_TRAITS: Record<string, any> = {
  'quick_learner': {
    id: createTraitId('quick_learner'),
    name: 'Quick Learner',
    description: 'Increases experience gain by 10%',
    tier: 1,
    effects: [{ type: 'expGain', value: 0.1 }],
    requirements: { level: 1 },
    cost: 1
  },
  'tough_skin': {
    id: createTraitId('tough_skin'),
    name: 'Tough Skin',
    description: 'Reduces damage taken by 5%',
    tier: 1,
    effects: [{ type: 'damageReduction', value: 0.05 }],
    requirements: { level: 1 },
    cost: 1
  },
  'keen_eye': {
    id: createTraitId('keen_eye'),
    name: 'Keen Eye',
    description: 'Increases critical hit chance by 2%',
    tier: 1,
    effects: [{ type: 'critChance', value: 2 }],
    requirements: { level: 2 },
    cost: 1
  }
};

/**
 * Initial state for the trait system
 */
const traitsInitialState: TraitSystem = {
  copyableTraits: INITIAL_TRAITS,  // Populated with trait definitions
  playerTraits: [],
  availableTraits: Object.keys(INITIAL_TRAITS).slice(0, 2).map(id => createTraitId(id)), // First 2 traits available initially
  traitSlots: {
    maxTraits: 5,
    unlockedSlots: 2,
    lockedSlotRequirements: INITIAL_LOCKED_SLOTS
  },
  discoveredTraits: [],  // Tracks traits the player has discovered
  favoriteTraits: [],    // Tracks traits the player has marked as favorites
  traitPoints: 0,        // Starting with no trait points
  
  /**
   * Tracks changes to traits (acquisition, removal, upgrades)
   * New entries should be added whenever the player's traits change
   */
  traitHistory: [],
  
  /**
   * Reference timestamp for time-based calculations
   * This helps track when the trait system was initialized
   */
  lastUpdateTime: Date.now(),
  
  /**
   * Records how trait points are spent
   * New entries should be added whenever points are allocated
   */
  pointAllocationHistory: []
};

export default traitsInitialState;
