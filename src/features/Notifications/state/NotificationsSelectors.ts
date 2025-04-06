/**
 * Selectors for accessing notification data from the Redux store
 * Uses createSelector for memoization and performance optimization
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  Notification, 
  NotificationType, 
  NotificationFilter,
  DialogueNotification,
  QuestNotification,
  LootNotification,
  AchievementNotification
} from './NotificationsTypes';

// Basic selectors
export const selectAllNotifications = (state: RootState) => 
  state.notifications.notifications;

export const selectUnreadCount = (state: RootState) => 
  state.notifications.unreadCount;

export const selectNotificationSettings = (state: RootState) => ({
  soundEnabled: state.notifications.soundEnabled,
  displayEnabled: state.notifications.displayEnabled,
  maxNotifications: state.notifications.maxNotifications,
  defaultDuration: state.notifications.defaultDuration
});

// Memoized selectors for performance
export const selectNotificationsByType = createSelector(
  [selectAllNotifications, (_: RootState, type: NotificationType) => type],
  (notifications, type) => notifications.filter(n => n.type === type)
);

export const selectNotificationsByFilter = createSelector(
  [selectAllNotifications, (_: RootState, filter: NotificationFilter) => filter],
  (notifications, filter) => {
    return notifications.filter(notification => {
      // Apply each filter condition
      if (filter.types && !filter.types.includes(notification.type)) return false;
      if (filter.categories && notification.category && !filter.categories.includes(notification.category)) return false;
      if (filter.read !== undefined && notification.read !== filter.read) return false;
      if (filter.after !== undefined && notification.timestamp < filter.after) return false;
      if (filter.before !== undefined && notification.timestamp > filter.before) return false;
      
      return true;
    });
  }
);

export const selectRecentNotifications = createSelector(
  [selectAllNotifications, (_: RootState, count: number = 5) => count],
  (notifications, count) => notifications.slice(0, count)
);

// Type-specific selectors
export const selectDialogueNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(
    (n): n is DialogueNotification => n.type === 'dialogue'
  )
);

export const selectQuestNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(
    (n): n is QuestNotification => n.type === 'quest'
  )
);

export const selectLootNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(
    (n): n is LootNotification => n.type === 'loot'
  )
);

export const selectAchievementNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(
    (n): n is AchievementNotification => n.type === 'achievement'
  )
);

// Utility selectors
export const selectUnreadNotifications = createSelector(
  [selectAllNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const selectNotificationsInTimeRange = createSelector(
  [
    selectAllNotifications,
    (_: RootState, startTime: number) => startTime,
    (_: RootState, _startTime: number, endTime: number) => endTime
  ],
  (notifications, startTime, endTime) => 
    notifications.filter(n => n.timestamp >= startTime && n.timestamp <= endTime)
);

export const selectNotificationById = createSelector(
  [
    selectAllNotifications,
    (_: RootState, id: string) => id
  ],
  (notifications, id) => notifications.find(n => n.id === id)
);

// Group notifications by category
export const selectNotificationsByCategory = createSelector(
  [selectAllNotifications],
  (notifications) => {
    const result: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const category = notification.category || 'uncategorized';
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(notification);
    });
    
    return result;
  }
);
