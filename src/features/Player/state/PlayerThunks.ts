import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { StatusEffect, PlayerStats } from './PlayerTypes';
import { Trait } from '../../Traits/state/TraitsTypes';
import { 
  updateStats, 
  updateTraitEffects, 
  initialState as playerInitialState,
  addAttributePoints,
  addSkillPoints,
  restoreHealth,
  restoreMana,
  takeDamage,
  consumeMana,
  addStatusEffect,
  removeStatusEffect,
  updateStatusEffects,
  setPlayerAlive
} from './PlayerSlice';
import { 
  processTraitEffects, 
  applyTraitEffectsToStats
} from '../utils/traitEffectProcessor'; // Corrected import path
import {
  STAT_FORMULAS,
  STAT_LIMITS,
  STATUS_EFFECT_CONSTANTS,
  calculateAttributeModifier
} from '../../../constants/playerConstants';

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
    const baseStats = { ...playerInitialState.stats };

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

    // 3. Get all active traits
    const equippedTraitIds = playerState.traitSlots
      .filter(slot => slot.isUnlocked && slot.traitId)
      .map(slot => slot.traitId as string);
    const permanentTraitIds = playerState.permanentTraits || [];
    const activeTraitIds = Array.from(new Set([...equippedTraitIds, ...permanentTraitIds]));

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
    dispatch(updateStats(finalStats));
    dispatch(updateTraitEffects(traitEffects));
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
    
    const activeEffects = state.player.statusEffects.filter(effect => {
      const elapsed = currentTime - effect.startTime;
      return effect.isActive && elapsed < effect.duration;
    });

    dispatch(updateStatusEffects(activeEffects));
    
    // Recalculate stats after removing expired effects
    dispatch(recalculateStatsThunk());
  }
);

/**
 * Regenerate health and mana over time
 */
export const regenerateVitalsThunk = createAsyncThunk<
  void,
  number, // deltaTime in seconds
  { state: RootState }
>(
  'player/regenerateVitalsThunk',
  async (deltaTime, { getState, dispatch }) => {
    const state = getState();
    const { stats } = state.player;
    
    if (!state.player.isAlive) return;

    const healthRegen = stats.healthRegen * deltaTime;
    const manaRegen = stats.manaRegen * deltaTime;

    if (healthRegen > 0 && stats.health < stats.maxHealth) {
      dispatch(restoreHealth(healthRegen));
    }

    if (manaRegen > 0 && stats.mana < stats.maxMana) {
      dispatch(restoreMana(manaRegen));
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
            if (value > 0) dispatch(restoreHealth(value));
            else dispatch(takeDamage(Math.abs(value)));
            break;
          case 'mana':
            if (value > 0) dispatch(restoreMana(value));
            else dispatch(consumeMana(Math.abs(value)));
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
        category: STATUS_EFFECT_CONSTANTS.CATEGORIES.CONSUMABLE as 'consumable',
        effects,
        duration,
        startTime: Date.now(),
        isActive: true,
      };

      dispatch(addStatusEffect(statusEffect));
      dispatch(recalculateStatsThunk());
    }
  }
);

/**
 * Enhanced rest mechanic with customizable effects
 */
export const restThunk = createAsyncThunk<
  void,
  { restoreHealthPercent?: number; restoreManaPercent?: number; removeStatusEffects?: boolean },
  { state: RootState }
>(
  'player/restThunk',
  async ({ 
    restoreHealthPercent = 1.0, 
    restoreManaPercent = 1.0, 
    removeStatusEffects = true 
  }, { getState, dispatch }) => {
    const state = getState();
    const { stats } = state.player;

    // Restore health and mana by percentage
    const healthToRestore = (stats.maxHealth - stats.health) * restoreHealthPercent;
    const manaToRestore = (stats.maxMana - stats.mana) * restoreManaPercent;

    if (healthToRestore > 0) {
      dispatch(restoreHealth(healthToRestore));
    }

    if (manaToRestore > 0) {
      dispatch(restoreMana(manaToRestore));
    }

    // Remove negative status effects if requested
    if (removeStatusEffects) {
      const remainingEffects = state.player.statusEffects.filter(effect => 
        effect.category !== STATUS_EFFECT_CONSTANTS.CATEGORIES.DEBUFF &&
        effect.category !== STATUS_EFFECT_CONSTANTS.CATEGORIES.FATIGUE
      );
      dispatch(updateStatusEffects(remainingEffects));
    }

    // Revive player if they were dead
    if (!state.player.isAlive) {
      dispatch(setPlayerAlive(true));
    }

    dispatch(recalculateStatsThunk());
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
