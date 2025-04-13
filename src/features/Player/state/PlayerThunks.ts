import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import {
  updatePlayer,
  modifyHealth,
  modifyEnergy,
  updateAttribute,
  updateAttributes,
  allocateAttribute,
  updateSkill,
  learnSkill,
  addStatusEffect,
  removeStatusEffect
} from './PlayerSlice';
import {
  equipTrait, // <-- Make sure this is imported from TraitsSlice
  unequipTrait,
  makePermanent as makeTraitPermanentAction,
  unlockTraitSlot as unlockTraitSlotAction
} from '../../Traits/state/TraitsSlice';
import { spendEssence } from '../../Essence/state/EssenceSlice';
import { recalculatePlayerStats } from '../utils/playerStatCalculations';
import { 
  Attribute, 
  PlayerState, 
  PlayerStats,
  StatusEffect 
} from './PlayerTypes';

/**
 * Thunk for gaining experience and handling level-ups
 */
export const gainExperienceThunk = createAsyncThunk(
  'player/gainExperience',
  async (amount: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { player } = state;
    
    // Add experience
    const newExperience = player.experience + amount;
    
    // Calculate level and check for level up
    const currentLevel = player.level;
    const newLevel = calculateLevelFromExperience(newExperience);
    
    // Update player with new experience
    dispatch(updatePlayer({
      experience: newExperience
    }));
    
    // Handle level up if needed
    if (newLevel > currentLevel) {
      // Perform level up with bonus attribute and skill points
      const attributePointsGained = (newLevel - currentLevel);
      const skillPointsGained = (newLevel - currentLevel);
      
      const levelUpUpdates = {
        level: newLevel,
        attributePoints: player.attributePoints + attributePointsGained,
        skillPoints: player.skillPoints + skillPointsGained
      };
      
      dispatch(updatePlayer(levelUpUpdates));
      
      // Recalculate stats based on new level
      const updatedStats = handleLevelUpStats(player, newLevel);
      dispatch(updatePlayer({
        stats: updatedStats
      }));
      
      // Return level up data
      return {
        success: true,
        previousLevel: currentLevel,
        newLevel,
        attributePointsGained,
        skillPointsGained,
        experienceGained: amount
      };
    }
    
    // Return regular experience gain data
    return {
      success: true,
      experienceGained: amount,
      levelUp: false
    };
  }
);

/**
 * Thunk for recovering health and mana over time
 */
export const recoverOverTimeThunk = createAsyncThunk(
  'player/recoverOverTime',
  async ({ healthAmount = 0, manaAmount = 0 }: { healthAmount?: number, manaAmount?: number }, { dispatch }) => {
    // Handle health recovery if needed
    if (healthAmount > 0) {
      dispatch(modifyHealth({ amount: healthAmount }));
    }
    
    // Handle mana recovery if needed
    if (manaAmount > 0) {
      dispatch(modifyEnergy({ amount: manaAmount }));
    }
    
    return {
      success: true,
      healthRecovered: healthAmount,
      manaRecovered: manaAmount
    };
  }
);

/**
 * Thunk for allocating multiple attribute points at once
 */
export const allocateAttributesThunk = createAsyncThunk(
  'player/allocateAttributes',
  async (allocations: Record<string, number>, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { player } = state;
    
    // Calculate total points being allocated
    const totalPoints = Object.values(allocations).reduce((sum, points) => sum + points, 0);
    
    // Check if player has enough attribute points
    if (totalPoints > player.attributePoints) {
      return {
        success: false,
        message: 'Not enough attribute points available'
      };
    }
    
    // Apply each allocation
    Object.entries(allocations).forEach(([attributeId, points]) => {
      if (points > 0 && player.attributes[attributeId]) {
        dispatch(allocateAttribute({ attributeId, amount: points }));
      }
    });
    
    // Recalculate derived stats based on new attributes
    const updatedStats = recalculatePlayerStats(player);
    dispatch(updatePlayer({ stats: updatedStats }));
    
    return {
      success: true,
      allocated: allocations,
      remainingPoints: player.attributePoints - totalPoints
    };
  }
);

/**
 * Thunk for learning and upgrading skills
 */
