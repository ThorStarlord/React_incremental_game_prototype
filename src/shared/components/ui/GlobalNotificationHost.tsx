import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  removeNotification,
  selectNotifications,
} from '../../state/NotificationSlice';

/**
 * Production renderer for the shared Redux notification queue.
 *
 * The most recent notification is shown first so a newly generated resume
 * summary is immediately legible even if older transient messages were saved.
 * Dismissing it reveals the next queued message.
 */
const GlobalNotificationHost: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const current = notifications.length > 0
    ? notifications[notifications.length - 1]
    : undefined;

  if (!current) return null;

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(removeNotification(current.id));
  };

  return (
    <Snackbar
      key={current.id}
      open
      autoHideDuration={current.timeout ?? 5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={current.type}
        variant="filled"
        data-testid="global-notification"
        sx={{ width: '100%' }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotificationHost;
