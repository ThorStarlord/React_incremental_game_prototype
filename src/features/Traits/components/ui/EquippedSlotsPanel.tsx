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
        Expressed Trait Slots
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Expression slots determine which available Trait patterns are currently manifested. Discovered patterns can be tried temporarily; stabilized patterns stay in your assimilated library and can be expressed or suppressed freely. Sharing projects a currently expressed pattern without transferring ownership.
      </Typography>

      {/* Integration Point for TraitSlotsContainer */}
      <Box sx={{ mb: 3 }}>
        <TraitSlotsContainer />
      </Box>

      {/* Helpful Information */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>Trait Slot Tips</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Empty Slots:</strong> Click to express an available Trait
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Expressed Traits:</strong> Click to suppress and free the slot
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • <strong>Locked Slots:</strong> Unlock automatically as Resonance Level increases
        </Typography>
        <Typography variant="body2">
          • <strong>Assimilated Traits:</strong> Stay permanently available but affect active play only while expressed
        </Typography>
      </Alert>
    </Box>
  );
});

EquippedSlotsPanel.displayName = 'EquippedSlotsPanel';
export default EquippedSlotsPanel;