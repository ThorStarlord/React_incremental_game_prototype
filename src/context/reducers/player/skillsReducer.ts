import { PlayerState } from '../../types/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { Skill } from '../../types/combat/skills';
import { isActionOfType } from '../playerReducer';

/**
 * Skills reducer - manages player skills and skill progression
 * 
 * Responsible for:
 * - Tracking skill experience and levels
 * - Learning new skills
 * - Upgrading existing skills
 */
export const skillsReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_SKILL:
      // Use type assertion for action.payload
      const payload = action.payload as { skillId: string, experience: number };
      const { skillId, experience } = payload;
      
      // Find skill if it exists
      const skills = state.skills || [];
      const existingSkillIndex = skills.findIndex(skill => skill.id === skillId);
      
      // Create a new skills array using slice instead of spread
      const updatedSkills = skills.slice();
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        const currentSkill = skills[existingSkillIndex];
        if (currentSkill) {
          const newExperience = currentSkill.experience + experience;
          const newLevel = Math.floor(Math.pow(newExperience / 100, 0.8)) + 1;
          
          // Create a new skill object explicitly
          updatedSkills[existingSkillIndex] = {
            id: currentSkill.id,
            level: newLevel,
            experience: newExperience
          };
        }
      } else {
        // Add new skill
        const newSkill: Skill = {
          id: skillId,
          level: 1,
          experience
        };
        updatedSkills.push(newSkill);
      }
      
      return {
        ...state,
        skills: updatedSkills
      };

    case PLAYER_ACTIONS.LEARN_SKILL:
      // Type guard for LEARN_SKILL action
      if (!isActionOfType(action, PLAYER_ACTIONS.LEARN_SKILL)) {
        return state;
      }
      
      // Check payload shape
      if (!action.payload || typeof action.payload !== 'object' || !('skillId' in action.payload)) {
        return state;
      }
      
      const learnSkillId = action.payload.skillId;
      if (state.skills?.some(skill => skill.id === learnSkillId)) {
        return state;
      }
      const newSkill: Skill = {
        id: learnSkillId,
        level: 1,
        experience: 0
      };
      return {
        ...state,
        skills: [...(state.skills || []), newSkill]
      };

    case PLAYER_ACTIONS.UPGRADE_SKILL:
      type UpgradeSkillPayload = { 
        skillId: string;
        level: number;
        cost: number;
        timestamp?: number;
      };
      
      if (!action.payload) return state;
      const upgradePayload = action.payload as UpgradeSkillPayload;
      
      // Safely access the payload properties without spreading
      const upgradeSkillId = upgradePayload.skillId;
      const level = upgradePayload.level;
      
      const existingSkills = state.skills || [];
      const skillIndex = existingSkills.findIndex(skill => skill.id === upgradeSkillId);
      
      if (skillIndex === -1) {
        return state;
      }
      
      // Create a new skills array without using spread on potentially undefined values
      const skillsAfterUpgrade = existingSkills.slice();
      
      // Get the current skill object
      const currentSkill = existingSkills[skillIndex];
      if (currentSkill) {
        // Create a new skill object with updated properties
        skillsAfterUpgrade[skillIndex] = {
          id: currentSkill.id,
          level: level,
          experience: currentSkill.experience
        };
      }
      
      // Return the updated state
      return {
        ...state,
        skills: skillsAfterUpgrade
      };

    default:
      return state;
  }
};
