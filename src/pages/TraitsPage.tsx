import React from 'react';
import { Box, Grid, Container, Typography } from '@mui/material'; // Import Container and Typography
import TraitSlotsContainer from '../features/Traits/components/containers/TraitSlotsContainer';
// Add TraitListContainer import
import TraitListContainer from '../features/Traits/components/containers/TraitListContainer';

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
 * 2. TraitListContainer - Displays all acquired traits that can be leveled up
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
          <TraitSlotsContainer />
        </Grid>
        
        {/* Right column: Acquired Traits List */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Acquired Traits
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View your collection of acquired traits. Some traits may be leveled up.
            </Typography>
          </Box>
          <TraitListContainer />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TraitsPage;
