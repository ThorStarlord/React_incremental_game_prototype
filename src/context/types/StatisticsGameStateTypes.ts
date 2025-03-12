/**
 * Type definitions for statistics system
 */

/**
 * Combat statistics
 */
export interface CombatStatistics {
  enemiesDefeated: number;
  criticalHits: number;
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
}

/**
 * Progression statistics
 */
export interface ProgressionStatistics {
  questsCompleted: number;
  achievementsUnlocked: number;
  levelsGained: number;
}

/**
 * Economy statistics
 */
export interface EconomyStatistics {
  goldEarned: number;
  goldSpent: number;
  itemsCrafted: number;
  itemsPurchased: number;
}

/**
 * Production statistics
 */
export interface ProductionStatistics {
  resourcesGathered: number;
  itemsProduced: number;
}

/**
 * Exploration statistics
 */
export interface ExplorationStatistics {
  areasDiscovered: number;
  secretsFound: number;
}

/**
 * Time statistics
 */
export interface TimeStatistics {
  totalPlayTime: number;
  sessionPlayTime: number;
}

/**
 * Social statistics
 */
export interface SocialStatistics {
  npcsInteracted: number;
  tradesMade: number;
}

/**
 * Complete statistics state
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
 * Historical statistics entry with timestamp
 */
export interface HistoricalStatisticsEntry {
  timestamp: number;
  data: StatisticsState;
}

/**
 * Statistics system with current and historical data
 */
export interface StatisticsSystem {
  current: StatisticsState;
  history: HistoricalStatisticsEntry[];
}

/**
 * Utility type for aggregating statistics
 */
export type AggregatedStatistics = {
  [K in keyof StatisticsState]: number;
};
