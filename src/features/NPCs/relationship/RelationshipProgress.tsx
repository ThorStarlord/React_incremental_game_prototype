import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

/**
 * Interface for RelationshipProgress component props
 */
interface RelationshipProgressProps {
  /** Current relationship value (0-100) */
  relationship: number;
  /** Description of the next milestone to achieve (optional) */
  nextMilestone?: string;
}

/**
 * Component that displays a progress bar for relationship advancement
 * 
 * @param relationship - Current relationship value
 * @param nextMilestone - Description of next milestone (optional)
 * @returns A progress bar component showing relationship advancement
 */
const RelationshipProgress: React.FC<RelationshipProgressProps> = ({ relationship, nextMilestone }) => {
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
