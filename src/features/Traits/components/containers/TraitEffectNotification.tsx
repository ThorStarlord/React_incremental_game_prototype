import React from 'react';
import { 
  Snackbar, 
  Alert, 
  Typography, 
  Box, 
  Slide, 
  IconButton,
  useTheme
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import useTraitNotifications from '../../hooks/useTraitNotifications';

/**
 * Types for notification types
 */
type NotificationType = 'equip' | 'unequip' | 'effect' | string;

/**
 * Interface for a notification
 * 
 * @interface Notification
 * @property {string} id - Unique identifier for the notification
 * @property {string} message - The main notification message
 * @property {string} [description] - Optional detailed description
 * @property {NotificationType} type - The type of notification
 */
interface Notification {
  id: string;
  message: string;
  description?: string;
  type: NotificationType;
}

/**
 * Interface for TraitEffectNotification props
 * 
 * @interface TraitEffectNotificationProps
 * @property {Notification[]} [notifications] - Array of notification objects to display
 * @property {(id: string) => void} onDismiss - Function to call when dismissing a notification
 */
interface TraitEffectNotificationProps {
  notifications?: Notification[];
  onDismiss: (id: string) => void;
}

/**
 * Interface for style settings
 * 
 * @interface StyleSetting
 * @property {React.ReactNode} icon - Icon element to display
 * @property {string} color - Text color for the notification
 * @property {string} bgColor - Background color for the notification
 */
interface StyleSetting {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

/**
 * TraitEffectNotification Component
 * 
 * Displays notifications for trait effects with appropriate styling based on type.
 * 
 * @param {TraitEffectNotificationProps} props - Component props
 * @returns {JSX.Element | null} The rendered component or null if no notifications
 */
const TraitEffectNotification: React.FC<TraitEffectNotificationProps> = ({ 
  notifications = [],
  onDismiss 
}) => {
  const theme = useTheme();
  
  // If no notifications or empty array, don't render anything
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }
  
  // Get the latest notification
  const currentNotification = notifications[0];
  
  /**
   * Determine styles based on notification type
   * 
   * @param {NotificationType} type - The notification type
   * @returns {StyleSetting} Object containing style settings
   */
  const getStyles = (type: NotificationType): StyleSetting => {
    switch (type) {
      case 'equip':
        return {
          icon: <AutoAwesomeIcon />,
          color: theme.palette.success.main,
          bgColor: theme.palette.success.light,
        };
      case 'unequip':
        return {
          icon: <AutoAwesomeIcon />,
          color: theme.palette.info.main,
          bgColor: theme.palette.info.light,
        };
      default:
        return {
          icon: <AutoAwesomeIcon />,
          color: theme.palette.primary.main,
          bgColor: theme.palette.primary.light,
        };
    }
  };
  
  const styles = getStyles(currentNotification?.type);
  
  return (
    <Snackbar
      open={true}
      key={currentNotification?.id || 'trait-notification'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={Slide}
    >
      <Alert
        elevation={3}
        severity="info"
        icon={styles.icon}
        sx={{
          width: '100%',
          minWidth: 300,
          backgroundColor: styles.bgColor,
          color: styles.color,
          '& .MuiAlert-icon': {
            color: styles.color
          },
          border: `1px solid ${styles.color}`
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => onDismiss && onDismiss(currentNotification.id)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Box>
          <Typography variant="subtitle2">
            {currentNotification?.message || 'Trait effect activated'}
          </Typography>
          {currentNotification?.description && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {currentNotification.description}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default TraitEffectNotification;
