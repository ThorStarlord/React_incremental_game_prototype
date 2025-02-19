import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableComponent from './DraggableComponent';
import PlayerStats from './PlayerStats';
import './LeftColumn.css';

const LeftColumn = ({ components }) => {
  const renderComponent = (componentId) => {
    switch (componentId) {
      case 'PlayerStats':
        return <PlayerStats />;
      default:
        return null;
    }
  };

  return (
    <Box id="left-column" className="column">
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Character</Typography>
        <SortableContext 
          id="left"
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

export default LeftColumn;
