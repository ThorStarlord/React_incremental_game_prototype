import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '../../app/hooks'; // Corrected path
// import { CombatLog } from '../../features/Combat/components/ui/CombatLog'; // Commented out
// import { DebugPanel } from '../../shared/components/ui/DebugPanel'; // Commented out

/**
 * Component that renders contextual content in the right column
 * based on current game state and conditions
 */
export const ContextualRightContent: React.FC = () => {
  // Example selectors - replace with actual state selectors
  const gameState = useAppSelector((state) => ({
    inCombat: false, // Replace with actual combat state selector
    isDevelopment: process.env.NODE_ENV === 'development',
    showDebugPanel: false // Replace with actual debug panel state selector
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Combat Log - only show during/after combat */}
      {/* {gameState.inCombat && (
        <CombatLog />
      )} */}
      
      {/* Debug Panel - only show in development or when enabled */}
      {/* {(gameState.isDevelopment || gameState.showDebugPanel) && (
        <DebugPanel />
      )} */}
    </Box>
  );
};
