/**
 * @file TraitDisplayContainer.tsx
 * @description Container component for displaying player traits in the right sidebar.
 * Connects to the Redux store to fetch trait data and passes it to the UI component.
 */
import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
// FIXED: Importing selectors from the correct file: TraitsSelectors.ts
import {
  selectTraits,
  selectAcquiredTraits, // This selector gives IDs of all known traits // This gives full objects of equipped traits
} from '../../state/TraitsSelectors';
import { selectEquippedTraits } from '../../../Player/state/PlayerSelectors'; // This gives full objects of equipped traits
import { fetchTraitsThunk } from '../../state/TraitThunks';
import { Trait } from '../../state/TraitsTypes'; // Import the Trait type

/**
 * TraitDisplayContainer Component
 *
 * Fetches trait data from the Redux store and renders a simple trait display
 * for the sidebar. Shows equipped traits and available traits.
 */
const TraitDisplayContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTraitsThunk());
  }, [dispatch]);

  // Select the necessary data from the Redux store
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraitIds = useAppSelector(selectAcquiredTraits);
  const equippedTraits = useAppSelector(selectEquippedTraits); // This is an array of Trait objects

  // Memoize the IDs of equipped traits for easy lookup
  const equippedTraitIds = useMemo(() => equippedTraits.map(trait => trait.id), [equippedTraits]);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Traits</Typography>
      
      {/* Equipped Traits Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Equipped Traits ({equippedTraits.length})
        </Typography>
        
        {equippedTraits.length > 0 ? (
          // We already have the full Trait objects, so we can map directly
          equippedTraits.map((trait: Trait) => (
            <Box key={trait.id} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">{trait.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {trait.description.substring(0, 60)}...
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No traits equipped
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Available Traits Count */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Available Traits
        </Typography>
        <Chip 
          size="small"
          // Calculate available by subtracting equipped from total acquired
          label={`${acquiredTraitIds.length - equippedTraitIds.length} available`} 
        />
      </Box>
    </Paper>
  );
};

export default TraitDisplayContainer;