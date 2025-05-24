import React from 'react';
import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

/**
 * @deprecated LeftColumn is deprecated as part of the legacy 3-column layout system
 * 
 * The 3-column layout (LeftColumn, MiddleColumn, RightColumn) has been replaced
 * by the more flexible GameLayout component with VerticalNavBar navigation.
 * 
 * Migration Guide:
 * - Replace 3-column layout usage with GameLayout
 * - VerticalNavBar provides navigation functionality previously in LeftColumn
 * - MainContentArea handles dynamic content rendering
 * - Layout state managed via useLayoutState hook
 * 
 * @see src/layout/components/GameLayout.tsx
 * @see src/layout/components/VerticalNavBar/VerticalNavBar.tsx
 * 
 * This component will be removed in a future version.
 */
export const LeftColumn: React.FC = React.memo(() => {
  console.warn(
    'LeftColumn is deprecated as part of legacy 3-column layout. ' +
    'Please migrate to GameLayout with VerticalNavBar navigation.'
  );

  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>Legacy Component - LeftColumn Deprecated</AlertTitle>
        <Typography variant="body2">
          LeftColumn is part of the deprecated 3-column layout system.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Replacement:</strong> Use GameLayout with VerticalNavBar navigation
        </Typography>
      </Alert>
      
      <Typography variant="h6" color="text.secondary">
        LeftColumn - Legacy Component
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Navigation functionality moved to VerticalNavBar component.
      </Typography>
    </Box>
  );
});

LeftColumn.displayName = 'LeftColumn';
