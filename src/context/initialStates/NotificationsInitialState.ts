/**
 * Initial state configuration for the notifications system
 */

import { NotificationsState } from '../types/gameStates/NotificationsGameStateTypes';

/**
 * Initial state for the notifications system
 */
const notificationsInitialState: NotificationsState = {
  notifications: [],    // Start with empty notifications array
  unreadCount: 0,       // No unread notifications
  maxNotifications: 100 // Maximum notifications to store before pruning older ones
};

export default notificationsInitialState;
