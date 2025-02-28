import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PlayerStats from '../PlayerStats';

const LeftColumn = ({ components }) => {
  const renderComponent = (componentId) => {
    switch (componentId) {
      case 'PlayerStats':
        return <PlayerStats />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'visible'
        }}
        elevation={3}
      >
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Character
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {components.map((componentId) => (
            <div key={componentId}>
              {renderComponent(componentId)}
            </div>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default LeftColumn;
