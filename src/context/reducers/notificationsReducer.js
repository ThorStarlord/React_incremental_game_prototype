import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier for the notification
 * @property {string} type - Type of notification (success, info, warning, error, achievement)
 * @property {string} message - Main notification message
 * @property {string} [details] - Optional additional details
 * @property {boolean} read - Whether the notification has been marked as read
 * @property {Date} timestamp - When the notification was created
 * @property {number} [duration] - How long the notification should be displayed (ms), null for persistent
 * @property {string} [icon] - Optional icon identifier
 * @property {Object} [actions] - Optional action buttons for the notification
 */

/**
 * Maximum number of notifications to keep in history
 * @type {number}
 */
const MAX_NOTIFICATIONS = 50;

/**
 * @function notificationsReducer
 * @description Manages the game's notification system for alerts, achievements, and important events
 * 
 * @param {Array<Notification>} state - Current notifications array
 * @param {Object} action - Dispatched action
 * @returns {Array<Notification>} Updated notifications array
 */
export const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_NOTIFICATION: {
      const newNotification = {
        id: action.payload.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: action.payload.type || 'info',
        message: action.payload.message,
        details: action.payload.details || null,
        read: false,
        timestamp: new Date().toISOString(),
        duration: action.payload.duration,
        icon: action.payload.icon,
        actions: action.payload.actions
      };
      
      // Add new notification to the beginning of the array and limit the total count
      return [newNotification, ...state].slice(0, MAX_NOTIFICATIONS);
    }
    
    case ACTION_TYPES.MARK_NOTIFICATION_READ:
      return state.map(notification => 
        notification.id === action.payload.id 
          ? { ...notification, read: true }
          : notification
      );
    
    case ACTION_TYPES.MARK_ALL_NOTIFICATIONS_READ:
      return state.map(notification => ({ ...notification, read: true }));
    
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return state.filter(notification => notification.id !== action.payload.id);
    
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      // If a type is specified, only clear that type
      if (action.payload && action.payload.type) {
        return state.filter(notification => notification.type !== action.payload.type);
      }
      // Otherwise clear all notifications
      return [];
    
    case ACTION_TYPES.CLEAR_READ_NOTIFICATIONS:
      return state.filter(notification => !notification.read);
    
    default:
      return state;
  }
};
