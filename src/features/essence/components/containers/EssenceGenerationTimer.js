import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { UPDATE_INTERVALS } from '../../../../constants/gameConstants';

/**
 * @component EssenceGenerationTimer
 * @description Displays a progress bar that visualizes the time remaining until the next essence generation occurs.
 * The component updates every 100ms to provide a smooth animation effect. When the timer completes, it resets and
 * can trigger an optional callback function.
 * 
 * @param {Object} props - Component props
 * @param {number} props.rate - The rate of essence generation. If rate is 0 or negative, the timer is not displayed.
 * @param {Function} [props.onGenerate] - Optional callback function that is called when essence is generated (timer completes).
 * 
 * @returns {React.ReactElement|null} - Returns the timer component or null if rate is <= 0
 */
const EssenceGenerationTimer = ({ rate, onGenerate }) => {
  // Track the progress percentage (0-100)
  const [progress, setProgress] = useState(0);
  // Get the interval duration from game constants
  const interval = UPDATE_INTERVALS.ESSENCE_GENERATION;

  useEffect(() => {
    // Skip timer setup if rate is not positive
    if (rate <= 0) return;
    
    // Record the start time to calculate elapsed time
    let startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / interval) * 100;
      
      if (newProgress >= 100) {
        // Timer complete - reset and trigger callback
        startTime = Date.now();
        setProgress(0);
        
        // Call the onGenerate callback if provided
        if (typeof onGenerate === 'function') {
          onGenerate(rate);
        }
      } else {
        setProgress(newProgress);
      }
    }, 100); // Update every 100ms for smooth animation

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [interval, rate, onGenerate]);

  // Don't render anything if rate is not positive
  if (rate <= 0) return null;

  // Calculate seconds remaining until next essence gain
  const secondsRemaining = Math.ceil((100 - progress) / 100 * (interval / 1000));

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Next essence gain in {secondsRemaining}s
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