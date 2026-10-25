import React from 'react';
import { Box, CircularProgress, Grid, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
// FIXED: Importing the correct selectors without duplicates
import {
    selectDiscoveredTraitObjects,
    selectTraitLoading,
    selectTraitError,
    selectTraits
} from '../../state/TraitsSelectors';
import { expressTrait } from '../../../Player/state/PlayerSlice';
// FIXED: Use correct selector name - selectAvailableTraitSlots (not selectAvailableTraitSlotCount)
import {
  selectAssimilatedTraitIds,
  selectPlayerTraitSlots,
  selectAvailableTraitSlots,
} from '../../../Player/state/PlayerSelectors';
import TraitCard from '../ui/TraitCard';
import { Trait } from '../../state/TraitsTypes'; // Import the Trait type

const AvailableTraitList: React.FC = () => {
  const dispatch = useAppDispatch();
  const acquiredTraits = useAppSelector(selectDiscoveredTraitObjects);
  const assimilatedTraitIds = useAppSelector(selectAssimilatedTraitIds);
  const allTraits = useAppSelector(selectTraits);
  // FIXED: Use the correct selector name
  const availableSlotCount = useAppSelector(selectAvailableTraitSlots);
  const playerTraitSlots = useAppSelector(selectPlayerTraitSlots);
  const equippedTraitIds = playerTraitSlots.filter(s => s.traitId).map(s => s.traitId);

  const isLoading = useAppSelector(selectTraitLoading);
  const error = useAppSelector(selectTraitError);
  
  // Migrated assimilated Traits remain available even when old discovery
  // metadata did not include them.
  const availableTraits = React.useMemo(() => {
    const candidateIds = new Set([
      ...acquiredTraits.map(trait => trait.id),
      ...assimilatedTraitIds,
    ]);
    return Array.from(candidateIds)
      .map(traitId => allTraits[traitId])
      .filter((trait): trait is Trait => Boolean(trait))
      .filter(trait => !equippedTraitIds.includes(trait.id));
  }, [acquiredTraits, assimilatedTraitIds, allTraits, equippedTraitIds]);


  const handleEquip = (traitId: string) => {
    if (availableSlotCount > 0) {
      // FIXED: Correctly find an available slot.
      const availableSlot = playerTraitSlots.find(slot => !slot.isLocked && !slot.traitId);
      if (availableSlot) {
        dispatch(expressTrait({ traitId, slotIndex: availableSlot.slotIndex }));
      } else {
        console.warn("No available expression slots.");
      }
    } else {
       console.warn("Attempted to express Trait with no available slots.");
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
          No Traits are currently available to express.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Available to Express ({availableSlotCount} slots open)
      </Typography>
      
      {availableSlotCount === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            No expression slots are open. Unlock more slots or suppress a currently expressed Trait.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        {availableTraits.map((trait: Trait) => (
          <Grid item xs={12} sm={6} md={4} key={trait.id}>
            {/* FIXED: Passing the correct props to TraitCard */}
            <TraitCard
              trait={trait}
              onUnequip={() => handleEquip(trait.id)} // Compatibility action prop used as the Express button
              showUnequipButton={true} // Re-purposing this button as "Equip"
              unequipButtonText="Express"
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