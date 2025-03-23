/**
 * Notification-related action type definitions
 * 
 * This module defines the types and interfaces for notification actions
 * in the game.
 * 
 * @module notificationActionTypes
 */

/**
 * Notification action type constants
 */
export const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'notification/add' as const,
  REMOVE_NOTIFICATION: 'notification/remove' as const,
  CLEAR_NOTIFICATIONS: 'notification/clear' as const,
  ADD_DIALOGUE: 'notification/addDialogue' as const
};

// Create a union type of all notification action types
export type NotificationActionType = typeof NOTIFICATION_ACTIONS[keyof typeof NOTIFICATION_ACTIONS];

/**
 * Base notification action interface
 */
export interface NotificationAction {
  type: NotificationActionType;
  payload?: any;
}

/**
 * Notification types
 */
export type NotificationType = 
  'success' | 'error' | 'info' | 'warning' | 
  'positive' | 'negative' | 'event' | 'achievement' | 'dialogue';

/**
 * Notification interface
 */
export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration?: number;
  dismissable?: boolean;
  category?: string;
  npcId?: string;
  npcName?: string;
  isPlayerResponse?: boolean;
  emotion?: string;
  timestamp?: number;
}

/**
 * Add notification payload
 */
export interface AddNotificationPayload {
  message: string;
  type: NotificationType;
  duration?: number;
  dismissable?: boolean;
  category?: string;
}

/**
 * Remove notification payload
 */
export interface RemoveNotificationPayload {
  id: number;
}

/**
 * Add dialogue payload
 */
export interface AddDialoguePayload {
  message: string;
  npcName: string;
  npcId: string;
  isPlayerResponse?: boolean;
  emotion?: string;
}
