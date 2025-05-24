import React from 'react';
import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

/**
 * @deprecated MiddleColumn is deprecated as part of the legacy 3-column layout system
 * 
 * The 3-column layout (LeftColumn, MiddleColumn, RightColumn) has been replaced
 * by the more flexible GameLayout component with MainContentArea content management.
 * 
 * Migration Guide:
 * - Replace 3-column layout usage with GameLayout
 * - MainContentArea provides content rendering functionality previously in MiddleColumn
 * - Dynamic content switching via switch-based rendering
 * - Better performance and state management
 * 
 * @see src/layout/components/GameLayout.tsx
 * @see src/layout/components/MainContentArea.tsx
 * 
 * This component will be removed in a future version.
 */
export const MiddleColumn: React.FC = React.memo(() => {
  console.warn(
    'MiddleColumn is deprecated as part of legacy 3-column layout. ' +
    'Please migrate to GameLayout with MainContentArea content management.'
  );

  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>Legacy Component - MiddleColumn Deprecated</AlertTitle>
        <Typography variant="body2">
          MiddleColumn is part of the deprecated 3-column layout system.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Replacement:</strong> Use GameLayout with MainContentArea content management
        </Typography>
      </Alert>
      
      <Typography variant="h6" color="text.secondary">
        MiddleColumn - Legacy Component
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Content rendering functionality moved to MainContentArea component.
      </Typography>
    </Box>
  );
});

MiddleColumn.displayName = 'MiddleColumn';
