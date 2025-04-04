/**
 * Redux slice for managing notifications in the game
 */
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { 
  Notification, 
  NotificationType, 
  NotificationsState,
  NotificationFilter,
  DialogueNotification,
  QuestNotification,
  LootNotification
} from './NotificationsTypes';
import { RootState } from '../../../app/store';

/**
 * Initial state for the notifications slice
 */
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  maxNotifications: 100,
  soundEnabled: true,
  displayEnabled: true,
  defaultDuration: 3000
};

/**
 * Notifications slice with reducers for managing notification state
 */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Add a new notification with default values
     */
    addNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        // Add the notification to the array
        state.notifications.unshift(action.payload);
        
        // Increment unread count
        state.unreadCount += 1;
        
        // Limit array size to maxNotifications
        if (state.notifications.length > state.maxNotifications) {
          state.notifications = state.notifications.slice(0, state.maxNotifications);
        }
      },
      // Prepare callback to create a properly formatted notification
      prepare: (
        message: string, 
        type: NotificationType = 'info', 
        options?: Partial<Omit<Notification, 'id' | 'message' | 'type' | 'timestamp' | 'read'>>
      ) => {
        return {
          payload: {
            id: uuidv4(),
            message,
            type,
            timestamp: Date.now(),
            read: false,
            duration: options?.duration || initialState.defaultDuration,
            ...options
          } as Notification
        };
      }
    },
    
    /**
     * Add a dialogue notification
     */
    addDialogueNotification: {
      reducer: (state, action: PayloadAction<DialogueNotification>) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
        
        if (state.notifications.length > state.maxNotifications) {
          state.notifications = state.notifications.slice(0, state.maxNotifications);
        }
      },
      prepare: (
        message: string,
        npcName: string,
        npcId: string,
        isPlayerResponse: boolean = false,
        emotion?: string
      ) => {
        return {
          payload: {
            id: uuidv4(),
            message,
            type: 'dialogue' as const,
            timestamp: Date.now(),
            read: false,
            duration: 0, // Dialogue notifications are persistent
            npcId,
            npcName,
            isPlayerResponse,
            emotion
          } as DialogueNotification
        };
      }
    },
    
    /**
     * Add a quest notification
     */
    addQuestNotification: {
      reducer: (state, action: PayloadAction<QuestNotification>) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
        
        if (state.notifications.length > state.maxNotifications) {
          state.notifications = state.notifications.slice(0, state.maxNotifications);
        }
      },
      prepare: (
        questId: string,
        questName: string,
        questStatus: 'started' | 'updated' | 'completed' | 'failed',
        message?: string
      ) => {
        // Generate appropriate message if not provided
        const defaultMessages = {
          started: `Quest started: ${questName}`,
          updated: `Quest updated: ${questName}`,
          completed: `Quest completed: ${questName}`,
          failed: `Quest failed: ${questName}`
        };
        
        return {
          payload: {
            id: uuidv4(),
            message: message || defaultMessages[questStatus],
            type: 'quest' as const,
            timestamp: Date.now(),
            read: false,
            duration: 5000, // Quest notifications last a bit longer
            questId,
            questName,
            questStatus
          } as QuestNotification
        };
      }
    },
    
    /**
     * Add a loot notification
     */
    addLootNotification: {
      reducer: (state, action: PayloadAction<LootNotification>) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
        
        if (state.notifications.length > state.maxNotifications) {
          state.notifications = state.notifications.slice(0, state.maxNotifications);
        }
      },
      prepare: (
        itemId: string,
        itemName: string,
        quantity: number = 1,
        rarity?: string
      ) => {
        return {
          payload: {
            id: uuidv4(),
            message: `Received ${quantity} ${itemName}${quantity > 1 ? 's' : ''}`,
            type: 'loot' as const,
            timestamp: Date.now(),
            read: false,
            duration: 3000,
            itemId,
            itemName,
            quantity,
            rarity
          } as LootNotification
        };
      }
    },
    
    /**
     * Dismiss a notification by ID
     */
    dismissNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      
      if (index !== -1) {
        // If the notification was unread, decrement the counter
        if (!state.notifications[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        // Remove the notification
        state.notifications.splice(index, 1);
      }
    },
    
    /**
     * Mark a notification as read
     */
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    /**
     * Mark all notifications as read
     */
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    /**
     * Clear all notifications
     */
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    /**
     * Update notification settings
     */
    updateSettings: (state, action: PayloadAction<Partial<{
      soundEnabled: boolean;
      displayEnabled: boolean;
      maxNotifications: number;
      defaultDuration: number;
    }>>) => {
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

// Export actions
export const { 
  addNotification,
  addDialogueNotification,
  addQuestNotification,
  addLootNotification,
  dismissNotification,
  markAsRead,
  markAllAsRead,
  clearAll,
  updateSettings
} = notificationsSlice.actions;

// Basic selectors
export const selectAllNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectSettings = (state: RootState) => ({
  soundEnabled: state.notifications.soundEnabled,
  displayEnabled: state.notifications.displayEnabled,
  maxNotifications: state.notifications.maxNotifications,
  defaultDuration: state.notifications.defaultDuration
});

// Advanced selectors with memoization
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

export default notificationsSlice.reducer;
