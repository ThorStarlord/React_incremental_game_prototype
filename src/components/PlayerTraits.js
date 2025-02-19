import React, { useContext } from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { GameStateContext } from '../context/GameStateContext';

const PlayerTraits = () => {
  const { player, traits } = useContext(GameStateContext);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'player-traits-window',
    data: { type: 'window', windowType: 'player-traits' }
  });

  const renderAcquiredTraits = () => {
    if (!player.acquiredTraits.length) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No traits acquired yet
        </Typography>
      );
    }

    return player.acquiredTraits.map(traitId => {
      const trait = traits.copyableTraits[traitId];
      return (
        <Paper
          key={traitId}
          elevation={1}
          sx={{
            p: 1.5,
            mb: 1,
            '&:last-child': { mb: 0 },
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
            {trait.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {trait.description}
          </Typography>
          <Chip
            size="small"
            label={trait.type}
            color="primary"
            variant="outlined"
          />
        </Paper>
      );
    });
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        width: '100%',
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition: 'transform 0.2s ease'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        Acquired Traits
      </Typography>
      <Box sx={{ 
        mt: 2,
        maxHeight: '300px',
        overflow: 'auto'
      }}>
        {renderAcquiredTraits()}
      </Box>
    </Box>
  );
};

export default PlayerTraits;