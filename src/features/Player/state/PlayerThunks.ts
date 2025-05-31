import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { StatusEffect, PlayerStats } from './PlayerTypes';
import { Trait, TraitEffectValues } from '../../Traits/state/TraitsTypes';
import { updateStats, initialState as playerInitialState } from './PlayerSlice';

/**
 * Async thunk for processing status effects over time
 * Handles duration tracking, expiration, and effect removal
 */
export const processStatusEffectsThunk = createAsyncThunk<
  string[], // Array of expired effect IDs
  void,
  { state: RootState }
>('player/processStatusEffects', async (_, { getState }) => {
  const state = getState();
  const player = state.player;
  const currentTime = Date.now();
  
  // Find expired effects
  const expiredEffectIds = player.statusEffects
    .filter(effect => effect.duration > 0 && (effect.startTime + effect.duration) <= currentTime)
    .map(effect => effect.id);
  
  return expiredEffectIds;
});

/**
 * Async thunk for regenerating health and mana over time
 * Applies regeneration rates and caps at maximum values
 */
export const regenerateVitalsThunk = createAsyncThunk<
  { healthRegenerated: number; manaRegenerated: number },
  number, // deltaTime in milliseconds
  { state: RootState }
>(
  'player/regenerateVitals', async (deltaTime, { getState }) => {
    const state = getState();
    const player = state.player;
    const stats = player.stats;
    
    // Calculate regeneration amounts (per second, so convert deltaTime to seconds)
    const timeInSeconds = deltaTime / 1000;
    const healthRegenerated = Math.min(
      stats.healthRegen * timeInSeconds,
      stats.maxHealth - stats.health
    );
    const manaRegenerated = Math.min(
      stats.manaRegen * timeInSeconds,
      stats.maxMana - stats.mana
    );
    
    return {
      healthRegenerated: Math.max(0, healthRegenerated),
      manaRegenerated: Math.max(0, manaRegenerated)
    };
  });

/**
 * Async thunk for using consumable items
 * Applies item effects and handles item consumption
 */
export const useConsumableItemThunk = createAsyncThunk<
  { effectsApplied: StatusEffect[]; statsModified: Record<string, number> },
  { itemId: string; effectData: Record<string, any> },
  { state: RootState }
