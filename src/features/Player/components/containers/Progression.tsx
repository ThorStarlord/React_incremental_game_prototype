/**
 * @file Progression.tsx
 * @description Container component for player progression and experience tracking
 */

import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { TrendingUp, Timer, Star } from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
import { selectPlayer } from '../../state/PlayerSelectors';
import { ProgressBar } from '../ui/ProgressBar';
import { StatDisplay } from '../ui/StatDisplay';

/**
 * Container component for displaying player progression information
 */
export const Progression: React.FC = React.memo(() => {
  const player = useAppSelector(selectPlayer);

  // Calculate experience needed for next level (mock calculation)
  const experienceForNextLevel = player.level * 1000;
  const currentLevelExperience = player.experience % experienceForNextLevel;

  // Format playtime
  const formatPlaytime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box>
      {/* Experience Progress */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          Level Progression
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ProgressBar
              current={currentLevelExperience}
              max={experienceForNextLevel}
              label={`Level ${player.level} Experience`}
              color="success"
              height={16}
              showValues
              showPercentage
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StatDisplay
              label="Current Level"
              value={player.level}
              color="success"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Character Stats */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="warning" />
          Character Statistics
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Total Experience"
              value={player.experience}
              color="primary"
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Attribute Points"
              value={player.attributePoints}
              color="success"
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Skill Points"
              value={player.skillPoints}
              color="info"
            />
          </Grid>
          
          <Grid item xs={6} md={3}>
            <StatDisplay
              label="Gold"
              value={player.gold}
              unit=" gold"
              color="warning"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Playtime Stats */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timer color="info" />
          Session Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StatDisplay
              label="Total Playtime"
              value={formatPlaytime(player.totalPlayTime)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StatDisplay
              label="Character Status"
              value={player.isAlive ? 'Alive' : 'Dead'}
              color={player.isAlive ? 'success' : 'error'}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
});

Progression.displayName = 'Progression';

export default Progression;
