import React from 'react';
import { Box, Alert, AlertTitle, Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

/**
 * @deprecated RightColumn is deprecated as part of the legacy 3-column layout system
 * 
 * The 3-column layout (LeftColumn, MiddleColumn, RightColumn) has been replaced
 * by the more flexible GameLayout component with integrated content management.
 * 
 * Migration Guide:
 * - Replace 3-column layout usage with GameLayout
 * - Activity/logging functionality can be integrated into page components
 * - Better responsive design and performance
 * - Unified state management via useLayoutState hook
 * 
 * @see src/layout/components/GameLayout.tsx
 * @see src/pages/ for page-level component examples
 * 
 * This component will be removed in a future version.
 */
export const RightColumn: React.FC = React.memo(() => {
  console.warn(
    'RightColumn is deprecated as part of legacy 3-column layout. ' +
    'Please migrate to GameLayout or integrate logging into page components.'
  );

  return (
    <Box sx={{ p: 2 }}>
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ mb: 2 }}
      >
        <AlertTitle>Legacy Component - RightColumn Deprecated</AlertTitle>
        <Typography variant="body2">
          RightColumn is part of the deprecated 3-column layout system.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Replacement:</strong> Integrate functionality into GameLayout or page components
        </Typography>
      </Alert>
      
      <Typography variant="h6" color="text.secondary">
        RightColumn - Legacy Component
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Activity logging can be integrated into individual page components as needed.
      </Typography>
    </Box>
  );
});

RightColumn.displayName = 'RightColumn';
