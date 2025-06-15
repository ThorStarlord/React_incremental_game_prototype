import React from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  AlertTitle,
  Paper,
  CircularProgress,
} from '@mui/material';
import { BugReport as DebugIcon } from '@mui/icons-material';
// Import the UI component and the necessary hooks/selectors
import NPCDebugPanel from '../features/NPCs/components/ui/NPCDebugPanel';
import { useAppSelector } from '../app/hooks';
import { selectAllNPCs, selectNPCLoading } from '../features/NPCs';

/**
 * DebugPage component.
 * 
 * This page serves as a container for various development and debugging tools.
 * It is only accessible in a development environment and now handles loading state.
 */
export const DebugPage: React.FC = React.memo(() => {
  // Fetch the necessary data at the page level
  const npcs = useAppSelector(selectAllNPCs);
  const isLoading = useAppSelector(selectNPCLoading);
  const npcList = Object.values(npcs);

  const renderContent = () => {
    if (isLoading && npcList.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Loading NPC data...</Typography>
        </Paper>
      );
    }

    if (npcList.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No NPCs Found</Typography>
          <Typography color="text.secondary">
            Ensure that `initializeNPCsThunk` is dispatched on app start and the data is loaded correctly.
          </Typography>
        </Paper>
      );
    }
    
    // Pass the loaded data as a prop to the "dumb" panel component
    return <NPCDebugPanel npcList={npcList} />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <DebugIcon color="primary" sx={{ fontSize: '2.5rem' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Debug & Testing Tools
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tools for testing game mechanics and state. This page is not available in production builds.
          </Typography>
        </Box>
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Developer Tools</AlertTitle>
        Changes made here can directly affect the game state and may lead to unexpected behavior. Use with caution.
      </Alert>

      {renderContent()}

    </Container>
  );
});

DebugPage.displayName = 'DebugPage';

export default DebugPage;