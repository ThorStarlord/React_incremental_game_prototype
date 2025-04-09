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
import { TraitNotification } from '../../hooks/useTraitNotifications';

/**
 * Interface for TraitEffectNotification props
 * 
 * @interface TraitEffectNotificationProps
 * @property {TraitNotification[]} [notifications] - Array of notification objects to display
 * @property {(id: string) => void} onDismiss - Function to call when dismissing a notification
 */
interface TraitEffectNotificationProps {
  notifications?: TraitNotification[];
  onDismiss: (id: string) => void;
}

/**
 * Interface for style settings
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
   */
  const getStyles = (type: TraitNotification['type']): StyleSetting => {
    switch (type) {
      case 'positive':
        return {
          icon: <AutoAwesomeIcon />,
          color: theme.palette.success.main,
          bgColor: theme.palette.success.light,
        };
      case 'negative':
        return {
          icon: <AutoAwesomeIcon />,
          color: theme.palette.error.main,
          bgColor: theme.palette.error.light,
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
            {currentNotification?.title || 'Trait Effect'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {currentNotification?.message || 'A trait effect has been activated'}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default TraitEffectNotification;
