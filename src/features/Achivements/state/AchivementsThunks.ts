import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  addNotification 
} from '../../Notifications/state/NotificationsSlice';
import { 
  addAchievementNotification 
} from '../../Notifications/state/NotificationsThunks';
import {
  initializeAchievements,
  initializePlayerAchievements,
  unlockAchievement,
  updateAchievementProgress,
  markAchievementDisplayed,
  setLoading,
  setError
} from './AchivementsSlice';
import {
  AchievementConditionType,
  CheckStatAchievementPayload,
  CheckAchievementConditionPayload
} from './AchivementsTypes';

/**
 * Load achievements data
 */
export const loadAchievements = createAsyncThunk(
  'achievements/loadAchievements',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    
    try {
      // In a real app, would fetch from API or load from JSON
      // For this example, we'll just simulate with placeholder data
      
      // Simulating async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load achievement definitions from wherever your data is stored
      const achievementsData = {}; // Replace with actual data loading
      
      dispatch(initializeAchievements(achievementsData));
      dispatch(setLoading(false));
      
      return achievementsData;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to load achievements'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Load player achievement progress
 */
export const loadPlayerAchievements = createAsyncThunk(
  'achievements/loadPlayerAchievements',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    
    try {
      // In a real app, would fetch from API, localStorage, or other storage
      // For this example, we'll just simulate with placeholder data
      
      // Simulating async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get saved achievement progress
      const savedProgress = localStorage.getItem('playerAchievements');
      const playerAchievements = savedProgress ? JSON.parse(savedProgress) : {};
      
      dispatch(initializePlayerAchievements(playerAchievements));
      dispatch(setLoading(false));
      
      return playerAchievements;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to load player achievements'));
      dispatch(setLoading(false));
      throw error;
    }
  }
);

/**
 * Save player achievement progress to storage
 */
export const savePlayerAchievements = createAsyncThunk(
  'achievements/savePlayerAchievements',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const playerAchievements = state.achievements.playerAchievements;
    
    // In a real app, would save to localStorage, API, or other storage
    localStorage.setItem('playerAchievements', JSON.stringify(playerAchievements));
    
    return playerAchievements;
  }
);

/**
 * Check if a statistic achievement should be unlocked
 */
export const checkStatAchievement = createAsyncThunk(
  'achievements/checkStatAchievement',
  async (payload: CheckStatAchievementPayload, { dispatch, getState }) => {
    const { statCategory, statName, value } = payload;
    const state = getState() as RootState;
    const achievements = state.achievements.achievements;
    const playerAchievements = state.achievements.playerAchievements;
    
    // Find all stat-based achievements that match this stat
    const relevantAchievements = Object.values(achievements).filter(achievement => 
      achievement.conditions.some(condition => 
        (condition.type === AchievementConditionType.STAT_EQUALS || 
         condition.type === AchievementConditionType.STAT_GREATER_THAN) &&
        condition.target === `${statCategory}.${statName}`
      )
    );
    
    const unlocked: string[] = [];
    
    // Check each achievement
    relevantAchievements.forEach(achievement => {
      // Skip if already unlocked
      if (playerAchievements[achievement.id]?.unlocked) return;
      
      // Check each condition
      let allConditionsMet = true;
      let progressPercentage = 0;
      
      achievement.conditions.forEach(condition => {
        // Skip non-relevant conditions for this check
        if ((condition.type !== AchievementConditionType.STAT_EQUALS && 
             condition.type !== AchievementConditionType.STAT_GREATER_THAN) ||
            condition.target !== `${statCategory}.${statName}`) {
          return;
        }
        
        const conditionValue = typeof condition.value === 'number' 
          ? condition.value 
          : parseInt(condition.value as string, 10);
        
        if (condition.type === AchievementConditionType.STAT_EQUALS) {
          if (value !== conditionValue) {
            allConditionsMet = false;
          }
          progressPercentage = value === conditionValue ? 100 : 0;
        } else if (condition.type === AchievementConditionType.STAT_GREATER_THAN) {
          if (value < conditionValue) {
            allConditionsMet = false;
            progressPercentage = Math.min(100, Math.floor((value / conditionValue) * 100));
          } else {
            progressPercentage = 100;
          }
        }
      });
      
      // Update progress
      if (progressPercentage > 0) {
        dispatch(updateAchievementProgress({
          achievementId: achievement.id,
          progress: progressPercentage
        }));
      }
      
      // Unlock if all conditions are met
      if (allConditionsMet) {
        dispatch(unlockAchievement({
          achievementId: achievement.id,
          displayNotification: true
        }));
        unlocked.push(achievement.id);
      }
    });
    
    // Handle notifications for unlocked achievements
    await Promise.all(unlocked.map(achievementId => {
      const achievement = achievements[achievementId];
      return dispatch(addAchievementNotification({
        achievementId,
        title: achievement.title,
        description: achievement.description
      })).unwrap();
    }));
    
    // Save progress
    if (unlocked.length > 0) {
      dispatch(savePlayerAchievements());
    }
    
    return { unlockedAchievements: unlocked };
  }
);

