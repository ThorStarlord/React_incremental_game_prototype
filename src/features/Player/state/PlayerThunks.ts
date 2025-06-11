import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { selectPlayer, selectPlayerStats } from './PlayerSelectors';
import { PlayerState, PlayerStats, StatusEffect } from './PlayerTypes';
import { Trait } from '../../Traits/state/TraitsTypes';
import { 
  calculateAttributeModifier, 
  STAT_FORMULAS, 
  STAT_LIMITS, 
  PLAYER_BASE_STATS 
} from '../../../constants/playerConstants';

// Import the slice properly - import the slice object that contains both reducer and actions
import { playerSlice } from './PlayerSlice';

/**
 * Initial state for base stats calculation
 */
const getPlayerInitialStats = (): PlayerStats => ({ ...PLAYER_BASE_STATS });

/**
 * Simple trait effect processing
 */
const processTraitEffects = (activeTraits: Trait[], baseStats: PlayerStats) => {
  const effects: Record<string, number> = {};
  const warnings: string[] = [];

  activeTraits.forEach(trait => {
    if (trait.effects) {
      if (Array.isArray(trait.effects)) {
        trait.effects.forEach(effect => {
          if (typeof effect === 'object' && 'type' in effect && 'magnitude' in effect) {
            // Handle TraitEffect objects
            const statName = effect.type.toLowerCase();
            if (statName in baseStats) {
              effects[statName] = (effects[statName] || 0) + effect.magnitude;
            }
          }
        });
      } else if (typeof trait.effects === 'object') {
        // Handle TraitEffectValues (key-value pairs)
        Object.entries(trait.effects).forEach(([statName, value]) => {
          if (statName in baseStats && typeof value === 'number') {
            effects[statName] = (effects[statName] || 0) + value;
          }
        });
      }
    }
  });

  return { effects, warnings };
};

const applyTraitEffectsToStats = (baseStats: PlayerStats, traitEffects: { effects: Record<string, number> }): PlayerStats => {
  const result = { ...baseStats };
  
  Object.entries(traitEffects.effects).forEach(([stat, modifier]) => {
    if (stat in result && typeof result[stat as keyof PlayerStats] === 'number') {
      (result[stat as keyof PlayerStats] as number) += modifier;
    }
  });

  return result;
};

/**
 * Enhanced async thunk for recalculating all player stats using centralized constants
 */
