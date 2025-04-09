import React from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

/**
 * Interface for the position of an effect animation
 * 
 * @interface AnimationPosition
 * @property {string | number} x - Horizontal position (can be percentage or pixel value)
 * @property {string | number} y - Vertical position (can be percentage or pixel value)
 */
interface AnimationPosition {
  x: string | number;
  y: string | number;
}

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
 * Interface for TraitEffectAnimation props
 * 
 * @interface TraitEffectAnimationProps
 * @property {TraitEffect | null} effect - The trait effect data to display
 * @property {AnimationPosition | undefined} position - Optional position for the animation
 */
interface TraitEffectAnimationProps {
  effect: TraitEffect | null;
  position?: AnimationPosition;
}

/**
 * TraitEffectAnimation Component
 * 
 * Displays a floating animation when a trait effect is activated,
 * showing the trait name and potentially a value.
 * 
 * @param {TraitEffectAnimationProps} props - Component props
 * @returns {JSX.Element | null} The rendered component or null if no effect
 */
const TraitEffectAnimation: React.FC<TraitEffectAnimationProps> = ({ effect, position }) => {
  if (!effect) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: position?.y || '50%',
        left: position?.x || '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'floatUp 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        '@keyframes floatUp': {
          '0%': {
            opacity: 0,
            transform: 'translate(-50%, -40%)',
          },
          '20%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
            transform: 'translate(-50%, -150%)',
          }
        }
      }}
    >
      <AutoAwesomeIcon 
        sx={{ 
          color: 'primary.main',
          fontSize: '2rem',
          mb: 0.5,
          animation: 'pulse 1s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' }
          }
        }} 
      />
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'primary.main',
          fontWeight: 'bold',
          textShadow: (theme) => `2px 2px 4px ${theme.palette.background.paper}`,
          animation: 'glow 1s ease-in-out infinite alternate',
          '@keyframes glow': {
            from: { filter: 'drop-shadow(0 0 2px currentColor)' },
            to: { filter: 'drop-shadow(0 0 8px currentColor)' }
          }
        }}
      >
        {effect.traitName}
      </Typography>
      {effect.value && (
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'success.main',
            fontWeight: 'bold',
            mt: 0.5
          }}
        >
          +{effect.value}
        </Typography>
      )}
    </Box>
  );
};

export default TraitEffectAnimation;
