/**
 * Redux Thunks for Skills-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { addNotification } from '../../notifications/state/NotificationsSlice';
import {
  unlockSkill,
  gainSkillExperience,
  updateSkill,
  spendSkillPoints,
  rewardSkillPoints,
  setSkillLevel
} from './SkillsSlice';
import {
  SkillRequirement,
  SkillRequirementsResult
} from './SkillsTypes';

/**
 * Train a skill with an NPC
 */
export const trainSkill = createAsyncThunk<
  { success: boolean; skillId: string; message: string },
  { skillId: string; trainerId: string; cost: number },
  { state: RootState }
>(
  'skills/trainSkill',
  async ({ skillId, trainerId, cost }, { getState, dispatch }) => {
    const state = getState();
    const { skills, player } = state;
    
    // Check if player has enough gold
    if ((player?.gold || 0) < cost) {
      dispatch(addNotification(
        'Not enough gold to train this skill',
        'error',
        {
          duration: 3000,
          category: 'skills'
        }
      ));
      
      throw new Error('Not enough gold to train this skill');
    }
    
    // Check if the skill exists
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    // Check if the skill is trainable
    if (!skill.canTrain) {
      dispatch(addNotification(
        `${skill.name} cannot be trained`,
        'error',
        {
          duration: 3000,
          category: 'skills'
        }
      ));
      
      throw new Error(`Skill cannot be trained`);
    }
    
    // Check if the NPC is a valid trainer for this skill
    if (!skill.trainers?.includes(trainerId)) {
      throw new Error(`NPC is not a valid trainer for this skill`);
    }
    
    // Deduct gold from player
    dispatch({
      type: 'player/spendGold',
      payload: cost
    });
    
    // Calculate experience gained from training
    const experienceGained = cost * 0.5; // Base ratio of gold to experience
    
    // Award experience to the skill
    dispatch(gainSkillExperience({
      skillId,
      amount: experienceGained,
      source: `Training with ${trainerId}`
    }));
    
    // If the skill was locked, unlock it
    if (skill.locked) {
      dispatch(unlockSkill({ skillId }));
    }
    
    // Show success notification
    dispatch(addNotification(
      `Trained ${skill.name} and gained ${experienceGained} experience!`,
      'success',
      {
        duration: 3000,
        category: 'skills'
      }
    ));
    
    return {
      success: true,
      skillId,
      message: `Successfully trained ${skill.name}`
    };
  }
);

/**
 * Use a skill item to gain experience
 */
export const useSkillItem = createAsyncThunk<
  { success: boolean; skillId: string; message: string },
  { skillId: string; itemId: string; experienceAmount: number },
  { state: RootState }
>(
  'skills/useSkillItem',
  async ({ skillId, itemId, experienceAmount }, { getState, dispatch }) => {
    const state = getState();
    const { skills, inventory } = state;
    
    // Check if player has the item
    const item = inventory?.items.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) {
      dispatch(addNotification(
        'You don\'t have this item',
        'error',
        {
          duration: 3000,
          category: 'skills'
        }
      ));
      
      throw new Error('Item not found in inventory');
    }
    
    // Check if the skill exists
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    // Remove item from inventory
    dispatch({
      type: 'inventory/removeItem',
      payload: {
        itemId,
        quantity: 1
      }
    });
    
    // Award experience to the skill
    dispatch(gainSkillExperience({
      skillId,
      amount: experienceAmount,
      source: `Used ${item.name}`
    }));
    
    // If the skill was locked, unlock it
    if (skill.locked) {
      dispatch(unlockSkill({ skillId }));
    }
    
    // Show success notification
    dispatch(addNotification(
      `Used ${item.name} and gained ${experienceAmount} experience in ${skill.name}!`,
      'success',
      {
        duration: 3000,
        category: 'skills'
      }
    ));
    
    return {
      success: true,
      skillId,
      message: `Successfully used ${item.name} on ${skill.name}`
    };
  }
);

/**
 * Check if player meets requirements for a skill
 */
export const checkSkillRequirements = createAsyncThunk<
  SkillRequirementsResult & { skillId: string },
  { skillId: string },
  { state: RootState }
>(
  'skills/checkRequirements',
  async ({ skillId }, { getState }) => {
    const state = getState();
    const { skills, player, quests, inventory } = state;
    
    // Get the skill
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    // If no requirements, all are met
    if (!skill.requirements || skill.requirements.length === 0) {
      return {
        allMet: true,
        details: [],
        skillId
      };
    }
    
    const results: SkillRequirementsResult = {
      allMet: true,
      details: []
    };
    
    // Check each requirement
    for (const req of skill.requirements) {
      let met = false;
      
      switch (req.type) {
        case 'level':
          met = player?.level >= req.value;
          break;
          
        case 'skill':
          const requiredSkill = skills.skills[req.id];
          met = requiredSkill ? requiredSkill.level >= req.value : false;
          break;
          
        case 'attribute':
          const attribute = player?.attributes?.[req.id];
          met = attribute ? attribute.value >= req.value : false;
          break;
          
        case 'quest':
          met = quests?.completedQuestIds?.includes(req.id) || false;
          break;
          
        case 'item':
          const item = inventory?.items?.find(i => i.id === req.id);
          met = item ? item.quantity >= req.value : false;
          break;
          
        default:
          met = false;
      }
      
      results.details.push({
        requirement: req,
        met
      });
      
      // If any requirement is not met, the overall result is false
      if (!met) {
        results.allMet = false;
      }
    }
    
    return { ...results, skillId };
  }
);

/**
 * Gather skill experience through an activity
 */
export const gatherSkillExperience = createAsyncThunk<
  { success: boolean; skillId: string; amount: number },
  { skillId: string; activityType: string; duration: number; difficulty?: number },
  { state: RootState }
