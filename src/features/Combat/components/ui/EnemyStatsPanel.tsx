import React from 'react';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import useThemeUtils from '../../hooks/useThemeUtils';

interface EnemyStatsPanelProps {
  enemyStats: {
    name: string;
    level: number;
    currentHealth: number;
    maxHealth: number;
    attack: number;
    defense: number;
  };
}

export const EnemyStatsPanel: React.FC<EnemyStatsPanelProps> = ({ enemyStats }) => {
  const { theme, getProgressColor } = useThemeUtils();
  
  return (
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle2" color="text.secondary">
        {enemyStats.name} (Level {enemyStats.level})
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom display="flex" justifyContent="space-between">
          <span>HP:</span>
          <span>{enemyStats.currentHealth}/{enemyStats.maxHealth}</span>
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(enemyStats.currentHealth / enemyStats.maxHealth) * 100}
          sx={{ 
            height: 10, 
            borderRadius: 1,
            backgroundColor: theme.palette.grey[300],
            '& .MuiLinearProgress-bar': {
              backgroundColor: getProgressColor(enemyStats.currentHealth, enemyStats.maxHealth)
            }
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Attack: {enemyStats.attack}
      </Typography>
      <Typography variant="body2">
        Defense: {enemyStats.defense}
      </Typography>
    </Grid>
  );
};
