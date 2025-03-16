/**
 * @file notificationUtils.ts
 * @description Utilities for managing in-game notifications in the incremental RPG.
 * 
 * This module provides functions to manage notifications, including:
 * - Creating notification objects
 * - Adding notifications to the game state
 * - Removing expired notifications
 * - Grouping similar notifications
 * 
 * Notifications are used to provide feedback to the player about game events,
 * such as resource gains, quest updates, combat results, and more.
 * 
 * @example
 * // Add a success notification
 * const newState = addNotification(
 *   currentState,
 *   createNotification('Item added to inventory!', 'success')
 * );
 */

import { 
  GameState,
} from '../types/GameStateTypes';

/**
 * Types of notifications
 */
export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'dialogue' | 'event' | 'achievement' | 'discovery';

/**
 * Notification object structure
 */
export interface Notification {
  /** Unique identifier for the notification */
  id: number;
  
  /** Message to display to the player */
  message: string;
  
  /** Type of notification, affects styling */
  type: NotificationType;
  
  /** How long the notification should display (in milliseconds) */
  duration: number;
  
  /** Optional icon to display with the notification */
  icon?: string;
  
  /** Optional category for grouping similar notifications */
  category?: string;
  
  /** Optional count for stacking multiple similar notifications */
  count?: number;

  /** Timestamp when the notification was created */
  timestamp?: number;

  /** Optional NPC ID for dialogue notifications */
  npcId?: string;
  
  /** Optional NPC name for dialogue notifications */
  npcName?: string;
  
  /** Whether this is a player response for dialogue notifications */
  isPlayerResponse?: boolean;
  
  /** Optional emotion for dialogue notifications */
  emotion?: string;
  
  /** Whether the notification has been read */
  read?: boolean;
}

/**
 * Extended game state with notifications
 */
export interface GameStateWithNotifications {
  notifications?: Notification[];
  [key: string]: any; // Allow any other properties from the game state
}

/**
 * Creates a notification object
 * 
 * @param {string} message - The message to display
 * @param {NotificationType} type - The type of notification
 * @param {number} duration - How long to show the notification in milliseconds
 * @param {string} icon - Optional icon identifier
 * @returns {Notification} A notification object
 * 
 * @example
 * // Create a success notification
 * const notification = createNotification(
 *   'Quest completed successfully!', 
 *   'success',
 *   5000,
 *   'checkmark'
 * );
 */
export const createNotification = (
  message: string,
  type: NotificationType = 'info',
  duration: number = 3000,
  icon?: string
): Notification => {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    message,
    type,
    duration,
    icon
  };
};

/**
 * Adds a notification to the game state
 * 
 * @param {GameStateWithNotifications} state - Current game state
 * @param {Partial<Notification> & {message: string; type: NotificationType}} notification - Notification to add (partial allowed)
 * @returns {GameStateWithNotifications} Updated game state
 */
export const addNotification = <T extends GameStateWithNotifications>(
  state: T,
  notification: Partial<Notification> & {message: string; type?: NotificationType}
): T => {
  // Create a complete notification with missing properties filled with defaults
  const completeNotification: Notification = {
    id: notification.id || Date.now() + Math.floor(Math.random() * 1000),
    message: notification.message,
    type: notification.type || 'info',
    duration: notification.duration || 3000,
    icon: notification.icon,
    category: notification.category,
    count: notification.count
  };
  
  return {
    ...state,
    notifications: [
      ...(state.notifications || []),
      completeNotification
    ]
  };
};

/**
 * Adds multiple notifications at once
 */
export const addMultipleNotifications = <T extends GameStateWithNotifications>(
  state: T,
  notifications: Notification[]
): T => {
  if (notifications.length === 0) return state;
  
  return {
    ...state,
    notifications: [
      ...(state.notifications || []),
      ...notifications
    ]
  };
};

/**
 * Removes a notification from the game state
 */
export const removeNotification = <T extends GameStateWithNotifications>(
  state: T,
  id: number
): T => {
  if (!state.notifications) return state;
  
  return {
    ...state,
    notifications: state.notifications.filter(n => n.id !== id)
  };
};

/**
 * Cleans up expired notifications
 * 
 * This function is typically called on a timer to remove notifications
 * that have exceeded their display duration.
 * 
 * @param {GameStateWithNotifications} state - Current game state
 * @param {number} currentTime - Current timestamp to check against
 * @returns {GameStateWithNotifications} Updated game state with expired notifications removed
 * 
 * @example
 * useEffect(() => {
 *   const timer = setInterval(() => {
 *     dispatch({
 *       type: 'UPDATE_STATE',
 *       payload: cleanupExpiredNotifications(currentState, Date.now())
 *     });
 *   }, 1000);
 *   
 *   return () => clearInterval(timer);
 * }, [currentState, dispatch]);
 */
