import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../../app/store';

/**
 * Interface for a notification object
 */
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  category?: string;
  timestamp: number;
  isRead?: boolean;
  icon?: string;
  title?: string;
  link?: string;
  /**
   * Additional custom properties
   */
  [key: string]: any;
}

/**
 * Interface for add notification action payload
 */
export interface AddNotificationPayload {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  category?: string;
  icon?: string;
  title?: string;
  link?: string;
  /**
   * Any additional custom data
   */
  [key: string]: any;
}

/**
 * Interface for the notifications state in the Redux store
 */
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isNotificationPanelOpen: boolean;
}

/**
 * Initial state for the notifications slice
 */
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isNotificationPanelOpen: false
};

/**
 * The notifications slice for the Redux store
 */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Add a new notification
     */
    addNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.notifications.push(action.payload);
        state.unreadCount++;
      },
      prepare: (payload: AddNotificationPayload) => ({
        payload: {
          id: uuidv4(),
          message: payload.message,
          type: payload.type || 'info',
          duration: payload.duration || 5000,
          category: payload.category || 'general',
          timestamp: Date.now(),
          isRead: false,
          icon: payload.icon,
          title: payload.title,
          link: payload.link,
          ...payload
        }
      })
    },
    
    /**
     * Mark a notification as read
     */
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    /**
     * Mark all notifications as read
     */
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    
    /**
     * Remove a notification
     */
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    /**
     * Clear all notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    /**
     * Toggle the notification panel
     */
    toggleNotificationPanel: (state) => {
      state.isNotificationPanelOpen = !state.isNotificationPanelOpen;
    },
    
    /**
     * Set the notification panel state
     */
    setNotificationPanelState: (state, action: PayloadAction<boolean>) => {
      state.isNotificationPanelOpen = action.payload;
    }
  }
});

// Export actions
export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  toggleNotificationPanel,
  setNotificationPanelState
} = notificationsSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectIsNotificationPanelOpen = (state: RootState) => 
  state.notifications.isNotificationPanelOpen;

// Export reducer
export default notificationsSlice.reducer;
