import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface TurnIndicatorProps {
  isPlayerTurn: boolean;
}

/**
 * TurnIndicator Component
 * 
 * Displays whose turn it is in combat.
 */
const TurnIndicator: React.FC<TurnIndicatorProps> = ({ isPlayerTurn }) => {
  return (
    <Paper 
      sx={{ 
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        px: 2,
        py: 0.5,
        textAlign: 'center',
        bgcolor: isPlayerTurn ? 'primary.main' : 'error.main',
        color: 'white',
        borderRadius: 2
      }}
    >
      <Typography variant="subtitle2">
        {isPlayerTurn ? 'Your Turn' : 'Enemy Turn'}
      </Typography>
    </Paper>
  );
};

export default TurnIndicator;
