export const ESSENCE_COSTS = {
  FACTION_CREATION: 50,
  SKILL_LEARNING: {
    BASIC: 25,
    INTERMEDIATE: 50,
    ADVANCED: 100
  }
};

export const AFFINITY_LEVELS = {
  STRANGER: 'Stranger',
  ACQUAINTANCE: 'Acquaintance',
  FRIEND: 'Friend',
  ALLY: 'Ally',
  SOULBOUND: 'Soulbound'
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
  BATTLE_ATTACK: 1000 // 1 second in milliseconds - interval between battle attacks
};