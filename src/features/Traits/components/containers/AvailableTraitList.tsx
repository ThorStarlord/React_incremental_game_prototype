import React from 'react';
import { Box, CircularProgress, Grid, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
// FIXED: Importing the correct selectors.
import {
    selectAcquiredTraitObjects, // This gets all traits the player knows.
    selectAvailableTraitSlotCount,
    selectTraitLoading,
    selectTraitError
} from '../../state/TraitsSelectors';
import { equipTrait } from '../../../Player/state/PlayerSlice';
// FIXED: Changed to the correct selector name.
import { selectPlayerTraitSlots } from '../../../Player/state/PlayerSelectors';
import TraitCard from '../ui/TraitCard';
import { Trait } from '../../state/TraitsTypes'; // Import the Trait type

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  // FIXED: Use the correct selector for available traits.
  const acquiredTraits = useAppSelector(selectAcquiredTraitObjects);
  const availableSlotCount = useAppSelector(selectAvailableTraitSlotCount);
  // FIXED: Use the correct selector.
  const playerTraitSlots = useAppSelector(selectPlayerTraitSlots);
  const equippedTraitIds = playerTraitSlots.filter(s => s.traitId).map(s => s.traitId);

  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  
  // Filter out already equipped traits to get the truly "available" ones for equipping
  const availableTraits = React.useMemo(() => {
    return acquiredTraits.filter(trait => !equippedTraitIds.includes(trait.id));
  }, [acquiredTraits, equippedTraitIds]);


  const handleEquip = (traitId: string) => {
    if (availableSlotCount > 0) {
      // FIXED: Correctly find an available slot.
      const availableSlot = playerTraitSlots.find(slot => !slot.isLocked && !slot.traitId);
      if (availableSlot) {
        dispatch(equipTrait({ traitId, slotIndex: availableSlot.slotIndex }));
      } else {
        console.warn("No available slots to equip trait.");
      }
    } else {
       console.warn("Attempted to equip trait with no available slots.");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          <Typography variant="body2">
            Error loading traits: {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (availableTraits.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="text.secondary">
          No traits available for equipping.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Available Traits ({availableSlotCount} slots open)
      </Typography>
      
      {availableSlotCount === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            No available trait slots. Unlock more slots or unequip traits to equip new ones.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        {availableTraits.map((trait: Trait) => (
          <Grid item xs={12} sm={6} md={4} key={trait.id}>
            {/* FIXED: Passing the correct props to TraitCard */}
            <TraitCard
              trait={trait}
              onUnequip={() => handleEquip(trait.id)} // This will be the "Equip" button
              showUnequipButton={true} // Re-purposing this button as "Equip"
              unequipButtonText="Equip" // Added a prop to change button text
              unequipButtonColor="primary" // Change color for equip action
              canUnequip={availableSlotCount > 0} // Button is enabled if slots are available
              currentEssence={0} // Not needed for this action
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableTraitList;