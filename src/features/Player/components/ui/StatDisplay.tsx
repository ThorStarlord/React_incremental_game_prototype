/**
 * @file StatDisplay.tsx
 * @description Reusable component for displaying individual player statistics with visual indicators
 */

import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './StatDisplay.module.css';

/**
 * Props interface for StatDisplay component
 */
export interface StatDisplayProps {
  /** Display label for the statistic */
  label: string;
  /** Current value of the statistic */
  value: number;
  /** Maximum value (optional, for progress bars) */
  maxValue?: number;
  /** Optional unit suffix (e.g., "HP", "%", "sec") */
  unit?: string;
  /** Color variant for the progress bar */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Show as percentage (0-100 scale) */
  asPercentage?: boolean;
  /** Show progress bar indicator */
  showProgress?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StatDisplay component for showing player statistics with optional progress indicators
 */
export const StatDisplay: React.FC<StatDisplayProps> = React.memo(({
  label,
  value,
  maxValue,
  unit = '',
  color = 'primary',
  asPercentage = false,
  showProgress = false,
  className
}) => {
  const theme = useTheme();

  // Calculate percentage for progress bar
  const percentage = maxValue ? Math.min((value / maxValue) * 100, 100) : 0;

  // Format display value
  const displayValue = asPercentage ? `${Math.round(value)}%` : value.toLocaleString();
  const displayMaxValue = maxValue ? maxValue.toLocaleString() : '';

  // Determine color based on percentage for health/mana
  const getProgressColor = () => {
    if (color === 'error' || (showProgress && percentage < 25)) return 'error';
    if (color === 'warning' || (showProgress && percentage < 50)) return 'warning';
    return color;
  };

  return (
    <Box className={`${styles.statDisplay} ${className || ''}`}>
      <Box className={styles.statHeader}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {displayValue}{unit}
          {maxValue && !asPercentage && (
            <Typography component="span" variant="body2" color="text.secondary">
              /{displayMaxValue}
            </Typography>
          )}
        </Typography>
      </Box>
      
      {showProgress && maxValue && (
        <Box className={styles.progressContainer}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={getProgressColor()}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" className={styles.percentageLabel}>
            {Math.round(percentage)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
});

StatDisplay.displayName = 'StatDisplay';

export default StatDisplay;