>(
  'player/useConsumableItem', async ({ itemId, effectData }, { getState, rejectWithValue }) => {
    const state = getState();
    const player = state.player;
    
    try {
      // Process item effects
      const effectsApplied: StatusEffect[] = [];
      const statsModified: Record<string, number> = {};
      
      // Example: Health potion
      if (effectData.healAmount) {
        const healAmount = Math.min(effectData.healAmount, player.stats.maxHealth - player.stats.health);
        statsModified.health = healAmount;
      }
      
      // Example: Mana potion
      if (effectData.manaAmount) {
        const manaAmount = Math.min(effectData.manaAmount, player.stats.maxMana - player.stats.mana);
        statsModified.mana = manaAmount;
      }
      
      // Example: Temporary buff
      if (effectData.buffEffect) {
        const buffEffect: StatusEffect = {
          id: `item_${itemId}_${Date.now()}`,
          name: effectData.buffEffect.name,
          description: effectData.buffEffect.description,
          duration: effectData.buffEffect.duration,
          effects: effectData.buffEffect.statModifiers,
          startTime: Date.now(),
          type: 'buff',
          category: 'consumable'
        };
        effectsApplied.push(buffEffect);
      }
      
      return { effectsApplied, statsModified };
    } catch (error) {
      return rejectWithValue(`Failed to use item ${itemId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

/**
 * Async thunk for resting/camping
 * Provides enhanced recovery and potentially removes certain debuffs
 */
export const restThunk = createAsyncThunk<
  { healthRestored: number; manaRestored: number; effectsRemoved: string[] },
  { restDuration: number; restQuality: 'poor' | 'normal' | 'good' | 'excellent' },
  { state: RootState }
>(
  'player/rest', async ({ restDuration, restQuality }, { getState }) => {
    const state = getState();
    const player = state.player;
    const stats = player.stats;
    
    // Calculate rest effectiveness multipliers
    const qualityMultipliers = {
      poor: 0.5,
      normal: 1.0,
      good: 1.5,
      excellent: 2.0
    };
    
    const multiplier = qualityMultipliers[restQuality];
    const timeInMinutes = restDuration / 60000; // Convert to minutes
    
    // Calculate restoration amounts
    const healthRestored = Math.min(
      stats.maxHealth * 0.1 * multiplier * timeInMinutes, // 10% per minute base
      stats.maxHealth - stats.health
    );
    
    const manaRestored = Math.min(
      stats.maxMana * 0.15 * multiplier * timeInMinutes, // 15% per minute base
      stats.maxMana - stats.mana
    );
    
    // Remove certain negative effects during good rest
    const effectsRemoved: string[] = [];
    if (restQuality === 'good' || restQuality === 'excellent') {
      player.statusEffects.forEach(effect => {
        if (effect.type === 'debuff' && effect.category === 'fatigue') {
          effectsRemoved.push(effect.id);
        }
      });
    }
    
    return {
      healthRestored: Math.max(0, healthRestored),
      manaRestored: Math.max(0, manaRestored),
      effectsRemoved
    };
  });

/**
 * Async thunk for automatic attribute allocation
 * Distributes available points based on a strategy
 */
export const autoAllocateAttributesThunk = createAsyncThunk<
  Record<string, number>, // Allocation results
  { strategy: 'balanced' | 'combat' | 'social' | 'magical'; pointsToSpend?: number },
  { state: RootState }
>(
  'player/autoAllocateAttributes', async ({ strategy, pointsToSpend }, { getState, rejectWithValue }) => {
    const state = getState();
    const player = state.player;
    const availablePoints = pointsToSpend || player.availableAttributePoints;
    
    if (availablePoints <= 0) {
      return rejectWithValue('No attribute points available to allocate');
    }
    
    const allocation: Record<string, number> = {
      strength: 0,
      dexterity: 0,
      intelligence: 0,
      constitution: 0,
      wisdom: 0,
      charisma: 0
    };
    
    // Define allocation strategies
    const strategies = {
      balanced: [1, 1, 1, 1, 1, 1], // Equal distribution
      combat: [3, 2, 0, 2, 0, 1], // Focus on physical combat
      social: [0, 1, 1, 1, 2, 3], // Focus on social interaction
      magical: [0, 1, 3, 1, 3, 0] // Focus on magical abilities
    };
    
    const weights = strategies[strategy];
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const attributes = ['strength', 'dexterity', 'intelligence', 'constitution', 'wisdom', 'charisma'];
    
    // Distribute points based on strategy weights
    let remainingPoints = availablePoints;
    for (let i = 0; i < attributes.length && remainingPoints > 0; i++) {
      const attribute = attributes[i];
      const weight = weights[i];
      const pointsForAttribute = Math.floor((availablePoints * weight) / totalWeight);
      const actualPoints = Math.min(pointsForAttribute, remainingPoints);
      
      allocation[attribute] = actualPoints;
      remainingPoints -= actualPoints;
    }
    
    // Distribute any remaining points to the highest priority attributes
    while (remainingPoints > 0) {
      const maxWeightIndex = weights.indexOf(Math.max(...weights));
      const attribute = attributes[maxWeightIndex];
      allocation[attribute]++;
      remainingPoints--;
      weights[maxWeightIndex] = 0; // Prevent infinite loop
    }
    
    return allocation;
  });

/**
 * Async thunk for recalculating all player stats based on attributes, status effects, and traits.
 */
export const recalculateStatsThunk = createAsyncThunk<
  void, // Returns nothing as it dispatches updateStats
  void, // Takes no arguments
  { state: RootState }
>(
  'player/recalculateStatsThunk', async (_, { getState, dispatch }) => {
    const state = getState();
    const playerState = state.player;
    const allTraits = state.traits.traits; // Access all trait definitions

    // Base stats (use a fresh copy of initial stats to avoid compounding)
    const baseStats = { ...playerInitialState.stats };

    // 1. Get all active trait IDs (equipped + permanent)
    const equippedTraitIds = playerState.traitSlots
      .filter(slot => slot.isUnlocked && slot.traitId)
      .map(slot => slot.traitId as string);
    const permanentTraitIds = playerState.permanentTraits || [];
    const activeTraitIds = Array.from(new Set([...equippedTraitIds, ...permanentTraitIds])); // Changed to Array.from

    // 2. Initialize trait modifiers
    const traitModifiers: Partial<PlayerStats> = {};

    // 3. Aggregate effects from active traits
    activeTraitIds.forEach(traitId => {
      const trait = allTraits[traitId];
      if (trait && trait.effects) {
        // Assuming effects is TraitEffectValues (Record<string, number>) for direct stat changes
        // If it can also be TraitEffect[], more complex logic is needed here
        if (!Array.isArray(trait.effects)) { // Check if it's TraitEffectValues
          for (const [statKey, value] of Object.entries(trait.effects as TraitEffectValues)) {
            if (statKey in baseStats) { // Ensure the effect targets a valid player stat
              traitModifiers[statKey as keyof PlayerStats] = 
                (traitModifiers[statKey as keyof PlayerStats] || 0) + value;
            }
          }
        } else {
          // TODO: Handle TraitEffect[] if necessary (e.g., effects with duration, type, etc.)
          // For now, focusing on direct TraitEffectValues
          console.warn(`Trait ${traitId} has effects in array format, not yet fully handled in recalculateStatsThunk.`);
        }
      }
    });

    // 4. Calculate attribute bonuses
    const { attributes, statusEffects } = playerState;
    const strengthBonus = Math.floor((attributes.strength - 10) / 2);
    const dexterityBonus = Math.floor((attributes.dexterity - 10) / 2);
    const intelligenceBonus = Math.floor((attributes.intelligence - 10) / 2);
    const constitutionBonus = Math.floor((attributes.constitution - 10) / 2);
    const wisdomBonus = Math.floor((attributes.wisdom - 10) / 2);

    // 5. Calculate status effect modifiers
    const statusModifiers: Partial<PlayerStats> = {};
    statusEffects.forEach(effect => {
      if (effect.effects) {
        Object.entries(effect.effects).forEach(([stat, value]) => {
          if (stat in baseStats) {
            statusModifiers[stat as keyof PlayerStats] = 
              (statusModifiers[stat as keyof PlayerStats] || 0) + (value as number);
          }
        });
      }
    });

    // 6. Calculate final stats
    const finalStats: PlayerStats = {
      ...baseStats, // Start with base
      maxHealth: Math.max(1, (baseStats.maxHealth || 0) + (constitutionBonus * 5) + (statusModifiers.maxHealth || 0) + (traitModifiers.maxHealth || 0)),
      maxMana: Math.max(0, (baseStats.maxMana || 0) + (intelligenceBonus * 3) + (statusModifiers.maxMana || 0) + (traitModifiers.maxMana || 0)),
      attack: Math.max(0, (baseStats.attack || 0) + strengthBonus + (statusModifiers.attack || 0) + (traitModifiers.attack || 0)),
      defense: Math.max(0, (baseStats.defense || 0) + constitutionBonus + (statusModifiers.defense || 0) + (traitModifiers.defense || 0)),
      speed: Math.max(0, (baseStats.speed || 0) + dexterityBonus + (statusModifiers.speed || 0) + (traitModifiers.speed || 0)),
      healthRegen: Math.max(0, (baseStats.healthRegen || 0) + (constitutionBonus * 0.1) + (statusModifiers.healthRegen || 0) + (traitModifiers.healthRegen || 0)),
      manaRegen: Math.max(0, (baseStats.manaRegen || 0) + (wisdomBonus * 0.15) + (statusModifiers.manaRegen || 0) + (traitModifiers.manaRegen || 0)),
      criticalChance: Math.max(0, Math.min(1, (baseStats.criticalChance || 0) + (dexterityBonus * 0.01) + (statusModifiers.criticalChance || 0) + (traitModifiers.criticalChance || 0))),
      criticalDamage: Math.max(1, (baseStats.criticalDamage || 0) + (strengthBonus * 0.05) + (statusModifiers.criticalDamage || 0) + (traitModifiers.criticalDamage || 0)), // Removed extra parenthesis
      // health and mana are set after maxHealth and maxMana are calculated
      health: 0, // Placeholder, will be set below
      mana: 0,   // Placeholder, will be set below
    };

    // Set current health and mana, capped by their new maximums
    // This preserves current health/mana unless the new max is lower.
    finalStats.health = Math.max(0, Math.min(playerState.stats.health + (traitModifiers.health || 0) + (statusModifiers.health || 0), finalStats.maxHealth));
    finalStats.mana = Math.max(0, Math.min(playerState.stats.mana + (traitModifiers.mana || 0) + (statusModifiers.mana || 0), finalStats.maxMana));
    
    // Ensure current health and mana are not reset if only max values changed
    // If only maxHealth changed due to a buff, current health shouldn't jump to maxHealth unless it was already there or a heal also occurred.
    // The current logic for health/mana might need refinement if direct health/mana changes from traits/status effects are additive to current, then capped.
    // For now, this recalculates max values and then ensures current values are within bounds.
    // If a trait directly adds +10 health (not maxHealth), that needs a different handling.
    // The current trait.effects are assumed to modify base/max stats, not current temporary values.

    dispatch(updateStats(finalStats));
  });
