import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

/**
 * Simplified GameContainer that delegates content rendering to routes
 * and focuses on global layout structure and elements
 */
export const GameContainer: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Global Header/Navigation (if needed) */}
      {/* <GlobalHeader /> */}
      
      {/* Main Content Area - Delegated to Routes */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </Box>
      
      {/* Global Drawers/Modals (if needed) */}
      {/* <GlobalDrawer />
      <GlobalModal /> */}
    </Box>
  );
};
