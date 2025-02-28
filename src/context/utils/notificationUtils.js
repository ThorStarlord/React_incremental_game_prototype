/**
 * Adds a notification to the state
 */
export const addNotification = (state, notification) => {
  const newNotification = {
    id: Date.now(),
    duration: 3000, // default duration
    type: 'info',   // default type
    ...notification
  };
  
  return {
    ...state,
    notifications: [
      ...(state.notifications || []),
      newNotification
    ]
  };
};

/**
 * Removes a notification from the state
 */
export const removeNotification = (state, notificationId) => {
  return {
    ...state,
    notifications: state.notifications.filter(n => n.id !== notificationId)
  };
};