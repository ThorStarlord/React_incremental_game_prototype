import React from 'react';
import { Box, Grid } from '@mui/material';
import TraitList from '../features/Traits/components/containers/TraitList';
import TraitSlots from '../components/TraitSlots';
import Page from '../components/Page';

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
 * @returns {JSX.Element} A page displaying trait management interface
 */
const TraitsPage: React.FC = (): JSX.Element => {
  return (
    <Page title="Traits Management">
      <Grid container spacing={3}>
        {/* Left side: Active trait slots section */}
        <Grid item xs={12} md={5}>
          <TraitSlots 
            aria-label="Active trait slots"
            role="region"
          />
        </Grid>
        
        {/* Right side: Available traits list */}
        <Grid item xs={12} md={7}>
          <TraitList 
            aria-label="Available traits"
            role="region"
          />
        </Grid>
      </Grid>
    </Page>
  );
};

export default TraitsPage;
