import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Box,
  Chip,
} from '@mui/material';
import {
  Favorite as HealthIcon,
  AutoAwesome as ManaIcon,
  Security as DefenseIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import type { PlayerStats } from '../../state/PlayerTypes';

interface PlayerStatsUIProps {
  stats: PlayerStats;
  health: {
    current: number;
    max: number;
    percentage: number;
  };
  mana: {
    current: number;
    max: number;
    percentage: number;
  };
}

/**
 * UI component for displaying player statistics
 *
 * Features:
 * - Vital stats with progress bars and color coding
 * - Combat statistics in organized grid layout
 * - Visual indicators for health/mana status
 * - Responsive design with Material-UI components
 * - Semantic color usage for quick status assessment
 */
export const PlayerStatsUI: React.FC<PlayerStatsUIProps> = React.memo(
  ({ stats, health, mana }) => {
    const getHealthColor = (percentage: number) => {
      if (percentage > 75) return 'success';
      if (percentage > 25) return 'warning';
      return 'error';
    };

    const getManaColor = (percentage: number) => {
      if (percentage > 75) return 'primary';
      if (percentage > 25) return 'info';
      return 'warning';
    };

    return (
      <Grid container spacing={3}>
        {/* Vital Stats Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vital Statistics
              </Typography>

              {/* Health */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HealthIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Health: {health.current} / {health.max} (
                    {health.percentage.toFixed(1)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={health.percentage}
                  color={getHealthColor(health.percentage)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Mana */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ManaIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Mana: {mana.current} / {mana.max} ({mana.percentage.toFixed(1)}
                    %)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={mana.percentage}
                  color={getManaColor(mana.percentage)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Combat Stats Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Combat Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Attack
                    </Typography>
                    <Chip
                      label={stats.attack}
                      color="error"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Defense
                    </Typography>
                    <Chip
                      label={stats.defense}
                      color="info"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Speed
                    </Typography>
                    <Chip
                      label={stats.speed}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Crit Chance
                    </Typography>
                    <Chip
                      label={`${(stats.critChance * 100).toFixed(1)}%`}
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Regeneration Stats */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Regeneration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Health Regen: {stats.healthRegen}/sec
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Mana Regen: {stats.manaRegen}/sec
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
);

PlayerStatsUI.displayName = 'PlayerStatsUI';
