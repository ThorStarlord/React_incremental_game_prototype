import React from 'react';
import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

/**
 * @deprecated GameContainer is deprecated in favor of GameLayout component
 * 
 * This component was part of the legacy 3-column layout system and has been
 * replaced by the more flexible and performant GameLayout component.
 * 
 * Migration Guide:
 * - Replace GameContainer usage with GameLayout
 * - GameLayout provides unified layout state management via useLayoutState hook
 * - GameLayout includes responsive design and AppRouter integration
 * - GameLayout handles both VerticalNavBar and MainContentArea integration
 * 
 * @see src/layout/components/GameLayout.tsx
 * @see src/routes/AppRouter.tsx for proper integration
 * 
 * This component will be removed in a future version.
 */
export const GameContainer: React.FC = React.memo(() => {
  console.warn(
    'GameContainer is deprecated. Please migrate to GameLayout component. ' +
    'See src/layout/components/GameLayout.tsx for the replacement.'
  );

  return (
    <Box sx={{ p: 3 }}>
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>Legacy Component - GameContainer Deprecated</AlertTitle>
        <Typography variant="body2">
          This GameContainer component is deprecated and scheduled for removal.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Migration Required:</strong> Replace with GameLayout component 
          located at <code>src/layout/components/GameLayout.tsx</code>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Benefits:</strong> GameLayout provides unified state management, 
          responsive design, AppRouter integration, and better performance.
        </Typography>
      </Alert>
      
      <Typography variant="h5" color="text.secondary">
        GameContainer - Legacy Component
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This component has been replaced by GameLayout. Please update your imports 
        and usage to use the new layout system.
      </Typography>
    </Box>
  );
});

GameContainer.displayName = 'GameContainer';
