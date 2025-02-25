// src/components/GameContainer.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import PlayerStats from './PlayerStats';
import WorldMap from './WorldMap';
import Panel from './Panel';
import BreadcrumbNav from './BreadcrumbNav';

const GameContainer = () => {
  const navigate = useNavigate();

  const handleTownSelect = (townId) => {
    navigate(`/town/${townId}`);
  };

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BreadcrumbNav />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={3}>
          <PlayerStats />
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Panel title="Game World">
            <WorldMap onTownSelect={handleTownSelect} />
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameContainer;