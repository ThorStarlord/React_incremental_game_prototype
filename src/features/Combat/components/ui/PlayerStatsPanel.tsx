import React from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import useThemeUtils from '../../hooks/useThemeUtils';

interface PlayerStatsPanelProps {
  playerStats: {
    currentHealth: number;
    maxHealth: number;
    currentMana: number;
    maxMana: number;
  };
  calculatedStats: {
    attack: number;
    defense: number;
  };
  playerName: string;
}

export const PlayerStatsPanel: React.FC<PlayerStatsPanelProps> = ({
  playerStats,
  calculatedStats,
  playerName
}) => {
  const { theme, getProgressColor } = useThemeUtils();
  
  return (
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle2" color="text.secondary">
        Player Stats
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom display="flex" justifyContent="space-between">
          <span>HP:</span>
          <span>{playerStats.currentHealth}/{playerStats.maxHealth}</span>
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(playerStats.currentHealth / playerStats.maxHealth) * 100}
          sx={{ 
            height: 10, 
            borderRadius: 1,
            backgroundColor: theme.palette.grey[300],
            '& .MuiLinearProgress-bar': {
              backgroundColor: getProgressColor(playerStats.currentHealth, playerStats.maxHealth)
            }
          }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom display="flex" justifyContent="space-between">
          <span>Mana:</span>
          <span>{playerStats.currentMana}/{playerStats.maxMana}</span>
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(playerStats.currentMana / playerStats.maxMana) * 100}
          sx={{ 
            height: 8, 
            borderRadius: 1,
            backgroundColor: theme.palette.grey[300],
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.info.main
            }
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Attack: {calculatedStats.attack}
      </Typography>
      <Typography variant="body2">
        Defense: {calculatedStats.defense}
      </Typography>
    </Grid>
  );
};
