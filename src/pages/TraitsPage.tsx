import React from 'react';
import { Box, Grid, Container, Typography } from '@mui/material'; // Import Container and Typography
import TraitSlots from '../features/Traits/components/containers/TraitSlots';
import AvailableTraitList from '../features/Traits/components/containers/AvailableTraitList'; // Import AvailableTraitList

/**
 * @fileoverview TraitsPage Component - Manages and displays character traits
 * @module TraitsPage
 */

/**
 * TraitsPage Component
 * 
 * @description Renders the trait management interface of the Incremental RPG game.
 * This component allows players to view available traits and assign them to trait slots.
 * Traits can modify various character attributes, abilities, or game mechanics.
 * 
 * The page is divided into two main sections:
 * 1. TraitSlots - Shows the active trait slots and currently equipped traits
 * 2. AvailableTraitList - Displays all available traits that can be assigned to slots
 * 
 * @component
 * @example
 * return (
 *   <TraitsPage />
 * )
 * 
 * @returns {JSX.Element} A page displaying trait management interface using MUI
 */
const TraitsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Character Traits
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Manage your character's traits. Equip traits to gain special abilities and
        stat bonuses. Your character's unique combination of traits defines their
        strengths and playstyle.
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left column: Trait Slots */}
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Equipped Traits
            </Typography>
            <Typography variant="body2" color="text.secondary">
              These traits are currently active and affecting your character.
            </Typography>
          </Box>
          <TraitSlots />
        </Grid>
        
        {/* Right column: Available Traits */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Available Traits
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select traits to equip from your collection of acquired traits.
            </Typography>
          </Box>
          <AvailableTraitList /> 
        </Grid>
      </Grid>
    </Container>
  );
};

export default TraitsPage;
