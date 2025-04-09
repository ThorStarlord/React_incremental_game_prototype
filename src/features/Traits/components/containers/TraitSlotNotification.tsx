import React from 'react';
import { Snackbar, Alert, Typography, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Zoom } from '@mui/material';

/**
 * Possible types for trait notifications
 */
type NotificationType = 'equip' | 'unequip';

/**
 * Props interface for TraitSlotNotification component
 * 
 * @interface TraitSlotNotificationProps
 * @property {boolean} open - Whether the notification is visible
 * @property {() => void} onClose - Function to call when the notification should close
 * @property {string} message - The notification message to display
 * @property {NotificationType} type - The type of notification (equip or unequip)
 */
interface TraitSlotNotificationProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type: NotificationType;
}

/**
 * TraitSlotNotification Component
 * 
 * Displays a notification when traits are equipped or unequipped.
 * 
 * @param {TraitSlotNotificationProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
const TraitSlotNotification: React.FC<TraitSlotNotificationProps> = ({ open, onClose, message, type }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={Zoom}
    >
      <Alert
        severity={type === 'equip' ? 'success' : 'info'}
        icon={<AutoAwesomeIcon />}
        sx={{
          minWidth: '200px',
          bgcolor: type === 'equip' ? 'success.light' : 'info.light',
          color: '#fff',
          '& .MuiAlert-icon': {
            color: '#fff'
          }
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {type === 'equip' ? 'Trait Equipped' : 'Trait Unequipped'}
          </Typography>
          <Typography variant="caption">
            {message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default TraitSlotNotification;
