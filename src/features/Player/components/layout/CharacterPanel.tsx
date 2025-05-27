import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { PlayerStatsContainer } from '../containers/PlayerStatsContainer';
import { PlayerTraitsContainer } from '../containers/PlayerTraitsContainer';
import { Progression } from '../containers/Progression';

/**
 * Interface for CharacterPanel props
 */
interface CharacterPanelProps {
  /** Optional player name to display */
  playerName?: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * CharacterPanel Component
 * 
 * Displays a comprehensive view of the player's character including
 * stats, traits, and progression information. Uses container components
 * that handle Redux state management.
 * 
 * @param props Component props
 * @returns CharacterPanel component
 */
const CharacterPanel: React.FC<CharacterPanelProps> = ({ 
  playerName = 'Character',
  className 
}) => {
  return (
    <Paper 
      elevation={2} 
      className={className}
      sx={{ 
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {playerName} Overview
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Player Statistics Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Character Statistics
        </Typography>
        <PlayerStatsContainer />
      </Box>
      
      {/* Player Traits Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Character Traits
        </Typography>
        <PlayerTraitsContainer />
      </Box>
      
      {/* Progression Section */}
      <Box>
        <Typography variant="h6" component="h3" gutterBottom>
          Character Progress
        </Typography>
        <Progression showDetails={true} />
      </Box>
    </Paper>
  );
};

export default React.memo(CharacterPanel);
