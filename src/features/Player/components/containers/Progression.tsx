import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../app/hooks';
import { RootState } from '../../../../app/store';
import { selectTraitSlots } from '../../../Traits/state/TraitsSlice';

/**
 * Displays player progression information
 * Focuses on trait slots and other non-level based progression
 */
const Progression: React.FC = () => {
  // Use typed selectors to access state from slices
  const traitSlots = useSelector((state: RootState) => state.player.traitSlots || 0);
  const equippedTraits = useSelector(
    (state: RootState) => state.traits.slots
      .filter(slot => slot.isUnlocked && slot.traitId)
      .map(slot => slot.traitId as string)
  );
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Character Progress</Typography>
      
      <Paper sx={{ p: 2 }}>
        {/* Trait slots */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Trait Slots:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {equippedTraits.length} / {traitSlots} used
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Progression;
