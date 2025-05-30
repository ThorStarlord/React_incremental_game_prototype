import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import { NotificationLog } from '../../features/Notifications/components/ui/NotificationLog'; // Commented out
// import { SystemMessages } from '../../shared/components/ui/SystemMessages'; // Commented out
import { ContextualRightContent } from './ContextualRightContent';

/**
 * Right column layout component that renders persistent system feedback
 * and provides slots for dynamic contextual content
 */
export const RightColumnLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        overflow: 'auto',
        p: 1
      }}
    >
      {/* Static/Persistent Components */}
      {/* <NotificationLog /> */}
      {/* <SystemMessages /> */}
      
      {/* Contextual Content Based on Game State */}
      <ContextualRightContent />
      
      {/* Dynamic Content Slot */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
