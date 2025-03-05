import { ACTION_TYPES } from './actionTypes';

/**
 * Type definitions for notification actions
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'positive' | 'negative' | 'event' | 'achievement';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration?: number;
  dismissable?: boolean;
}

export interface AddNotificationPayload {
  message: string;
  type: NotificationType;
  duration?: number;
  dismissable?: boolean;
}

export interface RemoveNotificationPayload {
  id: number;
}

/**
 * Add a notification to display to the player
 * 
 * @param payload Notification details
 */
export const addNotification = (payload: AddNotificationPayload) => ({
  type: ACTION_TYPES.ADD_NOTIFICATION,
  payload: {
    ...payload,
    id: Date.now() // Add unique ID
  }
});

/**
 * Remove a specific notification by ID
 * 
 * @param id ID of the notification to remove
 */
export const removeNotification = (id: number) => ({
  type: ACTION_TYPES.REMOVE_NOTIFICATION,
  payload: { id }
});

/**
 * Clear all notifications
 */
export const clearNotifications = () => ({
  type: ACTION_TYPES.CLEAR_NOTIFICATIONS
});
