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
  BATTLE_ATTACK: 1000 // 1 second in milliseconds - interval between battle attacks
};