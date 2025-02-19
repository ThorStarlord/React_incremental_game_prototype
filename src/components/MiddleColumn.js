import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Battle from './Battle';
import WorldMap from '../panels/WorldMap';
import TownArea from '../areas/TownArea';
import ExplorationArea from '../areas/ExplorationArea';
import './MiddleColumn.css';

const MiddleColumn = ({ selectedTownId, selectedNpcId, selectedDungeon, isExploring, onTownSelect, onBackToWorldMap }) => {
  const renderContent = () => {
    if (isExploring || selectedDungeon) {
      return <ExplorationArea />;
    }
    if (selectedTownId) {
      return <TownArea
        townId={selectedTownId}
        selectedNpcId={selectedNpcId}
        onBack={onBackToWorldMap}
      />;
    }
    return (
      <Box className="world-map-wrapper">
        <WorldMap
          onTownSelect={onTownSelect}
          onDungeonSelect={(dungeonId, regionId) => {
            console.log("Dungeon Selected:", dungeonId, regionId);
          }}
        />
      </Box>
    );
  };

  return (
    <Box id="middle-column" className="column">
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Main Content</Typography>
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default MiddleColumn;
