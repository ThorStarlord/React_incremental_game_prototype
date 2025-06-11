import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { 
  modifyHealth, 
  modifyEnergy, 
  addStatusEffect, 
  removeStatusEffect,
  updatePlayer,
  recalculateStats,
  allocateAttribute
} from './PlayerSlice';
import type { StatusEffect, PlayerAttributes } from './PlayerTypes';

/**
 * Async thunk for regenerating player vitals over time
 * Applies health and mana regeneration based on current regen rates
 */
export const regenerateVitalsThunk = createAsyncThunk(
  'player/regenerateVitals',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const player = state.player;

    if (!player.isAlive) {
      return { healthGained: 0, manaGained: 0 };
    }

    // Calculate regeneration amounts based on delta time (in seconds)
    const timeInSeconds = deltaTime / 1000;
    const healthRegen = Math.floor(player.stats.healthRegen * timeInSeconds);
    const manaRegen = Math.floor(player.stats.manaRegen * timeInSeconds);

    let healthGained = 0;
    let manaGained = 0;

    // Apply health regeneration if needed and possible
    if (healthRegen > 0 && player.stats.health < player.stats.maxHealth) {
      const actualHealthGain = Math.min(healthRegen, player.stats.maxHealth - player.stats.health);
      dispatch(modifyHealth({ amount: actualHealthGain }));
      healthGained = actualHealthGain;
    }

    // Apply mana regeneration if needed and possible
    if (manaRegen > 0 && player.stats.mana < player.stats.maxMana) {
      const actualManaGain = Math.min(manaRegen, player.stats.maxMana - player.stats.mana);
      dispatch(modifyEnergy({ amount: actualManaGain }));
      manaGained = actualManaGain;
    }

    return { healthGained, manaGained };
  }
);

/**
 * Async thunk for processing status effects over time
 * Handles duration countdown and effect expiration
 */
export const processStatusEffectsThunk = createAsyncThunk(
  'player/processStatusEffects',
  async (deltaTime: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const player = state.player;
    const currentTime = Date.now();
    
    let effectsProcessed = 0;
    let effectsExpired = 0;

    // Process each status effect
    for (const effect of player.statusEffects) {
      // Skip permanent effects (duration -1)
      if (effect.duration === -1) {
        continue;
      }

      const elapsedTime = currentTime - effect.startTime;
      
      // Check if effect has expired
      if (elapsedTime >= effect.duration) {
        dispatch(removeStatusEffect({ effectId: effect.id }));
        effectsExpired++;
      }

      effectsProcessed++;
    }

    // Recalculate stats after effect changes
    if (effectsExpired > 0) {
      dispatch(recalculateStats());
    }

    return { effectsProcessed, effectsExpired };
  }
);

/**
 * Async thunk for using consumable items with effects
 * Applies item effects and manages duration-based status effects
 */
export const useConsumableItemThunk = createAsyncThunk(
  'player/useConsumableItem',
  async (
    itemData: {
      name: string;
      effects: Partial<{ health: number; mana: number; [key: string]: number }>;
      duration?: number;
      type?: string;
    },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const player = state.player;

    if (!player.isAlive) {
      throw new Error('Cannot use items while defeated');
    }

    // Apply immediate effects
    if (itemData.effects.health) {
      dispatch(modifyHealth({ amount: itemData.effects.health }));
    }

    if (itemData.effects.mana) {
      dispatch(modifyEnergy({ amount: itemData.effects.mana }));
    }

    // Apply status effect if duration is specified
    if (itemData.duration && itemData.duration > 0) {
      const statusEffect: StatusEffect = {
        id: `consumable_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${itemData.name} Effect`,
        description: `Temporary effect from ${itemData.name}`,
        duration: itemData.duration,
        effects: itemData.effects,
        startTime: Date.now(),
        type: itemData.type || 'consumable',
        category: 'consumable'
      };

      dispatch(addStatusEffect({ effect: statusEffect }));
    }

    // Recalculate stats to apply any changes
    dispatch(recalculateStats());

    return {
      itemUsed: itemData.name,
      effectsApplied: Object.keys(itemData.effects),
      statusEffectApplied: !!itemData.duration
    };
  }
);

/**
 * Async thunk for enhanced rest mechanics
 * Provides significant healing and status effect removal
 */
