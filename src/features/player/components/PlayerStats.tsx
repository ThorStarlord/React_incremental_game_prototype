import React from 'react';
import { Box, Typography, Grid, LinearProgress } from '@mui/material';
import { useGameState } from '../../../context/GameStateContext';

interface PlayerStatsProps {
  compact?: boolean;
  showLevelProgress?: boolean;
}

interface PlayerAttributes {
  [key: string]: number | string;
}

interface PlayerStats {
  [key: string]: number | string;
}

/**
 * PlayerStats Component
 * 
 * Displays player's statistics and attributes
 * 
 * @param {boolean} compact - Whether to show a compact version
 * @param {boolean} showLevelProgress - Whether to show level progress bar
 * @returns {JSX.Element} The rendered component
 */
const PlayerStats: React.FC<PlayerStatsProps> = ({
  compact = false,
  showLevelProgress = true
}) => {
  const { player } = useGameState();
  
  // Early return for missing player data
  if (!player) {
    return <Typography>Player data not available</Typography>;
  }
  
  // Get player stats with defaults
  const {
    name = 'Hero',
    level = 1,
    experience = 0,
    experienceToNextLevel = 100,
    stats = {} as PlayerStats,
    attributes = {} as PlayerAttributes
  } = player;
  
  // Calculate experience percentage
  const expPercentage = Math.min(100, Math.floor((experience / experienceToNextLevel) * 100));
  
  return compact ? (
    // Compact view
    <Box>
      <Typography variant="subtitle1">
        {name} (Lv. {level})
      </Typography>
      {showLevelProgress && (
        <Box sx={{ mb: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={expPercentage} 
            sx={{ height: 8, borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            EXP: {experience}/{experienceToNextLevel} ({expPercentage}%)
          </Typography>
        </Box>
      )}
    </Box>
  ) : (
    // Full view
    <Box>
      <Typography variant="h6" gutterBottom>
        {name} (Level {level})
      </Typography>
      
      {showLevelProgress && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Experience</Typography>
            <Typography variant="body2">{experience}/{experienceToNextLevel}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={expPercentage} 
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>Attributes</Typography>
          <Box>
            {Object.entries(attributes).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {key}
                </Typography>
                <Typography variant="body2">{String(value)}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" gutterBottom>Stats</Typography>
          <Box>
            {Object.entries(stats).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Typography>
                <Typography variant="body2">{String(value)}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerStats;
