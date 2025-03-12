/**
 * Type definitions for game statistics and metrics
 */

/**
 * Combat-related statistics
 */
export interface CombatStatistics {
  enemiesDefeated: number;
  damageDealt: number;
  damageTaken: number;
  criticalHits: number;
  highestDamageDealt: number;
  deathCount: number;
  bossesDefeated: number;
  skillsUsed: Record<string, number>;
  enemiesDefeatedByType: Record<string, number>;
}

/**
 * Progression-related statistics
 */
export interface ProgressionStatistics {
  questsCompleted: number;
  questsFailed: number;
  achievementsUnlocked: number;
  locationsDiscovered: number;
  levelsGained: number;
  highestLevel: number;
  featuresUnlocked: number;
}

/**
 * Economy-related statistics
 */
export interface EconomyStatistics {
  goldEarned: number;
  goldSpent: number;
  itemsBought: number;
  itemsSold: number;
  highestGoldHeld: number;
  gemsEarned: number;
  gemsSpent: number;
}

/**
 * Crafting and gathering statistics
 */
export interface ProductionStatistics {
  itemsCrafted: number;
  resourcesGathered: number;
  itemsEnchanted: number;
  recipesLearned: number;
  highestQualityItem: number;
  materialsByType: Record<string, number>;
  itemsCraftedByType: Record<string, number>;
}

/**
 * Exploration-related statistics
 */
export interface ExplorationStatistics {
  distanceTraveled: number;
  areasExplored: number;
  chestsOpened: number;
  secretsFound: number;
  dungeonRuns: number;
}

/**
 * Time-related statistics
 */
export interface TimeStatistics {
  totalPlayTime: number; // in seconds
  sessionCount: number;
  longestSession: number; // in seconds
  afkTime: number; // in seconds
  activeDays: number;
}

/**
 * Social interaction statistics
 */
export interface SocialStatistics {
  npcInteractions: number;
  questsAccepted: number;
  relationshipLevelsGained: number;
  giftsGiven: number;
  highestRelationship: number;
}

/**
 * Time period for statistics tracking
 */
export type StatisticsPeriod = 'daily' | 'weekly' | 'monthly' | 'allTime';

/**
 * All game statistics and metrics
 */
export interface StatisticsState {
  // Basic statistics (for backward compatibility)
  enemiesDefeated: number;
  questsCompleted: number;
  itemsCrafted: number;
  resourcesGathered: number;
  goldEarned: number;
  distanceTraveled: number;
  totalPlayTime: number; // in seconds
  
  // Detailed statistics by category
  combat?: CombatStatistics;
  progression?: ProgressionStatistics;
  economy?: EconomyStatistics;
  production?: ProductionStatistics;
  exploration?: ExplorationStatistics;
  time?: TimeStatistics;
  social?: SocialStatistics;
  
  // Historical data for trends
  historicalData?: {
    [key in StatisticsPeriod]?: Partial<StatisticsState>;
  };
  
  // First occurrence timestamps
  firstOccurrences?: Record<string, string>; // ISO date strings
  
  // Allow for additional statistics
  [key: string]: any;
}

/**
 * Structure for a statistics milestone
 */
export interface StatisticsMilestone {
  id: string;
  name: string;
  description: string;
  statisticKey: string;
  threshold: number;
  isAchieved: boolean;
  reward?: any;
}

/**
 * Statistics event for tracking significant changes
 */
export interface StatisticsEvent {
  type: string;
  value: number;
  timestamp: string; // ISO date string
  metadata?: Record<string, any>;
}

/**
 * Complete statistics tracking system
 */
export interface StatisticsSystem {
  current: StatisticsState;
  milestones: StatisticsMilestone[];
  recentEvents: StatisticsEvent[];
}
