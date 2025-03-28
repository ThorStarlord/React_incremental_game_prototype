import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import StatDisplay from '../ui/StatDisplay';
import PlayerTraits from '../containers/PlayerTraits';
import Progression from '../containers/Progression';

/**
 * Interface for CharacterPanel props
 */
interface CharacterPanelProps {
  /** Optional player name to display */
  playerName?: string;
}

/**
 * CharacterPanel Component
 * 
 * Displays a comprehensive view of the player's character including
 * stats, traits, and progression information.
 * 
 * @param props Component props
 * @returns CharacterPanel component
 */
const CharacterPanel: React.FC<CharacterPanelProps> = ({ playerName = 'Character' }) => {
  return (
    <Paper 
      elevation={2} 
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
      
      <Box sx={{ mb: 3 }}>
        <StatDisplay />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <PlayerTraits />
      </Box>
      
      <Box>
        <Progression />
      </Box>
    </Paper>
  );
};

export default CharacterPanel;
