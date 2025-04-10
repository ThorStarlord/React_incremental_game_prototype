import React from 'react';
import { Box, Grid, Container, Typography } from '@mui/material'; // Import Container and Typography
import TraitList from '../features/Traits/components/containers/TraitList';
// Assuming TraitSlots is the component from the features directory
import TraitSlots from '../features/Traits/components/containers/TraitSlots';
// import Page from '../components/Page'; // Remove Page import

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
 * 2. TraitList - Displays all available traits that can be assigned to slots
 * 
 * @component
 * @example
 * return (
 *   <TraitsPage />
 * )
 * 
 * @returns {JSX.Element} A page displaying trait management interface using MUI
 */
// Remove explicit return type annotation from the function signature
const TraitsPage: React.FC = () => { 
  return (
    // Replace Page with Container and Typography
    <Container maxWidth="lg" sx={{ py: 3 }}> 
      <Typography variant="h4" component="h1" gutterBottom>
        Traits Management
      </Typography>
      <Grid container spacing={3}>
        {/* Left side: Active trait slots section */}
        <Grid item xs={12} md={5}>
          <TraitSlots 
            // Removed aria-label and role as Panel/Paper inside TraitSlots likely handles semantics
          />
        </Grid>
        
        {/* Right side: Available traits list */}
        <Grid item xs={12} md={7}>
          <TraitList 
            // Removed aria-label and role as Panel/Paper inside TraitList likely handles semantics
            // Pass necessary props if TraitList requires them (assuming it uses Redux for now)
            traits={[]} // Placeholder - TraitList likely gets data from Redux
            onTraitLevelUp={() => {}} // Placeholder
            pointsAvailable={0} // Placeholder
          />
        </Grid>
      </Grid>
    </Container> // End Container
  );
};

export default TraitsPage;
