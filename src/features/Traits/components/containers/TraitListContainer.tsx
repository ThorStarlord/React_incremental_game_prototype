import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import TraitListUI from '../ui/TraitList'; // Renamed import to avoid naming conflict
import {
  selectAcquiredTraitObjects,
  selectTraitLoading,
  selectTraitError,
} from '../../state/TraitsSelectors';
import { selectPlayerSkillPoints } from '../../../Player/state/PlayerSelectors';
import { fetchTraitsThunk } from '../../state/TraitThunks';
import { TraitEffect } from '../../state/TraitsTypes'; // Import TraitEffect if needed

/**
 * Container component for displaying the list of acquired traits.
 * Fetches data, handles loading/error states, and passes props to the UI component.
 */
const TraitListContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select data from Redux store
  const acquiredTraitsObjects = useAppSelector(selectAcquiredTraitObjects);
  const traitPoints = useAppSelector(selectPlayerSkillPoints); // Assuming skill points are used for leveling
  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  const allTraitsLoaded = useAppSelector(
    (state) => Object.keys(state.traits.traits).length > 0,
  ); // Check if base traits are loaded

  // Fetch traits if not already loaded
  useEffect(() => {
    if (!allTraitsLoaded && !isLoading) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraitsLoaded, isLoading]);

  // Handler for leveling up a trait (placeholder logic)
  const handleTraitLevelUp = (traitId: string) => {
    console.log(`Level up requested for trait: ${traitId}`);
    // TODO: Dispatch a thunk or action to handle trait leveling
    // Example: dispatch(levelUpTraitThunk({ traitId, cost: calculatedCost }));
  };

  // Prepare props for TraitListUI
  // Map the core Trait objects to the structure expected by TraitListUI
  const traitListProps = {
    traits: acquiredTraitsObjects.map((trait) => ({
      id: trait.id,
      name: trait.name,
      level: trait.level || 1,
      description: trait.description,
      // Format effects based on their structure
      effect: Array.isArray(trait.effects)
        ? trait.effects
            .map(
              (e: TraitEffect) =>
                `${e.type}: ${e.magnitude > 0 ? '+' : ''}${e.magnitude}`,
            )
            .join(', ')
        : typeof trait.effects === 'object'
          ? Object.entries(trait.effects)
              .map(
                ([k, v]) =>
                  `${k}: ${typeof v === 'number' && v > 0 ? '+' : ''}${v}`,
              )
              .join(', ')
          : 'No effects',
      cost: trait.essenceCost || 0, // Or a specific level-up cost if defined
      type: trait.category,
    })),
    onTraitLevelUp: handleTraitLevelUp,
    pointsAvailable: traitPoints,
  };

  // --- Loading State ---
  if (isLoading && !allTraitsLoaded) {
    // Show loading only if base traits aren't loaded yet
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