/**
 * Check achievements based on a condition
 */
export const checkAchievementsByCondition = createAsyncThunk(
  'achievements/checkAchievementsByCondition',
  async (payload: CheckAchievementConditionPayload, { dispatch, getState }) => {
    const { type, target, value } = payload;
    const state = getState() as RootState;
    const achievements = state.achievements.achievements;
    const playerAchievements = state.achievements.playerAchievements;
    
    // Find relevant achievements
    const relevantAchievements = Object.values(achievements).filter(achievement => 
      achievement.conditions.some(condition => 
        condition.type === type && condition.target === target
      )
    );
    
    const unlocked: string[] = [];
    
    // Check each achievement
    relevantAchievements.forEach(achievement => {
      // Skip if already unlocked
      if (playerAchievements[achievement.id]?.unlocked) return;
      
      // Check each condition
      let allConditionsMet = true;
      let progressPercentage = 0;
      
      achievement.conditions.forEach(condition => {
        // Skip non-relevant conditions
        if (condition.type !== type || condition.target !== target) return;
        
        const conditionValue = condition.value;
        
        // Handle different condition types
        switch (type) {
          case AchievementConditionType.QUEST_COMPLETED:
          case AchievementConditionType.LOCATION_DISCOVERED:
          case AchievementConditionType.ITEM_COLLECTED:
          case AchievementConditionType.TRAIT_ACQUIRED:
            // For these types, check exact matches
            if (conditionValue !== value) {
              allConditionsMet = false;
              progressPercentage = 0;
            } else {
              progressPercentage = 100;
            }
            break;
            
          case AchievementConditionType.NPC_RELATIONSHIP:
          case AchievementConditionType.PLAYER_LEVEL:
          case AchievementConditionType.SKILL_LEVEL:
          case AchievementConditionType.ENEMY_DEFEATED:
            // For numeric comparisons
            const numValue = typeof value === 'number' ? value : parseInt(value as string, 10);
            const numCondition = typeof conditionValue === 'number' ? 
              conditionValue : parseInt(conditionValue as string, 10);
            
            const operator = condition.operator || 'greater_equal';
            
            switch (operator) {
              case 'equal':
                if (numValue !== numCondition) {
                  allConditionsMet = false;
                  progressPercentage = numValue === numCondition ? 100 : 0;
                } else {
                  progressPercentage = 100;
                }
                break;
              case 'greater':
                if (numValue <= numCondition) {
                  allConditionsMet = false;
                  progressPercentage = Math.min(100, Math.floor((numValue / numCondition) * 100));
                } else {
                  progressPercentage = 100;
                }
                break;
              case 'less':
                if (numValue >= numCondition) {
                  allConditionsMet = false;
                  progressPercentage = 0;
                } else {
                  progressPercentage = 100;
                }
                break;
              case 'greater_equal':
                if (numValue < numCondition) {
                  allConditionsMet = false;
                  progressPercentage = Math.min(100, Math.floor((numValue / numCondition) * 100));
                } else {
                  progressPercentage = 100;
                }
                break;
              case 'less_equal':
                if (numValue > numCondition) {
                  allConditionsMet = false;
                  progressPercentage = 0;
                } else {
                  progressPercentage = 100;
                }
                break;
            }
            break;
        }
      });
      
      // Update progress
      if (progressPercentage > 0) {
        dispatch(updateAchievementProgress({
          achievementId: achievement.id,
          progress: progressPercentage
        }));
      }
      
      // Unlock if all conditions are met
      if (allConditionsMet) {
        dispatch(unlockAchievement({
          achievementId: achievement.id,
          displayNotification: true
        }));
        unlocked.push(achievement.id);
      }
    });
    
    // Handle notifications for unlocked achievements
    await Promise.all(unlocked.map(achievementId => {
      const achievement = achievements[achievementId];
      return dispatch(addAchievementNotification({
        achievementId,
        title: achievement.title,
        description: achievement.description
      })).unwrap();
    }));
    
    // Save progress
    if (unlocked.length > 0) {
      dispatch(savePlayerAchievements());
    }
    
    return { unlockedAchievements: unlocked };
  }
);

