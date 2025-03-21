/**
 * Combat skills and abilities
 */

import { Effect } from './effects';

/**
 * Combat skill definition
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: Effect;
  manaCost?: number;
  requiredLevel?: number;
  targeting: 'single' | 'all' | 'self' | 'random';
  iconPath?: string;
}

/**
 * Active skill with cooldown tracking
 */
export interface ActiveSkill extends Skill {
  currentCooldown: number;
}

/**
 * Special ability that can be used in combat
 */
export interface Ability {
  id: string;
  name: string;
  description: string;
  effect: Effect;
  cooldown?: number;
  currentCooldown?: number;
  charges?: number;
  requiredResource?: number;
  iconPath?: string;
}

/**
 * Combat skills for the player
 */
export interface CombatSkills {
  swordplay: number;
  archery: number;
  defense: number;
  dualWielding: number;
  [key: string]: number; // For additional skills
}
