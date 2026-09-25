import React from 'react';
import { Box, Typography, Alert, AlertTitle } from '@mui/material';
import { Inventory2 } from '@mui/icons-material';
import TraitSlotsContainer from '../containers/TraitSlotsContainer';

/**
 * EquippedSlotsPanel Component
 *
 * Wrapper component for trait slot management functionality.
 * Integrates the TraitSlotsContainer for slot visualization and interaction.
 */
const EquippedSlotsPanel: React.FC = React.memo(() => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Inventory2 color="primary" />
        Equipped Trait Slots
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use slots to try discovered, non-permanent Traits and make selected Traits available for sharing. Permanent Traits no longer need a slot; Doctrine owns current late-game specialization.
      </Typography>

      {/* Integration Point for TraitSlotsContainer */}
      <Box sx={{ mb: 3 }}>
        <TraitSlotsContainer />
      </Box>

      {/* Helpful Information */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>Trait Slot Tips</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Empty Slots:</strong> Click to equip available traits
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Equipped Traits:</strong> Click to unequip and free the slot
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Locked Slots:</strong> Unlock automatically as Resonance Level increases
        </Typography>
        <Typography variant="body2">
          • <strong>Permanent Traits:</strong> Do not require slots, remain active, and are no longer shared from Player slots
        </Typography>
      </Alert>
    </Box>
  );
});

EquippedSlotsPanel.displayName = 'EquippedSlotsPanel';
export default EquippedSlotsPanel;