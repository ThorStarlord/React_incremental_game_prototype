import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import TraitListUI from '../ui/TraitList'; // Renamed import to avoid naming conflict
import {
  selectTraits, // Changed selector
  selectTraitLoading,
  selectTraitError,
} from '../../state/TraitsSelectors';
import { fetchTraitsThunk } from '../../state/TraitThunks';
import { TraitEffect, Trait } from '../../state/TraitsTypes'; // Import Trait type

/**
 * Container component for displaying the list of all defined traits.
 * Fetches data, handles loading/error states, and passes props to the UI component.
 */
const TraitListContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select data from Redux store
  const allTraitsData = useAppSelector(selectTraits); // Use selectTraits
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const allTraitsLoaded = useAppSelector(
    (state) => Object.keys(state.traits.traits).length > 0,
  );

  // Fetch traits if not already loaded
  useEffect(() => {
    if (!allTraitsLoaded && !isLoading) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraitsLoaded, isLoading]);

  // Handler for leveling up a trait (placeholder logic, less relevant here)
  const handleTraitLevelUp = (traitId: string) => {
    console.log(`Level up action triggered for trait (display only): ${traitId}`);
    // This container primarily displays all traits; leveling logic might belong elsewhere.
  };

  // Prepare props for TraitListUI
  // Map the core Trait objects from the Record<string, Trait>
  const traitListProps = {
    // Iterate over Object.values to get an array of Trait objects
    traits: Object.values(allTraitsData).map((trait: Trait) => ({
      id: trait.id,
      name: trait.name,
      level: trait.level || 1, // Default level if not present
      description: trait.description,
      // Format effects based on their structure
      effect: Array.isArray(trait.effects)
        ? trait.effects
            .map(
              (e: TraitEffect) =>
                `${e.type}: ${e.magnitude > 0 ? '+' : ''}${e.magnitude}`,
            )
            .join(', ')
        : typeof trait.effects === 'object' && trait.effects !== null // Check if it's a non-null object
          ? Object.entries(trait.effects)
              .map(
                ([k, v]) =>
                  `${k}: ${typeof v === 'number' && v > 0 ? '+' : ''}${v}`,
              )
              .join(', ')
          : 'No effects', // Handle cases where effects might be missing or not an array/object
      cost: trait.essenceCost || 0, // Use essenceCost or a default
      type: trait.category,
    })),
    onTraitLevelUp: handleTraitLevelUp,
    pointsAvailable: 0, // Set pointsAvailable to 0 as leveling isn't the focus here
  };

  // --- Loading State ---
  if (isLoading && !allTraitsLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography color="text.secondary">Loading Traits...</Typography>
      </Box>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 1 }}>
        Error loading traits: {error}
      </Alert>
    );
  }

  // --- Render Trait List UI ---
  // Pass the prepared props to the UI component
  return <TraitListUI {...traitListProps} />;
};

export default TraitListContainer;
