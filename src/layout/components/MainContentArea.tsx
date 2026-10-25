import React, { Suspense } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import type { TabId } from '../types/NavigationTypes';

/**
 * Routed layout shell. AppRouter alone chooses which page renders through
 * GameLayout's Outlet; this component does not duplicate route or page state.
 */
export interface MainContentAreaProps {
  activeTabId?: TabId;
  className?: string;
  children?: React.ReactNode;
}

const LoadingPage: React.FC = () => (
  <Box role="status" sx={{
    display: 'flex', flexDirection: 'column', gap: 2, minHeight: 200,
    justifyContent: 'center', alignItems: 'center',
  }}>
    <CircularProgress size={36} />
    <Typography variant="body2" color="text.secondary">Loading your journey...</Typography>
  </Box>
);

export const MainContentArea: React.FC<MainContentAreaProps> = React.memo(({
  activeTabId = 'dashboard',
  className,
  children,
}) => (
  <Box component="main" role="main" aria-label={activeTabId + ' content area'}
    className={className} tabIndex={-1} sx={{
      flexGrow: 1, minWidth: 0, overflow: 'auto',
      bgcolor: 'background.default',
      position: 'relative',
      '&:focus': { outline: 'none' },
    }}>
    <Container maxWidth="xl" sx={{
      py: 3, px: { xs: 2, sm: 3 },
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', flexDirection: 'column',
    }}>
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </Container>
  </Box>
));
MainContentArea.displayName = 'MainContentArea';
export default MainContentArea;