export const learnOrUpgradeSkillThunk = createAsyncThunk(
  'player/learnOrUpgradeSkill',
  async ({ skillId, experienceAmount = 0 }: { skillId: string, experienceAmount?: number }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { player } = state;
    
    // Check if player already has this skill
    const existingSkill = player.skills.find(skill => skill.id === skillId);
    
    if (!existingSkill) {
      // Learn new skill
      dispatch(learnSkill({ skillId }));
      
      // Add experience if provided
      if (experienceAmount > 0) {
        dispatch(updateSkill({ skillId, experience: experienceAmount }));
      }
      
      return {
        success: true,
        message: `Learned new skill: ${skillId}`,
        isNew: true
      };
    } else if (experienceAmount > 0) {
      // Update existing skill with experience
      dispatch(updateSkill({ skillId, experience: experienceAmount }));
      
      // Calculate new level after experience gain
      const newExperience = existingSkill.experience + experienceAmount;
      const newLevel = calculateSkillLevel(newExperience);
      
      // Check if skill level increased
      if (newLevel > existingSkill.level) {
        return {
          success: true,
          message: `Skill improved to level ${newLevel}: ${skillId}`,
          levelUp: true,
          previousLevel: existingSkill.level,
          newLevel
        };
      }
      
      return {
        success: true,
        message: `Gained experience in ${skillId}`,
        experienceGained: experienceAmount
      };
    }
    
    return {
      success: false,
      message: 'No changes made to skill'
    };
  }
);

/**
 * Thunk for making a trait permanent (always active)
 * Now dispatches actions to TraitsSlice and EssenceSlice
 */
export const makeTraitPermanentThunk = createAsyncThunk(
  'player/makeTraitPermanent',
  async (traitId: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { player } = state;
    const traitsState = state.traits;
    
    // Check if player has the trait
    if (!traitsState.acquiredTraits.includes(traitId)) {
      return {
        success: false,
        message: 'You do not have this trait'
      };
    }
    
    // Check if trait is already permanent
    if (traitsState.permanentTraits.includes(traitId)) {
      return {
        success: false,
        message: 'This trait is already permanent'
      };
    }
    
    // Check if player has enough essence
    const requiredEssence = 150;
    const playerEssence = player.totalEssenceEarned || 0;
    
    if (playerEssence < requiredEssence) {
      return {
        success: false,
        message: `Not enough essence. Need ${requiredEssence}, have ${playerEssence}`
      };
    }
    
    // Spend essence
    const traitName = traitsState.traits[traitId]?.name || traitId;
    dispatch(spendEssence({
      amount: requiredEssence,
      reason: `Made ${traitName} permanent`
    }));

    // Make the trait permanent
    dispatch(makeTraitPermanentAction(traitId));
    
    return {
      success: true,
      message: `${traitName} is now permanent!`,
      essenceCost: requiredEssence
    };
  }
);

/**
 * Thunk for applying a status effect with proper cleanup
 */
export const applyStatusEffectThunk = createAsyncThunk(
  'player/applyStatusEffect',
  async (effect: StatusEffect, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { player } = state;
    
    // Add the effect immediately
    dispatch(addStatusEffect(effect));
    
    // If effect has a duration, set up automatic removal
    if (effect.duration > 0) {
      // Convert duration to milliseconds for setTimeout
      const durationMs = effect.duration * 1000;
      
      // Set timeout to remove the effect
      setTimeout(() => {
        // Check if the effect still exists before removing
        const currentState = getState() as RootState;
        const effectExists = currentState.player.statusEffects.some(e => e.id === effect.id);
        
        if (effectExists) {
          dispatch(removeStatusEffect({ effectId: effect.id }));
        }
      }, durationMs);
    }
    
    return {
      success: true,
      effect
    };
  }
);

/**
 * Thunk for handling trait equipment with slot management
 * Now dispatches actions to TraitsSlice
 */
