import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useAppDispatch } from '../../../../app/hooks';
import { addItem } from '../../state/InventorySlice';

const InventoryDebugPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleAddItem = (itemId: string) => {
    dispatch(addItem({ itemId, quantity: 1 }));
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Inventory Debug</Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={() => handleAddItem('item_ancient_relic')}>
          Add Ancient Relic
        </Button>
        <Button variant="contained" onClick={() => handleAddItem('item_glowing_crystal')}>
          Add Glowing Crystal
        </Button>
      </Box>
    </Paper>
  );
};

export default InventoryDebugPanel;
