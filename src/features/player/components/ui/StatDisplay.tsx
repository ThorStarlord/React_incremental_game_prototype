import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { 
  selectPlayerAttribute,
  selectPlayerHealth,
  selectPlayerMaxHealth
} from '../../state/playerSelectors';

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
    </Box>
  );
};

export default StatDisplay;
