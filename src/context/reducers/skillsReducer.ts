import { ACTION_TYPES } from '../types/ActionTypes';
import { SKILL_ACTIONS } from '../types/actions';
import { GameState } from '../types/gameStates/GameStateTypes';
import { addGameNotification } from '../utils/notificationUtils';
import { Notification, NotificationsState } from '../types/gameStates/NotificationsGameStateTypes';

/**
 * Interface for a skill with all required properties
 */
interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  unlockedAt?: number;
  unlockedFrom?: string;
  usageCount?: number;
  perks?: string[];
  specialty?: string;
  levelHistory?: { level: number; timestamp: number }[];
  [key: string]: any;
}

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
 * Modified to only require level and experience properties
 */
const checkLevelUp = (skillData: { level: number; experience: number }): { 
  newLevel: number; 
  remainingXp: number; 
  leveledUp: boolean;
} => {
  let currentLevel = skillData.level;
  let remainingXp = skillData.experience;
  let leveledUp = false;
  
  while (remainingXp >= getXpForLevel(currentLevel)) {
    remainingXp -= getXpForLevel(currentLevel);
    currentLevel++;
    leveledUp = true;
  }
  
  return { newLevel: currentLevel, remainingXp, leveledUp };
};

/**
 * Extended GameState type to include the notification durations property
 */
interface ExtendedGameState extends GameState {
  _notificationDurations?: Record<string, number>;
}

/**
 * Validate and convert a string to a valid notification type
 */
function validateNotificationType(type: string): "info" | "warning" | "error" | "success" {
  switch (type) {
    case "info":
    case "warning":
    case "error":
    case "success":
      return type;
    default:
      // Default to info for unknown types
      console.warn(`Invalid notification type: ${type}, defaulting to "info"`);
      return "info";
  }
}

export const skillsReducer = (state: GameState, action: { type: string; payload: any }): GameState => {
  switch (action.type) {
    case SKILL_ACTIONS.GAIN_SKILL_XP: {
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
      const { newLevel, remainingXp, leveledUp } = checkLevelUp({ level: skill.level, experience: newXp });
      
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
        const currentStats = state.stats || {};
        const skillsLeveled = typeof currentStats.skillsLeveled === 'number' ? currentStats.skillsLeveled : 0;
        const highestSkillLevel = typeof currentStats.highestSkillLevel === 'number' ? currentStats.highestSkillLevel : 0;
        
        updatedState.stats = {
          ...currentStats,
          skillsLeveled: skillsLeveled + 1,
          highestSkillLevel: Math.max(newLevel, highestSkillLevel),
          totalSkillLevels: updatedSkills.reduce((sum, s) => sum + s.level, 0)
        };
        
        // Use our wrapper function instead of direct addNotification call
        return addGameNotification(
          updatedState,
          `${skill.name} skill leveled up to ${newLevel}!`,
          "success",
          5000
        );
      }
      
      return updatedState;
    }
    
    case SKILL_ACTIONS.UNLOCK_SKILL: {
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
      
      // Use our wrapper function here too
      return addGameNotification(
        {
          ...state,
          player: {
            ...state.player,
            skills: [...(state.player.skills || []), newSkill]
          }
        },
        `Unlocked new skill: ${skillData.name}!`,
        "info",
        4000
      );
    }
    
    case SKILL_ACTIONS.USE_SKILL: {
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