export const recalculateStatsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'player/recalculateStatsThunk', 
  async (_, { getState, dispatch }) => {
    const state = getState();
    const playerState = state.player;
    const allTraits = state.traits.traits;

    // 1. Start with fresh base stats
    const baseStats = { ...PLAYER_BASE_STATS };

    // 2. Apply attribute bonuses using centralized formulas
    const { attributes } = playerState;
    const strengthBonus = calculateAttributeModifier(attributes.strength);
    const dexterityBonus = calculateAttributeModifier(attributes.dexterity);
    const intelligenceBonus = calculateAttributeModifier(attributes.intelligence);
    const constitutionBonus = calculateAttributeModifier(attributes.constitution);
    const wisdomBonus = calculateAttributeModifier(attributes.wisdom);
    const charismaBonus = calculateAttributeModifier(attributes.charisma);

    // Apply attribute-derived stats using constants
    baseStats.maxHealth += constitutionBonus * STAT_FORMULAS.HEALTH_PER_CONSTITUTION;
    baseStats.maxMana += intelligenceBonus * STAT_FORMULAS.MANA_PER_INTELLIGENCE;
    baseStats.attack += strengthBonus;
    baseStats.defense += constitutionBonus;
    baseStats.speed += dexterityBonus;
    baseStats.healthRegen += constitutionBonus * STAT_FORMULAS.HEALTH_REGEN_PER_CONSTITUTION;
    baseStats.manaRegen += wisdomBonus * STAT_FORMULAS.MANA_REGEN_PER_WISDOM;
    baseStats.criticalChance += dexterityBonus * STAT_FORMULAS.CRIT_CHANCE_PER_DEXTERITY;
    baseStats.criticalDamage += strengthBonus * STAT_FORMULAS.CRIT_DAMAGE_PER_STRENGTH;

    // 3. Get all active traits (simplified - no trait slots in current PlayerState)
    const permanentTraitIds = playerState.permanentTraits || [];
    const activeTraitIds = [...permanentTraitIds];

    const activeTraits = activeTraitIds
      .map(id => allTraits[id])
      .filter(Boolean) as Trait[];

    // 4. Process trait effects with validation
    const traitEffects = processTraitEffects(activeTraits, baseStats);
    
    // Log any warnings from trait processing
    if (traitEffects.warnings && traitEffects.warnings.length > 0) {
      console.warn('Trait effect processing warnings:', traitEffects.warnings);
    }

    const statsWithTraitEffects = applyTraitEffectsToStats(baseStats, traitEffects);

    // 5. Apply status effect modifiers
    const statusModifiers: Partial<PlayerStats> = {};
    playerState.statusEffects.forEach(effect => {
      if (effect.effects) {
        Object.entries(effect.effects).forEach(([stat, value]) => {
          if (stat in statsWithTraitEffects) {
            statusModifiers[stat as keyof PlayerStats] = 
              (statusModifiers[stat as keyof PlayerStats] || 0) + (value as number);
          }
        });
      }
    });

    // 6. Apply status effects to get final stats
    const finalStats: PlayerStats = { ...statsWithTraitEffects };
    Object.entries(statusModifiers).forEach(([stat, modifier]) => {
      const statKey = stat as keyof PlayerStats;
      if (typeof finalStats[statKey] === 'number' && typeof modifier === 'number') {
        (finalStats[statKey] as number) += modifier;
      }
    });

    // 7. Apply final constraints using constants
    finalStats.maxHealth = Math.max(STAT_LIMITS.MIN_MAX_HEALTH, finalStats.maxHealth);
    finalStats.maxMana = Math.max(STAT_LIMITS.MIN_MAX_MANA, finalStats.maxMana);
    finalStats.attack = Math.max(STAT_LIMITS.MIN_ATTACK, finalStats.attack);
    finalStats.defense = Math.max(STAT_LIMITS.MIN_DEFENSE, finalStats.defense);
    finalStats.speed = Math.max(STAT_LIMITS.MIN_SPEED, finalStats.speed);
    finalStats.healthRegen = Math.max(STAT_LIMITS.MIN_HEALTH_REGEN, finalStats.healthRegen);
    finalStats.manaRegen = Math.max(STAT_LIMITS.MIN_MANA_REGEN, finalStats.manaRegen);
    finalStats.criticalChance = Math.max(STAT_LIMITS.MIN_CRIT_CHANCE, Math.min(STAT_LIMITS.MAX_CRIT_CHANCE, finalStats.criticalChance));
    finalStats.criticalDamage = Math.max(STAT_LIMITS.MIN_CRIT_DAMAGE, finalStats.criticalDamage);

    // 8. Preserve current health/mana within new limits
    finalStats.health = Math.max(STAT_LIMITS.MIN_HEALTH, Math.min(
      playerState.stats.health + (statusModifiers.health || 0),
      finalStats.maxHealth
    ));
    finalStats.mana = Math.max(STAT_LIMITS.MIN_MANA, Math.min(
      playerState.stats.mana + (statusModifiers.mana || 0),
      finalStats.maxMana
    ));

    // 9. Update state
    dispatch(playerSlice.actions.updateStats(finalStats));
  }
);

/**
 * Process status effects and remove expired ones
 */
export const processStatusEffectsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'player/processStatusEffectsThunk',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const currentTime = Date.now();
    
    // Remove expired effects individually
    state.player.statusEffects.forEach(effect => {
      const elapsed = currentTime - effect.startTime;
      if (effect.duration !== -1 && elapsed >= effect.duration) {
        dispatch(playerSlice.actions.removeStatusEffect(effect.id));
      }
    });
    
    // Recalculate stats after removing expired effects
    dispatch(recalculateStatsThunk());
  }
);

/**
 * Auto-regeneration thunk for health and mana over time
 */
export const regenerateVitalsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'player/regenerateVitals',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const player = selectPlayer(state);
    const stats = selectPlayerStats(state);
    
    // Calculate regeneration amounts (assuming per-second rates)
    const healthRegen = Math.min(stats.healthRegen, stats.maxHealth - stats.health);
    const manaRegen = Math.min(stats.manaRegen, stats.maxMana - stats.mana);
    
    if (healthRegen > 0) {
      dispatch(playerSlice.actions.restoreHealth(healthRegen));
    }
    
    if (manaRegen > 0) {
      dispatch(playerSlice.actions.restoreMana(manaRegen));
    }
  }
);

/**
 * Use a consumable item with validation
 */
export const useConsumableItemThunk = createAsyncThunk<
  void,
  { itemId: string; effects: Partial<PlayerStats>; duration?: number },
  { state: RootState }
