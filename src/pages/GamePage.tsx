import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Grid, Button, Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';

// Feature components/hooks needed specifically for this page's content
// Selectors needed for this page's content
import { selectPlayerName, selectPlayerLevel } from '../features/Player/state/PlayerSelectors';
// Import selector and action for NPC connections
import { selectNpcConnections } from '../features/Essence/state/EssenceSelectors';
import { addNpcConnection } from '../features/Essence/state/EssenceSlice';

// Import acquireTrait, addTraitDefinition, and discoverTrait actions
import { addTraitDefinition, discoverTrait, acquireTrait } from '../features/Traits/state/TraitsSlice';
import { Trait } from '../features/Traits/state/TraitsTypes';
import TraitAcquisitionPanel from '../features/Traits/components/containers/TraitAcquisitionPanel';

// Shared components
import Panel from '../shared/components/layout/Panel';
import { GameControlPanel } from '../features/GameLoop';
import { PlaceholderPage } from '../shared/components/PlaceholderPage';

/**
 * Main Game Page Content Component
 * 
 * Renders the specific content for the main gameplay screen.
 * Assumes layout (header, columns) is provided by GameContainer via Outlet.
 */
const GamePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showAcquisition, setShowAcquisition] = useState(false);
  
  const playerName = useAppSelector(selectPlayerName);
  const playerLevel = useAppSelector(selectPlayerLevel);
  // Get NPC connections state
  const npcConnections = useAppSelector(selectNpcConnections);
  
  useEffect(() => {
    // Example: Fetch traits if needed specifically here
    // dispatch(fetchTraitsThunk()); 
  }, [dispatch]);

  // Handler for adding a sample trait
  const handleAddTraitClick = () => {
    // Add and acquire a sample trait at runtime
    const sampleTrait: Trait = {
      id: 'sample_trait',
      name: 'Sample Trait',
      description: 'A demonstration trait for testing.',
      category: 'Test',
      effects: { testEffect: 1 },
      rarity: 'common',
      essenceCost: 0
    };
    dispatch(addTraitDefinition(sampleTrait));
    dispatch(discoverTrait(sampleTrait.id));
    dispatch(acquireTrait(sampleTrait.id));
    console.log(`Added and acquired trait: ${sampleTrait.id}`);
  };

  // Handler to reset the game: clear storage and reload
  const handleResetGame = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  return (
    <> 
      <Typography variant="h4" component="h1" gutterBottom>
        Game Control Center
      </Typography>
      
      <Grid container spacing={3}>
        {/* Game Controls Section */}
        <Grid item xs={12}>
          <Panel title="Game Loop Controls">
            {/* Game Control Panel Integration */}
            <GameControlPanel />
          </Panel>
        </Grid>

        {/* World Content Placeholder */}
        <Grid item xs={12}>
          <Panel title="Game World Interface">
            <PlaceholderPage
              title="Game World Interface"
              description="This section will contain the main game world interactions, including character status, current location, and active game elements."
              status="planned"
              features={[
                'Real-time game world display',
                'Character status overview',
                'Current location information',
                'Active effects and status indicators',
                'Quick action buttons',
                'Resource displays integration',
              ]}
            />
          </Panel>
        </Grid>
      </Grid>

      {showAcquisition && (
        <TraitAcquisitionPanel />
      )}
    </>
  );
};

export default GamePage;