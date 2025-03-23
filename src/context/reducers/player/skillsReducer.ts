import { PlayerState } from '../../types/gameStates/GameStateTypes';
import { PlayerAction } from '../playerReducer';
import { PLAYER_ACTIONS } from '../../types/ActionTypes';
import { isActionOfType } from '../playerReducer';

/**
 * Interface for properly typed payloads
 */
interface UpdateSkillPayload {
  skillId: string;
  experience: number;
}

interface LearnSkillPayload {
  skillId: string;
  timestamp?: number;
}

interface UpgradeSkillPayload {
  skillId: string;
  level: number;
  cost: number;
  timestamp?: number;
}

/**
 * Calculate skill level based on experience
 * @param experience - Current experience points
 * @returns Calculated skill level
 */
function calculateSkillLevel(experience: number): number {
  // Simple skill level formula: Level = sqrt(experience/100) + 1
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

/**
 * Create a new skill object with default values
 * @param skillId - Unique identifier for the skill
 * @returns New skill object
 */
function createNewSkill(skillId: string) {
  return {
    id: skillId,
    level: 1,
    experience: 0
  };
}

/**
 * Skills reducer - manages player skills and their progression
 * 
 * Responsible for:
 * - Tracking skill experience and level progression
 * - Learning new skills
 * - Upgrading existing skills
 */
export const skillsReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_SKILL: {
      // Type guard for UPDATE_SKILL action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPDATE_SKILL)) {
        return state;
      }

      // Validate payload structure
      if (!action.payload || 
          typeof action.payload !== 'object' ||
          typeof action.payload.skillId !== 'string' ||
          typeof action.payload.experience !== 'number') {
        console.warn('Invalid UPDATE_SKILL payload:', action.payload);
        return state;
      }

      const { skillId, experience } = action.payload as UpdateSkillPayload;
      
      // Handle negative experience values
      if (experience <= 0) {
        console.warn('Ignoring negative or zero skill experience update');
        return state;
      }

      // Initialize skills array if undefined
      const skills = state.skills || [];
      const existingSkillIndex = skills.findIndex(skill => skill.id === skillId);
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        const currentSkill = skills[existingSkillIndex];
        const newExperience = (currentSkill?.experience || 0) + experience;
        const newLevel = calculateSkillLevel(newExperience);
        
        // Create a new skills array with the updated skill
        const updatedSkills = [
          ...skills.slice(0, existingSkillIndex),
          {
            ...currentSkill,
            level: newLevel,
            experience: newExperience
          },
          ...skills.slice(existingSkillIndex + 1)
        ];
        
        return {
          ...state,
          skills: updatedSkills
        };
      } else {
        // Add new skill with initial experience
        return {
          ...state,
          skills: [
            ...skills,
            {
              id: skillId,
              level: calculateSkillLevel(experience),
              experience
            }
          ]
        };
      }
    }

    case PLAYER_ACTIONS.LEARN_SKILL: {
      // Type guard for LEARN_SKILL action
      if (!isActionOfType(action, PLAYER_ACTIONS.LEARN_SKILL)) {
        return state;
      }
      
      // Validate payload
      if (!action.payload || 
          typeof action.payload !== 'object' ||
          typeof action.payload.skillId !== 'string') {
        console.warn('Invalid LEARN_SKILL payload:', action.payload);
        return state;
      }
      
      const { skillId } = action.payload as LearnSkillPayload;
      
      // Check if skill already exists
      const skills = state.skills || [];
      if (skills.some(skill => skill.id === skillId)) {
        console.info(`Skill ${skillId} already learned, skipping.`);
        return state;
      }
      
      // Create a new skill
      return {
        ...state,
        skills: [
          ...skills,
          createNewSkill(skillId)
        ]
      };
    }

    case PLAYER_ACTIONS.UPGRADE_SKILL: {
      // Type guard for UPGRADE_SKILL action
      if (!isActionOfType(action, PLAYER_ACTIONS.UPGRADE_SKILL)) {
        return state;
      }
      
      // Validate payload
      if (!action.payload || 
          typeof action.payload !== 'object' ||
          typeof action.payload.skillId !== 'string' ||
          typeof action.payload.level !== 'number') {
        console.warn('Invalid UPGRADE_SKILL payload:', action.payload);
        return state;
      }
      
      const { skillId, level } = action.payload as UpgradeSkillPayload;
      
      // Find the skill to upgrade
      const skills = state.skills || [];
      const skillIndex = skills.findIndex(skill => skill.id === skillId);
      
      if (skillIndex === -1) {
        console.warn(`Cannot upgrade skill ${skillId}: skill not found`);
        return state;
      }
      
      // Safety check for level validity (can't downgrade)
      const currentSkill = skills[skillIndex];
      if (level <= (currentSkill?.level || 0)) {
        console.warn(`Cannot downgrade skill ${skillId} from level ${currentSkill?.level} to ${level}`);
        return state;
      }
      
      // Create updated skills array
      const updatedSkills = [
        ...skills.slice(0, skillIndex),
        {
          ...skills[skillIndex],
          level
        },
        ...skills.slice(skillIndex + 1)
      ];
      
      return {
        ...state,
        skills: updatedSkills
      };
    }

    default:
      return state;
  }
};
