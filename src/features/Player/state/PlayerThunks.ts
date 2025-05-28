import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { StatusEffect } from './PlayerTypes';

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
>('player/regenerateVitals', async (deltaTime, { getState }) => {
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
>('player/useConsumableItem', async ({ itemId, effectData }, { getState, rejectWithValue }) => {
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
>('player/rest', async ({ restDuration, restQuality }, { getState }) => {
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
>('player/autoAllocateAttributes', async ({ strategy, pointsToSpend }, { getState, rejectWithValue }) => {
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