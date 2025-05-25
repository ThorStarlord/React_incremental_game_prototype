import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { NPCListView } from '../features/Npcs/components/containers/NPCListView';

/**
 * NPCPage component - Main page for NPC interaction and management
 * 
 * Features:
 * - Complete NPC interaction system
 * - Relationship management
 * - Tabbed interface for different interaction types
 * - Mobile-responsive design
 */
export const NPCPage: React.FC = React.memo(() => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          NPCs & Relationships
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 4 }}
        >
          Manage your relationships with NPCs, engage in dialogue, trade, and discover new traits.
        </Typography>
        
        <NPCListView />
      </Box>
    </Container>
  );
});

NPCPage.displayName = 'NPCPage';

export default NPCPage;
