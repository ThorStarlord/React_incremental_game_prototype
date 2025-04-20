import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'; // Use typed hooks
import { Grid } from '@mui/material';
import TraitList from '../ui/TraitList';
import TraitSlotsContainer from './TraitSlotsContainer';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';

// Import from Redux store
import { RootState } from '../../../../app/store';
import { selectPlayerLevel, selectPlayerTraitSlots } from '../../../Player/state/PlayerSelectors';
import { unlockTraitSlotThunk } from '../../../Player/state/PlayerThunks';
import { selectEssenceAmount, spendEssence } from '../../../Essence/state/EssenceSlice';
import {
  fetchTraitsThunk,
  makeTraitPermanentThunk // Keep if TraitSlots uses it
} from '../../state/TraitThunks';
import {
  equipTrait,
  unequipTrait,
  selectTraits,
  selectTraitSlots as selectTraitSliceSlots, // Alias to avoid naming conflict
} from '../../state/TraitsSlice'; // Import actions and selectors from Traits slice
// Import object selectors from the correct file
import {
  selectEquippedTraitObjects,
  selectAvailableTraitObjects,
  selectAcquiredTraitObjects // Need this for TraitList if it shows all acquired
} from '../../state/TraitsSelectors';
// Import Trait and TraitEffect types
import { Trait, TraitSlot as StateTraitSlot, TraitEffect } from '../../state/TraitsTypes'; 

/**
 * TraitSystemWrapper Component (Renamed from TraitFeatureView)
 *
 * Manages the trait system UI, coordinating between trait list and trait slots components using Redux.
 *
 * @returns {JSX.Element} The rendered component
 */
const TraitSystemWrapper: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store using selectors
  const playerLevel = useAppSelector(selectPlayerLevel);
  const allTraits = useAppSelector(selectTraits); // All defined traits
  const acquiredTraitsObjects = useAppSelector(selectAcquiredTraitObjects); // Acquired Trait objects
  const equippedTraitsObjects = useAppSelector(selectEquippedTraitObjects); // Equipped Trait objects
  const availableTraitsObjects = useAppSelector(selectAvailableTraitObjects); // Available Trait objects
  const traitSlotsData = useAppSelector(selectTraitSliceSlots); // TraitSlot[] from traits slice
  const playerTraitSlotsCount = useAppSelector(selectPlayerTraitSlots); // Number of slots from player slice
  const essence = useAppSelector(selectEssenceAmount);
  const traitPoints = 0; // Placeholder

  // Fetch traits if not already loaded
  useEffect(() => {
    if (Object.keys(allTraits).length === 0) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraits]);

  // --- Event Handlers ---
  const handleEquipTrait = (traitId: string, slotIndex?: number): void => {
    dispatch(equipTrait({ traitId, slotIndex }));
  };

  const handleUnequipTrait = (traitId: string): void => {
    dispatch(unequipTrait(traitId));
  };

  const handleUpgradeSlot = (cost: number): void => {
    if (essence >= cost) {
        dispatch(unlockTraitSlotThunk(cost));
    } else {
        console.warn("Not enough essence to upgrade trait slot");
    }
  };

  const handleTraitLevelUp = (traitId: string): void => {
    console.log(`Level up requested for trait: ${traitId}`);
  };

  // --- Prepare Props for Child Components ---

  // Props for TraitList
  const traitListProps = {
    traits: acquiredTraitsObjects.map(trait => ({
      id: trait.id,
      name: trait.name,
      level: trait.level || 1,
      description: trait.description,
      // Add type annotation for 'e' and type check for 'v'
      effect: Array.isArray(trait.effects)
        ? trait.effects.map((e: TraitEffect) => `${e.type}: ${e.magnitude > 0 ? '+' : ''}${e.magnitude}`).join(', ')
        : typeof trait.effects === 'object'
        ? Object.entries(trait.effects).map(([k, v]) => `${k}: ${typeof v === 'number' && v > 0 ? '+' : ''}${v}`).join(', ')
        : 'No effects',
      cost: trait.essenceCost || 0,
      // Pass the category as 'type' for TraitList/TraitPanel if needed
      type: trait.category 
    })),
    onTraitLevelUp: handleTraitLevelUp,
    pointsAvailable: traitPoints,
  };

  return (
    <TraitSystemErrorBoundary>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          {/* Pass the correctly typed props */}
          <TraitList {...traitListProps} />
        </Grid>
        <Grid item xs={12} md={5}>
          <TraitSlotsContainer />
        </Grid>
      </Grid>
    </TraitSystemErrorBoundary>
  );
};

export default TraitSystemWrapper;