>(
  'skills/gatherExperience',
  async ({ skillId, activityType, duration, difficulty = 1 }, { getState, dispatch }) => {
    const state = getState();
    const { skills } = state;
    
    // Check if the skill exists
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    // Calculate base experience based on duration and difficulty
    const baseExperience = (duration / 1000) * difficulty * skill.experienceRate;
    
    // Add random variation (±20%)
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    const finalExperience = Math.floor(baseExperience * randomFactor);
    
    // Award experience to the skill
    dispatch(gainSkillExperience({
      skillId,
      amount: finalExperience,
      source: activityType
    }));
    
    // If the activity has a chance of discovering a related skill, process that
    if (skill.relatedSkills && skill.relatedSkills.length > 0 && Math.random() < 0.1) {
      // 10% chance to gain experience in a related skill
      const relatedSkillId = skill.relatedSkills[Math.floor(Math.random() * skill.relatedSkills.length)];
      const relatedSkill = skills.skills[relatedSkillId];
      
      if (relatedSkill && !relatedSkill.locked) {
        // Award 10% of the experience to the related skill
        dispatch(gainSkillExperience({
          skillId: relatedSkillId,
          amount: Math.floor(finalExperience * 0.1),
          source: `${activityType} (related to ${skill.name})`
        }));
      }
    }
    
    return {
      success: true,
      skillId,
      amount: finalExperience
    };
  }
);

/**
 * Learn a new skill from a special source (quest, item, etc.)
 */
export const learnNewSkill = createAsyncThunk<
  { success: boolean; skillId: string; message: string },
  { skillId: string; source: string },
  { state: RootState }
>(
  'skills/learnNewSkill',
  async ({ skillId, source }, { getState, dispatch }) => {
    const state = getState();
    const { skills } = state;
    
    // Check if the skill exists
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    // Unlock the skill
    dispatch(unlockSkill({ skillId }));
    
    // Update the skill to show it was learned from this source
    dispatch(updateSkill({
      id: skillId,
      level: 1,
      experience: 0,
      nextLevelExperience: 100
    }));
    
    // Show notification
    dispatch(addNotification(
      `Learned new skill: ${skill.name}!`,
      'success',
      {
        duration: 5000,
        category: 'skills',
        description: `You can now use ${skill.name} abilities and gain experience in this skill.`
      }
    ));
    
    return {
      success: true,
      skillId,
      message: `Successfully learned ${skill.name} from ${source}`
    };
  }
);

/**
 * Apply a skill bonus (from item, trait, etc.)
 */
export const applySkillBonus = createAsyncThunk<
  { success: boolean; skillId: string; bonusType: string; value: number },
  { skillId: string; bonusType: 'experienceRate' | 'maxLevel' | 'levelBoost'; value: number; source: string },
  { state: RootState }
>(
  'skills/applyBonus',
  async ({ skillId, bonusType, value, source }, { getState, dispatch }) => {
    const state = getState();
    const { skills } = state;
    
    // Check if the skill exists
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    switch (bonusType) {
      case 'experienceRate':
        // Increase experience rate
        dispatch(updateSkill({
          id: skillId,
          experienceRate: skill.experienceRate + value
        }));
        break;
        
      case 'maxLevel':
        // Increase max level
        dispatch(updateSkill({
          id: skillId,
          maxLevel: skill.maxLevel + value
        }));
        break;
        
      case 'levelBoost':
        // Directly boost level
        const newLevel = Math.min(skill.level + value, skill.maxLevel);
        
        if (newLevel > skill.level) {
          dispatch(setSkillLevel({
            skillId,
            level: newLevel
          }));
        }
        break;
    }
    
    // Show notification
    dispatch(addNotification(
      `${skill.name} received a bonus from ${source}!`,
      'info',
      {
        duration: 3000,
        category: 'skills'
      }
    ));
    
    return {
      success: true,
      skillId,
      bonusType,
      value
    };
  }
);

/**
 * Allocate skill points to a skill
 */
export const allocateSkillPoints = createAsyncThunk<
  { success: boolean; skillId: string; pointsSpent: number },
  { skillId: string; points: number },
  { state: RootState }
>(
  'skills/allocatePoints',
  async ({ skillId, points }, { getState, dispatch }) => {
    const state = getState();
    const { skills } = state;
    
    // Check if the skill exists
    const skill = skills.skills[skillId];
    if (!skill) {
      throw new Error(`Skill with ID ${skillId} not found`);
    }
    
    // Check if player has enough skill points
    if (skills.skillPoints < points) {
      dispatch(addNotification(
        'Not enough skill points',
        'error',
        {
          duration: 3000,
          category: 'skills'
        }
      ));
      
      throw new Error('Not enough skill points');
    }
    
    // Spend the skill points
    dispatch(spendSkillPoints({
      skillId,
      amount: points
    }));
    
    // Show notification
    dispatch(addNotification(
      `Allocated ${points} skill points to ${skill.name}!`,
      'success',
      {
        duration: 3000,
        category: 'skills'
      }
    ));
    
    return {
      success: true,
      skillId,
      pointsSpent: points
    };
  }
);

/**
 * Grant skill points to the player
 */
export const grantSkillPoints = createAsyncThunk<
  { success: boolean; amount: number },
  { amount: number; source: string },
  { state: RootState }
>(
  'skills/grantPoints',
  async ({ amount, source }, { dispatch }) => {
    // Award skill points
    dispatch(rewardSkillPoints({
      amount,
      source
    }));
    
    // Show notification
    dispatch(addNotification(
      `Gained ${amount} skill points from ${source}!`,
      'success',
      {
        duration: 3000,
        category: 'skills'
      }
    ));
    
    return {
      success: true,
      amount
    };
  }
);
