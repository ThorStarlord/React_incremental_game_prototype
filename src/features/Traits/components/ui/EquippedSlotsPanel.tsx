import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { TraitSlotsContainer } from '../containers/TraitSlotsContainer';

/**
 * EquippedSlotsPanel - UI component for displaying and managing equipped trait slots
 * 
 * This component provides a clean interface for the trait slot management system,
 * wrapping the TraitSlotsContainer with appropriate layout and styling.
 */
const EquippedSlotsPanel: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Equipped Traits
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage your active trait slots. Click empty slots to equip traits, or click equipped traits to unequip them.
          </Typography>
          
          <Box mt={2}>
            <TraitSlotsContainer />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EquippedSlotsPanel;