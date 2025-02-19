import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableComponent from './DraggableComponent';
import Battle from './Battle';
import WorldMap from './panels/WorldMap';
import MainContent from './MainContent';
import styles from './styles/MiddleColumn.module.css';
import sharedStyles from './styles/shared.module.css';

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        sx={{ 
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'background.default',
          overflow: 'visible'
        }} 
        elevation={3}
      >
        <Typography variant="h6" align="center">Game World</Typography>
        
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'visible',
          mb: 2
        }}>
          <MainContent 
            selectedTownId={selectedTownId}
            selectedNpcId={selectedNpcId}
            selectedDungeon={selectedDungeon}
            isExploring={isExploring}
            onBackToWorldMap={onBackToWorldMap}
          />
        </Box>

        <Box sx={{ 
          flex: 1,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'visible',
          mb: 2
        }}>
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
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {components.map((componentId) => (
              <DraggableComponent key={componentId} id={componentId}>
                {renderComponent(componentId)}
              </DraggableComponent>
            ))}
          </Box>
        </SortableContext>
      </Paper>
    </Box>
  );
};

export default MiddleColumn;
