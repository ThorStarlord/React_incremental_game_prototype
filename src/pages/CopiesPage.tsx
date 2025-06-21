import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import { ContentCopy as CopiesIcon } from '@mui/icons-material';
// This page does not need to import other pages.

/**
 * CopiesPage component.
 * 
 * This page serves as the main UI for the Copy System, allowing players
 * to view, manage, and interact with their created Copies.
 */
export const CopiesPage: React.FC = React.memo(() => {
  // In the future, we will use selectors to get the list of copies
  // const copies = useAppSelector(selectAllCopies);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CopiesIcon color="primary" sx={{ fontSize: '2.5rem' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Copy Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your created Copies. Assign tasks and develop their abilities.
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Feature In Development</AlertTitle>
        The Copy System is a core upcoming feature. This page will be where you manage everything related to your Copies. The Redux slice and data types have been created.
      </Alert>
      
      {/* This is where the main UI for the Copy system will go. */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">My Copies</Typography>
        <Typography color="text.secondary" sx={{mt: 2, textAlign: 'center'}}>
            (The list of created Copies will be displayed here in a future update.)
        </Typography>
        {/* Example of future component: <CopiesList copies={copies} /> */}
      </Paper>

    </Container>
  );
});

CopiesPage.displayName = 'CopiesPage';

export default CopiesPage;