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

import React, { useState, useEffect, ReactNode } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Drawer, IconButton, Tooltip, Paper, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import styles from './GameContainer.module.css';

//import InventoryList from '../../features/Inventory/components/containers/InventoryList';
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';
import TraitSystemWrapper from '../../features/Traits/components/containers/TraitSystemWrapper';
import Panel from '../../shared/components/layout/Panel';
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration';
import RelationshipNotification from '../../features/NPCs/components/RelationshipNotification';
import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification';
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications';
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';
import CompactTraitPanel from '../../features/Traits/components/containers/CompactTraitPanel';
import CompactCharacterPanel from '../../features/Minions/components/ui/CompactCharacterPanel';




const GameWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

interface GameContainerProps {
  showLeftColumn?: boolean;
  showRightColumn?: boolean;
  sx?: React.CSSProperties;
  children?: ReactNode;
}

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

const LeftColumnContent: React.FC<{
  player: Partial<GameState['player']> & {
    name?: string;
    level?: number;
    health?: number;
    maxHealth?: number;
    equippedTraits?: string[];
  };
  onToggleCharacterDrawer: () => void;
}> = ({ player, onToggleCharacterDrawer }) => {
  return (
    <>
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
              onClick={onToggleCharacterDrawer} 
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
          <CompactTraitPanel 
            traits={(player?.equippedTraits || []).map((id: string) => ({
              id,
              name: `Trait ${id}`,
              description: 'A powerful character trait'
            }))} 
          />
        </Panel>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Panel title="Inventory">
          <InventoryList compact />
        </Panel>
      </Box>
    </>
  );
};

const MobileDrawerContent: React.FC<{
  player: Partial<GameState['player']> & {
    name?: string;
    level?: number;
    health?: number;
    maxHealth?: number;
    equippedTraits?: string[];
  };
  onClose: () => void;
}> = ({ player, onClose }) => {
  return (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <BreadcrumbNav />
        <IconButton onClick={onClose}>
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
  );
};

const GameWorldContent: React.FC<{
  world?: any;
}> = ({ world }) => {
  return (
    <Panel title="Game World">
      {world && world.currentArea ? (
        <Box>
          <Typography variant="h6">{world.currentArea.name}</Typography>
          <Typography variant="body2">{world.currentArea.description}</Typography>
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
  );
};

const HeaderContent: React.FC<{
  gameState: ExtendedGameState;
  isSmallScreen: boolean;
  onOpenDrawer: () => void;
}> = ({ gameState, isSmallScreen, onOpenDrawer }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <BreadcrumbNav />
      <Box sx={{ display: 'flex', gap: 2 }}>
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
        {isSmallScreen && (
          <IconButton onClick={onOpenDrawer} color="primary">
            <MenuIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

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
  
  const gameState = useGameState() as ExtendedGameState;
  const { player } = gameState;
  const { world } = gameState;
  const dispatch = useGameDispatch();
  
  const minionSimulationHook = useMinionSimulation();
  const essenceGenerationHook = useEssenceGeneration();
  const { generateEssence } = essenceGenerationHook;
  
  const traitNotificationsHook = useTraitNotifications() as any;
  const { notifications = [], dismissNotification = () => {} } = traitNotificationsHook;
  
  const toggleCharacterDrawer = (): void => {
    setCharacterDrawerOpen(!characterDrawerOpen);
  };

  useEffect(() => {
    const essenceInterval = setInterval(() => {
      generateEssence();
    }, 10000);
    return () => clearInterval(essenceInterval);
  }, [generateEssence]);

  if (children) {
    return (
      <GameWrapper sx={sx}>
        {children}
      </GameWrapper>
    );
  }

  return (
    <GameWrapper sx={sx}>
      <Box className={styles['game-container']}>
        <Box id="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <HeaderContent 
            gameState={gameState}
            isSmallScreen={isSmallScreen}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </Box>
        <Box id="bottom-windows" className={styles['bottom-windows']}>
          {!isSmallScreen && showLeftColumn ? (
            <Box id="left-column" className={styles.column}>
              <LeftColumnContent 
                player={player} 
                onToggleCharacterDrawer={toggleCharacterDrawer}
              />
            </Box>
          ) : (
            showLeftColumn && (
              <Drawer 
                anchor="left" 
                open={drawerOpen} 
                onClose={() => setDrawerOpen(false)}
              >
                <MobileDrawerContent 
                  player={player}
                  onClose={() => setDrawerOpen(false)}
                />
              </Drawer>
            )
          )}
          <Box id="middle-column" className={styles.column}>
            <GameWorldContent world={world} />
          </Box>
          {showRightColumn && (
            <Box id="right-column" className={styles.column}>
              <Panel title="System">
                <TraitSystemWrapper />
              </Panel>
            </Box>
          )}
        </Box>
        <CharacterManagementDrawer
          isOpen={characterDrawerOpen}
          onClose={() => setCharacterDrawerOpen(false)}
        />
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
