import React, { useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { startGame } from '../../features/GameLoop/state/GameLoopSlice';
import { useLayoutState } from '../hooks/useLayoutState';
import { VerticalNavBar } from './VerticalNavBar/VerticalNavBar';
import { MainContentArea } from './MainContentArea';
import { Navigate, Outlet } from 'react-router-dom';
import IntroNarration from '../../shared/components/ui/IntroNarration';
import GlobalNotificationHost from '../../shared/components/ui/GlobalNotificationHost';
import { useAppSelector } from '../../app/hooks';
import { selectHasSeenIntro, selectSessionActive } from '../../features/Meta/state/MetaSlice';
import { useNpcShopRestock } from '../../features/NPCs/hooks/useNpcShopRestock';
import { PrologueObjectivePanel } from '../../features/Story/components/PrologueObjectivePanel';
import { CampaignSpinePanel } from '../../features/Story/components/CampaignSpinePanel';
import { GameSessionBar } from './GameSessionBar';

/**
 * New GameLayout component that integrates with useLayoutState hook
 * and provides responsive layout management with sidebar collapse functionality.
 */
export const GameLayout: React.FC = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const hasSeenIntro = useAppSelector(selectHasSeenIntro);
  const sessionActive = useAppSelector(selectSessionActive);

  // Automatically start the game loop when a session's layout mounts
  useEffect(() => {
    if (sessionActive) dispatch(startGame());
  }, [dispatch, sessionActive]);
  // Periodic NPC shop restock
  useNpcShopRestock();
  
  // Use the centralized layout state management
  const {
    activeTab,
    sidebarCollapsed,
    setActiveTab,
    setSidebarCollapsed,
  } = useLayoutState({
    defaultTab: 'dashboard',
    persistSidebar: true,
    syncWithRouter: true,
  });

  // Calculate main content margin based on sidebar state and device type
  const getMainContentMargin = () => {
    if (isMobile) {
      return 0;
    }
    
    return sidebarCollapsed ? 64 : 240;
  };

  // Without New Game or Load (e.g. after a page reload) the store holds only the
  // startup catalog, not a playable campaign. Send the player to the main menu,
  // where Continue resumes the latest save.
  if (!sessionActive) {
    return <Navigate to="/" replace />;
  }

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
          minWidth: 0,
        }}
      >
        <MainContentArea 
          activeTabId={activeTab}
          changeTab={setActiveTab}
        >
          <GameSessionBar />
          <PrologueObjectivePanel />
          <CampaignSpinePanel />
          <Outlet />
          {!hasSeenIntro && <IntroNarration />}
        </MainContentArea>
      </Box>
      <GlobalNotificationHost />
    </Box>
  );
});

GameLayout.displayName = 'GameLayout';