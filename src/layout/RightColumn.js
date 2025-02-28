import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import InventoryList from '../components/InventoryList';

const RightColumn = ({ components }) => {
  const renderComponent = (componentId) => {
    switch (componentId) {
      case 'InventoryList':
        return <InventoryList />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }} elevation={3}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Inventory
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

export default RightColumn;
