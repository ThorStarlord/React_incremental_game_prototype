import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * Props for ProgressBar component
 */
interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value */
  maxValue: number;
  /** Label for the progress bar */
  label?: string;
  /** Color theme */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Height of the progress bar */
  height?: number;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Show value/maxValue text */
  showValues?: boolean;
  /** Variant style */
  variant?: 'standard' | 'rounded' | 'striped';
  /** Size preset */
  size?: 'small' | 'medium' | 'large';
  /** Animation enabled */
  animated?: boolean;
}

/**
 * ProgressBar component for displaying progress with various customization options
 * 
 * Features:
 * - Multiple color themes
 * - Customizable height and styling
 * - Optional labels and value display
 * - Animation support
 * - Responsive design
 */
export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  value,
  maxValue,
  label,
  color = 'primary',
  height,
  showPercentage = true,
  showValues = false,
  variant = 'standard',
  size = 'medium',
  animated = false,
}) => {
  const theme = useTheme();

  /**
   * Calculate percentage ensuring it stays within bounds
   */
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  /**
   * Get height based on size
   */
  const getHeight = (): number => {
    if (height) return height;
    
    const sizeMap = {
      small: 4,
      medium: 8,
      large: 12,
    };
    
    return sizeMap[size];
  };

  /**
   * Get styling based on variant
   */
  const getVariantStyles = () => {
    const baseStyles = {
      height: getHeight(),
      borderRadius: variant === 'rounded' ? getHeight() / 2 : 4,
    };

    if (variant === 'striped') {
      return {
        ...baseStyles,
        '& .MuiLinearProgress-bar': {
          backgroundImage: `linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          )`,
          backgroundSize: '20px 20px',
          ...(animated && {
            animation: 'stripe-animation 1s linear infinite',
          }),
        },
      };
    }

    return baseStyles;
  };

  /**
   * Format number for display
   */
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header with label and values */}
      {(label || showValues || showPercentage) && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 1,
          }}
        >
          {label && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {label}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showValues && (
              <Typography variant="body2" color="text.secondary">
                {formatNumber(value)} / {formatNumber(maxValue)}
              </Typography>
            )}
            
            {showPercentage && (
              <Typography 
                variant="body2" 
                color={`${color}.main`}
                sx={{ fontWeight: 600, minWidth: '40px', textAlign: 'right' }}
              >
                {Math.round(percentage)}%
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Progress bar */}
      <Box sx={{ position: 'relative' }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={color}
          sx={{
            ...getVariantStyles(),
            backgroundColor: alpha(theme.palette[color].main, 0.1),
            ...(animated && {
              '& .MuiLinearProgress-bar': {
                transition: 'transform 0.3s ease-in-out',
              },
            }),
          }}
        />
        
        {/* Overlay for additional styling effects */}
        {variant === 'standard' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(to right, 
                transparent 0%, 
                ${alpha(theme.palette.common.white, 0.1)} 50%, 
                transparent 100%
              )`,
              pointerEvents: 'none',
              borderRadius: 4,
            }}
          />
        )}
      </Box>

      {/* CSS for stripe animation */}
      <style jsx>{`
        @keyframes stripe-animation {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 0;
          }
        }
      `}</style>
    </Box>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
