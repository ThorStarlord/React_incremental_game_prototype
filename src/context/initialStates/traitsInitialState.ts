/**
 * Initial state configuration for character traits in the incremental RPG.
 * Traits represent innate abilities, skills, and characteristics that provide various
 * bonuses and gameplay effects.
 */

import { 
  TraitSystem,
  SLOT_REQUIREMENT_TYPES
} from '../types/TraitsGameStateTypes';

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
 * Initial state for the trait system
 */
const traitsInitialState: TraitSystem = {
  copyableTraits: {},  // Will be populated with trait definitions from data files or API
  playerTraits: [],
  availableTraits: [],
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
