/**
 * @file GameContainer.tsx
 * @description Main layout container and entry point for the incremental RPG game interface.
 *
 * This component serves as the primary layout component for the game, providing:
 * - Full viewport height wrapper with proper styling
 * - Three-column responsive layout for game content
 * - Content organization across mobile and desktop devices
 * - Integration point for all major game subsystems
 * 
 * The interface is organized into three main columns:
 * - Left column: Character information, stats, inventory, and traits
 * - Middle column: Main game content, world map, and interaction areas
 * - Right column: Game systems, faction information, and auxiliary data
 * 
 * Features:
 * - Responsive layout that adapts to different screen sizes
 * - Mobile-friendly design with sidebar drawers on small screens
 * - Integrated notifications system for game events
 * - Real-time resource generation and updates
 * - Character management through modal drawers
 * - Themeable and customizable appearance
 * - Optional rendering of left and right columns (for focused gameplay)
 * - Support for custom children content when needed
 * 
 * The component integrates multiple game subsystems and hooks:
 * - Essence generation and display
 * - Minion simulation for automated activities
 * - Relationship notifications for NPC interactions
 * - Trait effects and notifications
 * 
 * @example
 * // Basic usage with default layout
 * <GameContainer />
 * 
 * @example
 * // Usage with only middle column for focused gameplay
 * <GameContainer 
 *   showLeftColumn={false} 
 *   showRightColumn={false} 
 * />
 * 
 * @example
 * // Usage with custom content
 * <GameContainer>
 *   <CustomGameContent />
 * </GameContainer>
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Box, Grid, Typography, useMediaQuery, useTheme, Drawer, IconButton, Tooltip, Paper, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
// Import CSS module
import styles from './GameContainer.module.css';

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

// Import Context from gameContext.ts instead of separate files
import { useGameState, useGameDispatch } from '../../context/GameContext';

// Import hook for minion simulation
import useMinionSimulation from '../../shared/hooks/useMinionSimulation';

// Import proper types
import { GameState } from '../../context/InitialState';

/**
 * Styled wrapper for the game area with full viewport height
 * Provides a consistent container for the game interface that properly
 * fills the screen and establishes the base styling.
 */
const GameWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

/**
 * Interface for the props accepted by GameContainer
 * 
 * Defines configuration options for controlling the game interface layout
 * and appearance.
 */
interface GameContainerProps {
  /** 
   * Whether to show the left sidebar containing character information
   * @default true
   */
  showLeftColumn?: boolean;
  
  /** 
   * Whether to show the right sidebar containing game systems and traits
   * @default true
   */
  showRightColumn?: boolean;
  
  /** 
   * Additional styling to apply to the container
   * Allows for custom theming and layout adjustments
   */
  sx?: React.CSSProperties;

  /**
   * Optional custom content to render instead of the standard game interface
   * Allows for complete control over what's rendered within the GameWrapper
   */
  children?: ReactNode;
}

/**
 * Interface for notification objects displayed in the game
 * 
 * These notifications provide feedback to the player about game events,
 * achievements, and system messages.
 */
interface Notification {
  /** Unique identifier for the notification */
  id: number;
  
  /** Content text to display to the player */
  message: string;
  
  /** Category of notification (affects styling and behavior) */
  type: string;
  
  /** How long the notification should be displayed in milliseconds */
  duration: number;
}

/**
 * Interface for world area data representing locations in the game
 * 
 * World areas define locations that the player can visit, explore,
 * and interact with throughout their adventure.
 */
interface WorldArea {
  /** Unique identifier for the area */
  id: string;
  
  /** Display name of the location */
  name: string;
  
  /** Descriptive text about the area shown to the player */
  description: string;
  
  /** 
   * Additional area properties such as danger level, resources, NPCs, etc.
   * Specific properties vary by area type
   */
  [key: string]: any;
}

/**
 * Interface for the GameState context structure
 * 
 * Defines the shape of the global game state accessed via React context.
 * This state contains all persistent game data including player progress,
 * world state, and game settings.
 */
interface GameStateContextType {
  /** 
   * Player data including stats, inventory, and progression
   */
  player: {
    /** Player character name */
    name: string;
    
    /** Current player level */
    level: number;
    
    /** Additional player properties */
    [key: string]: any;
  };
  
  /**
   * World state data including current location and world conditions
   */
  world: {
    /** Currently active area where the player is located */
    currentArea?: WorldArea;
    
    /** Additional world state properties */
    [key: string]: any;
  };
  
  /**
   * Game settings and configuration options
   */
  settings?: {
    /** Gameplay-related settings */
    gameplay?: {
      /** Whether relationship decay is disabled */
      relationshipDecayDisabled?: boolean;
      
      /** Additional gameplay settings */
      [key: string]: any;
    };
    
    /** Other setting categories */
    [key: string]: any;
  };
  
  /** Additional state properties */
  [key: string]: any;
}

// Extend GameState with world property - update to properly extend GameState
interface ExtendedGameState {
  world?: any;
  player?: Partial<GameState['player']> & {
    name?: string;
    level?: number;
    health?: number;
    maxHealth?: number;
    equippedTraits?: string[];
  };
  essence?: {
    amount?: number;
    maxAmount?: number;
  };
}

/**
 * GameContainer Component
 * 
 * The main layout container and entry point for the game interface that organizes 
 * the UI into a responsive three-column layout with header and notification areas.
 * 
 * On desktop screens, all columns are displayed side by side in a grid layout.
 * On mobile devices, the middle column is shown with the left and right columns
 * accessible via drawer menus triggered by buttons in the header.
 * 
 * This component serves as the visual foundation of the game, integrating
 * numerous game systems and UI components into a cohesive interface.
 * 
 * @component
 */
