import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const InventoryList = () => {
  // This is a placeholder implementation
  return (
    <Box>
      <List>
        <ListItem>
          <ListItemText primary="Empty inventory" secondary="Add items here" />
        </ListItem>
      </List>
    </Box>
  );
};

export default InventoryList;