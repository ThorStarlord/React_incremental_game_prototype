import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  modifyHealth,
  modifyMana,
  addStatusEffect,
  removeStatusEffect,
  recalculateStats,
  updatePlaytime,
  allocateAttributePoint
} from './PlayerSlice';

/**
 * Result interface for regeneration operations
 */
interface RegenerationResult {
  healthGained: number;
  manaGained: number;
  timestamp: number;
}

/**
 * Result interface for status effect processing
 */
interface StatusEffectProcessingResult {
  effectsRemoved: number;
  effectsUpdated: number;
  statsRecalculated: boolean;
}

/**
 * Result interface for consumable usage
 */
interface ConsumableResult {
  success: boolean;
  message: string;
  healthChanged?: number;
  manaChanged?: number;
  statusEffectsApplied?: number;
}

/**
 * Result interface for rest action
 */
interface RestResult {
  healthGained: number;
  manaGained: number;
  duration: number;
  timestamp: number;
}

/**
 * Interface for attribute allocation distribution
 */
interface AttributeDistribution {
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  constitution?: number;
  wisdom?: number;
  charisma?: number;
}

/**
 * Thunk for handling player resource regeneration over time
 * Applies natural health and mana regeneration based on player stats
 * 
 * @returns RegenerationResult containing health/mana gained and timestamp
 */
export const regenerateResourcesThunk = createAsyncThunk<
  RegenerationResult,
  void,
  { state: RootState; rejectValue: string }
>(
  'player/regenerateResources',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { player } = getState();
      
      if (!player) {
        return rejectWithValue('Player state not found');
      }

      const stats = player.stats;
      let healthGained = 0;
      let manaGained = 0;
      
      // Validate regeneration stats
      if (stats.healthRegeneration < 0 || stats.manaRegeneration < 0) {
        return rejectWithValue('Invalid regeneration stats');
      }
      
      // Regenerate health if not at maximum and regeneration is positive
      if (stats.health < stats.maxHealth && stats.healthRegeneration > 0) {
        healthGained = Math.min(
          stats.healthRegeneration,
          stats.maxHealth - stats.health
        );
        dispatch(modifyHealth(healthGained));
      }
      
      // Regenerate mana if not at maximum and regeneration is positive
      if (stats.mana < stats.maxMana && stats.manaRegeneration > 0) {
        manaGained = Math.min(
          stats.manaRegeneration,
          stats.maxMana - stats.mana
        );
        dispatch(modifyMana(manaGained));
      }

      return {
        healthGained,
        manaGained,
        timestamp: Date.now()
      };
    } catch (error) {
      return rejectWithValue(`Regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Process status effects by reducing duration and removing expired effects
 * Updates all active status effects and recalculates player stats
 * 
 * @param deltaTime - Time elapsed in seconds since last update
 * @returns StatusEffectProcessingResult with processing statistics
 */
export const processStatusEffectsThunk = createAsyncThunk<
  StatusEffectProcessingResult,
  number,
  { state: RootState; rejectValue: string }
>(
  'player/processStatusEffects',
  async (deltaTime, { dispatch, getState, rejectWithValue }) => {
    try {
      if (deltaTime < 0 || !Number.isFinite(deltaTime)) {
        return rejectWithValue('Invalid deltaTime provided');
      }

      const { player } = getState();
      
      if (!player || !Array.isArray(player.statusEffects)) {
        return rejectWithValue('Invalid player state or status effects');
      }

      let effectsRemoved = 0;
      let effectsUpdated = 0;
      
      // Process each status effect
      for (const effect of player.statusEffects) {
        if (!effect || typeof effect.duration !== 'number' || !effect.id) {
          continue; // Skip invalid effects
        }

        const newDuration = Math.max(0, effect.duration - deltaTime);
        
        if (newDuration <= 0) {
          // Effect expired, remove it
          dispatch(removeStatusEffect(effect.id));
          effectsRemoved++;
        } else if (newDuration !== effect.duration) {
          // Update effect with new duration
          const updatedEffect = {
            ...effect,
            duration: newDuration
          };
          dispatch(addStatusEffect(updatedEffect));
          effectsUpdated++;
        }
      }
      
      // Recalculate stats after processing effects
      dispatch(recalculateStats());
      
      return {
        effectsRemoved,
        effectsUpdated,
        statsRecalculated: true
      };
    } catch (error) {
      return rejectWithValue(`Status effect processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Thunk for using consumable items with various effects
 * Applies health, mana, and status effect changes from item consumption
 * 
 * @param params - Object containing itemId and effects to apply
 * @returns ConsumableResult indicating success and changes made
 */
export const useConsumableThunk = createAsyncThunk<
  ConsumableResult,
  { 
    itemId: string; 
    effects: { 
      health?: number; 
      mana?: number; 
      statusEffects?: Array<{
        id: string;
        name: string;
        description: string;
        duration: number;
        effects: Record<string, number>;
        startTime: number;
      }>; 
    } 
  },
  { state: RootState; rejectValue: string }
>(
  'player/useConsumable',
  async ({ itemId, effects }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!itemId || typeof itemId !== 'string') {
        return rejectWithValue('Invalid item ID');
      }

      const { player } = getState();
      
      if (!player) {
        return rejectWithValue('Player state not found');
      }

      let healthChanged = 0;
      let manaChanged = 0;
      let statusEffectsApplied = 0;
      
      // Apply health effects with bounds checking
      if (effects.health && typeof effects.health === 'number') {
        const currentHealth = player.stats.health;
        const maxHealth = player.stats.maxHealth;
        
        if (effects.health > 0) {
          // Healing - cap at max health
          healthChanged = Math.min(effects.health, maxHealth - currentHealth);
        } else {
          // Damage - don't go below 0
          healthChanged = Math.max(effects.health, -currentHealth);
        }
        
        if (healthChanged !== 0) {
          dispatch(modifyHealth(healthChanged));
        }
      }
      
      // Apply mana effects with bounds checking
      if (effects.mana && typeof effects.mana === 'number') {
        const currentMana = player.stats.mana;
        const maxMana = player.stats.maxMana;
        
        if (effects.mana > 0) {
          // Mana restoration - cap at max mana
          manaChanged = Math.min(effects.mana, maxMana - currentMana);
        } else {
          // Mana drain - don't go below 0
          manaChanged = Math.max(effects.mana, -currentMana);
        }
        
        if (manaChanged !== 0) {
          dispatch(modifyMana(manaChanged));
        }
      }
      
      // Apply status effects with validation
      if (effects.statusEffects && Array.isArray(effects.statusEffects)) {
        for (const effect of effects.statusEffects) {
          if (effect && effect.id && effect.name && typeof effect.duration === 'number') {
            // Ensure the status effect has all required properties
            const statusEffect = {
              ...effect,
              effects: effect.effects || {},
              startTime: effect.startTime || Date.now()
            };
            dispatch(addStatusEffect(statusEffect));
            statusEffectsApplied++;
          }
        }
      }
      
      // Recalculate stats after all effects
      dispatch(recalculateStats());
      
      return {
        success: true,
        message: `Successfully used ${itemId}`,
        healthChanged: healthChanged !== 0 ? healthChanged : undefined,
        manaChanged: manaChanged !== 0 ? manaChanged : undefined,
        statusEffectsApplied: statusEffectsApplied > 0 ? statusEffectsApplied : undefined
      };
    } catch (error) {
      return rejectWithValue(`Consumable use failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Thunk for player rest action with enhanced recovery
 * Provides accelerated health and mana regeneration during rest periods
 * 
 * @param params - Object containing rest duration in seconds
 * @returns RestResult with health/mana gained and rest details
 */
export const restThunk = createAsyncThunk<
  RestResult,
  { duration: number },
  { state: RootState; rejectValue: string }
>(
  'player/rest',
  async ({ duration }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (duration <= 0 || !Number.isFinite(duration)) {
        return rejectWithValue('Invalid rest duration');
      }

      const { player } = getState();
      
      if (!player) {
        return rejectWithValue('Player state not found');
      }
      
      // Rest provides 3x normal regeneration rate
      const restMultiplier = 3;
      const baseHealthGain = player.stats.healthRegeneration * restMultiplier * duration;
      const baseManaGain = player.stats.manaRegeneration * restMultiplier * duration;
      
      // Calculate actual gains with bounds checking
      const healthGained = Math.min(
        Math.floor(baseHealthGain),
        player.stats.maxHealth - player.stats.health
      );
      
      const manaGained = Math.min(
        Math.floor(baseManaGain),
        player.stats.maxMana - player.stats.mana
      );
      
      // Apply rest healing
      if (healthGained > 0) {
        dispatch(modifyHealth(healthGained));
      }
      
      if (manaGained > 0) {
        dispatch(modifyMana(manaGained));
      }
      
      // Update play time (convert duration to milliseconds)
      const playtimeIncrease = duration * 1000;
      dispatch(updatePlaytime(player.totalPlaytime + playtimeIncrease));

      const timestamp = Date.now();

      return {
        healthGained,
        manaGained,
        duration,
        timestamp
      };
    } catch (error) {
      return rejectWithValue(`Rest action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Auto-allocate attribute points based on percentage distribution
 * Distributes available attribute points according to specified percentages
 * 
 * @param params - Object containing distribution percentages for each attribute
 * @returns void - Success indicated by fulfilled action
 */
export const autoAllocateAttributesThunk = createAsyncThunk<
  void,
  { distribution: AttributeDistribution },
  { state: RootState; rejectValue: string }
>(
  'player/autoAllocateAttributes',
  async ({ distribution }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!distribution || typeof distribution !== 'object') {
        return rejectWithValue('Invalid distribution object');
      }

      const { player } = getState();
      
      if (!player) {
        return rejectWithValue('Player state not found');
      }
      
      if (player.unallocatedAttributePoints <= 0) {
        return rejectWithValue('No attribute points available to allocate');
      }
      
      const totalPoints = player.unallocatedAttributePoints;
      const validAttributes = ['strength', 'dexterity', 'intelligence', 'constitution', 'wisdom', 'charisma'];
      
      // Validate distribution percentages
      const totalPercentage = Object.values(distribution).reduce((sum, pct) => {
        if (typeof pct !== 'number' || pct < 0 || pct > 100) {
          throw new Error(`Invalid percentage value: ${pct}`);
        }
        return sum + pct;
      }, 0);
      
      if (totalPercentage > 100) {
        return rejectWithValue('Total distribution percentage exceeds 100%');
      }
      
      const allocations: Record<string, number> = {};
      let pointsAllocated = 0;
      
      // Calculate allocation for each attribute
      for (const [attribute, percentage] of Object.entries(distribution)) {
        if (!validAttributes.includes(attribute)) {
          return rejectWithValue(`Invalid attribute: ${attribute}`);
        }
        
        if (percentage > 0) {
          const points = Math.floor((percentage / 100) * totalPoints);
          if (points > 0) {
            allocations[attribute] = points;
            pointsAllocated += points;
          }
        }
      }
      
      if (pointsAllocated === 0) {
        return rejectWithValue('No points would be allocated with current distribution');
      }
      
      // Apply allocations
      for (const [attributeName, points] of Object.entries(allocations)) {
        dispatch(allocateAttributePoint({ attributeName, points }));
      }
      
      return undefined; // Void return type
    } catch (error) {
      return rejectWithValue(`Attribute allocation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Update play time tracking
 * Updates the player's total playtime with current session time
 * 
 * @param currentTime - Current timestamp in milliseconds
 * @returns void - Success indicated by fulfilled action
 */
export const updatePlayTimeThunk = createAsyncThunk<
  void,
  number,
  { state: RootState; rejectValue: string }
>(
  'player/updatePlayTime',
  async (currentTime, { dispatch, getState, rejectWithValue }) => {
    try {
      if (!Number.isFinite(currentTime) || currentTime <= 0) {
        return rejectWithValue('Invalid timestamp provided');
      }

      const { player } = getState();
      
      if (!player) {
        return rejectWithValue('Player state not found');
      }
      
      // Validate that the new time is reasonable (not too far in past/future)
      const now = Date.now();
      const timeDifference = Math.abs(currentTime - now);
      const maxReasonableDifference = 24 * 60 * 60 * 1000; // 24 hours
      
      if (timeDifference > maxReasonableDifference) {
        return rejectWithValue('Timestamp is too far from current time');
      }
      
      dispatch(updatePlaytime(currentTime));
      return undefined; // Void return type
    } catch (error) {
      return rejectWithValue(`Playtime update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);