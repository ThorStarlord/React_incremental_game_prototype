import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { StatusEffect } from './PlayerTypes';
import { 
  modifyHealth, 
  modifyMana, 
  addStatusEffect, 
  removeStatusEffect,
  recalculateStats,
  updatePlayTime
} from './PlayerSlice';

/**
 * Regenerate player health and mana based on regeneration stats
 */
export const regeneratePlayerResources = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'player/regenerateResources',
  async (_, { dispatch, getState }) => {
    const { player } = getState();
    
    if (!player.isAlive) return;
    
    const { stats } = player;
    
    // Regenerate health if not at maximum
    if (stats.health < stats.maxHealth) {
      dispatch(modifyHealth({
        amount: stats.healthRegen,
        type: 'heal'
      }));
    }
    
    // Regenerate mana if not at maximum
    if (stats.mana < stats.maxMana) {
      dispatch(modifyMana({
        amount: stats.manaRegen,
        type: 'restore'
      }));
    }
  }
);

/**
 * Process status effects (reduce duration, remove expired)
 */
export const processStatusEffects = createAsyncThunk<
  void,
  number, // deltaTime in seconds
  { state: RootState }
>(
  'player/processStatusEffects',
  async (deltaTime, { dispatch, getState }) => {
    const { player } = getState();
    
    // Process each status effect
    for (const effect of player.statusEffects) {
      const newDuration = effect.duration - deltaTime;
      
      if (newDuration <= 0) {
        // Effect expired, remove it
        dispatch(removeStatusEffect(effect.id));
      } else {
        // Update effect with new duration
        const updatedEffect: StatusEffect = {
          ...effect,
          duration: newDuration
        };
        dispatch(addStatusEffect(updatedEffect));
      }
    }
    
    // Recalculate stats after processing effects
    dispatch(recalculateStats());
  }
);

/**
 * Use a consumable item
 */
export const useConsumableItem = createAsyncThunk<
  boolean,
  { itemId: string; effects: Partial<{ health: number; mana: number; statusEffects: StatusEffect[] }> },
  { state: RootState }
>(
  'player/useConsumableItem',
  async ({ itemId, effects }, { dispatch, getState }) => {
    const { player } = getState();
    
    if (!player.isAlive) {
      return false;
    }
    
    // Apply health effects
    if (effects.health) {
      if (effects.health > 0) {
        dispatch(modifyHealth({ amount: effects.health, type: 'heal' }));
      } else {
        dispatch(modifyHealth({ amount: Math.abs(effects.health), type: 'damage' }));
      }
    }
    
    // Apply mana effects
    if (effects.mana) {
      if (effects.mana > 0) {
        dispatch(modifyMana({ amount: effects.mana, type: 'restore' }));
      } else {
        dispatch(modifyMana({ amount: Math.abs(effects.mana), type: 'spend' }));
      }
    }
    
    // Apply status effects
    if (effects.statusEffects) {
      effects.statusEffects.forEach(effect => {
        dispatch(addStatusEffect(effect));
      });
    }
    
    return true;
  }
);

/**
 * Rest action - restore health and mana over time
 */
export const restPlayer = createAsyncThunk<
  void,
  { duration: number }, // Rest duration in seconds
  { state: RootState }
>(
  'player/rest',
  async ({ duration }, { dispatch, getState }) => {
    const { player } = getState();
    
    if (!player.isAlive) return;
    
    // Calculate rest healing (faster than normal regeneration)
    const restHealthGain = Math.floor((player.stats.healthRegen * 3) * duration);
    const restManaGain = Math.floor((player.stats.manaRegen * 3) * duration);
    
    // Apply rest healing
    if (player.stats.health < player.stats.maxHealth) {
      dispatch(modifyHealth({
        amount: restHealthGain,
        type: 'heal'
      }));
    }
    
    if (player.stats.mana < player.stats.maxMana) {
      dispatch(modifyMana({
        amount: restManaGain,
        type: 'restore'
      }));
    }
    
    // Update play time
    const currentTime = Date.now();
    dispatch(updatePlayTime(player.totalPlayTime + (duration * 1000)));
  }
);

/**
 * Level up attribute automatically based on points
 */
export const autoAllocateAttributes = createAsyncThunk<
  void,
  { distribution: Record<string, number> }, // Percentage distribution
  { state: RootState }
>(
  'player/autoAllocateAttributes',
  async ({ distribution }, { dispatch, getState }) => {
    const { player } = getState();
    
    if (player.attributePoints <= 0) return;
    
    const totalPoints = player.attributePoints;
    const allocations: Record<string, number> = {};
    
    // Calculate allocation for each attribute
    Object.entries(distribution).forEach(([attribute, percentage]) => {
      const points = Math.floor((percentage / 100) * totalPoints);
      if (points > 0 && player.attributes[attribute]) {
        allocations[attribute] = points;
      }
    });
    
    // Apply allocations
    Object.entries(allocations).forEach(([attribute, points]) => {
      dispatch({
        type: 'player/allocateAttribute',
        payload: { attributeName: attribute, points }
      });
    });
  }
);

/**
 * Update play time periodically
 */
export const updatePlayTimeThunk = createAsyncThunk<
  void,
  number, // Current timestamp
  { state: RootState }
>(
  'player/updatePlayTime',
  async (currentTime, { dispatch, getState }) => {
    const { player } = getState();
    
    // This would typically be called from the game loop
    // The actual time calculation would be handled elsewhere
    dispatch(updatePlayTime(currentTime));
  }
);