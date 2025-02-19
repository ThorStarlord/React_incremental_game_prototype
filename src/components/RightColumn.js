import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableComponent from './DraggableComponent';
import PlayerTraits from './PlayerTraits';

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper 
        sx={{ 
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'visible'
        }} 
        elevation={3}
      >
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Character Traits
        </Typography>
        <SortableContext 
          id="right"
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

export default RightColumn;
