/**
 * @file NPCPanelContainer.tsx
 * @description Container component that connects NPCPanelUI to Redux state
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
// FIXED: Import the correct thunk for creating a copy
import { createCopyThunk } from '../../../Copy/state/CopyThunks';
import { selectNPCById, selectNPCLoading, selectNPCError } from '../../state/NPCSelectors';
import { initializeNPCsThunk } from '../../'; // Corrected import path
import { Box, Paper, Typography, Button, Tabs, Tab, CircularProgress } from '@mui/material';
import NPCOverviewTab from '../ui/tabs/NPCOverviewTab';
import NPCTradeTab from '../ui/tabs/NPCTradeTab';
import NPCQuestsTab from '../ui/tabs/NPCQuestsTab';
import NPCTraitsTab from '../ui/tabs/NPCTraitsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`npc-tabpanel-${index}`}
      aria-labelledby={`npc-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export interface NPCPanelContainerProps {
  // Props are no longer needed as they are derived from the route/redux
}

export const NPCPanelContainer: React.FC<NPCPanelContainerProps> = () => {
  const { npcId } = useParams<{ npcId: string }>();
  const dispatch = useAppDispatch();

  // Ensure NPC data is loaded
  useEffect(() => {
    dispatch(initializeNPCsThunk());
  }, [dispatch]);

  const npc = useAppSelector((state) => (npcId ? selectNPCById(state, npcId) : undefined));
  const isLoading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Handler for creating a copy
  const handleCreateCopy = () => {
    if (npc) {
      // FIXED: Dispatch the thunk with the correct payload
      dispatch(createCopyThunk({ npcId: npc.id }));
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading NPC data...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
        <Typography variant="h6" color="error">Error Loading NPC</Typography>
        <Typography paragraph color="error">{error}</Typography>
        {/* The back button is now handled by the parent NPCsPage */}
      </Paper>
    );
  }

  // Add a guard for missing npcId from the URL params
  if (!npcId) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
        <Typography variant="h6" color="error">Invalid NPC ID</Typography>
        <Typography paragraph>No NPC ID was provided in the URL.</Typography>
      </Paper>
    );
  }

  if (!npc) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
        <Typography variant="h6">NPC Not Found</Typography>
        <Typography paragraph>
          The selected NPC could not be found. They may not have been discovered yet.
        </Typography>
        {/* The back button is now handled by the parent NPCsPage */}
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">{npc.name}</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateCopy} // FIXED: Use the correct handler
        >
          Create Copy
        </Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="npc details tabs">
          <Tab label="Overview" id="npc-tab-0" />
          <Tab label="Quests" id="npc-tab-1" />
          <Tab label="Trade" id="npc-tab-2" />
          <Tab label="Traits" id="npc-tab-3" />
        </Tabs>
      </Box>
      <TabPanel value={currentTab} index={0}>
        <NPCOverviewTab npc={npc} />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <NPCQuestsTab npcId={npc.id} />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <NPCTradeTab npcId={npc.id} />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <NPCTraitsTab npcId={npc.id} />
      </TabPanel>
    </Box>
  );
};

export default NPCPanelContainer;