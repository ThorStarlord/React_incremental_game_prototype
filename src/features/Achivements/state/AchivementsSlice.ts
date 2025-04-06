import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  AchievementsState, 
  Achievement, 
  AchievementStatus,
  AchievementCategory,
  UnlockAchievementPayload,
  UpdateProgressPayload,
  MarkAchievementDisplayedPayload
} from './AchivementsTypes';

/**
 * Initial state for the achievements system
 */
const initialState: AchievementsState = {
  achievements: {},
  playerAchievements: {},
  totalPoints: 0,
  loading: false,
  error: null,
  recentlyUnlocked: [],
  achievementCategories: {
    [AchievementCategory.COMBAT]: 0,
    [AchievementCategory.EXPLORATION]: 0,
    [AchievementCategory.PROGRESSION]: 0,
    [AchievementCategory.SOCIAL]: 0,
    [AchievementCategory.COLLECTION]: 0,
    [AchievementCategory.CRAFTING]: 0,
    [AchievementCategory.SPECIAL]: 0
  }
};

/**
 * Achievement slice for Redux store
 */
const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    /**
     * Add a new achievement definition
     */
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = action.payload;
      state.achievements[achievement.id] = achievement;
      
      // Update category counts
      if (state.achievementCategories[achievement.category] !== undefined) {
        state.achievementCategories[achievement.category]++;
      }
    },
    
    /**
     * Initialize achievements from data
     */
    initializeAchievements: (state, action: PayloadAction<Record<string, Achievement>>) => {
      state.achievements = action.payload;
      
      // Reset category counts
      Object.keys(state.achievementCategories).forEach(category => {
        state.achievementCategories[category as AchievementCategory] = 0;
      });
      
      // Count achievements by category
      Object.values(action.payload).forEach(achievement => {
        if (state.achievementCategories[achievement.category] !== undefined) {
          state.achievementCategories[achievement.category]++;
        }
      });
    },
    
    /**
     * Initialize player achievement status
     */
    initializePlayerAchievements: (state, action: PayloadAction<Record<string, AchievementStatus>>) => {
      state.playerAchievements = action.payload;
      
      // Calculate total points
      let points = 0;
      Object.entries(action.payload).forEach(([achievementId, status]) => {
        if (status.unlocked && state.achievements[achievementId]) {
          points += state.achievements[achievementId].points;
        }
      });
      state.totalPoints = points;
    },
    
    /**
     * Unlock an achievement
     */
    unlockAchievement: (state, action: PayloadAction<UnlockAchievementPayload>) => {
      const { achievementId, displayNotification = true } = action.payload;
      
      // Check if achievement exists and is not already unlocked
      if (!state.achievements[achievementId]) {
        return;
      }
      
      const existingStatus = state.playerAchievements[achievementId];
      if (existingStatus && existingStatus.unlocked) {
        return;
      }
      
      // Create or update achievement status
      state.playerAchievements[achievementId] = {
        ...existingStatus,
        achievementId,
        unlocked: true,
        progress: 100,
        dateUnlocked: new Date().toISOString(),
        displayed: !displayNotification // Mark as not displayed if we want a notification
      };
      
      // Add to recently unlocked list if we want to display it
      if (displayNotification && !state.recentlyUnlocked.includes(achievementId)) {
        state.recentlyUnlocked.push(achievementId);
      }
      
      // Update total points
      state.totalPoints += state.achievements[achievementId].points;
    },
    
    /**
     * Update achievement progress
     */
    updateAchievementProgress: (state, action: PayloadAction<UpdateProgressPayload>) => {
      const { achievementId, progress } = action.payload;
      
      // Verify achievement exists
      if (!state.achievements[achievementId]) {
        return;
      }
      
      // Create or update status
      const existingStatus = state.playerAchievements[achievementId] || {
        achievementId,
        unlocked: false,
        progress: 0
      };
      
      // Don't reduce progress and don't update if already unlocked
      if (existingStatus.unlocked || progress <= existingStatus.progress) {
        return;
      }
      
      // Cap progress at 100
      const newProgress = Math.min(100, progress);
      
      // Update progress
      state.playerAchievements[achievementId] = {
        ...existingStatus,
        progress: newProgress
      };
      
      // If progress reaches 100, unlock the achievement
      if (newProgress >= 100 && !existingStatus.unlocked) {
        state.playerAchievements[achievementId].unlocked = true;
        state.playerAchievements[achievementId].dateUnlocked = new Date().toISOString();
        state.playerAchievements[achievementId].displayed = false;
        
        // Add to recently unlocked
        if (!state.recentlyUnlocked.includes(achievementId)) {
          state.recentlyUnlocked.push(achievementId);
        }
        
        // Update total points
        state.totalPoints += state.achievements[achievementId].points;
      }
    },
    
    /**
     * Mark achievement as displayed (notification shown)
     */
    markAchievementDisplayed: (state, action: PayloadAction<MarkAchievementDisplayedPayload>) => {
      const { achievementId } = action.payload;
      
      if (state.playerAchievements[achievementId]) {
        state.playerAchievements[achievementId].displayed = true;
      }
      
      // Remove from recently unlocked list
      state.recentlyUnlocked = state.recentlyUnlocked.filter(id => id !== achievementId);
    },
    
    /**
     * Clear all recently unlocked achievements
     */
    clearRecentlyUnlocked: (state) => {
      // Mark all as displayed
      state.recentlyUnlocked.forEach(achievementId => {
        if (state.playerAchievements[achievementId]) {
          state.playerAchievements[achievementId].displayed = true;
        }
      });
      
      // Clear the list
      state.recentlyUnlocked = [];
    },
    
    /**
     * Reset all achievements (for testing/development)
     */
    resetAllAchievements: (state) => {
      // Reset player achievements to not unlocked
      Object.keys(state.playerAchievements).forEach(achievementId => {
        state.playerAchievements[achievementId] = {
          achievementId,
          unlocked: false,
          progress: 0
        };
      });
      
      // Reset points and recently unlocked
      state.totalPoints = 0;
      state.recentlyUnlocked = [];
    },
    
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// Export actions
export const {
  addAchievement,
  initializeAchievements,
  initializePlayerAchievements,
  unlockAchievement,
  updateAchievementProgress,
  markAchievementDisplayed,
  clearRecentlyUnlocked,
  resetAllAchievements,
  setLoading,
  setError
} = achievementsSlice.actions;

export default achievementsSlice.reducer;
