import React, { useEffect, useState } from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

/**
 * Interface for NewSlotAnimation component props
 */
interface NewSlotAnimationProps {
  /** Callback function to run when animation completes */
  onComplete?: () => void;
  /** Number of new trait slots unlocked */
  newSlots: number;
}

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/**
 * Component that displays an animation when a new trait slot is unlocked
 * 
 * @param props - Component props
 * @param props.onComplete - Callback function to run when animation completes
 * @param props.newSlots - Number of new trait slots unlocked
 * @returns Animation component or null when animation is complete
 */
const NewSlotAnimation: React.FC<NewSlotAnimationProps> = ({ onComplete, newSlots }) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isAnimating) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 4,
        p: 4,
        animation: `${fadeIn} 0.5s ease-out forwards`,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          animation: `${pulse} 1s infinite ease-in-out`
        }}
      >
        <AutoAwesomeIcon 
          sx={{ 
            fontSize: 40, 
            color: 'white',
            animation: `${spin} 3s infinite linear`
          }} 
        />
      </Box>
      
      <Typography variant="h4" color="primary.main" gutterBottom>
        New Trait Slot Unlocked!
      </Typography>
      
      <Typography variant="h5" color="white">
        You now have {newSlots} trait slots
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" mt={2}>
        Equip more traits to grow stronger!
      </Typography>
    </Box>
  );
};

export default NewSlotAnimation;
