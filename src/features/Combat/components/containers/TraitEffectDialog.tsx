import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Paper,
  Box
} from '@mui/material';

interface TraitEffectProps {
  open: boolean;
  onClose: () => void;
  effect: {
    traitName: string;
    description: string;
    value: string | number;
  } | null;
}

/**
 * Dialog that displays trait activation effects
 */
const TraitEffectDialog: React.FC<TraitEffectProps> = ({ open, onClose, effect }) => {
  if (!effect) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          minWidth: 300
        }
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Trait Activated!
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            {effect.traitName}
          </Typography>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: 'background.paper',
              borderRadius: 1
            }}
          >
            <Typography variant="body1">
              {effect.description}
            </Typography>
          </Paper>
          
          <Typography 
            variant="h4" 
            color="secondary"
            sx={{ fontWeight: 'bold' }}
          >
            {typeof effect.value === 'number' && effect.value > 0 ? '+' : ''}
            {effect.value}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TraitEffectDialog;
