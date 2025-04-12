import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { addManualEssence } from '../../features/Essence/state/EssenceSlice';

/**
 * Mock component for the Middle Column content area.
 * Includes the manual essence generation button as required by REQ-UI-004.
 */
const MockMiddleContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleAddEssenceClick = () => {
    dispatch(addManualEssence(10)); // Dispatch action to add 10 essence
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Main Game Area
      </Typography>
      <Typography paragraph color="text.secondary">
        This is the central content area. Game views like the World Map, Town View, Dungeons, etc., will be rendered here in the future.
      </Typography>
      <Button variant="contained" onClick={handleAddEssenceClick}>
        Add 10 Essence (Test)
      </Button>
    </Box>
  );
};

export default MockMiddleContent;
