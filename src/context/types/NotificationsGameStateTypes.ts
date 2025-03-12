/**
 * Type definitions for notifications system
 */

/**
 * Notification type
 */
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number; // Unix timestamp
  read: boolean;
}

/**
 * Notifications state
 */
export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number; // Number of unread notifications
  maxNotifications: number; // Maximum number of notifications to keep
}

/**
 * Utility type for filtering notifications
 */
export type NotificationFilter = (notification: Notification) => boolean;
