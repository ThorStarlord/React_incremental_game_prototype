/**
 * @file PlayerStatsUI.tsx
 * @description UI component for displaying player statistics with visual progress indicators
 */

import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Favorite, Shield, Speed, FlashOn } from '@mui/icons-material';
import type { PlayerStats } from '../../state/PlayerTypes';
import { StatDisplay } from './StatDisplay';
import { ProgressBar } from './ProgressBar';

/**
 * Props interface for PlayerStatsUI component
 */
export interface PlayerStatsUIProps {
  /** Player statistics data */
  stats: PlayerStats;
  /** Show detailed breakdown */
  showDetails?: boolean;
}

/**
 * PlayerStatsUI component for displaying player statistics with visual indicators
 */
export const PlayerStatsUI: React.FC<PlayerStatsUIProps> = React.memo(({
  stats,
  showDetails = true
}) => {
  return (
    <Box>
      {/* Vital Stats with Progress Bars */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Favorite color="error" />
          Vital Statistics
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ProgressBar
              current={stats.health}
              max={stats.maxHealth}
              label="Health"
              color="error"
              height={12}
              showValues
              showPercentage
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ProgressBar
              current={stats.mana}
              max={stats.maxMana}
              label="Mana"
              color="primary"
              height={12}
              showValues
              showPercentage
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Combat Stats */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield color="primary" />
          Combat Statistics
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Attack"
              value={stats.attack}
              color="error"
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Defense"
              value={stats.defense}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Crit Chance"
              value={stats.critChance * 100}
              unit="%"
              color="warning"
              asPercentage
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Crit Damage"
              value={stats.critDamage * 100}
              unit="%"
              color="success"
              asPercentage
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Regeneration & Speed */}
      {showDetails && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed color="success" />
            Performance Statistics
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <StatDisplay
                label="Speed"
                value={stats.speed}
                color="success"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatDisplay
                label="Health Regen"
                value={stats.healthRegen}
                unit="/sec"
                color="error"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatDisplay
                label="Mana Regen"
                value={stats.manaRegen}
                unit="/sec"
                color="primary"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <StatDisplay
                label="Total Power"
                value={stats.attack + stats.defense + stats.speed}
                color="warning"
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
});

PlayerStatsUI.displayName = 'PlayerStatsUI';

export default PlayerStatsUI;
