import React from 'react';
import { Box, Typography, Grid, Paper, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import {
  selectPlayerAttribute,
  selectPlayerHealth,
  selectPlayerMaxHealth
} from '../../state/PlayerSelectors';

interface StatDisplayProps {
  statName?: string;
  statValue?: number | string;
}

/**
 * Component to display player statistics
 * Shows all player stats if no specific stat is provided
 */
const StatDisplay: React.FC<StatDisplayProps> = ({ statName, statValue }) => {
  // Replace context with Redux selectors
  const playerAttributes = useSelector((state: RootState) => state.player.attributes);
  const playerStats = useSelector((state: RootState) => state.player.stats);
  const health = useSelector(selectPlayerHealth);
  const maxHealth = useSelector(selectPlayerMaxHealth);

  // If specific stat values are provided, show only that stat
  if (statName && statValue !== undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1">{statName}:</Typography>
        <Typography variant="body1" fontWeight="bold">{statValue}</Typography>
      </Box>
    );
  }

  // Otherwise display all player stats
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Character Stats</Typography>

      <Grid container spacing={2}>
        {/* Attributes Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Attributes</Typography>
            {playerAttributes && Object.entries(playerAttributes).map(([key, attribute]) => (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {key}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {attribute.value}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Combat Stats Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Combat Stats</Typography>
            {playerStats && Object.entries({
              health: `${health || 0}/${maxHealth || 100}`,
              attack: playerStats.attack || 0,
              defense: playerStats.defense || 0,
              critChance: `${playerStats.critChance || 0}%`
            }).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {key}
                </Typography>
                <Typography variant="body2" fontWeight="medium">{value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* StatDisplay Component Example - Replace with actual usage */}
      <StatDisplayComponent
        label="Health"
        value={health}
        maxValue={maxHealth}
        icon={null}
        color="success"
        format="number"
        showProgress={true}
        description="Your current health points"
        size="medium"
      />
    </Box>
  );
};

export default StatDisplay;

import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import styles from './StatDisplay.module.css';

/**
 * Props for StatDisplay component
 */
interface StatDisplayProps {
  /** Display name of the stat */
  label: string;
  /** Current value of the stat */
  value: number;
  /** Maximum value (for progress bars) */
  maxValue?: number;
  /** Icon component to display */
  icon?: SvgIconComponent;
  /** Color theme for the stat */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Display format type */
  format?: 'number' | 'percentage' | 'decimal' | 'time';
  /** Show as progress bar */
  showProgress?: boolean;
  /** Additional description for tooltip */
  description?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
}

/**
 * StatDisplay component for individual stat visualization
 * 
 * Features:
 * - Flexible value formatting
 * - Optional progress bar display
 * - Icon integration
 * - Color theming
 * - Tooltip support
 * - Responsive sizing
 */
export const StatDisplay: React.FC<StatDisplayProps> = React.memo(({
  label,
  value,
  maxValue,
  icon: Icon,
  color = 'primary',
  format = 'number',
  showProgress = false,
  description,
  size = 'medium',
}) => {
  const theme = useTheme();

  /**
   * Format value based on specified format type
   */
  const formatValue = (val: number): string => {
    switch (format) {
      case 'percentage':
        return `${Math.round(val * 100)}%`;
      case 'decimal':
        return val.toFixed(1);
      case 'time':
        const hours = Math.floor(val / 3600);
        const minutes = Math.floor((val % 3600) / 60);
        return `${hours}h ${minutes}m`;
      case 'number':
      default:
        return val.toLocaleString();
    }
  };

  /**
   * Calculate percentage for progress bars
   */
  const getPercentage = (): number => {
    if (!maxValue || maxValue === 0) return 0;
    return Math.min((value / maxValue) * 100, 100);
  };

  /**
   * Get size-based styling
   */
  const getSizeStyles = () => {
    const baseSize = {
      small: { icon: 20, spacing: 1 },
      medium: { icon: 24, spacing: 2 },
      large: { icon: 32, spacing: 3 },
    };
    return baseSize[size];
  };

  const sizeStyles = getSizeStyles();

  const content = (
    <Box 
      className={styles.statCard}
      sx={{ 
        padding: theme.spacing(sizeStyles.spacing),
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        minHeight: size === 'large' ? 120 : size === 'medium' ? 80 : 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Header with icon and label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
        {Icon && (
          <Icon 
            className={styles.statIcon}
            sx={{ 
              fontSize: sizeStyles.icon,
              color: theme.palette[color].main,
            }} 
          />
        )}
        <Typography 
          variant={size === 'large' ? 'subtitle1' : 'body2'} 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>

      {/* Value display */}
      <Box sx={{ marginBottom: showProgress ? 1 : 0 }}>
        <Typography 
          variant={size === 'large' ? 'h5' : size === 'medium' ? 'h6' : 'body1'}
          color={color === 'primary' ? 'primary.main' : `${color}.main`}
          sx={{ fontWeight: 600 }}
        >
          {formatValue(value)}
          {maxValue && format === 'number' && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
              / {formatValue(maxValue)}
            </Typography>
          )}
        </Typography>
      </Box>

      {/* Progress bar */}
      {showProgress && maxValue && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={getPercentage()}
            color={color}
            className={styles.progressBar}
            sx={{ 
              height: size === 'large' ? 8 : 6,
              borderRadius: 1,
              marginBottom: 0.5,
            }}
          />
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ textAlign: 'center', display: 'block' }}
          >
            {Math.round(getPercentage())}%
          </Typography>
        </Box>
      )}

      {/* Additional info chip for large size */}
      {size === 'large' && format === 'percentage' && (
        <Chip
          label={`${formatValue(value)}`}
          size="small"
          color={color}
          variant="outlined"
          sx={{ alignSelf: 'flex-end', marginTop: 1 }}
        />
      )}
    </Box>
  );

  // Wrap with tooltip if description is provided
  if (description) {
    return (
      <Tooltip title={description} arrow placement="top">
        {content}
      </Tooltip>
    );
  }

  return content;
});

StatDisplay.displayName = 'StatDisplay';

/**
 * Reusable component for displaying player statistics
 * 
 * Features:
 * - Optional progress bar for current/max values
 * - Color coding for different stat types
 * - Icon support for visual identification
 * - Flexible display options for various stat types
 */
export const StatDisplay: React.FC<StatDisplayProps> = React.memo(({
  label,
  current,
  max,
  color = 'primary',
  showProgress = false,
  unit = '',
  icon
}) => {
  const percentage = max ? (current / max) * 100 : 100;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
        <Typography variant="body2">
          {label}: {current}{max ? ` / ${max}` : ''}{unit && ` ${unit}`}
          {max && ` (${percentage.toFixed(1)}%)`}
        </Typography>
      </Box>
      {showProgress && max && (
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          color={color}
          sx={{ height: 6, borderRadius: 3 }}
        />
      )}
    </Box>
  );
});

StatDisplay.displayName = 'StatDisplay';
