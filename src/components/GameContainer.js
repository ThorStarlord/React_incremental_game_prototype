// src/components/GameContainer.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, AppBar, Toolbar, Typography, IconButton, Snackbar, Tooltip } from '@mui/material';
import PlayerStats from './PlayerStats';
import WorldMap from './WorldMap';
import InventoryList from './InventoryList';
import EssenceDisplay from './EssenceDisplay';
import TraitSystemWrapper from './trait/TraitSystemWrapper';
import Panel from './Panel';
import BreadcrumbNav from './BreadcrumbNav';
import useEssenceGeneration from '../hooks/useEssenceGeneration';
import RelationshipNotification from './RelationshipNotification';
import TraitEffectNotification from './trait/TraitEffectNotification';
import useTraitNotifications from '../hooks/useTraitNotifications';
import CharacterTabBar from './CharacterTabBar';
import CharacterManagementDrawer from './CharacterManagementDrawer';
import CompactTraitPanel from './trait/CompactTraitPanel';
import CompactCharacterPanel from './characters/CompactCharacterPanel';
import useMinionSimulation from '../hooks/useMinionSimulation';

// Import icons for the header
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const GameContainer = () => {
  const navigate = useNavigate();
  // Get essence generation rate from the hook
  const { totalRate } = useEssenceGeneration();
  const { notification, hideNotification } = useTraitNotifications();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [initialTab, setInitialTab] = useState(0);
  
  const handleTownSelect = (townId) => {
    navigate(`/town/${townId}`);
  };
  
  const handleOpenDrawer = (tabIndex) => {
    setInitialTab(tabIndex);
    setDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Enable minion simulation
  useMinionSimulation();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with quick access icons */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Incremental RPG
          </Typography>
          
          {/* Quick access icons */}
          <IconButton 
            color="inherit" 
            onClick={() => handleOpenDrawer(0)}
            sx={{ mr: 1 }}
            aria-label="Characters"
          >
            <Tooltip title="Characters">
              <SportsKabaddiIcon />
            </Tooltip>
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={() => handleOpenDrawer(1)}
            sx={{ mr: 1 }}
            aria-label="NPCs"
          >
            <Tooltip title="NPCs">
              <PersonIcon />
            </Tooltip>
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={() => handleOpenDrawer(2)}
            aria-label="Traits"
          >
            <Tooltip title="Traits">
              <AutoFixHighIcon />
            </Tooltip>
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Main content */}
      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
        <RelationshipNotification />
        <TraitEffectNotification
          effect={notification}
          open={!!notification}
          onClose={hideNotification}
        />
        <BreadcrumbNav />
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {/* Left Panel - Player Stats */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PlayerStats />
              <EssenceDisplay generationRate={totalRate} />
              <InventoryList />
            </Box>
          </Grid>
          
          {/* Center Panel - Game World */}
          <Grid item xs={12} md={6}>
            <Panel title="Game World" sx={{ height: '100%' }}>
              <WorldMap onTownSelect={handleTownSelect} />
            </Panel>
          </Grid>
          
          {/* Right Panel - Traits and Characters */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CompactTraitPanel onExpandView={() => handleOpenDrawer(2)} />
              <CompactCharacterPanel onExpandView={() => handleOpenDrawer(0)} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Character management tab bar */}
      <CharacterTabBar onOpenDrawer={handleOpenDrawer} />
      
      {/* Character management drawer */}
      <CharacterManagementDrawer 
        open={drawerOpen} 
        onClose={handleCloseDrawer} 
        initialTab={initialTab} 
      />
    </Box>
  );
};

export default GameContainer;