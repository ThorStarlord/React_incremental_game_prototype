import React, { useEffect } from 'react'; // Added useEffect
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '../../app/hooks'; // Added useAppDispatch
import { startGame } from '../../features/GameLoop/state/GameLoopSlice'; // Added startGame
import { useLayoutState } from '../hooks/useLayoutState';
import { VerticalNavBar } from './VerticalNavBar/VerticalNavBar';
import { MainContentArea } from './MainContentArea';

/**
 * New GameLayout component that integrates with useLayoutState hook
 * and provides responsive layout management with sidebar collapse functionality.
 */
export const GameLayout: React.FC = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch(); // Get the dispatch function

  // Automatically start the game loop when the layout mounts
  useEffect(() => {
    dispatch(startGame());
  }, [dispatch]);
  
  // Use the centralized layout state management
  const {
    activeTab,
    sidebarCollapsed,
    setActiveTab,
    setSidebarCollapsed,
  } = useLayoutState({
    defaultTab: 'dashboard',
    persistSidebar: true,
    syncWithRouter: true
  });

  // Calculate main content margin based on sidebar state and device type
  const getMainContentMargin = () => {
    if (isMobile) {
      return 0;
    }
    
    return sidebarCollapsed ? 64 : 240;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Navigation Sidebar */}
      <VerticalNavBar
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: isMobile ? 0 : `${getMainContentMargin()}px`,
          transition: theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          padding: theme.spacing(3),
          paddingTop: theme.spacing(4),
          minWidth: 0,
        }}
      >
        <MainContentArea 
          activeTabId={activeTab}
          changeTab={setActiveTab}
        />
      </Box>
    </Box>
  );
});

GameLayout.displayName = 'GameLayout';