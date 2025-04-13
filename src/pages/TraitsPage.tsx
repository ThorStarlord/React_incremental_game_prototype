import React from 'react';
import { Box, Grid, Container, Typography } from '@mui/material'; // Import Container and Typography
import TraitList from '../features/Traits/components/ui/TraitList';
import TraitSlots from '../features/Traits/components/containers/TraitSlots';
// Import hooks and selectors
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAcquiredTraitObjects } from '../features/Traits/state/TraitsSelectors';
import { TraitEffect } from '../features/Traits/state/TraitsTypes'; // Import TraitEffect if needed
import { selectPlayerSkillPoints } from '../features/Player/state/PlayerSelectors'; 

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
const TraitsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const acquiredTraitsObjects = useAppSelector(selectAcquiredTraitObjects);
  const traitPoints = useAppSelector(selectPlayerSkillPoints); 

  // Handler for leveling up a trait (placeholder logic)
  const handleTraitLevelUp = (traitId: string) => {
    console.log(`Level up requested for trait: ${traitId}`);
    // TODO: Dispatch a thunk or action to handle trait leveling
    // Example: dispatch(levelUpTraitThunk(traitId));
  };

  // Prepare props for TraitList
  const traitListProps = {
    traits: acquiredTraitsObjects.map(trait => ({
      id: trait.id,
      name: trait.name,
      level: trait.level || 1,
      description: trait.description,
      effect: Array.isArray(trait.effects)
        ? trait.effects.map((e: TraitEffect) => `${e.type}: ${e.magnitude > 0 ? '+' : ''}${e.magnitude}`).join(', ')
        : typeof trait.effects === 'object'
        ? Object.entries(trait.effects).map(([k, v]) => `${k}: ${typeof v === 'number' && v > 0 ? '+' : ''}${v}`).join(', ')
        : 'No effects',
      cost: trait.essenceCost || 0,
      type: trait.category 
    })),
    onTraitLevelUp: handleTraitLevelUp,
    pointsAvailable: traitPoints,
  };

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
          <TraitList {...traitListProps} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TraitsPage;
