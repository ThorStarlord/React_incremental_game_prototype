import React, { useState, ReactNode } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // For potential mobile drawer toggle
import VerticalNavBar, { NavItem } from './VerticalNavBar';
import MainContentArea from './MainContentArea';

// --- Import Icons ---
import HomeIcon from '@mui/icons-material/Home'; // Changed to HomeIcon for 'Game'
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import PeopleIcon from '@mui/icons-material/People'; // For NPCs
import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public'; // For World Map

// --- Import Global Components & Hooks ---
import EssenceDisplay from '../../features/Essence/components/containers/EssenceDisplayContainer'; // Use container if it fetches data
// import RelationshipNotification from '../../features/NPCs/components/RelationshipNotification'; // TODO: Create this component
// import TraitEffectNotification from '../../features/Traits/components/containers/TraitEffectNotification'; // TODO: Create this component
import useTraitNotifications from '../../features/Traits/hooks/useTraitNotifications';
import useEssenceGeneration from '../../features/Essence/hooks/useEssenceGeneration'; // Add global hooks

interface GameContainerProps {
  children?: ReactNode; // Keep children prop if you ever need to override the layout
}

// Define the navigation items for the sidebar
const navItems: NavItem[] = [
  { id: 'game', label: 'Game', icon: <HomeIcon /> }, // Main game view
  { id: 'character', label: 'Character', icon: <PersonIcon /> },
  { id: 'inventory', label: 'Inventory', icon: <InventoryIcon /> },
  { id: 'traits', label: 'Traits', icon: <AutoFixHighIcon /> },
  { id: 'npcs', label: 'NPCs', icon: <PeopleIcon /> }, // Add NPCs navigation
  { id: 'quests', label: 'Quests', icon: <AssignmentIcon /> },
  { id: 'minions', label: 'Minions', icon: <GroupWorkIcon /> },
  { id: 'world', label: 'World Map', icon: <PublicIcon /> }, // Optional separate world map view
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const GameContainer: React.FC<GameContainerProps> = ({ children }) => {
  const [activeTabId, setActiveTabId] = useState<string>(navItems[0]?.id || 'game'); // Default to first tab
  // Add state for sidebar collapse if implementing collapsible sidebar
  // const [isCollapsed, setIsCollapsed] = useState(false);

  // Hooks for global features
  useEssenceGeneration(); // Run global hooks
  const traitNotificationsHook = useTraitNotifications();

  // If children are provided, render them directly (allows overriding the layout)
  if (children) {
    return <Box sx={{ display: 'flex', height: '100vh' }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      {/* Removed AppBar - Header logic can be within MainContentArea or a separate Header component if needed */}

      {/* Vertical Navigation Bar */}
      <VerticalNavBar
        navItems={navItems}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        // collapsed={isCollapsed} // Pass collapse state if implemented
      />

      {/* Main Content Area */}
      <MainContentArea activeTabId={activeTabId} />

      {/* Global Notifications */}
      {/* Ensure these notification components exist and function correctly */}
      {/* <RelationshipNotification /> */}
      {/* <TraitEffectNotification
        notifications={traitNotificationsHook.notifications as any[]} // Cast if needed
        onDismiss={traitNotificationsHook.dismissNotification}
      /> */}
    </Box>
  );
};

export default GameContainer;
