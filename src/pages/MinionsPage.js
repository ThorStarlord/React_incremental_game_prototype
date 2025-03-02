import React from 'react';
import { Box } from '@mui/material';
import MinionPanel from '../components/MinionPanel';
import Page from '../components/Page';
import useMinionSimulation from '../hooks/useMinionSimulation';

/**
 * @fileoverview MinionsPage Component - Manages and displays the player's minions
 * @module MinionsPage
 */

/**
 * MinionsPage Component
 * 
 * @description Renders the minions management interface of the Incremental RPG game.
 * This component allows players to view, upgrade, and manage their minions who
 * automatically gather resources or perform actions in the game.
 * 
 * The component uses the useMinionSimulation hook to handle the simulation logic
 * of minions performing tasks and generating resources in the background.
 * 
 * @component
 * @example
 * return (
 *   <MinionsPage />
 * )
 * 
 * @returns {JSX.Element} A page displaying minion management interfaces
 */
const MinionsPage = () => {
  // Use the minion simulation hook to handle background processing
  // This initializes timers and calculations for passive resource generation
  useMinionSimulation();
  
  return (
    <Page title="Minions">
      {/* Container for the minion management interface */}
      <Box 
        sx={{ mb: 3 }}
        aria-label="Minion management panel"
        role="region"
      >
        {/* MinionPanel handles the display and interaction with individual minions */}
        <MinionPanel />
      </Box>
    </Page>
  );
};

export default MinionsPage;