// src/components/GameContainer.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, AppBar, Toolbar, Typography, IconButton, Snackbar, Tooltip } from '@mui/material';
import PlayerStats from '../../features/player/components/PlayerStats';
import WorldMap from '../WorldMap';
import InventoryList from '../InventoryList';
import EssenceDisplay from '../EssenceDisplay';
import TraitSystemWrapper from '../trait/TraitSystemWrapper';
import Panel from '../panel/Panel';
import BreadcrumbNav from '../BreadcrumbNav';
import useEssenceGeneration from '../../hooks/useEssenceGeneration';
import RelationshipNotification from '../../features/npc/components/RelationshipNotification';
import TraitEffectNotification from '../trait/TraitEffectNotification';
import useTraitNotifications from '../../hooks/useTraitNotifications';
import CharacterTabBar from '../CharacterTabBar';
import CharacterManagementDrawer from '../CharacterManagementDrawer';
import CompactTraitPanel from '../trait/CompactTraitPanel';
import CompactCharacterPanel from '../characters/CompactCharacterPanel';
import useMinionSimulation from '../../hooks/useMinionSimulation';
import './GameContainer.css'; // Assuming there will be styling

/**
 * GameContainer Component
 * 
 * @component
 * @description
 * Main container for the incremental RPG game. This component serves as the parent
 * container for all game-related UI components and manages the overall layout.
 * It includes a basic game loop implementation and supports theming options.
 *
 * @example
 * return (
 *   <GameContainer 
 *     title="My Incremental RPG"
 *     theme="dark"
 *   >
 *     <GamePanel />
 *     <ResourcePanel />
 *   </GameContainer>
 * )
 */
const GameContainer = ({ 
  children,
  title = 'Incremental RPG',
  theme = 'light',
  fullScreen = false,
  className = '',
  onGameTick = () => {},
}) => {
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

  // Game tick state for handling game loop
  const [gameTick, setGameTick] = useState(0);
  
  /**
   * Game loop using useEffect
   * Sets up the main game loop that triggers onGameTick at regular intervals
   */
  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      setGameTick(prevTick => prevTick + 1);
      onGameTick(gameTick);
    }, 1000); // 1-second tick rate
    
    return () => clearInterval(gameLoopInterval);
  }, [onGameTick, gameTick]);
  
  const containerClasses = [
    'game-container',
    `theme-${theme}`,
    fullScreen ? 'fullscreen' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }} className={containerClasses} data-testid="game-container">
      <header className="game-header">
        <h1>{title}</h1>
      </header>
      
      <main className="game-content">
        {children}
      </main>
      
      <footer className="game-footer">
        <div className="game-info">
          <span>Tick: {gameTick}</span>
        </div>
      </footer>

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

GameContainer.propTypes = {
  /**
   * Child components to render inside the game container
   */
  children: PropTypes.node,
  
  /**
   * The title of the game to display in the header
   */
  title: PropTypes.string,
  
  /**
   * Theme variant ('light', 'dark', etc.)
   */
  theme: PropTypes.string,
  
  /**
   * Whether the game should take up the full screen
   */
  fullScreen: PropTypes.bool,
  
  /**
   * Additional CSS class names
   */
  className: PropTypes.string,
  
  /**
   * Callback function that gets called on each game tick
   * @param {number} tick - The current tick count
   */
  onGameTick: PropTypes.func,
};

export default GameContainer;