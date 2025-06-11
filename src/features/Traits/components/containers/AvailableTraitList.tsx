import React from 'react';
import { Box, CircularProgress, Grid, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { 
    selectAvailableTraitObjectsForEquip, 
    selectAvailableTraitSlotCount,
    selectTraitLoading,
    selectTraitError
} from '../../state/TraitsSelectors'; 
import { equipTrait } from '../../../Player/state/PlayerSlice';
import { selectTraitSlots } from '../../../Player/state/PlayerSelectors';
import TraitCard from '../ui/TraitCard';

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  const availableTraits = useAppSelector(selectAvailableTraitObjectsForEquip);
  const availableSlotCount = useAppSelector(selectAvailableTraitSlotCount);
  const playerTraitSlots = useAppSelector(selectTraitSlots);

  // Select loading and error states
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);

  // --- Add sampleTrait to the available traits list ---
  const sampleTrait = {
    id: 'sample_trait',
    name: 'Sample Trait',
    description: 'A demonstration trait for testing.',
    category: 'Test',
    effects: { testEffect: 1 },
    rarity: 'common',
    essenceCost: 0,
  };

  // Merge sampleTrait into the availableTraits array if not already present
  const traitsToShow = [
    ...availableTraits,
    ...(!availableTraits.some(t => t.id === sampleTrait.id) ? [sampleTrait] : [])
  ];

  const handleEquip = (traitId: string) => {
    if (availableSlotCount > 0) {
      const availableSlot = playerTraitSlots.find(slot => slot.isUnlocked && !slot.traitId);
      if (availableSlot) {
        dispatch(equipTrait({ traitId, slotIndex: availableSlot.index }));
      } else {
        console.warn("No available slots to equip trait (this should not happen if availableSlotCount > 0).");
      }
    } else {
       console.warn("Attempted to equip trait with no available slots.");
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
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

  // Handle empty state
  if (traitsToShow.length === 0) {
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
        Available Traits ({availableSlotCount} slots available)
      </Typography>
      
      {availableSlotCount === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            No available trait slots. Unlock more slots or unequip traits to equip new ones.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        {traitsToShow.map((trait) => (
          <Grid item xs={12} sm={6} md={4} key={trait.id}>
            <TraitCard
              trait={trait}
              onEquip={() => handleEquip(trait.id)}
              canEquip={availableSlotCount > 0}
              showEquipButton={true}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableTraitList;