/**
 * Process new achievement unlocks and display notifications
 */
export const processAchievementNotifications = createAsyncThunk(
  'achievements/processAchievementNotifications',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const recentlyUnlocked = state.achievements.recentlyUnlocked;
    const achievements = state.achievements.achievements;
    
    // Process each recently unlocked achievement
    for (const achievementId of recentlyUnlocked) {
      const achievement = achievements[achievementId];
      
      if (!achievement) continue;
      
      // Display notification
      await dispatch(addAchievementNotification({
        achievementId,
        title: achievement.title,
        description: achievement.description
      })).unwrap();
      
      // Mark as displayed
      dispatch(markAchievementDisplayed({ achievementId }));
      
      // Process any rewards
      if (achievement.rewards) {
        for (const reward of achievement.rewards) {
          // Handle different reward types
          switch (reward.type) {
            case 'gold':
              dispatch({
                type: 'player/addGold',
                payload: reward.amount || 0
              });
              break;
            case 'experience':
              dispatch({
                type: 'player/addExperience',
                payload: reward.amount || 0
              });
              break;
            case 'item':
              if (reward.id) {
                dispatch({
                  type: 'inventory/addItem',
                  payload: { 
                    itemId: reward.id,
                    quantity: reward.amount || 1
                  }
                });
              }
              break;
            case 'trait':
              if (reward.id) {
                dispatch({
                  type: 'player/acquireTrait',
                  payload: { traitId: reward.id }
                });
              }
              break;
            case 'stat_boost':
              // Handle stat boosts
              break;
          }
        }
        
        // Show rewards notification
        const rewardText = achievement.rewards
          .map(reward => reward.description)
          .join(', ');
        
        dispatch(addNotification(
          `Achievement Rewards: ${rewardText}`,
          'success',
          {
            duration: 5000,
            category: 'achievement_rewards'
          }
        ));
      }
      
      // Small delay between notifications for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return { processedCount: recentlyUnlocked.length };
  }
);

/**
 * Manually unlock an achievement (for testing or admin purposes)
 */
export const manuallyUnlockAchievement = createAsyncThunk(
  'achievements/manuallyUnlockAchievement',
  async (achievementId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const achievement = state.achievements.achievements[achievementId];
    
    if (!achievement) {
      throw new Error(`Achievement ${achievementId} not found`);
    }
    
    dispatch(unlockAchievement({
      achievementId,
      displayNotification: true
    }));
    
    dispatch(savePlayerAchievements());
    
    return { achievement };
  }
);
