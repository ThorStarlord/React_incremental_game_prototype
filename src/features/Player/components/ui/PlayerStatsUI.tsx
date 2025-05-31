/**
 * @file PlayerStatsUI.tsx
 * @description UI component for displaying player statistics with visual progress indicators
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  Shield as DefenseIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import type { PlayerStats } from '../../state/PlayerTypes';
import { StatDisplay } from './StatDisplay';
import { ProgressBar } from './ProgressBar';

/**
 * Props interface for PlayerStatsUI component
 */
export interface PlayerStatsUIProps {
  /** Player statistics data */
  stats: PlayerStats;
  /** Player's current resonance level */
  resonanceLevel?: number;
  /** Show detailed breakdown */
  showDetails?: boolean;
}

/**
 * PlayerStatsUI component for displaying player statistics with visual indicators
 */
export const PlayerStatsUI: React.FC<PlayerStatsUIProps> = React.memo(({
  stats,
  resonanceLevel,
  showDetails = true,
}) => {
  const healthPercentage = Math.round((stats.health / stats.maxHealth) * 100);
  const manaPercentage = Math.round((stats.mana / stats.maxMana) * 100);

  return (
    <Box>
      {/* Vital Stats */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <HeartIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Vital Stats</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Health
                </Typography>
                <ProgressBar
                  value={stats.health}
                  max={stats.maxHealth}
                  color="error"
                  height={8}
                  showValue
                />
                <Typography variant="caption" color="text.secondary">
                  {healthPercentage}%
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mana
                </Typography>
                <ProgressBar
                  value={stats.mana}
                  max={stats.maxMana}
                  color="primary"
                  height={8}
                  showValue
                />
                <Typography variant="caption" color="text.secondary">
                  {manaPercentage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Combat Stats */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <DefenseIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Combat Stats</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <StatDisplay
                label="Attack"
                value={stats.attack}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatDisplay
                label="Defense"
                value={stats.defense}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatDisplay
                label="Speed"
                value={stats.speed}
                color="success"
              />
            </Grid>
            
            {showDetails && (
              <>
                <Grid item xs={6} sm={4}>
                  <StatDisplay
                    label="Critical Hit Chance"
                    value={stats.criticalChance * 100}
                    unit="%"
                    color="warning"
                  />
                </Grid>
                
                <Grid item xs={6} sm={4}>
                  <StatDisplay
                    label="Critical Hit Damage"
                    value={stats.criticalDamage}
                    unit="x"
                    color="warning"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      {showDetails && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SpeedIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Performance Stats</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatDisplay
                  label="Health Regeneration"
                  value={stats.healthRegen}
                  unit="/sec"
                  color="success"
                />
              </Grid>
              <Grid item xs={6}>
                <StatDisplay
                  label="Mana Regeneration"
                  value={stats.manaRegen}
                  unit="/sec"
                  color="info"
                />
              </Grid>
              {resonanceLevel !== undefined && (
                <Grid item xs={12} sm={6}>
                  <StatDisplay
                    label="Resonance Level"
                    value={resonanceLevel}
                    color="secondary"
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
});

PlayerStatsUI.displayName = 'PlayerStatsUI';

export default PlayerStatsUI;
