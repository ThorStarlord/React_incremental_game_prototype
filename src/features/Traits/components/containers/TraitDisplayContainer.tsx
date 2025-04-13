/**
 * @file TraitDisplayContainer.tsx
 * @description Container component for displaying player traits in the right sidebar.
 * Connects to the Redux store to fetch trait data and passes it to the UI component.
 */
import React from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectAcquiredTraits, selectEquippedTraitIds, selectTraits } from '../../state/TraitsSlice';

/**
 * TraitDisplayContainer Component
 *
 * Fetches trait data from the Redux store and renders a simple trait display
 * for the sidebar. Shows equipped traits and available traits.
 */
const TraitDisplayContainer: React.FC = () => {
  // Select the necessary data from the Redux store
  const allTraits = useAppSelector(selectTraits);
  const acquiredTraitIds = useAppSelector(selectAcquiredTraits);
  const equippedTraitIds = useAppSelector(selectEquippedTraitIds);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Traits</Typography>
      
      {/* Equipped Traits Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Equipped Traits ({equippedTraitIds.length})
        </Typography>
        
        {equippedTraitIds.length > 0 ? (
          equippedTraitIds.map(traitId => {
            const trait = allTraits[traitId];
            return trait ? (
              <Box key={traitId} sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight="medium">{trait.name}</Typography>
                <Typography variant="caption" color="text.secondary">{trait.description.substring(0, 60)}...</Typography>
              </Box>
            ) : null;
          })
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
          label={`${acquiredTraitIds.length - equippedTraitIds.length} available`} 
        />
      </Box>
    </Paper>
  );
};

export default TraitDisplayContainer;