>(
  'player/useConsumableItemThunk',
  async ({ itemId, effects, duration }, { getState, dispatch }) => {
    const state = getState();
    
    if (!state.player.isAlive) {
      throw new Error('Cannot use items when character is not alive');
    }

    // Apply immediate effects
    Object.entries(effects).forEach(([stat, value]) => {
      if (typeof value === 'number') {
        switch (stat) {
          case 'health':
            if (value > 0) dispatch(playerSlice.actions.restoreHealth(value));
            else dispatch(playerSlice.actions.takeDamage(Math.abs(value)));
            break;
          case 'mana':
            if (value > 0) dispatch(playerSlice.actions.restoreMana(value));
            else dispatch(playerSlice.actions.consumeMana(Math.abs(value)));
            break;
          // Add other immediate stat effects as needed
        }
      }
    });

    // Add temporary status effect if duration is specified
    if (duration && duration > 0) {
      const statusEffect: StatusEffect = {
        id: `consumable_${itemId}_${Date.now()}`,
        name: `Consumable Effect: ${itemId}`,
        description: `Temporary effect from using ${itemId}`,
        category: 'consumable',
        effects,
        duration,
        startTime: Date.now(),
        isActive: true,
      };

      dispatch(playerSlice.actions.addStatusEffect(statusEffect));
      dispatch(recalculateStatsThunk());
    }
  }
);

/**
 * Enhanced rest mechanic with customizable effects
 */
export const restThunk = createAsyncThunk(
  'player/rest',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const player = state.player;
    
    // Use hardcoded initial stats for restoration
    const initialStats = PLAYER_BASE_STATS;
    
    // Restore health and mana to maximum
    dispatch(playerSlice.actions.restoreHealth(initialStats.maxHealth));
    dispatch(playerSlice.actions.restoreMana(initialStats.maxMana));
    
    // Remove temporary status effects
    player.statusEffects.forEach(effect => {
      if (effect.duration > 0) {
        dispatch(playerSlice.actions.removeStatusEffect(effect.id));
      }
    });
    
    return { success: true, message: 'Player has rested and recovered.' };
  }
);

/**
 * Auto-allocate attribute points based on a simple strategy
 */
export const autoAllocateAttributesThunk = createAsyncThunk<
  void,
  { strategy?: 'balanced' | 'combat' | 'magic' | 'social' },
  { state: RootState }
>(
  'player/autoAllocateAttributesThunk',
  async ({ strategy = 'balanced' }, { getState, dispatch }) => {
    const state = getState();
    const { availableAttributePoints, attributes } = state.player;

    if (availableAttributePoints <= 0) return;

    // Define allocation strategies
    const strategies = {
      balanced: { str: 1, dex: 1, int: 1, con: 1, wis: 1, cha: 1 },
      combat: { str: 3, dex: 2, int: 0, con: 2, wis: 0, cha: 1 },
      magic: { str: 0, dex: 1, int: 3, con: 1, wis: 2, cha: 1 },
      social: { str: 1, dex: 1, int: 1, con: 1, wis: 1, cha: 3 },
    };

    const allocation = strategies[strategy];
    const totalWeight = Object.values(allocation).reduce((sum, weight) => sum + weight, 0);

    // Distribute points proportionally
    Object.entries(allocation).forEach(([stat, weight]) => {
      const pointsToAllocate = Math.floor((availableAttributePoints * weight) / totalWeight);
      
      for (let i = 0; i < pointsToAllocate; i++) {
        // Use existing allocateAttributePoint action through the slice
        // This would need to be called multiple times or batch processed
      }
    });

    // Recalculate stats after allocation
    dispatch(recalculateStatsThunk());
  }
);

/**
 * Processes all active trait effects and updates the player's active trait effects
 */
export const updateActiveTraitEffectsThunk = createAsyncThunk<
  ProcessedTraitEffects,
  void,
  { state: RootState }
>(
  'player/updateActiveTraitEffects',
  async (_, { getState }) => {
    const state = getState();
    
    // Get equipped and permanent trait objects
    const equippedTraits = selectEquippedTraitObjects(state);
    const permanentTraits = selectPermanentTraitObjects(state);
    
    // Process and validate trait effects
    const rawEffects = processTraitEffects(equippedTraits, permanentTraits);
    const validatedEffects = validateTraitEffects(rawEffects);
    
    return validatedEffects;
  }
);

/**
 * Recalculates player stats based on current attributes, traits, and status effects
 */
export const recalculatePlayerStatsThunk = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'player/recalculateStats',
  async (_, { dispatch }) => {
    // First update active trait effects
    const result = await dispatch(updateActiveTraitEffectsThunk());
    
    if (updateActiveTraitEffectsThunk.fulfilled.match(result)) {
      // Then trigger stat recalculation in the slice
      dispatch({ type: 'player/recalculateStats' });
    }
  }
);

// Export individual actions for convenience
export const {
  addAttributePoints,
  addPermanentTrait,
  addSkillPoints,
  addStatusEffect,
  allocateAttributePoint,
  consumeMana,
  incrementResonanceLevel,
  recalculateStats,
  removePermanentTrait,
  removeStatusEffect,
  resetPlayer,
  restoreHealth,
  restoreMana,
  setPlayerAlive,
  setResonanceLevel,
  takeDamage,
  updateStats,
  updateTotalPlaytime
} = playerSlice.actions;
