import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { LeftColumnLayout, MiddleColumnLayout, RightColumnLayout } from '../../layout/columns';

/**
 * Main game layout component implementing the three-column structure
 * Delegates content rendering to column layout components and nested routes
 */
export const GameLayout: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Column - Status and Controls */}
        <Grid item xs={12} md={3}>
          <Box sx={{ height: '100%', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <LeftColumnLayout />
          </Box>
        </Grid>

        {/* Middle Column - Primary Content */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <MiddleColumnLayout />
          </Box>
        </Grid>

        {/* Right Column - Logs and Information */}
        <Grid item xs={12} md={3}>
          <Box sx={{ height: '100%', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <RightColumnLayout />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
