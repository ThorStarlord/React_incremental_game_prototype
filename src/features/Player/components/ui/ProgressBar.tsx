/**
 * @file ProgressBar.tsx
 * @description Reusable progress bar component for player progression indicators
 */

import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  useTheme,
} from '@mui/material';

export interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max: number;
  /** Custom color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Custom height in pixels */
  height?: number;
  /** Show value text */
  showValue?: boolean;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Animated progress */
  animated?: boolean;
  /** Additional styling */
  className?: string;
}

/**
 * Reusable progress bar component for player progression visualization
 * Supports customizable colors, heights, animations, and value displays
 */
export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  value,
  max,
  color = 'primary',
  height = 6,
  showValue = false,
  showPercentage = false,
  animated = false,
  className,
}) => {
  const theme = useTheme();
  
  // Ensure safe calculations
  const safeValue = Math.max(0, Math.min(value, max));
  const safeMax = Math.max(1, max);
  const percentage = Math.round((safeValue / safeMax) * 100);
  const normalizedValue = (safeValue / safeMax) * 100;

  const progressColor = theme.palette[color]?.main || theme.palette.primary.main;

  return (
    <Box className={className} width="100%">
      <Box position="relative">
        <LinearProgress
          variant="determinate"
          value={normalizedValue}
          color={color}
          sx={{
            height: height,
            borderRadius: height / 2,
            backgroundColor: theme.palette.grey[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: height / 2,
              transition: animated ? 'transform 0.3s ease' : 'none',
            },
          }}
        />
        
        {(showValue || showPercentage) && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: percentage > 50 ? 'white' : progressColor,
                fontWeight: 600,
                textShadow: percentage > 50 ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none',
                fontSize: height > 16 ? '0.75rem' : '0.625rem',
              }}
            >
              {showValue && `${safeValue.toLocaleString()}/${safeMax.toLocaleString()}`}
              {showValue && showPercentage && ' '}
              {showPercentage && `(${percentage}%)`}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
