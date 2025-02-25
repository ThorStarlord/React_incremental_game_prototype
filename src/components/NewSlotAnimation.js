import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const NewSlotAnimation = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeInOut 2s ease-in-out',
        '@keyframes fadeInOut': {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
          '100%': { opacity: 0, transform: 'scale(1.5)' }
        },
        zIndex: 10
      }}
    >
      <AutoAwesomeIcon 
        sx={{ 
          fontSize: '3rem',
          color: 'primary.main',
          animation: 'rotate 2s linear infinite',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          },
          filter: 'drop-shadow(0 0 10px currentColor)'
        }} 
      />
    </Box>
  );
};

export default NewSlotAnimation;