export const cleanupExpiredNotifications = <T extends GameStateWithNotifications>(
  state: T,
  currentTime: number
): T => {
  if (!state.notifications || state.notifications.length === 0) return state;

  // Calculate expiration times for each notification
  const notificationsWithExpiry = state.notifications.map(n => ({
    ...n,
    // Calculate when this notification expires (creation time + duration)
    expireTime: n.id + n.duration
  }));
  
  // Filter out expired notifications
  const activeNotifications = notificationsWithExpiry
    .filter(n => n.expireTime > currentTime)
    .map(({ expireTime, ...notification }) => notification); // Remove the temporary expireTime prop
  
  // Only update state if we removed something
  if (activeNotifications.length !== state.notifications.length) {
    return {
      ...state,
      notifications: activeNotifications
    };
  }
  
  return state;
};

/**
 * Groups similar notifications to prevent notification spam
 * 
 * This function combines similar notifications (same category) by
 * incrementing a count property rather than showing multiple separate
 * notifications.
 * 
 * @param {GameStateWithNotifications} state - Current game state
 * @param {Notification} notification - New notification to add or group
 * @returns {GameStateWithNotifications} Updated game state
 * 
 * @example
 * // When player kills multiple enemies of the same type
 * const newState = addOrGroupNotification(
 *   currentState,
 *   createNotification('Wolf defeated!', 'success', 3000, 'skull', 'combat.kill.wolf')
 * );
 */
export const addOrGroupNotification = <T extends GameStateWithNotifications>(
  state: T,
  notification: Notification & { category: string }
): T => {
  if (!notification.category) {
    // No category, can't group
    return addNotification(state, notification);
  }
  
  if (!state.notifications || state.notifications.length === 0) {
    // No existing notifications
    return addNotification(state, { ...notification, count: 1 });
  }
  
  // Check if we already have a notification in this category
  const existingIndex = state.notifications.findIndex(
    n => n.category === notification.category
  );
  
  if (existingIndex === -1) {
    // No matching notification found, add as new
    return addNotification(state, { ...notification, count: 1 });
  }
  
  // Update the existing notification
  const updatedNotifications = [...state.notifications];
  const existing = updatedNotifications[existingIndex];
  
  updatedNotifications[existingIndex] = {
    ...existing,
    count: (existing.count || 1) + 1,
    // Update the message if we have a count formatter function
    message: notification.message,
    // Reset the timer by updating the id
    id: Date.now() + Math.floor(Math.random() * 1000)
  };
  
  return {
    ...state,
    notifications: updatedNotifications
  };
};

/**
 * Creates a resource gain notification
 * 
 * @param {string} resourceName - Name of the resource gained
 * @param {number} amount - Amount gained
 * @returns {Notification} Formatted resource gain notification
 * 
 * @example
 * const notification = createResourceGainNotification('Gold', 50);
 * const newState = addNotification(currentState, notification);
 */
export const createResourceGainNotification = (
  resourceName: string,
  amount: number
): Notification => {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    message: `Gained ${amount} ${resourceName}`,
    type: 'success',
    duration: 3000,
    icon: 'resource',
    category: `resource.gain.${resourceName.toLowerCase()}`,
    count: 1
  };
};

/**
 * Creates a quest update notification
 * 
 * @param {string} questName - Name of the quest
 * @param {string} status - Status update (e.g., "started", "updated", "completed")
 * @returns {Notification} Formatted quest notification
 * 
 * @example
 * const notification = createQuestNotification(
 *   'The Ancient Artifact', 
 *   'completed'
 * );
 * const newState = addNotification(currentState, notification);
 */
export const createQuestNotification = (
  questName: string,
  status: 'started' | 'updated' | 'completed' | 'failed'
): Notification => {
  const messageMap = {
    started: `Quest started: ${questName}`,
    updated: `Quest updated: ${questName}`,
    completed: `Quest completed: ${questName}`,
    failed: `Quest failed: ${questName}`,
  };
  
  const typeMap = {
    started: 'info',
    updated: 'info',
    completed: 'success',
    failed: 'error',
  };
  
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    message: messageMap[status],
    type: typeMap[status] as NotificationType,
    duration: 5000,
    icon: 'scroll',
    category: `quest.${status}`
  };
};

/**
 * Creates a dialogue notification representing an NPC or player message
 * 
 * @param {string} message - The dialogue message content
 * @param {string} npcName - Name of the NPC speaking (or "Player" for player responses)
 * @param {string} npcId - ID of the NPC speaking
 * @param {boolean} isPlayerResponse - Whether this is a player response
 * @param {string} [emotion] - Optional emotional tone of the message
 * @returns {Notification} Formatted dialogue notification
 * 
 * @example
 * const notification = createDialogueNotification(
 *   "Hello traveler, welcome to our village!",
 *   "Village Elder",
 *   "npc_elder_01",
 *   false,
 *   "friendly"
 * );
 * const newState = addNotification(currentState, notification);
 */
export const createDialogueNotification = (
  message: string,
  npcName: string,
  npcId: string,
  isPlayerResponse: boolean = false,
  emotion?: string
): Notification => {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    message,
    type: 'dialogue',
    duration: 0, // Persistent in history
    icon: 'dialogue',
    category: 'dialogue',
    npcId,
    npcName,
    isPlayerResponse,
    emotion,
    timestamp: Date.now()
  };
};
