import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  showPercentage?: boolean;
  height?: number;
}

/**
 * Reusable progress bar component for player stats
 * 
 * Features:
 * - Percentage calculation and display
 * - Color theming for different stat types
 * - Optional label and percentage display
 * - Configurable height for different use cases
 */
export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  value,
  max,
  label,
  color = 'primary',
  showPercentage = true,
  height = 8
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <Box>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {value} / {max} ({percentage.toFixed(1)}%)
            </Typography>
          )}
        </Box>
      )}
      <LinearProgress 
        variant="determinate" 
        value={Math.min(percentage, 100)} 
        color={color}
        sx={{ 
          height,
          borderRadius: height / 2,
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}
      />
    </Box>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
