import React, { useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { Grid } from '@mui/material';
import TraitList from '../ui/TraitList';
import TraitSlotsContainer from './TraitSlotsContainer';
import TraitSystemErrorBoundary from './TraitSystemErrorBoundary';

// Import selectors and actions
import { selectPlayer } from '../../../Player/state/PlayerSelectors';
import { selectCurrentEssence } from '../../../Essence/state/EssenceSelectors';
import { fetchTraitsThunk } from '../../state/TraitThunks';
// FIXED: Changed the import path for selectTraits
import { selectTraits, selectAcquiredTraitObjects } from '../../state/TraitsSelectors';
import { TraitEffect } from '../../state/TraitsTypes';

/**
 * TraitSystemWrapper Component
 *
 * Manages the trait system UI, coordinating between trait list and trait slots components using Redux.
 * Follows Feature-Sliced Design principles and React best practices.
 *
 * @returns {JSX.Element} The rendered component
 */
const TraitSystemWrapper: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();

  // Select required data from Redux store
  const player = useAppSelector(selectPlayer);
  const allTraits = useAppSelector(selectTraits); // This import is now correct
  const acquiredTraitsObjects = useAppSelector(selectAcquiredTraitObjects);
  const currentEssence = useAppSelector(selectCurrentEssence);

  // Fetch traits if not already loaded
  useEffect(() => {
    if (Object.keys(allTraits).length === 0) {
      dispatch(fetchTraitsThunk());
    }
  }, [dispatch, allTraits]);

  // Memoized trait level up handler
  const handleTraitLevelUp = useCallback((traitId: string): void => {
    console.log(`Level up requested for trait: ${traitId}`);
    // TODO: Implement trait level up logic
  }, []);

  // Format trait effects for display
  const formatTraitEffects = useCallback((effects: unknown): string => {
    if (!effects) return 'No effects';
    if (Array.isArray(effects)) {
      return effects
        .map((e: TraitEffect) => `${e.type}: ${e.magnitude > 0 ? '+' : ''}${e.magnitude}`)
        .join(', ');
    }
    
    if (typeof effects === 'object' && effects !== null) {
      return Object.entries(effects)
        .map(([key, value]) => {
          const formattedValue = typeof value === 'number' && value > 0 ? `+${value}` : String(value);
          return `${key}: ${formattedValue}`;
        })
        .join(', ');
    }
    
    return 'No effects';
  }, []);

  // Prepare props for TraitList component
  const traitListProps = useMemo(() => ({
    traits: acquiredTraitsObjects.map(trait => ({
      id: trait.id,
      name: trait.name,
      level: trait.level || 1,
      description: trait.description || '',
      effect: formatTraitEffects(trait.effects),
      cost: trait.essenceCost || 0,
      type: trait.category || 'unknown'
    })),
    onTraitLevelUp: handleTraitLevelUp,
    pointsAvailable: 0,
  }), [acquiredTraitsObjects, formatTraitEffects, handleTraitLevelUp]);

  return (
    <TraitSystemErrorBoundary>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <TraitList {...traitListProps} />
        </Grid>
        <Grid item xs={12} md={5}>
          <TraitSlotsContainer />
        </Grid>
      </Grid>
    </TraitSystemErrorBoundary>
  );
});

TraitSystemWrapper.displayName = 'TraitSystemWrapper';

export default TraitSystemWrapper;