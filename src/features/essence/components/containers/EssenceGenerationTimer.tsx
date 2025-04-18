import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { earnEssence } from '../../state/EssenceSlice';

// Define locally if the import cannot be resolved
const UPDATE_INTERVALS = {
  ESSENCE_GENERATION: 10000 // 10 seconds
};

/**
 * Interface for EssenceGenerationTimer component props
 */
interface EssenceGenerationTimerProps {
  /** The rate of essence generation. If rate is 0 or negative, the timer is not displayed */
  rate?: number;
}

/**
 * @component EssenceGenerationTimer
 * @description Displays a progress bar that visualizes the time remaining until the next essence generation occurs.
 * The component updates every 100ms to provide a smooth animation effect. When the timer completes, it resets and
 * dispatches an earnEssence action.
 * 
 * @param {EssenceGenerationTimerProps} props - Component props
 * @returns {React.ReactElement|null} - Returns the timer component or null if rate is <= 0
 */
const EssenceGenerationTimer: React.FC<EssenceGenerationTimerProps> = ({ 
  rate 
}): React.ReactElement | null => {
  const dispatch = useDispatch();
  
  // Get essence generation rate from Redux store if not provided via props
  const generationRate = rate ?? useSelector((state: RootState) => 
    // Assuming there's a generationRate field in the essence state
    // If it doesn't exist, you can calculate it based on your game logic
    state.essence.generationRate || 1
  );
  
  // Track the progress percentage (0-100)
  const [progress, setProgress] = useState<number>(0);
  // Get the interval duration from game constants
  const interval = UPDATE_INTERVALS.ESSENCE_GENERATION;

  useEffect(() => {
    // Skip timer setup if rate is not positive
    if (generationRate <= 0) return;
    
    // Record the start time to calculate elapsed time
    let startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / interval) * 100;
      
      if (newProgress >= 100) {
        // Timer complete - reset and trigger callback
        startTime = Date.now();
        setProgress(0);
        
        // Dispatch earnEssence action with the generation rate
        dispatch(earnEssence({
          amount: generationRate,
          source: 'passive generation'
        }));
      } else {
        setProgress(newProgress);
      }
    }, 100); // Update every 100ms for smooth animation

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [interval, generationRate, dispatch]);

  // Don't render anything if rate is not positive
  if (generationRate <= 0) return null;

  // Calculate seconds remaining until next essence gain
  const secondsRemaining = Math.ceil((100 - progress) / 100 * (interval / 1000));

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Next essence gain in {secondsRemaining}s ({generationRate} essence)
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
          height: 2,
          borderRadius: 1,
          bgcolor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            bgcolor: 'success.main'
          }
        }}
      />
    </Box>
  );
};

export default EssenceGenerationTimer;
