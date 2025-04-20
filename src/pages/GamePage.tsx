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
        Game World - {playerName} (Level {playerLevel})
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Panel title="Player Actions">
            <Typography>
              Welcome, {playerName}! You are level {playerLevel}.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Essence auto-generated via container; manual gather removed */}
            </Box>
            {/* Manual essence controls removed */}
            {/* Add NPC Connection UI */}
            <Box sx={{ mt: 2 }}>
              <Typography>NPC Connections: {npcConnections}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => dispatch(addNpcConnection())}
                aria-label="Add NPC connection" // Add aria-label
              >
                Add NPC Connection
              </Button>
            </Box>
            {/* Add Trait Button */}
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleAddTraitClick}>
                Add Sample Trait (Test)
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAcquisition(true)}
              >
                Acquire Traits…
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" color="error" onClick={handleResetGame}>
                Reset Game
              </Button>
            </Box>
          </Panel>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Panel title="World Events">
            <Typography>
              No major events currently happening. Explore the world!
            </Typography>
          </Panel>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography>
          Placeholder for future game content.
        </Typography>
      </Box>

      {showAcquisition && (
        <TraitAcquisitionPanel />
      )}
    </>
  );
};

export default GamePage;