import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { UPDATE_INTERVALS } from '../../../../constants/gameConstants';

const EssenceGenerationTimer = ({ rate }) => {
  const [progress, setProgress] = useState(0);
  const interval = UPDATE_INTERVALS.ESSENCE_GENERATION;

  useEffect(() => {
    let startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / interval) * 100;
      
      if (newProgress >= 100) {
        startTime = Date.now();
        setProgress(0);
      } else {
        setProgress(newProgress);
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(timer);
  }, [interval]);

  if (rate <= 0) return null;

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Next essence gain in {Math.ceil((100 - progress) / 100 * (interval / 1000))}s
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