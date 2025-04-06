import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  updateStatistic, 
  updateSessionPlayTime,
  addToTotalPlayTime 
} from './StatisticsSlice';
import { StatisticsCategory } from './StatisticsTypes';

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
  async (elapsedSeconds: number, { dispatch, getState }) => {
    // This would be called periodically to update session time
    const state = getState() as RootState;
    const currentSessionTime = state.statistics.timeStatistics.sessionPlayTime;
    
    // Update both session time and total play time
    dispatch(updateSessionPlayTime(currentSessionTime + elapsedSeconds));
    dispatch(addToTotalPlayTime(elapsedSeconds));
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

/**
 * Track damage taken in combat
 */
export const trackDamageTaken = createAsyncThunk(
  'statistics/trackDamageTaken',
  async (payload: { damage: number }, { dispatch }) => {
    dispatch(updateStatistic({
      category: 'combat',
      statistic: 'damageTaken',
      value: payload.damage
    }));
  }
);

/**
 * Track healing received
 */
export const trackHealing = createAsyncThunk(
  'statistics/trackHealing',
  async (payload: { amount: number }, { dispatch }) => {
    dispatch(updateStatistic({
      category: 'combat',
      statistic: 'healingDone',
      value: payload.amount
    }));
  }
);

/**
 * Generic statistic tracker for any category and statistic
 */
export const trackGenericStat = createAsyncThunk(
  'statistics/trackGenericStat',
  async (payload: { 
    category: StatisticsCategory, 
    statistic: string, 
    value: number,
    operation?: 'add' | 'set' | 'subtract'
  }, { dispatch }) => {
    dispatch(updateStatistic(payload));
  }
);
