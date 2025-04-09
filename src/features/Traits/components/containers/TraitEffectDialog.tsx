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

/**
 * Interface for the trait effect object
 * 
 * @interface TraitEffect
 * @property {string} traitName - Name of the trait that was activated
 * @property {string} description - Description of the effect that occurred
 * @property {number | string | undefined} value - Optional numerical or string value associated with the effect
 */
interface TraitEffect {
  traitName: string;
  description: string;
  value?: number | string;
}

/**
 * Interface for TraitEffectDialog props
 * 
 * @interface TraitEffectDialogProps
 * @property {boolean} open - Whether the dialog is visible
 * @property {() => void} onClose - Function to call when the dialog should close
 * @property {TraitEffect | null} effect - The trait effect data to display
 */
interface TraitEffectDialogProps {
  open: boolean;
  onClose: () => void;
  effect: TraitEffect | null;
}

/**
 * TraitEffectDialog Component
 * 
 * Displays a dialog with information about an activated trait effect.
 * 
 * @param {TraitEffectDialogProps} props - Component props
 * @returns {JSX.Element | null} The rendered component or null if no effect
 */
const TraitEffectDialog: React.FC<TraitEffectDialogProps> = ({ open, onClose, effect }) => {
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
