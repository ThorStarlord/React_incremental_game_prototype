/**
 * UI Actions for Incremental RPG
 * 
 * This file contains action creators related to the user interface of the game.
 * These actions handle UI state changes such as menu toggling, notifications,
 * modal dialogs, and other interface-related functionality.
 * 
 * @module uiActions
 */

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
export const toggleMenu = (menuId) => ({
  type: UI_ACTION_TYPES.TOGGLE_MENU,
  payload: { menuId }
});

/**
 * Set visibility state of a specific menu
 * 
 * @param {string} menuId - Identifier of the menu
 * @param {boolean} isVisible - Visibility state to set
 * @returns {Object} Action object
 */
export const setMenuVisibility = (menuId, isVisible) => ({
  type: UI_ACTION_TYPES.SET_MENU_VISIBILITY,
  payload: { menuId, isVisible }
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
  type = 'info', 
  duration = 3000, 
  id = `notification_${Date.now()}`
}) => ({
  type: UI_ACTION_TYPES.SHOW_NOTIFICATION,
  payload: { id, message, type, duration, timestamp: Date.now() }
});

/**
 * Hide a specific notification
 * 
 * @param {string} id - ID of the notification to hide
 * @returns {Object} Action object
 */
export const hideNotification = (id) => ({
  type: UI_ACTION_TYPES.HIDE_NOTIFICATION,
  payload: { id }
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
export const showModal = ({ type, title, content, options }) => ({
  type: UI_ACTION_TYPES.SHOW_MODAL,
  payload: { type, title, content, options }
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
export const setUiTheme = (theme) => ({
  type: UI_ACTION_TYPES.SET_UI_THEME,
  payload: { theme }
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
export const setUiLoading = (isLoading, loadingMessage) => ({
  type: UI_ACTION_TYPES.SET_UI_LOADING,
  payload: { isLoading, loadingMessage }
});

/**
 * Set game paused state
 * 
 * @param {boolean} isPaused - Whether the game is paused
 * @returns {Object} Action object
 */
export const setGamePaused = (isPaused) => ({
  type: UI_ACTION_TYPES.SET_GAME_PAUSED,
  payload: { isPaused }
});
