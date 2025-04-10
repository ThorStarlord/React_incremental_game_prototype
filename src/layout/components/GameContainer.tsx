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

// Core UI Panels & Shared Components
import Panel from '../../shared/components/layout/Panel';
import BreadcrumbNav from '../../shared/components/ui/BreadcrumbNav';
import CharacterManagementDrawer from '../../shared/components/ui/CharacterManagementDrawer';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';

// Feature Components & Hooks
import EssenceDisplay from '../../features/Essence/components/ui/EssenceDisplay';
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration';
import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification';
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications';
import { useAutosaveSystem } from '../../gameLogic/systems/autosaveSystem';

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

const MiddleColumnContent: React.FC = () => {
  return (
    <Panel title="Game World">
      <Typography>Main Game Area</Typography>
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

  // Initialize game system hooks
  const { generateEssence } = useEssenceGeneration();
  const { notifications, dismissNotification } = useTraitNotifications();
  useAutosaveSystem(); // Call the autosave system hook

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

  const columnSx = {
    bgcolor: 'background.paper',
    p: 2,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  return (
    <GameWrapper sx={sx}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            p: theme.spacing(1, 2),
            background: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxSizing: 'border-box',
            height: 64,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
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
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            flex: 1,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' },
            height: { xs: 'auto', md: 'calc(100vh - 64px)' },
            overflowY: { xs: 'auto', md: 'hidden' },
          }}
        >
          {!isSmallScreen && showLeftColumn && (
            <Box
              sx={{
                ...columnSx,
                width: 250,
                flexShrink: 0,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <LeftColumn />
            </Box>
          )}
          <Box
            sx={{
              ...columnSx,
              flex: { xs: '1 1 auto', md: 1 },
              minWidth: 0,
              maxHeight: { xs: '60vh', md: 'none' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <MiddleColumnContent />
          </Box>
          {!isSmallScreen && showRightColumn && (
            <Box
              sx={{
                ...columnSx,
                width: 250,
                flexShrink: 0,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <RightColumn />
            </Box>
          )}
        </Box>
        {showLeftColumn && (
          <Drawer
            anchor="left"
            open={drawerOpen && isSmallScreen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
            }}
          >
            <Box sx={{ width: 280, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <LeftColumn />
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