export const manageTraitSlotThunk = createAsyncThunk(
  'player/manageTraitSlot',
  async (
    { traitId, action, slotIndex }: 
    { traitId: string, action: 'equip' | 'unequip', slotIndex?: number },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    const traitsState = state.traits;
    
    if (action === 'equip') {
      // Check if trait is available
      if (!traitsState.acquiredTraits.includes(traitId)) {
        return {
          success: false,
          message: 'You do not have this trait'
        };
      }
      
      // Check if already equipped
      if (traitsState.slots.some(slot => slot.traitId === traitId)) {
        return {
          success: false,
          message: 'This trait is already equipped'
        };
      }
      
      // Check if there's available space
      const availableSlots = traitsState.slots.filter(slot => slot.isUnlocked && !slot.traitId).length;
      if (availableSlots <= 0) {
         if (typeof slotIndex === 'number') {
            const targetSlot = traitsState.slots.find(s => s.index === slotIndex);
            if (!targetSlot || !targetSlot.isUnlocked || targetSlot.traitId) {
               return { success: false, message: 'Specified slot is invalid or occupied' };
            }
         } else {
            return { success: false, message: 'No available trait slots' };
         }
      }
      
      // Equip the trait - This call should match the definition in TraitsSlice
      dispatch(equipTrait({ traitId, slotIndex })); // Passing both traitId and optional slotIndex
      
      return {
        success: true,
        message: 'Trait equipped successfully'
      };
    } else if (action === 'unequip') {
      // Check if trait is equipped
      if (!traitsState.slots.some(slot => slot.traitId === traitId)) {
        return {
          success: false,
          message: 'This trait is not equipped'
        };
      }
      
      // Unequip the trait
      dispatch(unequipTrait(traitId));
      
      return {
        success: true,
        message: 'Trait unequipped successfully'
      };
    }
    
    return {
      success: false,
      message: 'Invalid action'
    };
  }
);

/**
 * Thunk for unlocking a new trait slot
 * Now dispatches actions to TraitsSlice and EssenceSlice
 */
export const unlockTraitSlotThunk = createAsyncThunk(
  'player/unlockTraitSlot',
  async (essenceCost: number, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { player } = state;
    const traitsState = state.traits;
    
    // Check if player has enough essence
    const playerEssence = player.totalEssenceEarned || 0;
    
    if (playerEssence < essenceCost) {
      return {
        success: false,
        message: `Not enough essence. Need ${essenceCost}, have ${playerEssence}`
      };
    }

    // Find the next slot index to unlock
    const lastUnlockedIndex = traitsState.slots.reduce((maxIndex, slot) => slot.isUnlocked ? Math.max(maxIndex, slot.index) : maxIndex, -1);
    const nextSlotIndex = lastUnlockedIndex + 1;

    if (nextSlotIndex >= traitsState.slots.length) {
        return { success: false, message: 'All slots already unlocked or no more slots defined.' };
    }
    
    // Spend essence
    dispatch(spendEssence({
      amount: essenceCost,
      reason: `Unlocked trait slot ${nextSlotIndex + 1}`
    }));

    // Unlock the trait slot
    dispatch(unlockTraitSlotAction(nextSlotIndex));
    
    return {
      success: true,
      message: `Trait slot ${nextSlotIndex + 1} unlocked!`,
      newTotalSlots: traitsState.slots.filter(s => s.isUnlocked).length,
      essenceCost
    };
  }
);

// Helper functions

/**
 * Calculate player level based on total experience
 */
function calculateLevelFromExperience(experience: number): number {
  return Math.floor(Math.pow(experience / 100, 1/1.5)) + 1;
}

/**
 * Calculate skill level based on experience
 */
function calculateSkillLevel(experience: number): number {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

/**
 * Update player stats based on level up
 */
function handleLevelUpStats(player: PlayerState, newLevel: number): PlayerStats {
  const healthPerLevel = 10;
  const manaPerLevel = 5;
  
  const levelDifference = newLevel - player.level;
  
  const newStats: PlayerStats = {
    ...player.stats,
    maxHealth: player.stats.maxHealth + (healthPerLevel * levelDifference),
    maxMana: player.stats.maxMana + (manaPerLevel * levelDifference)
  };
  
  newStats.health = newStats.maxHealth;
  newStats.mana = newStats.maxMana;
  
  return newStats;
}