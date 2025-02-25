// src/components/GameContainer.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Snackbar } from '@mui/material';
import PlayerStats from './PlayerStats';
import WorldMap from './WorldMap';
import InventoryList from './InventoryList';
import EssenceDisplay from './EssenceDisplay';
import TraitSystemWrapper from './TraitSystemWrapper';
import Panel from './Panel';
import BreadcrumbNav from './BreadcrumbNav';
import useEssenceGeneration from '../hooks/useEssenceGeneration';
import RelationshipNotification from './RelationshipNotification';
import TraitEffectNotification from './TraitEffectNotification';
import useTraitNotifications from '../hooks/useTraitNotifications';

const GameContainer = () => {
  const navigate = useNavigate();
  // Get essence generation rate from the hook
  const { totalRate } = useEssenceGeneration();
  const { notification, hideNotification } = useTraitNotifications();

  const handleTownSelect = (townId) => {
    navigate(`/town/${townId}`);
  };

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <RelationshipNotification />
      <TraitEffectNotification
        effect={notification}
        open={!!notification}
        onClose={hideNotification}
      />
      <BreadcrumbNav />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PlayerStats />
            <EssenceDisplay generationRate={totalRate} />
            <InventoryList />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TraitSystemWrapper />
            <Panel title="Game World">
              <WorldMap onTownSelect={handleTownSelect} />
            </Panel>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameContainer;