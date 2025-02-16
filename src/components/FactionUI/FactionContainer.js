import React, { useState, useContext } from 'react';
import { GameStateContext } from '../../context/GameStateContext';
import { Box, Tabs, Tab } from '@mui/material';
import FactionOverview from './FactionOverview';
import FactionCreation from './FactionCreation';
import './FactionContainer.css';

const FactionContainer = () => {
  const { player } = useContext(GameStateContext);
  const [activeTab, setActiveTab] = useState(player.factionId ? 0 : 1);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFactionCreated = () => {
    setActiveTab(0); // Switch to overview after creation
  };

  return (
    <Box className="faction-container">
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Faction Overview" />
        <Tab label="Create Faction" disabled={!!player.factionId} />
      </Tabs>

      <Box className="faction-content">
        {activeTab === 0 && <FactionOverview />}
        {activeTab === 1 && <FactionCreation onComplete={handleFactionCreated} />}
      </Box>
    </Box>
  );
};

export default FactionContainer;