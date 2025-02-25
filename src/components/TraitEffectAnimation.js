import React from 'react';
import { Box, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const TraitEffectAnimation = ({ effect, position }) => {
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