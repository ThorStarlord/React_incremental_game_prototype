import React from 'react';
import { Box, Button } from '@mui/material';

interface CombatControlsProps {
  onRetreat: () => void;
  disabled?: boolean;
}

/**
 * Component for combat control buttons like retreat
 */
const CombatControls: React.FC<CombatControlsProps> = ({ 
  onRetreat,
  disabled = false
}) => {
  return (
    <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
      <Button 
        variant="outlined" 
        color="error" 
        size="small"
        onClick={onRetreat}
        disabled={disabled}
      >
        Retreat
      </Button>
    </Box>
  );
};

export default CombatControls;
