import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useLayoutState } from '../hooks/useLayoutState';
import { VerticalNavBar } from './VerticalNavBar/VerticalNavBar';
import { MainContentArea } from './MainContentArea';

/**
 * New GameLayout component that integrates with useLayoutState hook
 * and provides responsive layout management with sidebar collapse functionality.
 * 
 * This component replaces the legacy GameLayout and provides:
 * - Centralized layout state management via useLayoutState hook
 * - Responsive navigation with automatic device detection
 * - Dynamic content rendering through MainContentArea
 * - Sidebar collapse with smooth transitions and margin adjustments
 * - Performance-optimized rendering with memoized callbacks
 */
export const GameLayout: React.FC = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use the centralized layout state management
  const {
    activeTab,
    sidebarCollapsed,
    setActiveTab,
    setSidebarCollapsed,
    toggleSidebar
  } = useLayoutState({
    defaultTab: 'dashboard',
    persistSidebar: true,
    syncWithRouter: true
  });

  // Calculate main content margin based on sidebar state and device type
  const getMainContentMargin = () => {
    if (isMobile) {
      // Mobile uses drawer overlay, no margin adjustment needed
      return 0;
    }
    
    // Desktop: adjust margin based on sidebar collapse state
    return sidebarCollapsed ? 64 : 240; // Collapsed width: 64px, Expanded width: 240px
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
          minWidth: 0, // Prevent flex item overflow
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
