import React, { useEffect } from 'react';
import { Typography, Grid, Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

// Feature components/hooks needed specifically for this page's content
import useEssenceGeneration from '../features/Essence/hooks/useEssenceGeneration';
// Selectors needed for this page's content
import { selectPlayerName, selectPlayerLevel } from '../features/Player/state/PlayerSelectors'; 

// For thunks, use the typed useAppDispatch
import { useAppDispatch } from '../app/hooks';

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
  const { generateEssence } = useEssenceGeneration(); 
  
  const playerName = useSelector(selectPlayerName);
  const playerLevel = useSelector(selectPlayerLevel);
  
  useEffect(() => {
    // Example: Fetch traits if needed specifically here
    // dispatch(fetchTraitsThunk()); 
  }, [dispatch]);

  const handleGenerateClick = () => {
    dispatch({ type: 'essence/gainEssence', payload: { amount: 5, source: 'manual_click' } }); 
  };

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
              <Button variant="contained" onClick={handleGenerateClick}>
                Gather Small Essence (+5)
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
    </>
  );
};

export default GamePage;