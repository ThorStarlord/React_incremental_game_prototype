import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import PlayerStats from './PlayerStats';
import './LeftColumn.css';

const LeftColumn = () => {
  return (
    <Box id="left-column" className="column">
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Left Column</Typography>
      </Paper>
      {/* PlayerStats module integration into LeftColumn */}
      <Box mt={2} className="player-stats-container">
        <PlayerStats />
      </Box>
    </Box>
  );
};

export default LeftColumn;
