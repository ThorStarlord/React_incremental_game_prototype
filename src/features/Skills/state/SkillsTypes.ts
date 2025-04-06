/**
 * Types for the Skills slice of the Redux store
 */

/**
 * Enum representing different skill categories
 */
export enum SkillCategory {
  COMBAT = 'combat',
  MAGIC = 'magic',
  CRAFTING = 'crafting',
  GATHERING = 'gathering',
  SOCIAL = 'social'
}

/**
 * Enum representing skill proficiency levels
 */
export enum SkillProficiency {
  LOCKED = 'locked',
  BEGINNER = 'beginner',
  APPRENTICE = 'apprentice',
  ADEPT = 'adept',
  EXPERT = 'expert',
  MASTER = 'master'
}

/**
 * Enum for combat skill types
 */
export enum CombatSkillType {
  SWORDPLAY = 'swordplay',
  ARCHERY = 'archery',
  DEFENSE = 'defense',
  DUAL_WIELDING = 'dualWielding'
}

/**
 * Enum for magic skill types
 */
export enum MagicSkillType {
  FIRE_MAGIC = 'fireMagic',
  ICE_MAGIC = 'iceMagic',
  LIGHTNING_MAGIC = 'lightningMagic',
  RESTORATION = 'restoration'
}

/**
 * Enum for crafting skill types
 */
export enum CraftingSkillType {
  ALCHEMY = 'alchemy',
  BLACKSMITHING = 'blacksmithing',
  LEATHERWORKING = 'leatherworking',
  ENCHANTING = 'enchanting'
}

/**
 * Enum for gathering skill types
 */
export enum GatheringSkillType {
  MINING = 'mining',
  HERBALISM = 'herbalism',
  WOODCUTTING = 'woodcutting',
  FISHING = 'fishing'
}

/**
 * Enum for social skill types
 */
export enum SocialSkillType {
  PERSUASION = 'persuasion',
  BARTERING = 'bartering',
  LEADERSHIP = 'leadership',
  DIPLOMACY = 'diplomacy'
}

/**
 * Type for all available skill types
 */
export type SkillType = 
  | CombatSkillType 
  | MagicSkillType 
  | CraftingSkillType 
  | GatheringSkillType 
  | SocialSkillType;

/**
 * Interface for skill requirements
 */
export interface SkillRequirement {
  /** Type of requirement */
  type: 'level' | 'skill' | 'attribute' | 'quest' | 'item';
  /** ID or value for the requirement */
  id: string;
  /** Value needed (level, amount, etc) */
  value: number;
  /** Description of the requirement */
  description: string;
}

/**
 * Interface for skill effects
 */
export interface SkillEffect {
  /** Type of effect (damage, resistance, yield, etc) */
  type: string;
  /** Target of the effect (health, defense, resources, etc) */
  target?: string;
  /** Value modifier (+10%, -5, etc) */
  value: number;
  /** Whether the value is a percentage or flat amount */
  isPercentage?: boolean;
  /** Description of the effect */
  description?: string;
}

/**
 * Interface for skill rewards
 */
export interface SkillReward {
  /** Type of reward (attribute, item, trait, etc) */
  type: string;
  /** ID of the reward if applicable */
  id?: string;
  /** Value/amount of the reward */
  value: number;
  /** Description of the reward */
  description: string;
}

/**
 * Interface for skill abilities
 */
export interface SkillAbility {
  /** Unique identifier for the ability */
  id: string;
  /** Display name for the ability */
  name: string;
  /** Description of what the ability does */
  description: string;
  /** Level at which this ability is unlocked */
  unlockLevel: number;
  /** Cooldown time in seconds if applicable */
  cooldown?: number;
  /** Resource cost to use (mana, energy, etc) */
  cost?: number;
  /** Type of resource used (mana, energy, etc) */
  costType?: string;
  /** Effects when using this ability */
  effects?: SkillEffect[];
  /** Whether the ability is passive or active */
  isPassive: boolean;
  /** Whether the ability is currently unlocked */
  unlocked: boolean;
}

/**
 * Interface for a single skill
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: string;
  /** Display name for the skill */
  name: string;
  /** Longer description of the skill */
  description: string;
  /** Category this skill belongs to */
  category: SkillCategory;
  /** Type of skill within the category */
  type: SkillType;
  /** Current level of the skill (1-100) */
  level: number;
  /** Current experience points */
  experience: number;
  /** Experience needed for next level */
  nextLevelExperience: number;
  /** Current proficiency level */
  proficiency: SkillProficiency;
  /** Whether the skill is locked (unavailable) */
  locked: boolean;
  /** Icon for the skill */
  icon?: string;
  /** Requirements to unlock this skill */
  requirements?: SkillRequirement[];
  /** Effects provided by this skill */
  effects?: SkillEffect[];
  /** Rewards for leveling this skill */
  levelRewards?: Record<number, SkillReward[]>;
  /** Abilities unlocked by this skill */
  abilities?: SkillAbility[];
  /** Maximum level this skill can reach */
  maxLevel: number;
  /** Trainer NPCs that can teach this skill */
  trainers?: string[];
  /** Related skills that provide bonuses */
  relatedSkills?: string[];
  /** Whether the skill can be improved through training */
  canTrain: boolean;
  /** Rate at which this skill gains experience */
  experienceRate: number;
}

