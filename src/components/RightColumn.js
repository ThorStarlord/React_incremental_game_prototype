import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FactionContainer from './FactionUI/FactionContainer';
import PlayerTraits from './PlayerTraits';
import './RightColumn.css';

const RightColumn = () => {
  return (
    <Box id="right-column" className="column">
      <Paper elevation={3} className="column-paper" style={{ marginBottom: '16px' }}>
        <Typography variant="h6" align="center">Faction Information</Typography>
        <FactionContainer />
      </Paper>
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Player Traits</Typography>
        <PlayerTraits />
      </Paper>
    </Box>
  );
};

export default RightColumn;
