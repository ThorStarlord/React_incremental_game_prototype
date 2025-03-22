import { NotificationType } from '../../actions/notificationActions';

/**
 * Creates a notification payload object with standardized formatting
 */
export const createNotification = (
  message: string,
  type: NotificationType = 'info',
  duration: number = 3000
) => {
  return {
    message,
    type,
    duration
  };
};
