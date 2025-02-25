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
  DEVOTED: {
    threshold: 80,
    name: 'Devoted',
    color: '#9C27B0',
    essenceRate: 5
  },
  TRUSTED: {
    threshold: 60,
    name: 'Trusted',
    color: '#4CAF50',
    essenceRate: 4
  },
  FRIENDLY: {
    threshold: 40,
    name: 'Friendly',
    color: '#2196F3',
    essenceRate: 3
  },
  WARM: {
    threshold: 20,
    name: 'Warm',
    color: '#8BC34A',
    essenceRate: 2
  },
  NEUTRAL: {
    threshold: 0,
    name: 'Neutral',
    color: '#9E9E9E',
    essenceRate: 0
  },
  COLD: {
    threshold: -20,
    name: 'Cold',
    color: '#FF9800',
    essenceRate: 0
  },
  UNFRIENDLY: {
    threshold: -40,
    name: 'Unfriendly',
    color: '#F44336',
    essenceRate: 0
  },
  HOSTILE: {
    threshold: -60,
    name: 'Hostile',
    color: '#D32F2F',
    essenceRate: 0
  },
  NEMESIS: {
    threshold: -80,
    name: 'Nemesis',
    color: '#B71C1C',
    essenceRate: 0
  }
};