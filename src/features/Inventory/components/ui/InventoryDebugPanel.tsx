import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useAppDispatch } from '../../../../app/hooks';
import { addItem } from '../../state/InventorySlice';

const InventoryDebugPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleAddItem = () => {
    dispatch(addItem({ itemId: 'item_sunstone', quantity: 1 }));
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Inventory Debug</Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleAddItem}>
          Add Sunstone
        </Button>
      </Box>
    </Paper>
  );
};

export default InventoryDebugPanel;
