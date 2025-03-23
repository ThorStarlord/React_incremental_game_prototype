/**
 * Initial state configuration for game statistics
 */

import { StatisticsState } from '../types/gameStates/StatisticsGameStateTypes';

/**
 * Initial state for the statistics system
 */
const statisticsInitialState: StatisticsState = {
  combatStatistics: {
    enemiesDefeated: 0,
    criticalHits: 0,
    damageDealt: 0,
    damageTaken: 0,
    healingDone: 0,
  },
  progressionStatistics: {
    questsCompleted: 0,
    achievementsUnlocked: 0,
    levelsGained: 0,
  },
  economyStatistics: {
    goldEarned: 0,
    goldSpent: 0,
    itemsCrafted: 0,
    itemsPurchased: 0,
  },
  productionStatistics: {
    resourcesGathered: 0,
    itemsProduced: 0,
  },
  explorationStatistics: {
    areasDiscovered: 0,
    secretsFound: 0,
  },
  timeStatistics: {
    totalPlayTime: 0,
    sessionPlayTime: 0,
  },
  socialStatistics: {
    npcsInteracted: 0,
    tradesMade: 0,
  },
};

export default statisticsInitialState;
