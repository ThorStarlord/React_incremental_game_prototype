import { ACTION_TYPES } from '../types/actionTypes';

/**
 * Type definitions for notification actions
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'positive' | 'negative' | 'event' | 'achievement' | 'dialogue';

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

/**
 * Add a dialogue message to the notification system
 * 
 * @param message The dialogue text
 * @param npcName Name of the speaking NPC
 * @param npcId ID of the speaking NPC
 * @param isPlayerResponse Whether this is a player response
 * @param emotion Optional emotional tone
 */
export const addDialogueMessage = (message: string, npcName: string, npcId: string, isPlayerResponse: boolean = false, emotion?: string) => ({
  type: ACTION_TYPES.ADD_DIALOGUE,
  payload: {
    id: Date.now(), // Add unique ID
    message,
    type: 'dialogue' as NotificationType,
    npcId,
    npcName,
    isPlayerResponse,
    emotion,
    timestamp: Date.now(),
    category: 'dialogue'
  }
});
