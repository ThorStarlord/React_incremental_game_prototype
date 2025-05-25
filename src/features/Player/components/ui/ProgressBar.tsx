/**
 * @file ProgressBar.tsx
 * @description Reusable progress bar component for player progression indicators
 */

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * Props interface for ProgressBar component
 */
export interface ProgressBarProps {
  /** Current progress value */
  current: number;
  /** Maximum progress value */
  max: number;
  /** Display label */
  label?: string;
  /** Color variant */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Height of the progress bar */
  height?: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Show current/max values */
  showValues?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * ProgressBar component for displaying player progression with customizable appearance
 */
export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  current,
  max,
  label,
  color = 'primary',
  height = 8,
  showPercentage = false,
  showValues = false,
  animationDuration = 500
}) => {
  const theme = useTheme();

  // Ensure values are valid
  const safeCurrent = Math.max(0, current);
  const safeMax = Math.max(1, max);
  const percentage = Math.min((safeCurrent / safeMax) * 100, 100);

  return (
    <Box>
      {(label || showValues || showPercentage) && (
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={1}
        >
          {label && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          
          <Box display="flex" gap={2}>
            {showValues && (
              <Typography variant="body2" color="text.primary">
                {safeCurrent.toLocaleString()} / {safeMax.toLocaleString()}
              </Typography>
            )}
            
            {showPercentage && (
              <Typography variant="body2" color="text.secondary">
                {Math.round(percentage)}%
              </Typography>
            )}
          </Box>
        </Box>
      )}
      
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={color}
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
            transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          },
        }}
      />
    </Box>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