export const restThunk = createAsyncThunk(
  'player/rest',
  async (restQuality: 'basic' | 'good' | 'excellent' = 'basic', { getState, dispatch }) => {
    const state = getState() as RootState;
    const player = state.player;

    // Calculate rest effectiveness based on quality
    const restMultipliers = {
      basic: 0.5,
      good: 0.8,
      excellent: 1.0
    };

    const multiplier = restMultipliers[restQuality];
    const healthRestored = Math.floor((player.stats.maxHealth - player.stats.health) * multiplier);
    const manaRestored = Math.floor((player.stats.maxMana - player.stats.mana) * multiplier);

    // Apply healing
    if (healthRestored > 0) {
      dispatch(modifyHealth({ amount: healthRestored }));
    }

    if (manaRestored > 0) {
      dispatch(modifyEnergy({ amount: manaRestored }));
    }

    // Remove negative status effects based on rest quality
    const effectsToRemove = player.statusEffects.filter(effect => {
      // Remove debuffs on good or excellent rest
      if (restQuality === 'good' || restQuality === 'excellent') {
        return effect.type === 'debuff' || effect.category === 'negative';
      }
      // Remove only minor debuffs on basic rest
      return effect.category === 'minor_negative';
    });

    effectsToRemove.forEach(effect => {
      dispatch(removeStatusEffect({ effectId: effect.id }));
    });

    // Add rest bonus effect for excellent rest
    if (restQuality === 'excellent') {
      const restBonus: StatusEffect = {
        id: `rest_bonus_${Date.now()}`,
        name: 'Well Rested',
        description: 'Feeling refreshed and energized from excellent rest',
        duration: 3600000, // 1 hour
        effects: {
          healthRegen: player.stats.healthRegen * 0.5,
          manaRegen: player.stats.manaRegen * 0.5
        },
        startTime: Date.now(),
        type: 'buff',
        category: 'rest'
      };

      dispatch(addStatusEffect({ effect: restBonus }));
    }

    // Recalculate stats after all changes
    dispatch(recalculateStats());

    return {
      restQuality,
      healthRestored,
      manaRestored,
      effectsRemoved: effectsToRemove.length,
      bonusApplied: restQuality === 'excellent'
    };
  }
);

/**
 * Async thunk for automated attribute allocation
 * Distributes available attribute points according to specified strategy
 */
export const autoAllocateAttributesThunk = createAsyncThunk(
  'player/autoAllocateAttributes',
  async (
    strategy: 'balanced' | 'combat' | 'social' | 'magical' = 'balanced',
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const player = state.player;

    if (player.availableAttributePoints <= 0) {
      throw new Error('No attribute points available');
    }

    // Define allocation strategies
    const strategies = {
      balanced: {
        strength: 1,
        dexterity: 1,
        intelligence: 1,
        constitution: 1,
        wisdom: 1,
        charisma: 1
      },
      combat: {
        strength: 3,
        dexterity: 2,
        constitution: 2,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      },
      social: {
        charisma: 3,
        wisdom: 2,
        intelligence: 1,
        strength: 0,
        dexterity: 0,
        constitution: 1
      },
      magical: {
        intelligence: 3,
        wisdom: 2,
        constitution: 1,
        strength: 0,
        dexterity: 1,
        charisma: 0
      }
    };

    const allocation = strategies[strategy];
    const totalWeight = Object.values(allocation).reduce((sum, weight) => sum + weight, 0);
    let pointsToAllocate = player.availableAttributePoints;
    const allocatedPoints: Partial<PlayerAttributes> = {};

    // Distribute points according to strategy weights
    for (const [attribute, weight] of Object.entries(allocation)) {
      if (weight > 0 && pointsToAllocate > 0) {
        const pointsForAttribute = Math.floor((weight / totalWeight) * player.availableAttributePoints);
        const actualPoints = Math.min(pointsForAttribute, pointsToAllocate);
        
        if (actualPoints > 0) {
          dispatch(allocateAttribute({ 
            attribute: attribute as keyof PlayerAttributes, 
            amount: actualPoints 
          }));
          allocatedPoints[attribute as keyof PlayerAttributes] = actualPoints;
          pointsToAllocate -= actualPoints;
        }
      }
    }

    return {
      strategy,
      pointsAllocated: player.availableAttributePoints - pointsToAllocate,
      distribution: allocatedPoints
    };
  }
);

/**
 * Async thunk for level-up processing (if leveling system is implemented)
 * Handles attribute point awards and stat recalculation
 */
export const levelUpThunk = createAsyncThunk(
  'player/levelUp',
  async (newLevel: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const player = state.player;

    // Award attribute points (typically 1-2 per level)
    const attributePointsGained = 2;
    
    // Award skill points (if skill system exists)
    const skillPointsGained = 1;

    // Update player level and points
    dispatch(updatePlayer({
      availableAttributePoints: player.availableAttributePoints + attributePointsGained,
      availableSkillPoints: player.availableSkillPoints + skillPointsGained
    }));

    // Recalculate stats for new level
    dispatch(recalculateStats());

    return {
      newLevel,
      attributePointsGained,
      skillPointsGained
    };
  }
);
