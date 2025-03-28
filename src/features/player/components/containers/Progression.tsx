import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useGameState } from '../../../../context/GameStateContext';

/**
 * Displays player progression information
 * Focuses on trait slots, attribute points, and other non-level based progression
 */
const Progression: React.FC = () => {
  const { player } = useGameState();
  
  // Get trait slots data
  const traitSlots = player?.traitSlots || 0;
  const equippedTraits = player?.equippedTraits?.length || 0;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Character Progress</Typography>
      
      <Paper sx={{ p: 2 }}>
        {/* Trait slots */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Trait Slots:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {equippedTraits} / {traitSlots} used
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Attribute points section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Attribute Points:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {player?.attributePoints || 0}
          </Typography>
        </Box>
        
        {(player?.attributePoints ?? 0) > 0 && (
          <Box sx={{ 
            p: 1.5, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            borderRadius: 1,
            mt: 2
          }}>
            <Typography variant="body2" fontWeight="medium">
              You have attribute points to spend! Improve your character's abilities.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Progression;
