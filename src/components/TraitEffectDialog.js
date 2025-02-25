import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Typography, 
  Box,
  Zoom
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const TraitEffectDialog = ({ open, onClose, effect }) => {
  if (!effect) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          minWidth: 300,
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <AutoAwesomeIcon sx={{ 
          fontSize: 40, 
          color: 'primary.main',
          animation: 'glow 1.5s ease-in-out infinite alternate',
          '@keyframes glow': {
            from: { filter: 'drop-shadow(0 0 2px currentColor)' },
            to: { filter: 'drop-shadow(0 0 10px currentColor)' }
          }
        }} />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {effect.traitName} Activated!
          </Typography>
          <Typography variant="body1">
            {effect.description}
          </Typography>
          {effect.value && (
            <Typography 
              variant="h5" 
              color="success.main" 
              sx={{ 
                mt: 1,
                animation: 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                '@keyframes popIn': {
                  '0%': { transform: 'scale(0)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            >
              {typeof effect.value === 'number' ? `+${effect.value}` : effect.value}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TraitEffectDialog;