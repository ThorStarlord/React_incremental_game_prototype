export const ESSENCE_COSTS = {
  TRAIT_COPY_BASE: 50,
  TRAIT_COPY_TIER_MULTIPLIER: 1.5,
  AFFINITY_LEVEL_UP: [0, 10, 25, 50, 100]
};

export const AFFINITY_LEVELS = {
  STRANGER: 0,
  ACQUAINTANCE: 1,
  FRIEND: 2,
  TRUSTED: 3,
  CONFIDANT: 4
};

export const ESSENCE_GENERATION_RATES = {
  [AFFINITY_LEVELS.ACQUAINTANCE]: 1,
  [AFFINITY_LEVELS.FRIEND]: 2,
  [AFFINITY_LEVELS.ALLY]: 3,
  [AFFINITY_LEVELS.SOULBOUND]: 5
};

export const UPDATE_INTERVALS = {
  ESSENCE_GENERATION: 60000, // 1 minute in milliseconds
  /**
   * @GAME_DESIGN: Battle Speed Configuration
   * Current fixed interval of 1000ms (1 second) between battle attacks.
   * 
   * Future Enhancement Plans:
   * - Scale battle speed based on player progression
   * - Faster intervals for higher-level areas (e.g., 800ms for mid-game, 600ms for end-game)
   * - Possible player upgrades to increase battle speed
   * - Special abilities or items that temporarily boost battle speed
   */
  BATTLE_ATTACK: 1000, // 1 second in milliseconds - interval between battle attacks
  SAVE_GAME: 300000 // 5 minutes in milliseconds
};

export const PROGRESSION_THRESHOLDS = {
  TRAIT_SLOT_ESSENCE: 100, // Essence needed per additional slot
  MAX_TRAIT_SLOTS: 8,
  INITIAL_TRAIT_SLOTS: 3,
  LEVEL_SLOT_START: 5, // Level at which players start earning level-based slots
  LEVEL_SLOT_INTERVAL: 5 // Levels between slot unlocks
};

export const RELATIONSHIP_TIERS = {
  NEMESIS: {
    name: 'Nemesis',
    threshold: -80,
    color: '#ff0000', // Red
    benefits: [],
    description: 'This person despises you and will actively work against you.'
  },
  ENEMY: {
    name: 'Enemy',
    threshold: -50,
    color: '#ff6b6b', // Light red
    benefits: [],
    description: 'This person dislikes you and may refuse to help you.'
  },
  UNFRIENDLY: {
    name: 'Unfriendly',
    threshold: -20,
    color: '#ffa500', // Orange
    benefits: [],
    description: 'This person is wary of you and reluctant to offer assistance.'
  },
  NEUTRAL: {
    name: 'Neutral',
    threshold: 0,
    color: '#ffff00', // Yellow
    benefits: ['Basic dialogue options'],
    description: 'This person has no strong feelings toward you.'
  },
  FRIENDLY: {
    name: 'Friendly',
    threshold: 20,
    color: '#90ee90', // Light green
    benefits: ['Basic dialogue options', 'Basic trade options'],
    description: 'This person is friendly towards you and willing to help.'
  },
  TRUSTED: {
    name: 'Trusted',
    threshold: 50,
    color: '#00cc00', // Medium green
    benefits: ['Advanced dialogue options', 'Trade discounts', 'Basic trait sharing'],
    description: 'This person trusts you and values your relationship.'
  },
  ALLY: {
    name: 'Ally',
    threshold: 80,
    color: '#008800', // Dark green
    benefits: ['All dialogue options', 'Best trade deals', 'Advanced trait sharing', 'Faction benefits'],
    description: 'This person is a close ally and will go out of their way to help you.'
  }
};

// Time constants for relationship decay
export const RELATIONSHIP_DECAY = {
  THRESHOLD_HOURS: 24, // Hours after which relationships start to decay
  DECAY_AMOUNT: -1, // Amount of decay per day
  MINIMUM_DECAY: 0, // Don't decay below neutral
};

export const ITEM_TYPES = {
  CONSUMABLE: 'consumable',
  WEAPON: 'weapon',
  ARMOR: 'armor'
};

export const QUEST_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
};