const GameContainer: React.FC<GameContainerProps> = ({
  showLeftColumn = true,
  showRightColumn = true,
  sx = {},
  children
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [characterDrawerOpen, setCharacterDrawerOpen] = useState<boolean>(false);
  
  // Use the useGameState hook which provides the properly typed context
  const gameState = useGameState() as ExtendedGameState;
  // Get player from game state
  const { player } = gameState;
  // World is guaranteed to exist in the return type of useGameState
  const { world } = gameState;
  const dispatch = useGameDispatch();
  
  // Hook for simulating minion activities over time
  const minionSimulationHook = useMinionSimulation();
  
  // Hook for essence generation over time
  const essenceGenerationHook = useEssenceGeneration();
  const { generateEssence } = essenceGenerationHook;
  const essenceRate = 3; // Fallback static value until context properly provides it
  
  // Hook for trait notifications
  const traitNotificationsHook = useTraitNotifications() as any; // Temporary type assertion
  const { notifications = [], dismissNotification = () => {} } = traitNotificationsHook;
  
  // Toggle character management drawer
  const toggleCharacterDrawer = (): void => {
    setCharacterDrawerOpen(!characterDrawerOpen);
  };

  // Auto-generate essence over time
  useEffect(() => {
    const essenceInterval = setInterval(() => {
      generateEssence();
    }, 10000);
    
    return () => clearInterval(essenceInterval);
  }, [generateEssence]);

  // If custom children are provided, render them within the wrapper
  if (children) {
    return (
      <GameWrapper sx={sx}>
        {children}
      </GameWrapper>
    );
  }

  // Otherwise render the standard game layout
  return (
    <GameWrapper sx={sx}>
      <Box className={styles['game-container']}>
        {/* Header - Contains navigation breadcrumbs and resource displays */}
        <Box id="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Breadcrumb navigation showing current location in game world */}
          <BreadcrumbNav />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Resource display showing current essence and generation rate */}
            <EssenceDisplay 
              currentEssence={gameState?.essence?.amount || 0}
              maxEssence={gameState?.essence?.maxAmount || 100}
              essenceTypes={[
                { 
                  id: 'regular', 
                  name: 'Essence', 
                  amount: gameState?.essence?.amount || 0,
                  color: '#3a7ca5'
                }
              ]}
            />
            
            {/* Mobile menu toggle button (only shown on small screens) */}
            {isSmallScreen && (
              <IconButton onClick={() => setDrawerOpen(true)} color="primary">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        
        {/* Main Game Area - Contains the three columns */}
        <Box id="bottom-windows" className={styles['bottom-windows']}>
          {/* 
            Left Column - Character information, traits, and inventory
            Only shown directly on desktop; on mobile it appears in a drawer
          */}
          {!isSmallScreen && showLeftColumn ? (
            <Box id="left-column" className={styles.column}>
              {/* Character panel with avatar and basic stats */}
              <Panel title="Character">
                <CompactCharacterPanel 
                  characters={[
                    {
                      id: 'player',
                      name: player?.name || 'Hero',
                      level: player?.level || 1,
                      health: player?.health || 100,
                      maxHealth: player?.maxHealth || 100,
                    }
                  ]} 
                />
                
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
              
              {/* Character traits panel */}
              <Box sx={{ mt: 2 }}>
                <Panel title="Traits">
                  <CompactTraitPanel 
                    traits={(player?.equippedTraits || []).map((id: string) => ({
                      id,
                      name: `Trait ${id}`,
                      description: 'A powerful character trait'
                    }))} 
                  />
                </Panel>
              </Box>
              
              {/* Inventory panel showing items and equipment */}
              <Box sx={{ mt: 2 }}>
                <Panel title="Inventory">
                  <InventoryList compact />
                </Panel>
              </Box>
            </Box>
          ) : (
            /* Mobile drawer version of the left column */
            showLeftColumn && (
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
                  <CompactCharacterPanel 
                    characters={[
                      {
                        id: 'player',
                        name: player?.name || 'Hero',
                        level: player?.level || 1,
                        health: player?.health || 100,
                        maxHealth: player?.maxHealth || 100,
                      }
                    ]}
                  />
                  <Box sx={{ mt: 2 }}>
                    <CompactTraitPanel 
                      traits={(player?.equippedTraits || []).map((id: string) => ({
                        id,
                        name: `Trait ${id}`,
                        description: 'A powerful character trait'
                      }))}
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <InventoryList compact />
                  </Box>
                </Box>
              </Drawer>
            )
          )}
          
          {/* Middle Column - Main game content and world map */}
          <Box id="middle-column" className={styles.column}>
            <Panel title="Game World">
              {/* Display current area information if available */}
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
                /* Welcome message when no area is selected */
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Welcome to the Game World</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select an area from the world map to begin exploring.
                  </Typography>
                </Paper>
              )}
            </Panel>
          </Box>
          
          {/* Right Column - System panels, traits, factions */}
          {showRightColumn && (
            <Box id="right-column" className={styles.column}>
              <Panel title="System">
                <TraitSystemWrapper />
              </Panel>
            </Box>
          )}
        </Box>
        
        {/* Character Management Drawer - Full character details and management */}
        <CharacterManagementDrawer
          isOpen={characterDrawerOpen}
          onClose={() => setCharacterDrawerOpen(false)}
        />
        
        {/* Notification Systems - Display game events and feedback */}
        <RelationshipNotification />
        <TraitEffectNotification 
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      </Box>
    </GameWrapper>
  );
};

export default GameContainer;
