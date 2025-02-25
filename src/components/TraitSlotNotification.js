import React from 'react';
import { Snackbar, Alert, Typography, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Zoom } from '@mui/material';

const TraitSlotNotification = ({ open, onClose, message, type }) => {
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