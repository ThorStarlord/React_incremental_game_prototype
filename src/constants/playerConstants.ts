/**
 * Player System Constants
 * 
 * Centralized configuration for player mechanics, formulas, and game balance.
 * These values control core gameplay mechanics and should be carefully tuned.
 */

// ============================================================================
// Attribute System Constants
// ============================================================================

export const ATTRIBUTE_CONSTANTS = {
  /** Base value for all attributes at character creation */
  BASE_ATTRIBUTE_VALUE: 10,
  
  /** Divisor for calculating attribute modifiers (D&D style: (attr - 10) / 2) */
  MODIFIER_DIVISOR: 2,
  
  /** Minimum attribute value (prevents negative modifiers beyond reasonable limits) */
  MIN_ATTRIBUTE_VALUE: 1,
  
  /** Practical maximum attribute value for UI display and balance */
  MAX_ATTRIBUTE_VALUE: 30,
} as const;

// ============================================================================
// Stat Calculation Constants
// ============================================================================

export const STAT_FORMULAS = {
  /** Health gained per point of Constitution */
  HEALTH_PER_CONSTITUTION: 5,
  
  /** Mana gained per point of Intelligence */
  MANA_PER_INTELLIGENCE: 3,
  
  /** Health regeneration per point of Constitution modifier */
  HEALTH_REGEN_PER_CONSTITUTION: 0.1,
  
  /** Mana regeneration per point of Wisdom modifier */
  MANA_REGEN_PER_WISDOM: 0.15,
  
  /** Critical chance gained per point of Dexterity modifier */
  CRIT_CHANCE_PER_DEXTERITY: 0.01,
  
  /** Critical damage multiplier gained per point of Strength modifier */
  CRIT_DAMAGE_PER_STRENGTH: 0.05,
} as const;

// ============================================================================
// Stat Limits and Caps
// ============================================================================

export const STAT_LIMITS = {
  /** Minimum health value (prevents character death from negative health) */
  MIN_HEALTH: 0,
  
  /** Minimum max health (ensures character always has some health capacity) */
  MIN_MAX_HEALTH: 1,
  
  /** Minimum mana value */
  MIN_MANA: 0,
  
  /** Minimum max mana value */
  MIN_MAX_MANA: 0,
  
  /** Minimum attack value */
  MIN_ATTACK: 0,
  
  /** Minimum defense value */
  MIN_DEFENSE: 0,
  
  /** Minimum speed value */
  MIN_SPEED: 0,
  
  /** Minimum regeneration rates */
  MIN_HEALTH_REGEN: 0,
  MIN_MANA_REGEN: 0,
  
  /** Critical chance bounds (0% to 100%) */
  MIN_CRIT_CHANCE: 0,
  MAX_CRIT_CHANCE: 1,
  
  /** Critical damage minimum (100% = no bonus damage) */
  MIN_CRIT_DAMAGE: 1,
} as const;

// ============================================================================
// Progression Constants
// ============================================================================

export const PROGRESSION_CONSTANTS = {
  /** Starting number of available attribute points */
  STARTING_ATTRIBUTE_POINTS: 0,
  
  /** Starting number of available skill points */
  STARTING_SKILL_POINTS: 0,
  
  /** Maximum number of trait slots */
  MAX_TRAIT_SLOTS: 4,
  
  /** Starting resonance level */
  STARTING_RESONANCE_LEVEL: 0,
} as const;

// ============================================================================
// Status Effect Constants
// ============================================================================

export const STATUS_EFFECT_CONSTANTS = {
  /** Default duration for temporary effects (in milliseconds) */
  DEFAULT_DURATION: 30000, // 30 seconds
  
  /** Maximum number of status effects that can be active simultaneously */
  MAX_ACTIVE_EFFECTS: 20,
  
  /** Categories for status effect organization */
  CATEGORIES: {
    BUFF: 'buff',
    DEBUFF: 'debuff',
    CONSUMABLE: 'consumable',
    FATIGUE: 'fatigue',
    EQUIPMENT: 'equipment',
    TRAIT: 'trait',
  },
} as const;

// ============================================================================
// Trait Effect Constants
// ============================================================================

export const TRAIT_EFFECT_CONSTANTS = {
  /** Direct stat modifier effect names */
  DIRECT_STATS: [
    'health', 'maxHealth', 'mana', 'maxMana',
    'attack', 'defense', 'speed',
    'healthRegen', 'manaRegen',
    'criticalChance', 'criticalDamage',
    'strength', 'dexterity', 'intelligence', 
    'constitution', 'wisdom', 'charisma'
  ] as const,
  
  /** Effect name patterns that indicate multiplier effects */
  MULTIPLIER_PATTERNS: ['Multiplier', 'GainMultiplier', 'XpMultiplier'] as const,
  
  /** Effect name patterns that indicate percentage bonuses */
  PERCENTAGE_PATTERNS: ['Bonus', 'PercentBonus'] as const,
  
  /** Special effect names that don't directly modify player stats */
  SPECIAL_EFFECTS: [
    'shopDiscount',
    'essenceGainBonus',
    'essenceGainMultiplier',
    'skillXpMultiplier',
    'craftingQualityBonus',
    'stealthEffectiveness',
    'socialBonus',
    'charismaBonus',
    'combatDamageMultiplier',
  ] as const,
} as const;

// ============================================================================
// Helper Functions for Constants
// ============================================================================

/**
 * Calculate attribute modifier using D&D formula
 */
export const calculateAttributeModifier = (attributeValue: number): number => {
  return Math.floor((attributeValue - ATTRIBUTE_CONSTANTS.BASE_ATTRIBUTE_VALUE) / ATTRIBUTE_CONSTANTS.MODIFIER_DIVISOR);
};

/**
 * Clamp a stat value within its defined limits
 */
export const clampStatValue = (statName: string, value: number): number => {
  const limits = STAT_LIMITS as Record<string, number>;
  const minKey = `MIN_${statName.toUpperCase()}`;
  const maxKey = `MAX_${statName.toUpperCase()}`;
  
  const min = limits[minKey] ?? -Infinity;
  const max = limits[maxKey] ?? Infinity;
  
  return Math.max(min, Math.min(max, value));
};

/**
 * Check if an effect name corresponds to a direct stat modifier
 */
export const isDirectStatEffect = (effectName: string): boolean => {
  return TRAIT_EFFECT_CONSTANTS.DIRECT_STATS.includes(effectName as any);
};

/**
 * Check if an effect name indicates a multiplier
 */
export const isMultiplierEffect = (effectName: string): boolean => {
  return TRAIT_EFFECT_CONSTANTS.MULTIPLIER_PATTERNS.some(pattern => 
    effectName.includes(pattern)
  );
};

/**
 * Check if an effect name indicates a percentage bonus
 */
export const isPercentageEffect = (effectName: string): boolean => {
  return TRAIT_EFFECT_CONSTANTS.PERCENTAGE_PATTERNS.some(pattern => 
    effectName.includes(pattern)
  ) && !isMultiplierEffect(effectName);
};
