import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const RelationshipProgress = ({ relationship, nextMilestone }) => {
  // Calculate progress percentage toward next milestone
  const currentLevel = Math.floor(relationship / 10) * 10;
  const nextLevel = currentLevel + 10;
  const progress = ((relationship - currentLevel) / (nextLevel - currentLevel)) * 100;
  
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Level {currentLevel}</Typography>
        <Typography variant="body2">Level {nextLevel}</Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ height: 10, borderRadius: 5 }} 
      />
      {nextMilestone && (
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          Next: {nextMilestone} at level {nextLevel}
        </Typography>
      )}
    </Box>
  );
};

export default RelationshipProgress;