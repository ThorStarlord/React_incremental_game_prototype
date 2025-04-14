import React from 'react'; // Removed useEffect
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Box, Typography, Grid, Alert, CircularProgress } from '@mui/material'; // Added Alert, CircularProgress
import { 
    selectAvailableTraitObjectsForEquip, 
    selectAvailableTraitSlotCount,
    selectTraitLoading, // Import loading selector
    selectTraitError    // Import error selector
} from '../../state/TraitsSelectors'; 
import { equipTrait } from '../../state/TraitsSlice';
import TraitCard from '../ui/TraitCard';

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  const availableTraits = useAppSelector(selectAvailableTraitObjectsForEquip);
  const availableSlotCount = useAppSelector(selectAvailableTraitSlotCount);

  // Select loading and error states
  const isLoading = useAppSelector(selectTraitLoading); // Use the selector
  const error = useAppSelector(selectTraitError);       // Use the selector

  const handleEquip = (traitId: string) => {
    // Optional: Add check here based on availableSlotCount before dispatching
    if (availableSlotCount > 0) {
       dispatch(equipTrait({ traitId }));
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
  if (!isLoading && !error && availableTraits.length === 0) {
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
        Available Traits ({availableTraits.length})
      </Typography>
      <Grid container spacing={2}>
        {availableTraits.map((trait) => (
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
