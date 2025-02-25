import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Typography, Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const TraitEffectNotification = ({ effect, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        severity="success"
        icon={<AutoAwesomeIcon />}
        sx={{ 
          minWidth: '200px',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Trait Effect Active
          </Typography>
          <Typography variant="caption">
            {effect}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default TraitEffectNotification;