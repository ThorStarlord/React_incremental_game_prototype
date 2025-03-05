/**
 * UI Actions for Incremental RPG
 * 
 * This file contains action creators related to the user interface of the game.
 * These actions handle UI state changes such as menu toggling, notifications,
 * modal dialogs, and other interface-related functionality.
 * 
 * @module uiActions
 */

// Define interfaces for action payloads
interface MenuTogglePayload {
  menuId: string;
}

interface MenuVisibilityPayload {
  menuId: string;
  isVisible: boolean;
}

interface NotificationPayload {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  timestamp: number;
}

interface ModalPayload {
  type: string;
  title?: string;
  content?: Record<string, any>;
  options?: Record<string, any>;
}

interface HideNotificationPayload {
  id: string;
}

interface ThemePayload {
  theme: string;
}

interface LoadingPayload {
  isLoading: boolean;
  loadingMessage?: string;
}

interface GamePausedPayload {
  isPaused: boolean;
}

/**
 * Action Types
 * These constants define the possible UI action types
 */
export const UI_ACTION_TYPES = {
  TOGGLE_MENU: 'ui/toggleMenu',
  SET_MENU_VISIBILITY: 'ui/setMenuVisibility',
  SHOW_NOTIFICATION: 'ui/showNotification',
  HIDE_NOTIFICATION: 'ui/hideNotification',
  CLEAR_NOTIFICATIONS: 'ui/clearNotifications',
  SHOW_MODAL: 'ui/showModal',
  HIDE_MODAL: 'ui/hideModal',
  SET_UI_THEME: 'ui/setTheme',
  TOGGLE_FULLSCREEN: 'ui/toggleFullscreen',
  SET_UI_LOADING: 'ui/setLoading',
  SET_GAME_PAUSED: 'ui/setGamePaused',
};

/**
 * Toggle visibility of a specific menu
 * 
 * @param {string} menuId - Identifier of the menu to toggle
 * @returns {Object} Action object
 */
export const toggleMenu = (menuId: string) => ({
  type: UI_ACTION_TYPES.TOGGLE_MENU,
  payload: { menuId } as MenuTogglePayload
});

/**
 * Set visibility state of a specific menu
 * 
 * @param {string} menuId - Identifier of the menu
 * @param {boolean} isVisible - Visibility state to set
 * @returns {Object} Action object
 */
export const setMenuVisibility = (menuId: string, isVisible: boolean) => ({
  type: UI_ACTION_TYPES.SET_MENU_VISIBILITY,
  payload: { menuId, isVisible } as MenuVisibilityPayload
});

/**
 * Show a notification to the user
 * 
 * @param {Object} notification - Notification data
 * @param {string} notification.message - Message to display
 * @param {string} [notification.type='info'] - Type of notification (info, success, warning, error)
 * @param {number} [notification.duration=3000] - Duration in ms before auto-hiding (0 for persistent)
 * @param {string} [notification.id] - Optional unique identifier (auto-generated if not provided)
 * @returns {Object} Action object with the notification data
 */
export const showNotification = ({ 
  message, 
  type = 'info' as 'info' | 'success' | 'warning' | 'error', 
  duration = 3000, 
  id = `notification_${Date.now()}`
}: {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  id?: string;
}) => ({
  type: UI_ACTION_TYPES.SHOW_NOTIFICATION,
  payload: { 
    id, 
    message, 
    type, 
    duration, 
    timestamp: Date.now() 
  } as NotificationPayload
});

/**
 * Hide a specific notification
 * 
 * @param {string} id - ID of the notification to hide
 * @returns {Object} Action object
 */
export const hideNotification = (id: string) => ({
  type: UI_ACTION_TYPES.HIDE_NOTIFICATION,
  payload: { id } as HideNotificationPayload
});

/**
 * Clear all active notifications
 * 
 * @returns {Object} Action object
 */
export const clearNotifications = () => ({
  type: UI_ACTION_TYPES.CLEAR_NOTIFICATIONS
});

/**
 * Show a modal dialog
 * 
 * @param {Object} modalData - Modal configuration
 * @param {string} modalData.type - Type of modal to display
 * @param {string} [modalData.title] - Title of the modal
 * @param {Object} [modalData.content] - Modal content data
 * @param {Object} [modalData.options] - Additional modal options
 * @returns {Object} Action object
 */
export const showModal = ({ 
  type, 
  title, 
  content, 
  options 
}: {
  type: string;
  title?: string;
  content?: Record<string, any>;
  options?: Record<string, any>;
}) => ({
  type: UI_ACTION_TYPES.SHOW_MODAL,
  payload: { type, title, content, options } as ModalPayload
});

/**
 * Hide the currently displayed modal
 * 
 * @returns {Object} Action object
 */
export const hideModal = () => ({
  type: UI_ACTION_TYPES.HIDE_MODAL
});

/**
 * Set the UI theme
 * 
 * @param {string} theme - Theme identifier to apply
 * @returns {Object} Action object
 */
export const setUiTheme = (theme: string) => ({
  type: UI_ACTION_TYPES.SET_UI_THEME,
  payload: { theme } as ThemePayload
});

/**
 * Toggle fullscreen mode for the game
 * 
 * @returns {Object} Action object
 */
export const toggleFullscreen = () => ({
  type: UI_ACTION_TYPES.TOGGLE_FULLSCREEN
});

/**
 * Set UI loading state
 * 
 * @param {boolean} isLoading - Whether the UI is in a loading state
 * @param {string} [loadingMessage] - Optional loading message to display
 * @returns {Object} Action object
 */
export const setUiLoading = (isLoading: boolean, loadingMessage?: string) => ({
  type: UI_ACTION_TYPES.SET_UI_LOADING,
  payload: { isLoading, loadingMessage } as LoadingPayload
});

/**
 * Set game paused state
 * 
 * @param {boolean} isPaused - Whether the game is paused
 * @returns {Object} Action object
 */
export const setGamePaused = (isPaused: boolean) => ({
  type: UI_ACTION_TYPES.SET_GAME_PAUSED,
  payload: { isPaused } as GamePausedPayload
});
