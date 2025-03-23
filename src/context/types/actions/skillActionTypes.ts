/**
 * Skill-related action type definitions
 * 
 * This module defines the types and interfaces for skill actions
 * in the game.
 * 
 * @module skillActionTypes
 */

/**
 * Skill action type constants
 */
export const SKILL_ACTIONS = {
  GAIN_SKILL_XP: 'skills/gainXp' as const,
  UNLOCK_SKILL: 'skills/unlock' as const,
  USE_SKILL: 'skills/use' as const,
  LEARN_SKILL: 'skills/learn' as const,
  UPGRADE_SKILL: 'skills/upgrade' as const,
  GAIN_SKILL_EXPERIENCE: 'skills/gainExperience' as const,
  LEVEL_UP_SKILL: 'skills/levelUp' as const
};

// Create a union type of all skill action types
export type SkillActionType = typeof SKILL_ACTIONS[keyof typeof SKILL_ACTIONS];

/**
 * Base skill action interface
 */
export interface SkillAction {
  type: SkillActionType;
  payload?: any;
}

/**
 * Gain skill XP payload
 */
export interface GainSkillXpPayload {
  skillId: string;
  amount: number;
  source?: string;
}

/**
 * Unlock skill payload
 */
export interface UnlockSkillPayload {
  skillId: string;
}

/**
 * Use skill payload
 */
export interface UseSkillPayload {
  skillId: string;
  targetId?: string;
  options?: Record<string, any>;
}

/**
 * Learn skill payload
 */
export interface LearnSkillPayload {
  skillId: string;
}

/**
 * Upgrade skill payload
 */
export interface UpgradeSkillPayload {
  skillId: string;
  level: number;
  cost: number;
}

/**
 * Gain skill experience payload
 */
export interface GainSkillExperiencePayload {
  skillId: string;
  experience: number;
}

/**
 * Level up skill payload
 */
export interface LevelUpSkillPayload {
  skillId: string;
}