/**
 * Interface for skill progression log entry
 */
export interface SkillLogEntry {
  /** Unique identifier for the log entry */
  id: string;
  /** ID of the skill this entry relates to */
  skillId: string;
  /** Time when this entry was created */
  timestamp: number;
  /** Type of entry (level up, experience gain, etc) */
  type: 'levelUp' | 'experienceGain' | 'abilityUnlock' | 'proficiencyChange';
  /** Additional data for the entry */
  data: {
    /** Previous level/value if applicable */
    previousValue?: number;
    /** New level/value */
    newValue: number;
    /** Amount of change */
    change?: number;
    /** Source of the change */
    source?: string;
    /** Ability ID if ability was unlocked */
    abilityId?: string;
  };
  /** Whether the entry has been seen by the player */
  seen: boolean;
}

/**
 * Interface for the Skills state in Redux
 */
export interface SkillsState {
  /** Map of all skills indexed by their ID */
  skills: Record<string, Skill>;
  /** IDs of active skills being trained */
  activeSkillId: string | null;
  /** Available skill points to spend */
  skillPoints: number;
  /** Skill progression log entries */
  skillLog: SkillLogEntry[];
  /** Multiplier for experience gain (from bonuses) */
  experienceMultiplier: number;
  /** Global cooldown for skill abilities */
  globalCooldown: number;
  /** Error message if any */
  error: string | null;
  /** Loading state for async operations */
  isLoading: boolean;
  /** IDs of favorite/pinned skills */
  favoriteSkillIds: string[];
  /** ID of currently selected skill in UI */
  selectedSkillId: string | null;
}

/**
 * Payload for gaining skill experience
 */
export interface GainSkillExperiencePayload {
  /** ID of the skill to update */
  skillId: string;
  /** Amount of experience to add */
  amount: number;
  /** Source of the experience (activity, item, etc) */
  source?: string;
}

/**
 * Payload for setting a skill level directly
 */
export interface SetSkillLevelPayload {
  /** ID of the skill to update */
  skillId: string;
  /** New level for the skill */
  level: number;
}

/**
 * Payload for unlocking a skill
 */
export interface UnlockSkillPayload {
  /** ID of the skill to unlock */
  skillId: string;
}

/**
 * Payload for setting the active skill
 */
export interface SetActiveSkillPayload {
  /** ID of the skill to make active (null to clear) */
  skillId: string | null;
}

/**
 * Payload for unlocking a skill ability
 */
export interface UnlockSkillAbilityPayload {
  /** ID of the skill */
  skillId: string;
  /** ID of the ability to unlock */
  abilityId: string;
}

/**
 * Payload for toggling a favorite skill
 */
export interface ToggleFavoriteSkillPayload {
  /** ID of the skill to toggle favorite status */
  skillId: string;
}

/**
 * Payload for activating a skill ability
 */
export interface ActivateSkillAbilityPayload {
  /** ID of the skill */
  skillId: string;
  /** ID of the ability to activate */
  abilityId: string;
  /** Target of the ability if applicable */
  targetId?: string;
}

/**
 * Payload for initializing skills
 */
export interface InitializeSkillsPayload {
  /** Initial skills data */
  skills: Record<string, Skill>;
  /** Initial skill points */
  skillPoints?: number;
}

/**
 * Payload for rewarding skill points
 */
export interface RewardSkillPointsPayload {
  /** Number of points to add */
  amount: number;
  /** Source of the points */
  source?: string;
}

/**
 * Payload for spending skill points
 */
export interface SpendSkillPointsPayload {
  /** ID of the skill to improve */
  skillId: string;
  /** Number of points to spend */
  amount: number;
}

/**
 * Payload for setting the experience multiplier
 */
export interface SetExperienceMultiplierPayload {
  /** New multiplier value */
  value: number;
  /** Source of the change */
  source?: string;
}

/**
 * Response for checking skill requirements
 */
export interface SkillRequirementsResult {
  /** Whether all requirements are met */
  allMet: boolean;
  /** Details about individual requirements */
  details: {
    /** The requirement that was checked */
    requirement: SkillRequirement;
    /** Whether this requirement was met */
    met: boolean;
  }[];
}
