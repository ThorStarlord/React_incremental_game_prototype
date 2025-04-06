/**
 * Type definitions for the Achievements system
 */

/**
 * Achievement categories
 */
export enum AchievementCategory {
  COMBAT = 'combat',
  EXPLORATION = 'exploration',
  PROGRESSION = 'progression',
  SOCIAL = 'social',
  COLLECTION = 'collection',
  CRAFTING = 'crafting',
  SPECIAL = 'special'
}

/**
 * Achievement rarity levels
 */
export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

/**
 * Condition types for achievement criteria
 */
export enum AchievementConditionType {
  STAT_EQUALS = 'stat_equals',
  STAT_GREATER_THAN = 'stat_greater_than',
  ITEM_COLLECTED = 'item_collected',
  LOCATION_DISCOVERED = 'location_discovered',
  QUEST_COMPLETED = 'quest_completed',
  NPC_RELATIONSHIP = 'npc_relationship',
  PLAYER_LEVEL = 'player_level',
  SKILL_LEVEL = 'skill_level',
  TRAIT_ACQUIRED = 'trait_acquired',
  ENEMY_DEFEATED = 'enemy_defeated',
  CUSTOM = 'custom'
}

/**
 * Condition for an achievement
 */
export interface AchievementCondition {
  type: AchievementConditionType;
  target: string;
  value: number | string;
  operator?: 'equal' | 'greater' | 'less' | 'greater_equal' | 'less_equal';
  description?: string;
}

/**
 * Reward type for completing an achievement
 */
export interface AchievementReward {
  type: 'gold' | 'item' | 'essence' | 'trait' | 'experience' | 'stat_boost';
  id?: string;
  amount?: number;
  description: string;
}

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  conditions: AchievementCondition[];
  rewards?: AchievementReward[];
  hidden?: boolean;
  icon?: string;
  points: number;
  order?: number;
}

/**
 * Achievement unlocked status information
 */
export interface AchievementStatus {
  achievementId: string;
  unlocked: boolean;
  progress: number; // 0-100
  dateUnlocked?: string;
  displayed?: boolean; // Whether unlock notification was displayed
}

/**
 * Achievement system state
 */
export interface AchievementsState {
  achievements: Record<string, Achievement>;
  playerAchievements: Record<string, AchievementStatus>;
  totalPoints: number;
  loading: boolean;
  error: string | null;
  recentlyUnlocked: string[];
  achievementCategories: Record<AchievementCategory, number>; // Number of achievements per category
}

/**
 * Payload for unlocking an achievement
 */
export interface UnlockAchievementPayload {
  achievementId: string;
  displayNotification?: boolean;
}

/**
 * Payload for updating achievement progress
 */
export interface UpdateProgressPayload {
  achievementId: string;
  progress: number;
}

/**
 * Payload for checking a stat achievement
 */
export interface CheckStatAchievementPayload {
  statCategory: string;
  statName: string;
  value: number;
}

/**
 * Payload for checking achievements by condition
 */
export interface CheckAchievementConditionPayload {
  type: AchievementConditionType;
  target: string;
  value: number | string;
}

/**
 * Payload for marking achievement notification as displayed
 */
export interface MarkAchievementDisplayedPayload {
  achievementId: string;
}
