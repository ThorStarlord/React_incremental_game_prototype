import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const NPCTabNav = ({ activeTab, setActiveTab }) => (
  <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
    <Tabs 
      value={activeTab} 
      onChange={(e, newValue) => setActiveTab(newValue)}
      aria-label="NPC interaction tabs"
    >
      <Tab label="Dialogue" value="dialogue" />
      <Tab label="Quests" value="quests" />
      <Tab label="History" value="history" />
      <Tab label="Relationship" value="relationship" />
      {/* Future feature: Trade tab can be added when implementation is ready */}
    </Tabs>
  </Box>
);

export default NPCTabNav;