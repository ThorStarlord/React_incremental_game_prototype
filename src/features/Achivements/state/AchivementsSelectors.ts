import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  Achievement, 
  AchievementCategory, 
  AchievementRarity,
  AchievementStatus 
} from './AchivementsTypes';

/**
 * Basic selectors
 */
export const selectAchievementsState = (state: RootState) => state.achievements;
export const selectAllAchievements = (state: RootState) => state.achievements.achievements;
export const selectPlayerAchievements = (state: RootState) => state.achievements.playerAchievements;
export const selectTotalPoints = (state: RootState) => state.achievements.totalPoints;
export const selectRecentlyUnlocked = (state: RootState) => state.achievements.recentlyUnlocked;
export const selectAchievementCategories = (state: RootState) => state.achievements.achievementCategories;
export const selectAchievementsLoading = (state: RootState) => state.achievements.loading;
export const selectAchievementsError = (state: RootState) => state.achievements.error;

/**
 * Memoized selectors
 */

/**
 * Select a single achievement by ID
 */
export const selectAchievementById = (achievementId: string) => 
  createSelector(
    [selectAllAchievements],
    (achievements) => achievements[achievementId]
  );

/**
 * Select a single achievement status by ID
 */
export const selectAchievementStatusById = (achievementId: string) => 
  createSelector(
    [selectPlayerAchievements],
    (statuses) => statuses[achievementId]
  );

/**
 * Select full achievement with status by ID
 */
export const selectAchievementWithStatus = (achievementId: string) => 
  createSelector(
    [selectAllAchievements, selectPlayerAchievements],
    (achievements, statuses) => {
      const achievement = achievements[achievementId];
      const status = statuses[achievementId] || {
        achievementId,
        unlocked: false,
        progress: 0
      };
      
      return { achievement, status };
    }
  );

/**
 * Select all achievements as an array
 */
export const selectAchievementsArray = createSelector(
  [selectAllAchievements],
  (achievements) => Object.values(achievements)
);

/**
 * Select all achievements with their status
 */
export const selectAchievementsWithStatus = createSelector(
  [selectAllAchievements, selectPlayerAchievements],
  (achievements, statuses) => {
    return Object.values(achievements).map(achievement => {
      const status = statuses[achievement.id] || {
        achievementId: achievement.id,
        unlocked: false,
        progress: 0
      };
      
      return { achievement, status };
    });
  }
);

/**
 * Select all unlocked achievements
 */
export const selectUnlockedAchievements = createSelector(
  [selectAchievementsWithStatus],
  (achievementsWithStatus) => 
    achievementsWithStatus
      .filter(({ status }) => status.unlocked)
      .map(({ achievement }) => achievement)
);

/**
 * Select all locked achievements
 */
export const selectLockedAchievements = createSelector(
  [selectAchievementsWithStatus],
  (achievementsWithStatus) => 
    achievementsWithStatus
      .filter(({ status }) => !status.unlocked)
      .map(({ achievement }) => achievement)
);

/**
 * Select count of unlocked achievements
 */
export const selectUnlockedCount = createSelector(
  [selectUnlockedAchievements],
  (unlockedAchievements) => unlockedAchievements.length
);

/**
 * Select recently unlocked achievements with details
 */
export const selectRecentlyUnlockedAchievements = createSelector(
  [selectRecentlyUnlocked, selectAllAchievements],
  (recentlyUnlocked, achievements) => 
    recentlyUnlocked
      .map(id => achievements[id])
      .filter(Boolean)
);

/**
 * Select achievements by category
 */
export const selectAchievementsByCategory = (category: AchievementCategory) => 
  createSelector(
    [selectAchievementsWithStatus],
    (achievementsWithStatus) => 
      achievementsWithStatus
        .filter(({ achievement }) => achievement.category === category)
        .sort((a, b) => (a.achievement.order || 0) - (b.achievement.order || 0))
  );

/**
 * Select achievements by rarity
 */
export const selectAchievementsByRarity = (rarity: AchievementRarity) => 
  createSelector(
    [selectAchievementsWithStatus],
    (achievementsWithStatus) => 
      achievementsWithStatus
        .filter(({ achievement }) => achievement.rarity === rarity)
  );

/**
 * Select completion percentage by category
 */
export const selectCategoryCompletionPercentage = createSelector(
  [selectAchievementCategories, selectPlayerAchievements, selectAllAchievements],
  (categories, playerAchievements, allAchievements) => {
    const result: Record<AchievementCategory, { total: number; unlocked: number; percentage: number }> = 
      {} as Record<AchievementCategory, { total: number; unlocked: number; percentage: number }>;
    
    // Initialize result
    Object.keys(categories).forEach(category => {
      result[category as AchievementCategory] = {
        total: categories[category as AchievementCategory],
        unlocked: 0,
        percentage: 0
      };
    });
    
    // Count unlocked achievements by category
    Object.entries(playerAchievements).forEach(([achievementId, status]) => {
      if (status.unlocked && allAchievements[achievementId]) {
        const category = allAchievements[achievementId].category;
        result[category].unlocked++;
      }
    });
    
    // Calculate percentages
    Object.keys(result).forEach(category => {
      const { total, unlocked } = result[category as AchievementCategory];
      result[category as AchievementCategory].percentage = 
        total > 0 ? Math.floor((unlocked / total) * 100) : 0;
    });
    
    return result;
  }
);

/**
 * Select overall completion percentage
 */
export const selectOverallCompletionPercentage = createSelector(
  [selectAchievementsWithStatus],
  (achievementsWithStatus) => {
    const total = achievementsWithStatus.length;
    const unlocked = achievementsWithStatus.filter(({ status }) => status.unlocked).length;
    
    return total > 0 ? Math.floor((unlocked / total) * 100) : 0;
  }
);

/**
 * Select achievements in progress (started but not completed)
 */
export const selectAchievementsInProgress = createSelector(
  [selectAchievementsWithStatus],
  (achievementsWithStatus) => 
    achievementsWithStatus
      .filter(({ status }) => !status.unlocked && status.progress > 0)
      .sort((a, b) => b.status.progress - a.status.progress)
);

/**
 * Select non-hidden locked achievements (for displaying available achievements)
 */
export const selectVisibleLockedAchievements = createSelector(
  [selectAchievementsWithStatus],
  (achievementsWithStatus) => 
    achievementsWithStatus
      .filter(({ achievement, status }) => !status.unlocked && !achievement.hidden)
);

/**
 * Format achievements for UI display
 */
export const selectFormattedAchievements = createSelector(
  [selectAchievementsWithStatus],
  (achievementsWithStatus) => 
    achievementsWithStatus.map(({ achievement, status }) => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon || 'default_achievement',
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      unlocked: status.unlocked,
      progress: status.progress,
      dateUnlocked: status.dateUnlocked
    }))
);
