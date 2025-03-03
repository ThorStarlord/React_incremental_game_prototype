import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TaskIcon from '@mui/icons-material/Task';

/**
 * NPCTabNav - Navigation tabs for interactions with NPCs
 * 
 * @param {Object} props
 * @param {string} props.activeTab - The currently active tab
 * @param {Function} props.setActiveTab - Function to change the active tab
 * @returns {JSX.Element} Tab navigation component
 */
const NPCTabNav = ({ activeTab, setActiveTab }) => {
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="fullWidth"
        aria-label="NPC interaction tabs"
      >
        <Tab 
          icon={<ChatIcon />} 
          label="Dialogue" 
          value="dialogue" 
          id="tab-dialogue"
          aria-controls="tabpanel-dialogue"
        />
        <Tab 
          icon={<FavoriteIcon />} 
          label="Relationship" 
          value="relationship" 
          id="tab-relationship"
          aria-controls="tabpanel-relationship" 
        />
        <Tab 
          icon={<ShoppingCartIcon />} 
          label="Trade" 
          value="trade" 
          id="tab-trade"
          aria-controls="tabpanel-trade" 
        />
        <Tab 
          icon={<TaskIcon />} 
          label="Quests" 
          value="quests" 
          id="tab-quests"
          aria-controls="tabpanel-quests" 
        />
      </Tabs>
    </Box>
  );
};

export default NPCTabNav;
