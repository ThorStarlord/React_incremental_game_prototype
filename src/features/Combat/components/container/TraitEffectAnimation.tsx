import React from 'react';
import { Box, Typography } from '@mui/material';

interface TraitEffectAnimationProps {
  effect: {
    traitName: string;
    description: string;
    value: string | number;
  };
  position: {
    x: number | string;
    y: number | string;
  };
}

/**
 * Visual animation for trait activation effects
 */
const TraitEffectAnimation: React.FC<TraitEffectAnimationProps> = ({ effect, position }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'none',
        animation: 'floatUp 2s ease-out forwards',
        '@keyframes floatUp': {
          '0%': {
            opacity: 0,
            transform: 'translate(-50%, -40%)'
          },
          '10%': {
            opacity: 1,
          },
          '80%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
            transform: 'translate(-50%, -200%)'
          }
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'secondary.main',
          fontWeight: 'bold',
          textShadow: '0px 0px 10px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}
      >
        {effect.traitName}
      </Typography>
      
      <Typography
        variant="h5"
        sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '0px 0px 10px rgba(0,0,0,0.5)'
        }}
      >
        {typeof effect.value === 'number' && effect.value > 0 ? '+' : ''}
        {effect.value}
      </Typography>
    </Box>
  );
};

export default TraitEffectAnimation;
