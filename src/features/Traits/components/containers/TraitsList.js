import React from 'react';
import { Grid } from '@mui/material';
import TraitCard from './TraitCard';

/**
 * TraitsList Component
 * 
 * This component renders a responsive grid of TraitCard components based on the provided traits.
 * It handles the display of all available traits, showing their acquisition status and allowing
 * players to acquire new traits if they have sufficient essence.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.traits - An object containing all available traits with their details
 * @param {Array} props.npcs - Array of NPCs that may be affected by or related to traits
 * @param {Function} props.onAcquire - Callback function triggered when a trait is acquired
 * @param {number} props.essence - Current essence amount available to the player for acquiring traits
 * @param {Array} props.acquiredTraits - Array of trait IDs that the player has already acquired
 * 
 * @returns {React.Component} A grid layout containing individual TraitCard components
 */
const TraitsList = ({ traits, npcs, onAcquire, essence, acquiredTraits }) => {
  return (
    <Grid container spacing={2}>
      {/* Map through all traits and create a card for each one */}
      {Object.entries(traits).map(([id, trait]) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <TraitCard 
            id={id} 
            trait={trait} 
            npcs={npcs}
            onAcquire={onAcquire}
            essence={essence}
            isAcquired={(acquiredTraits || []).includes(id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TraitsList;