import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  StatisticsState, 
  UpdateStatisticPayload, 
  ResetCategoryPayload,
  UpdateSessionTimePayload
} from './StatisticsTypes';

/**
 * Initial state for the statistics system
 */
const initialState: StatisticsState = {
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

/**
 * Redux slice for managing game statistics
 */
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    /**
     * Update a single statistic value
     */
    updateStatistic: (state, action: PayloadAction<UpdateStatisticPayload>) => {
      const { category, statistic, value, operation = 'add' } = action.payload;
      
      // Get the appropriate category object based on the category string
      const categoryKey = `${category}Statistics` as keyof StatisticsState;
      const categoryObj = state[categoryKey];
      
      if (categoryObj && statistic in categoryObj) {
        const currentValue = (categoryObj as any)[statistic];
        
        switch (operation) {
          case 'add':
            (categoryObj as any)[statistic] = currentValue + value;
            break;
          case 'subtract':
            (categoryObj as any)[statistic] = Math.max(0, currentValue - value);
            break;
          case 'set':
            (categoryObj as any)[statistic] = value;
            break;
        }
      }
    },
    
    /**
     * Reset all statistics to zero
     */
    resetStatistics: (state) => {
      return initialState;
    },
    
    /**
     * Reset statistics for a specific category
     */
    resetCategoryStatistics: (state, action: PayloadAction<string>) => {
      const categoryKey = `${action.payload}Statistics` as keyof StatisticsState;
      if (initialState[categoryKey]) {
        state[categoryKey] = initialState[categoryKey];
      }
    },
    
    /**
     * Update session play time
     */
    updateSessionPlayTime: (state, action: PayloadAction<number>) => {
      state.timeStatistics.sessionPlayTime = action.payload;
    },
    
    /**
     * Add time to total play time
     */
    addToTotalPlayTime: (state, action: PayloadAction<number>) => {
      state.timeStatistics.totalPlayTime += action.payload;
    },
    
    /**
     * Set specific total play time
     */
    setTotalPlayTime: (state, action: PayloadAction<number>) => {
      state.timeStatistics.totalPlayTime = action.payload;
    },
    
    /**
     * Import statistics (used for loading saved games)
     */
    importStatistics: (state, action: PayloadAction<StatisticsState>) => {
      return action.payload;
    }
  }
});

export const { 
  updateStatistic, 
  resetStatistics, 
  resetCategoryStatistics,
  updateSessionPlayTime,
  addToTotalPlayTime,
  setTotalPlayTime,
  importStatistics
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
