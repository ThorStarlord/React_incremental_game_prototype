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

// Core UI Panels & Shared Components
import Panel from '../../shared/components/layout/Panel';
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';

// Feature Components & Hooks
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration';
import CompactTraitPanel from '../../features/Traits/components/containers/CompactTraitPanel';
import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification';
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications';
import TraitSystemWrapper from '../../features/Traits/components/containers/TraitSystemWrapper';

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

const LeftColumnContent: React.FC<{ onToggleCharacterDrawer: () => void }> =
  ({ onToggleCharacterDrawer }) => {
    return (
      <>
        <Box sx={{ mt: 2 }}>
          <Panel title="Traits">
            <CompactTraitPanel traits={[]} />
          </Panel>
        </Box>
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
      </>
    );
};

const MiddleColumnContent: React.FC = () => {
  return (
    <Panel title="Game World">
      <Typography>Main Game Area</Typography>
    </Panel>
  );
};

const RightColumnContent: React.FC = () => {
  return (
    <Panel title="System">
      <TraitSystemWrapper />
    </Panel>
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

  const { generateEssence } = useEssenceGeneration();
  const { notifications, dismissNotification } = useTraitNotifications();

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
      <Box className={styles.gameContainer}>
        <Box className={styles.header} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <BreadcrumbNav />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <EssenceDisplay
                currentEssence={0}
                maxEssence={100}
                essenceTypes={[{ id: 'regular', name: 'Essence', amount: 0, color: '#3a7ca5' }]}
              />
              {isSmallScreen && (
                <IconButton onClick={() => setDrawerOpen(true)} color="primary">
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        <Box className={styles.bottomWindows}>
          {!isSmallScreen && showLeftColumn && (
            <Box className={`${styles.column} ${styles.leftColumn}`}>
              <LeftColumnContent onToggleCharacterDrawer={toggleCharacterDrawer} />
            </Box>
          )}
          <Box className={`${styles.column} ${styles.middleColumn}`}>
            <MiddleColumnContent />
          </Box>
          {!isSmallScreen && showRightColumn && (
            <Box className={`${styles.column} ${styles.rightColumn}`}>
              <RightColumnContent />
            </Box>
          )}
        </Box>
        {showLeftColumn && (
          <Drawer
            anchor="left"
            open={drawerOpen && isSmallScreen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 280, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <LeftColumnContent onToggleCharacterDrawer={toggleCharacterDrawer} />
            </Box>
          </Drawer>
        )}
        <CharacterManagementDrawer
          isOpen={characterDrawerOpen}
          onClose={() => setCharacterDrawerOpen(false)}
        />
        <TraitEffectNotification
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      </Box>
    </GameWrapper>
  );
};

export default GameContainer;
