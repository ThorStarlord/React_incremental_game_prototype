import React from 'react'; // Removed useEffect
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Box, Typography, Grid, Alert, CircularProgress } from '@mui/material'; // Added Alert, CircularProgress
import { 
    selectAvailableTraitObjectsForEquip, 
    selectAvailableTraitSlotCount,
    selectTraitLoading, // Import loading selector
    selectTraitError    // Import error selector
} from '../../state/TraitsSelectors'; 
import { equipTrait } from '../../../Player/state/PlayerSlice'; // Import from PlayerSlice
import { selectTraitSlots } from '../../../Player/state/PlayerSelectors'; // Import selectTraitSlots
import TraitCard from '../ui/TraitCard';

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  const availableTraits = useAppSelector(selectAvailableTraitObjectsForEquip);
  const availableSlotCount = useAppSelector(selectAvailableTraitSlotCount);
  const playerTraitSlots = useAppSelector(selectTraitSlots); // Get player trait slots

  // Select loading and error states
  const isLoading = useAppSelector(selectTraitLoading); // Use the selector
  const error = useAppSelector(selectTraitError);       // Use the selector

  // --- Add sampleTrait to the available traits list ---
  const sampleTrait = {
    id: 'sample_trait',
    name: 'Sample Trait',
    description: 'A demonstration trait for testing.',
    category: 'Test',
    effects: { testEffect: 1 },
    rarity: 'common',
    essenceCost: 0,
    // Add any other required fields for TraitCard
  };

  // Merge sampleTrait into the availableTraits array if not already present
  const traitsToShow = [
    ...availableTraits,
    ...(!availableTraits.some(t => t.id === sampleTrait.id) ? [sampleTrait] : [])
  ];

  const handleEquip = (traitId: string) => {
    // Optional: Add check here based on availableSlotCount before dispatching
    if (availableSlotCount > 0) {
      const availableSlot = playerTraitSlots.find(slot => slot.isUnlocked && !slot.traitId);
      if (availableSlot) {
        dispatch(equipTrait({ traitId, slotIndex: availableSlot.index }));
      } else {
        console.warn("No available slots to equip trait (this should not happen if availableSlotCount > 0).");
      }
    } else {
       console.warn("Attempted to equip trait with no available slots.");
       // Optionally show a user notification
    }
  };

  // --- Add Loading State ---
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography color="text.secondary">Loading Available Traits...</Typography>
      </Box>
    );
  }

  // --- Add Error State ---
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 1 }}>
        Error loading traits: {error}
      </Alert>
    );
  }

  // --- Add Empty State (after loading/error checks) ---
  if (!isLoading && !error && traitsToShow.length === 0) {
     return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Available Traits
            </Typography>
            <Alert severity="info" sx={{ mt: 1 }}>
               You have no traits available to equip right now. Discover or acquire more traits.
            </Alert>
        </Box>
     )
  }

  // --- Original Render Logic (only runs if not loading, no error, and traits exist) ---
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Available Traits ({traitsToShow.length})
      </Typography>
      <Grid container spacing={2}>
        {traitsToShow.map((trait) => (
          <Grid item xs={12} sm={6} md={4} key={trait.id}>
            <TraitCard
              trait={trait}
              canEquip={availableSlotCount > 0}
              showEquipButton={true}
              onEquip={() => handleEquip(trait.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableTraitList;
