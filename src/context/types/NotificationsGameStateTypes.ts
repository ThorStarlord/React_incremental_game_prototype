/**
 * Type definitions for notifications system
 */

/**
 * Notification type
 */
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'dialogue' | 'event' | 'discovery' | 'achievement';
  timestamp: number; // Unix timestamp
  read: boolean;
  npcId?: string;      // For dialogue notifications
  npcName?: string;    // For dialogue notifications
  isPlayerResponse?: boolean; // For dialogue notifications
  emotion?: string;    // For dialogue notifications
  category?: string;   // For categorizing notifications
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
