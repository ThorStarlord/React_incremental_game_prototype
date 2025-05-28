import React, { useCallback } from 'react';
import { Typography, Grid } from '@mui/material';

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
    </>
  );
};

export default GamePage;