import React, { memo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

/**
 * Component to display combat loading state
 */
const CombatLoading: React.FC = memo(() => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography variant="body1">Preparing for combat...</Typography>
    </Box>
  );
});

CombatLoading.displayName = 'CombatLoading';

export default CombatLoading;
