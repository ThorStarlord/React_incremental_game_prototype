/**
 * Player skill actions
 * 
 * Actions for managing player skills including learning, upgrading, and updating
 */
import { 
  SkillPayload, 
  SkillUpgradePayload, 
  PLAYER_ACTIONS, 
  PlayerAction 
} from '../../types/actions/playerActionTypes';
import { validateString, validatePositive, validateNonNegative } from './utils';

/**
 * Update a player's skill with additional experience
 * 
 * @param {string} skillId - ID of the skill to update
 * @param {number} experience - Amount of experience to add
 * @returns {PlayerAction} The UPDATE_SKILL action
 * 
 * @example
 * // Add 150 experience to the archery skill
 * updateSkill("archery", 150)
 */
export const updateSkill = (skillId: string, experience: number): PlayerAction => {
  validateString(skillId, 'Skill ID');
  validatePositive(experience, 'Skill experience');
  
  return {
    type: PLAYER_ACTIONS.UPDATE_SKILL,
    payload: { skillId, experience }
  };
};

/**
 * Learn a new skill
 * 
 * @param {string} skillId - ID of the skill to learn
 * @returns {PlayerAction} The LEARN_SKILL action
 * 
 * @example
 * // Learn fireball skill
 * learnSkill("fireball")
 */
export const learnSkill = (skillId: string): PlayerAction => {
  validateString(skillId, 'Skill ID');
  return {
    type: PLAYER_ACTIONS.LEARN_SKILL,
    payload: { 
      skillId,
      timestamp: Date.now() 
    } as SkillPayload
  };
};

/**
 * Upgrade an existing skill to a higher level
 * 
 * @param {string} skillId - ID of the skill to upgrade
 * @param {number} level - New level for the skill
 * @param {number} cost - Cost of the upgrade
 * @returns {PlayerAction} The UPGRADE_SKILL action
 * 
 * @example
 * // Upgrade lockpicking to level 3
 * upgradeSkill("lockpicking", 3, 500)
 */
export const upgradeSkill = (skillId: string, level: number, cost: number): PlayerAction => {
  validateString(skillId, 'Skill ID');
  validatePositive(level, 'Skill level');
  validateNonNegative(cost, 'Upgrade cost');
  
  return {
    type: PLAYER_ACTIONS.UPGRADE_SKILL,
    payload: { 
      skillId, 
      level, 
      cost,
      timestamp: Date.now()
    } as SkillUpgradePayload
  };
};
