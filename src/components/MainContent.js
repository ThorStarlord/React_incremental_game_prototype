import React from 'react';
import { Box, Typography } from '@mui/material';
import TownArea from './areas/TownArea';
import ExplorationArea from './areas/ExplorationArea';
import './MainContent.css';

const MainContent = ({ 
  selectedTownId, 
  selectedNpcId, 
  selectedDungeon, 
  isExploring, 
  onBackToWorldMap 
}) => {
  const renderGameContent = () => {
    if (isExploring || selectedDungeon) {
      return <ExplorationArea />;
    }
    if (selectedTownId) {
      return (
        <TownArea
          townId={selectedTownId}
          selectedNpcId={selectedNpcId}
          onBack={onBackToWorldMap}
        />
      );
    }
    return (
      <Typography>
        Welcome to the Main Content Area! Select a Town or Dungeon from the World Map below.
      </Typography>
    );
  };

  return (
    <Box id="main-content-area-dynamic" className="main-content">
      {renderGameContent()}
    </Box>
  );
};

export default MainContent;