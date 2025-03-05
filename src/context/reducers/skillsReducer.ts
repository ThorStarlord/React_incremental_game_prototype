import { ACTION_TYPES } from '../actions/actionTypes';
import { GameState, Skill } from './types';
import { withNotification } from './utils';

/**
 * Skill progression calculation constants
 */
const XP_MULTIPLIER = 100;
const XP_POWER = 1.5;

/**
 * Calculate XP needed to level up a skill
 */
const getXpForLevel = (level: number): number => 
  Math.floor(XP_MULTIPLIER * level + 10 * Math.pow(level, XP_POWER));

/**
 * Check if a skill should level up
 */
const checkLevelUp = (skill: Skill): { 
  newLevel: number; 
  remainingXp: number; 
  leveledUp: boolean;
} => {
  let currentLevel = skill.level;
  let remainingXp = skill.experience;
  let leveledUp = false;
  
  while (remainingXp >= getXpForLevel(currentLevel)) {
    remainingXp -= getXpForLevel(currentLevel);
    currentLevel++;
    leveledUp = true;
  }
  
  return { newLevel: currentLevel, remainingXp, leveledUp };
};

export const skillsReducer = (state: GameState, action: { type: string; payload: any }): GameState => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_SKILL_XP: {
      const { skillId, amount, source } = action.payload;
      
      // Find skill in player's skills
      const skillIndex = state.player.skills?.findIndex(s => s.id === skillId);
      if (skillIndex === -1 || skillIndex === undefined || !state.player.skills) {
        return state;
      }
      
      // Get current skill
      const skill = state.player.skills[skillIndex];
      
      // Calculate XP modifiers
      const equippedTraits = state.player.equippedTraits || [];
      
      // Apply trait bonuses
      let xpMultiplier = 1;
      if (equippedTraits.includes?.('QuickLearner')) xpMultiplier *= 1.15;  // +15% XP
      if (skill.specialty === source) xpMultiplier *= 1.25;  // +25% for specialty
      
      // Calculate new XP amount
      const modifiedAmount = Math.round(amount * xpMultiplier);
      const newXp = skill.experience + modifiedAmount;
      
      // Check for level up
      const { newLevel, remainingXp, leveledUp } = checkLevelUp({ ...skill, experience: newXp });
      
      // Update skill
      const updatedSkills = [...state.player.skills];
      updatedSkills[skillIndex] = {
        ...skill,
        level: newLevel,
        experience: remainingXp
      };
      
      // Add milestone perks if leveled up
      if (leveledUp && newLevel >= 5 && skill.level < 5) {
        updatedSkills[skillIndex].perks = [...(updatedSkills[skillIndex].perks || []), 'tier1'];
      }
      if (leveledUp && newLevel >= 15 && skill.level < 15) {
        updatedSkills[skillIndex].perks = [...(updatedSkills[skillIndex].perks || []), 'tier2'];
      }
      if (leveledUp && newLevel >= 30 && skill.level < 30) {
        updatedSkills[skillIndex].perks = [...(updatedSkills[skillIndex].perks || []), 'tier3'];
      }
      
      // Record level history if leveled up
      if (leveledUp) {
        updatedSkills[skillIndex].levelHistory = [
          ...(updatedSkills[skillIndex].levelHistory || []),
          { level: newLevel, timestamp: Date.now() }
        ];
      }
      
      // Update state
      const updatedState = {
        ...state,
        player: {
          ...state.player,
          skills: updatedSkills
        }
      };
      
      // Update stats if leveled up
      if (leveledUp) {
        updatedState.stats = {
          ...updatedState.stats,
          skillsLeveled: (updatedState.stats?.skillsLeveled || 0) + 1,
          highestSkillLevel: Math.max(
            newLevel,
            updatedState.stats?.highestSkillLevel || 0
          ),
          totalSkillLevels: updatedSkills.reduce((sum, s) => sum + s.level, 0)
        };
        
        // Add notification for level up
        return withNotification(
          updatedState,
          `${skill.name} skill leveled up to ${newLevel}!`,
          'achievement',
          5000
        );
      }
      
      return updatedState;
    }
    
    case ACTION_TYPES.UNLOCK_SKILL: {
      const { skillData, source } = action.payload;
      
      // Check if skill already exists
      if (state.player.skills?.some(s => s.id === skillData.id)) {
        return state;
      }
      
      // Create new skill
      const newSkill: Skill = {
        id: skillData.id,
        name: skillData.name,
        description: skillData.description || '',
        level: 1,
        experience: 0,
        unlockedAt: Date.now(),
        unlockedFrom: source || 'unknown',
        usageCount: 0,
        perks: []
      };
      
      return withNotification(
        {
          ...state,
          player: {
            ...state.player,
            skills: [...(state.player.skills || []), newSkill]
          }
        },
        `Unlocked new skill: ${skillData.name}!`,
        'discovery',
        4000
      );
    }
    
    case ACTION_TYPES.USE_SKILL: {
      const { skillId } = action.payload;
      
      const skillIndex = state.player.skills?.findIndex(s => s.id === skillId);
      if (skillIndex === -1 || skillIndex === undefined || !state.player.skills) {
        return state;
      }
      
      // Update usage count
      return {
        ...state,
        player: {
          ...state.player,
          skills: state.player.skills.map((skill, idx) =>
            idx === skillIndex
              ? { ...skill, usageCount: (skill.usageCount || 0) + 1 }
              : skill
          )
        }
      };
    }
    
    default:
      return state;
  }
};

export default skillsReducer;
