/**
 * @file StatDisplay.tsx
 * @description Reusable component for displaying individual player statistics with visual indicators
 */

import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import type { StatDisplayProps } from '../../state/PlayerTypes';
import styles from './StatDisplay.module.css';

/**
 * StatDisplay component for showing player statistics with optional progress indicators
 */
export const StatDisplay: React.FC<StatDisplayProps> = React.memo(({
  label,
  value,
  unit = '',
  showProgress = false,
  maxValue,
  color = 'primary', // Changed default from undefined to 'primary'
  size = 'medium',
}) => {
  // Handle both string and number values
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  const displayValue = typeof value === 'string' ? value : value.toLocaleString();
  
  // Calculate progress percentage for numeric values
  const progressPercentage = React.useMemo(() => {
    if (!showProgress || !maxValue || typeof value === 'string') return 0;
    return Math.min((numericValue / maxValue) * 100, 100);
  }, [showProgress, maxValue, numericValue, value]);

  // Size-based styling
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          typography: 'body2' as const,
          spacing: 1,
          progressHeight: 4,
        };
      case 'large':
        return {
          typography: 'h6' as const,
          spacing: 2,
          progressHeight: 8,
        };
      default:
        return {
          typography: 'body1' as const,
          spacing: 1.5,
          progressHeight: 6,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Box className={styles.statDisplay}>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        component="div"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>
      
      <Box display="flex" alignItems="center" gap={sizeStyles.spacing}>
        <Typography
          variant={sizeStyles.typography}
          color={`${color}.main`} // This now always uses a valid MUI color
          component="div"
          sx={{ fontWeight: size === 'large' ? 'bold' : 'medium' }}
        >
          {displayValue}{unit}
        </Typography>
        
        {showProgress && maxValue && typeof value === 'number' && (
          <Box sx={{ flex: 1, ml: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              color={color} // This now always uses a valid MUI color
              sx={{ 
                height: sizeStyles.progressHeight,
                borderRadius: sizeStyles.progressHeight / 2,
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
});

StatDisplay.displayName = 'StatDisplay';

export default StatDisplay;
