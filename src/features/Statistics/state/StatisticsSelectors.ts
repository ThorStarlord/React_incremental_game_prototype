import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { 
  StatisticsState, 
  CombatStatistics,
  ProgressionStatistics,
  EconomyStatistics,
  ProductionStatistics,
  ExplorationStatistics,
  TimeStatistics,
  SocialStatistics
} from './StatisticsTypes';

/**
 * Select the entire statistics state
 */
export const selectStatistics = (state: RootState): StatisticsState => 
  state.statistics;

/**
 * Select combat statistics
 */
export const selectCombatStatistics = (state: RootState): CombatStatistics => 
  state.statistics.combatStatistics;

/**
 * Select progression statistics
 */
export const selectProgressionStatistics = (state: RootState): ProgressionStatistics => 
  state.statistics.progressionStatistics;

/**
 * Select economy statistics
 */
export const selectEconomyStatistics = (state: RootState): EconomyStatistics => 
  state.statistics.economyStatistics;

/**
 * Select production statistics
 */
export const selectProductionStatistics = (state: RootState): ProductionStatistics => 
  state.statistics.productionStatistics;

/**
 * Select exploration statistics
 */
export const selectExplorationStatistics = (state: RootState): ExplorationStatistics => 
  state.statistics.explorationStatistics;

/**
 * Select time statistics
 */
export const selectTimeStatistics = (state: RootState): TimeStatistics => 
  state.statistics.timeStatistics;

/**
 * Select social statistics
 */
export const selectSocialStatistics = (state: RootState): SocialStatistics => 
  state.statistics.socialStatistics;

/**
 * Select a specific statistic by category and name
 */
export const selectSpecificStatistic = 
  (state: RootState, category: string, statName: string): number => {
    const categoryKey = `${category}Statistics` as keyof StatisticsState;
    const categoryObj = state.statistics[categoryKey];
    
    if (categoryObj && statName in categoryObj) {
      return (categoryObj as any)[statName];
    }
    
    return 0;
  };

/**
 * Select the top statistics (most impressive values)
 * Used for displaying achievements and progress summaries
 */
export const selectTopStatistics = createSelector(
  [selectStatistics],
  (stats) => {
    return {
      enemiesDefeated: stats.combatStatistics.enemiesDefeated,
      damageDealt: stats.combatStatistics.damageDealt,
      questsCompleted: stats.progressionStatistics.questsCompleted,
      goldEarned: stats.economyStatistics.goldEarned,
      areasDiscovered: stats.explorationStatistics.areasDiscovered,
      totalPlayTime: stats.timeStatistics.totalPlayTime,
    };
  }
);

/**
 * Format play time into readable string (hh:mm:ss)
 */
export const getFormattedPlayTime = createSelector(
  [selectTimeStatistics],
  (timeStats) => {
    const seconds = timeStats.totalPlayTime;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
);

/**
 * Get session play time in formatted string
 */
export const getFormattedSessionTime = createSelector(
  [selectTimeStatistics],
  (timeStats) => {
    const seconds = timeStats.sessionPlayTime;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
);

/**
 * Get combat efficiency ratio (damage dealt vs taken)
 */
export const getCombatEfficiencyRatio = createSelector(
  [selectCombatStatistics],
  (combatStats) => {
    if (combatStats.damageTaken === 0) return combatStats.damageDealt;
    return combatStats.damageDealt / combatStats.damageTaken;
  }
);

/**
 * Get economy efficiency (gold earned vs spent)
 */
export const getEconomyEfficiency = createSelector(
  [selectEconomyStatistics],
  (economyStats) => {
    return {
      netGold: economyStats.goldEarned - economyStats.goldSpent,
      ratio: economyStats.goldSpent > 0 ? economyStats.goldEarned / economyStats.goldSpent : economyStats.goldEarned
    };
  }
);
