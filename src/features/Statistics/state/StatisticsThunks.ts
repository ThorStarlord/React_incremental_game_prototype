import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { updateStatistic, updateSessionPlayTime } from './StatisticsSlice';

/**
 * Track enemies defeated and update related statistics
 */
export const trackEnemyDefeated = createAsyncThunk(
  'statistics/trackEnemyDefeated',
  async (payload: { enemyLevel: number, damageDealt: number }, { dispatch, getState }) => {
    // Update enemies defeated count
    dispatch(updateStatistic({
      category: 'combat',
      statistic: 'enemiesDefeated',
      value: 1
    }));
    
    // Update damage dealt
    dispatch(updateStatistic({
      category: 'combat',
      statistic: 'damageDealt',
      value: payload.damageDealt
    }));
    
    // Additional logic for milestone achievements could be added here
    const state = getState() as RootState;
    const enemiesDefeated = state.statistics.combatStatistics.enemiesDefeated;
    
    // Example of milestone tracking
    if (enemiesDefeated % 10 === 0) {
      // Could dispatch an achievement notification or reward
      console.log(`Milestone: Defeated ${enemiesDefeated} enemies!`);
    }
  }
);

/**
 * Track quest completion with related statistics
 */
export const trackQuestCompleted = createAsyncThunk(
  'statistics/trackQuestCompleted',
  async (payload: { questId: string, reward: number }, { dispatch }) => {
    // Update quests completed
    dispatch(updateStatistic({
      category: 'progression',
      statistic: 'questsCompleted',
      value: 1
    }));
    
    // Update gold earned from quest
    if (payload.reward > 0) {
      dispatch(updateStatistic({
        category: 'economy',
        statistic: 'goldEarned',
        value: payload.reward
      }));
    }
  }
);

/**
 * Track session time
 */
export const trackPlayTime = createAsyncThunk(
  'statistics/trackPlayTime',
  async (_, { dispatch, getState }) => {
    // This would be called periodically to update session time
    const state = getState() as RootState;
    const currentSessionTime = state.statistics.timeStatistics.sessionPlayTime;
    
    // Add 1 minute (60 seconds) to the session time
    dispatch(updateSessionPlayTime(currentSessionTime + 60));
  }
);

/**
 * Track item purchase
 */
export const trackItemPurchase = createAsyncThunk(
  'statistics/trackItemPurchase',
  async (payload: { itemId: string, cost: number }, { dispatch }) => {
    // Update items purchased count
    dispatch(updateStatistic({
      category: 'economy',
      statistic: 'itemsPurchased',
      value: 1
    }));
    
    // Update gold spent
    dispatch(updateStatistic({
      category: 'economy',
      statistic: 'goldSpent',
      value: payload.cost
    }));
  }
);

/**
 * Track critical hit in combat
 */
export const trackCriticalHit = createAsyncThunk(
  'statistics/trackCriticalHit',
  async (payload: { damage: number }, { dispatch }) => {
    // Update critical hits count
    dispatch(updateStatistic({
      category: 'combat',
      statistic: 'criticalHits',
      value: 1
    }));
    
    // Update damage dealt
    dispatch(updateStatistic({
      category: 'combat',
      statistic: 'damageDealt',
      value: payload.damage
    }));
  }
);
