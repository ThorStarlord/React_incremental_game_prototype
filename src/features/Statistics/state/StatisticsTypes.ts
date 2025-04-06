/**
 * Type definitions for game statistics
 */

/**
 * Combat statistics tracking
 */
export interface CombatStatistics {
  enemiesDefeated: number;
  criticalHits: number;
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
}

/**
 * Progression statistics tracking
 */
export interface ProgressionStatistics {
  questsCompleted: number;
  achievementsUnlocked: number;
  levelsGained: number;
}

/**
 * Economy statistics tracking
 */
export interface EconomyStatistics {
  goldEarned: number;
  goldSpent: number;
  itemsCrafted: number;
  itemsPurchased: number;
}

/**
 * Production statistics tracking
 */
export interface ProductionStatistics {
  resourcesGathered: number;
  itemsProduced: number;
}

/**
 * Exploration statistics tracking
 */
export interface ExplorationStatistics {
  areasDiscovered: number;
  secretsFound: number;
}

/**
 * Time tracking statistics
 */
export interface TimeStatistics {
  totalPlayTime: number; // in seconds
  sessionPlayTime: number; // in seconds
}

/**
 * Social interaction statistics
 */
export interface SocialStatistics {
  npcsInteracted: number;
  tradesMade: number;
}

/**
 * The complete statistics state
 */
export interface StatisticsState {
  combatStatistics: CombatStatistics;
  progressionStatistics: ProgressionStatistics;
  economyStatistics: EconomyStatistics;
  productionStatistics: ProductionStatistics;
  explorationStatistics: ExplorationStatistics;
  timeStatistics: TimeStatistics;
  socialStatistics: SocialStatistics;
}

/**
 * Possible categories of statistics for update operations
 */
export type StatisticsCategory = 
  | 'combat'
  | 'progression'
  | 'economy'
  | 'production'
  | 'exploration'
  | 'time'
  | 'social';

/**
 * Payload for updating a specific statistic
 */
export interface UpdateStatisticPayload {
  category: StatisticsCategory;
  statistic: string;
  value: number;
  operation?: 'add' | 'set' | 'subtract'; // default is 'add'
}
