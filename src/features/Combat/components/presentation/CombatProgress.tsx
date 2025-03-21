import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface CombatProgressProps {
  currentEncounter: number;
  totalEncounters: number;
}

/**
 * Component to display combat encounter progress
 */
const CombatProgress: React.FC<CombatProgressProps> = ({ 
  currentEncounter, 
  totalEncounters 
}) => {
  // Only show progress when there are multiple encounters
  if (totalEncounters <= 1) {
    return null;
  }
  
  const progress = (currentEncounter / totalEncounters) * 100;
  
  return (
    <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16 }}>
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
        Encounter {currentEncounter + 1} of {totalEncounters}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );
};

export default CombatProgress;
