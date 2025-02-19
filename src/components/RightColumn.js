import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableComponent from './DraggableComponent';
import PlayerTraits from './PlayerTraits';
import './RightColumn.css';

const RightColumn = ({ components }) => {
  const renderComponent = (componentId) => {
    switch (componentId) {
      case 'PlayerTraits':
        return <PlayerTraits />;
      default:
        return null;
    }
  };

  return (
    <Box id="right-column" className="column">
      <Paper elevation={3} className="column-paper">
        <Typography variant="h6" align="center">Character Traits</Typography>
        <SortableContext 
          id="right"
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

export default RightColumn;
