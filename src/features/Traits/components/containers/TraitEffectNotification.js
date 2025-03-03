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
 * Component that displays notifications for trait effects
 * 
 * @param {Object} props Component props
 * @param {Array} props.notifications Array of notification objects
 * @param {Function} props.onDismiss Function to call when dismissing a notification
 * @returns {JSX.Element} The notification component
 */
const TraitEffectNotification = ({ 
  notifications = [],  // Provide a default empty array to prevent undefined.length error
  onDismiss 
}) => {
  const theme = useTheme();
  
  // If no notifications or empty array, don't render anything
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return null;
  }
  
  // Get the latest notification
  const currentNotification = notifications[0];
  
  // Determine styles based on notification type
  const getStyles = (type) => {
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