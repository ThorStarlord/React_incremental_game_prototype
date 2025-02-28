import React from 'react';
import { Box } from '@mui/material';
import MinionPanel from '../components/MinionPanel';
import Page from '../components/Page';
import useMinionSimulation from '../hooks/useMinionSimulation';

const MinionsPage = () => {
  // Initialize the minion simulation
  useMinionSimulation();
  
  return (
    <Page title="Minions">
      <Box sx={{ mb: 3 }}>
        <MinionPanel />
      </Box>
    </Page>
  );
};

export default MinionsPage;