import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

/**
 * Middle column layout component that serves as the primary content area
 * for routed feature components
 */
export const MiddleColumnLayout: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Outlet />
    </Box>
  );
};
