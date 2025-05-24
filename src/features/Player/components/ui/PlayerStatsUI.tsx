import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Favorite as HealthIcon,
  AutoAwesome as ManaIcon,
  Sword as AttackIcon,
  Shield as DefenseIcon,
  Speed as SpeedIcon,
  StarHalf as CritIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
import {
  selectPlayerHealth,
  selectPlayerMana,
  selectPlayerStats,
} from '../../state/PlayerSelectors';

/**
 * PlayerStats component displays comprehensive player statistics with visual indicators
 * 
 * Features:
 * - Vital stats (Health/Mana) with progress bars
 * - Combat stats in organized grid layout
 * - Color-coded values based on stat types
 * - Responsive design for all screen sizes
 * - Real-time updates from Redux state
 */
export const PlayerStats: React.FC = React.memo(() => {
  const theme = useTheme();
  const playerStats = useAppSelector(selectPlayerStats);
  const healthData = useAppSelector(selectPlayerHealth);
  const manaData = useAppSelector(selectPlayerMana);

  /**
   * Get color for health bar based on percentage
   */
  const getHealthColor = (percentage: number) => {
    if (percentage > 60) return 'success';
    if (percentage > 30) return 'warning';
    return 'error';
  };

  /**
   * Get color for mana bar based on percentage
   */
  const getManaColor = (percentage: number) => {
    if (percentage > 60) return 'primary';
    if (percentage > 30) return 'warning';
    return 'error';
  };

  /**
   * Format numbers for display with localization
   */
  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  /**
   * Format percentage values
   */
  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      {/* Vital Stats Section */}
      <Card sx={{ marginBottom: theme.spacing(3) }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Favorite color="error" />
            Vital Statistics
          </Typography>
          
          <Grid container spacing={3}>
            {/* Health */}
            <Grid item xs={12} md={6}>
              <Box sx={{ marginBottom: theme.spacing(2) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HealthIcon color="error" fontSize="small" />
                    Health
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(healthData.current)} / {formatNumber(healthData.max)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={healthData.percentage}
                  color={getHealthColor(healthData.percentage)}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', marginTop: 0.5 }}>
                  {formatPercentage(healthData.percentage)}
                </Typography>
              </Box>
            </Grid>

            {/* Mana */}
            <Grid item xs={12} md={6}>
              <Box sx={{ marginBottom: theme.spacing(2) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ManaIcon color="primary" fontSize="small" />
                    Mana
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(manaData.current)} / {formatNumber(manaData.max)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={manaData.percentage}
                  color={getManaColor(manaData.percentage)}
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', marginTop: 0.5 }}>
                  {formatPercentage(manaData.percentage)}
                </Typography>
              </Box>
            </Grid>

            {/* Health Regeneration */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Health Regen
                </Typography>
                <Chip
                  label={`${playerStats.healthRegen.toFixed(1)}/sec`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Grid>

            {/* Mana Regeneration */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Mana Regen
                </Typography>
                <Chip
                  label={`${playerStats.manaRegen.toFixed(1)}/sec`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Combat Stats Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sword color="primary" />
            Combat Statistics
          </Typography>
          
          <Grid container spacing={3}>
            {/* Attack Power */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <AttackIcon color="error" sx={{ fontSize: 32, marginBottom: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Attack
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatNumber(playerStats.attack)}
                </Typography>
              </Box>
            </Grid>

            {/* Defense */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Shield color="primary" sx={{ fontSize: 32, marginBottom: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Defense
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {formatNumber(playerStats.defense)}
                </Typography>
              </Box>
            </Grid>

            {/* Speed */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <SpeedIcon color="success" sx={{ fontSize: 32, marginBottom: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Speed
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatNumber(playerStats.speed)}
                </Typography>
              </Box>
            </Grid>

            {/* Critical Hit */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <CritIcon color="warning" sx={{ fontSize: 32, marginBottom: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Crit Chance
                </Typography>
                <Typography variant="h6" color="warning.main">
                  {formatPercentage(playerStats.critChance * 100)}
                </Typography>
              </Box>
            </Grid>

            {/* Critical Damage */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Critical Damage Multiplier
                </Typography>
                <Chip
                  label={`${playerStats.critDamage.toFixed(1)}x`}
                  color="warning"
                  variant="filled"
                />
              </Box>
            </Grid>

            {/* Additional Stats */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Dynamic stats display for any additional stats */}
                {Object.entries(playerStats)
                  .filter(([key]) => !['health', 'maxHealth', 'mana', 'maxMana', 'attack', 'defense', 'speed', 'critChance', 'critDamage', 'healthRegen', 'manaRegen'].includes(key))
                  .map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {typeof value === 'number' ? formatNumber(value) : String(value)}
                      </Typography>
                    </Box>
                  ))
                }
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
});

PlayerStats.displayName = 'PlayerStats';

export default PlayerStats;
