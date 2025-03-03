import React, { useState, useContext, useEffect } from 'react';
import { Box, Grid, Typography, useMediaQuery, useTheme, Drawer, IconButton, Tooltip, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

// Import the correct modules with proper paths
import InventoryList from '../../features/Inventory/components/containers/InventoryList';
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';
import TraitSystemWrapper from '../../features/Traits/components/containers/TraitSystemWrapper';
import Panel from '../../shared/components/layout/Panel';
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import useEssenceGeneration from '../../shared/hooks/useEssenceGeneration';
import RelationshipNotification from '../../features/NPCs/components/RelationshipNotification';
import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification';
import useTraitNotifications from '../../shared/hooks/useTraitNotifications';
import CharacterTabBar from '../../shared/components/ui/CharacterTabBar';
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';
import CompactTraitPanel from '../../features/Traits/components/containers/CompactTraitPanel';
import CompactCharacterPanel from '../../features/Minions/components/ui/CompactCharacterPanel';
import useMinionSimulation from '../../shared/hooks/useMinionSimulation';

// Import the CSS module with the correct name
import styles from './GameContainer.module.css';

// Import Context
import { GameStateContext, useGameDispatch } from '../../context/GameStateContext';

/**
 * GameContainer Component
 * 
 * @component
 * @description
 * Main layout component for the game interface. Organizes the game UI into
 * three columns: left sidebar, main content area, and right sidebar.
 * 
 * Features:
 * - Responsive layout that adapts to different screen sizes
 * - Organized sections for different game features
 * - Integration with game state and hooks for real-time updates
 * - Support for notifications and interactive UI elements
 * - Collapsible sections for better space management
 * 
 * @returns {JSX.Element} The game container UI layout
 */
const GameContainer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [characterDrawerOpen, setCharacterDrawerOpen] = useState(false);
  const { player, world } = useContext(GameStateContext);
  const dispatch = useGameDispatch();
  
  // Hook for simulating minion activities over time
  useMinionSimulation();
  
  // Hook for essence generation over time
  const { essenceRate, generateEssence } = useEssenceGeneration();
  
  // Hook for trait notifications
  const { notifications, dismissNotification } = useTraitNotifications();
  
  // Toggle character management drawer
  const toggleCharacterDrawer = () => {
    setCharacterDrawerOpen(!characterDrawerOpen);
  };

  // Auto-generate essence over time
  useEffect(() => {
    const essenceInterval = setInterval(() => {
      generateEssence();
    }, 10000);
    
    return () => clearInterval(essenceInterval);
  }, [generateEssence]);

  return (
    <Box className={styles['game-container']}>
      {/* Header */}
      <Box id="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BreadcrumbNav />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <EssenceDisplay essenceRate={essenceRate} />
          
          {isSmallScreen && (
            <IconButton onClick={() => setDrawerOpen(true)} color="primary">
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      
      {/* Main Game Area */}
      <Box id="bottom-windows" className={styles['bottom-windows']}>
        {/* Left Column - Only shown on desktop or in drawer on mobile */}
        {!isSmallScreen ? (
          <Box id="left-column" className={styles.column}>
            <Panel title="Character">
              <CompactCharacterPanel />
              
              <Box sx={{ mt: 2 }}>
                <Tooltip title="Open Character Management">
                  <IconButton 
                    onClick={toggleCharacterDrawer} 
                    color="primary"
                    sx={{ width: '100%', border: '1px dashed', borderColor: 'divider' }}
                  >
                    <PersonIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Panel>
            
            <Box sx={{ mt: 2 }}>
              <Panel title="Traits">
                <CompactTraitPanel />
              </Panel>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Panel title="Inventory">
                <InventoryList compact />
              </Panel>
            </Box>
          </Box>
        ) : (
          <Drawer 
            anchor="left" 
            open={drawerOpen} 
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 280, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <BreadcrumbNav />
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <CompactCharacterPanel />
              <Box sx={{ mt: 2 }}>
                <CompactTraitPanel />
              </Box>
              <Box sx={{ mt: 2 }}>
                <InventoryList compact />
              </Box>
            </Box>
          </Drawer>
        )}
        
        {/* Middle Column - Game Content */}
        <Box id="middle-column" className={styles.column}>
          <Panel title="Game World">
            {world && world.currentArea ? (
              <Box>
                <Typography variant="h6">{world.currentArea.name}</Typography>
                <Typography variant="body2">{world.currentArea.description}</Typography>
                
                {/* Game content would go here */}
                <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'divider' }}>
                  Main game content area
                </Box>
              </Box>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Welcome to the Game World</Typography>
                <Typography variant="body2" color="text.secondary">
                  Select an area from the world map to begin exploring.
                </Typography>
              </Paper>
            )}
          </Panel>
        </Box>
        
        {/* Right Column */}
        <Box id="right-column" className={styles.column}>
          <Panel title="System">
            <TraitSystemWrapper />
          </Panel>
        </Box>
      </Box>
      
      {/* Character Management Drawer */}
      <CharacterManagementDrawer
        open={characterDrawerOpen}
        onClose={() => setCharacterDrawerOpen(false)}
      />
      
      {/* Notifications */}
      <RelationshipNotification />
      <TraitEffectNotification 
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </Box>
  );
};

export default GameContainer;