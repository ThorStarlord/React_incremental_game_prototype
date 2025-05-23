import React from 'react';
import { Box, Typography } from '@mui/material';

// Import the components that will be displayed as content for each tab
import CharacterPanel from '../../features/Player/components/layout/CharacterPanel';
// Placeholder for Inventory - Create or import your actual component
// import InventoryList from '../../features/Inventory/components/containers/InventoryList';
import TraitSystemWrapper from '../../features/Traits/components/containers/TraitSystemWrapper';
// Import NPCs page
import NPCsPage from '../../pages/NPCsPage';
// Placeholder for Quests - Create or import your actual component
// import QuestsPage from '../../pages/QuestsPage';
// Placeholder for Minions - Create or import your actual component
// import MinionsPage from '../../pages/MinionsPage';
import SettingsPage from '../../pages/Settings';
// Placeholder for World Map - Create or import your actual component
// import WorldMap from '../../features/World/components/containers/WorldMap';
import GamePage from '../../pages/GamePage'; // Assuming GamePage is the main world/interaction view

interface MainContentAreaProps {
  activeTabId: string;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({ activeTabId }) => {  const renderContent = () => {
    switch (activeTabId) {
      case 'game': // Changed 'world' to 'game' to match nav item
        return <GamePage />; // Render GamePage for the main view
      case 'character':
        return <CharacterPanel />;
      case 'inventory':
         // return <InventoryList />; // Replace with your actual Inventory component
         return <Typography>Inventory Component Placeholder</Typography>;
      case 'traits':
        return <TraitSystemWrapper />;
      case 'npcs':
        return <NPCsPage />; // Add NPCs page
      case 'quests':
        // return <QuestsPage />; // Replace with your actual Quests component
        return <Typography>Quests Component Placeholder</Typography>;
      case 'minions':
         // return <MinionsPage />; // Replace with your actual Minions component
         return <Typography>Minions Component Placeholder</Typography>;
      case 'world': // Keep 'world' if you have a separate map view
         // return <WorldMap />; // Replace with your actual WorldMap component
         return <Typography>World Map Placeholder</Typography>;
      case 'settings':
        return <SettingsPage />;
      default:
        return <GamePage />; // Default to GamePage if no match
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        // Removed padding here, apply within specific content components or the header below
        overflowY: 'auto', // Allow content scrolling
        height: '100%', // Ensure it takes full height
        bgcolor: 'background.default',
        display: 'flex', // Added flex display
        flexDirection: 'column', // Stack header and content vertically
      }}
    >
      {/* Optional Header within the content area */}
      {/* You might move the EssenceDisplay and Title here */}
      {/* <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}> */}
        {/* Title based on activeTabId */}
        {/* EssenceDisplay */}
      {/* </Box> */}

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}> {/* Add padding here, ensure scrolling */}
        {renderContent()}
      </Box>
    </Box>
  );
};

export default MainContentArea;
