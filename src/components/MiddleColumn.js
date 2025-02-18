import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Battle from './Battle';
import './MiddleColumn.css';

const MiddleColumn = () => {
  return (
    <Box id="middle-column" className="column">
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Battle Module</Typography>
        <Battle />
      </Paper>
    </Box>
  );
};

export default MiddleColumn;
