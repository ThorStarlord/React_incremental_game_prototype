import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableComponent from './DraggableComponent';
import Battle from './Battle';
import WorldMap from './panels/WorldMap';
import MainContent from './MainContent';
import './MiddleColumn.css';

const MiddleColumn = ({ 
  components,
  selectedTownId, 
  selectedNpcId, 
  selectedDungeon, 
  isExploring, 
  onTownSelect, 
  onBackToWorldMap 
}) => {
  const renderComponent = (componentId) => {
    switch (componentId) {
      case 'Battle':
        return <Battle />;
      default:
        return null;
    }
  };

  return (
    <Box id="middle-column" className="column">
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Game World</Typography>
        
        <Box className="main-content-container">
          <MainContent 
            selectedTownId={selectedTownId}
            selectedNpcId={selectedNpcId}
            selectedDungeon={selectedDungeon}
            isExploring={isExploring}
            onBackToWorldMap={onBackToWorldMap}
          />
        </Box>

        <Box className="world-map-wrapper">
          <WorldMap
            onTownSelect={onTownSelect}
            onDungeonSelect={(dungeonId, regionId) => {
              console.log("Dungeon Selected:", dungeonId, regionId);
            }}
          />
        </Box>

        <SortableContext 
          id="middle"
          items={components}
          strategy={verticalListSortingStrategy}
        >
          {components.map((componentId) => (
            <DraggableComponent key={componentId} id={componentId}>
              {renderComponent(componentId)}
            </DraggableComponent>
          ))}
        </SortableContext>
      </Paper>
    </Box>
  );
};

export default MiddleColumn;
