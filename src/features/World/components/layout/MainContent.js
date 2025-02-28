import React from 'react';
import { Box, Typography } from '@mui/material';
import TownArea from './areas/TownArea';
import ExplorationArea from './areas/ExplorationArea';

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
    <Box 
      id="main-content-area-dynamic" 
      sx={{
        height: '100%',
        overflowY: 'hidden',
        position: 'relative'
      }}
    >
      <Box 
        sx={{
          p: 2.5,
          border: 1,
          borderStyle: 'dashed',
          borderColor: 'grey.400',
          borderRadius: 1,
          bgcolor: 'background.paper',
          mb: 2.5,
          flex: 1,
          minHeight: 200,
          maxHeight: 300,
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          overflow: 'hidden',
        }}
      >
        {renderGameContent()}
      </Box>
    </Box>
  );
};

export default MainContent;