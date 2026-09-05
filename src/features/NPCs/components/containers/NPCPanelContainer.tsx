/**
 * @file NPCPanelContainer.tsx
 * @description Routed NPC detail container.
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks';
import { selectNPCById, selectNPCLoading, selectNPCError } from '../../state/NPCSelectors';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { CreateCopyModal } from '../../../Copy/components/ui/CreateCopyModal';
import NPCOverviewTab from '../ui/tabs/NPCOverviewTab';
import NPCDialogueTab from '../ui/tabs/NPCDialogueTab';
import NPCRelationshipTab from '../ui/tabs/NPCRelationshipTab';
import NPCTradeTab from '../ui/tabs/NPCTradeTab';
import NPCQuestsTab from '../ui/tabs/NPCQuestsTab';
import NPCTraitsTab from '../ui/tabs/NPCTraitsTab';
import MigratedRelationshipSummary from '../../../Relationships/components/MigratedRelationshipSummary';
import { selectUsesRelationshipConnectionAuthority } from '../../../Relationships/state/RelationshipSelectors';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export interface NPCPanelContainerProps {}

/**
 * The application already initializes NPC data at app startup, and New Game then
 * deliberately replaces it with the Willow-only onboarding seed. Do not fetch the
 * full NPC catalog again from this detail route: doing so would overwrite that
 * fresh-game state and silently restore Willow's legacy Affinity/connectionDepth.
 */
export const NPCPanelContainer: React.FC<NPCPanelContainerProps> = () => {
  const { npcId } = useParams<{ npcId: string }>();
  const npc = useAppSelector(state => (npcId ? selectNPCById(state, npcId) : undefined));
  const isLoading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  const usesRelationshipAuthority = useAppSelector(state =>
    npcId ? selectUsesRelationshipConnectionAuthority(state, npcId) : false
  );

  const [currentTab, setCurrentTab] = useState(0);
  const [isCreateCopyModalOpen, setCreateCopyModalOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (isLoading) {
    return (
      <Paper
        sx={{
          p: 2,
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
      </Paper>
    );
  }

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
      </Paper>
    );
  }

  // Migrated relationships use content-level evidence gates inside Dialogue,
  // Quests, Traits, and Relationship. Those surfaces must remain visible from
  // Connection 0 so a fresh player can discover what changes the bond.
  const questsLocked = !usesRelationshipAuthority && npc.affinity < 20;
  const traitsLocked = !usesRelationshipAuthority && npc.connectionDepth < 1;
  const tradeLocked = npc.affinity < 40;

  return (
    <>
      <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{npc.name}</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCreateCopyModalOpen(true)}
          >
            Create Copy
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
          {/* MUI Tabs expects Tab components as direct children. Wrapping a Tab in
              Tooltip/span causes Tabs to clone the wrapper, leaks Tab props onto the
              span, and prevents tab selection from changing. Use native title text
              for the legacy lock hint while keeping the required child structure. */}
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="npc details tabs" variant="scrollable" scrollButtons="auto">
            <Tab label="Overview" id="npc-tab-0" />
            <Tab label="Dialogue" id="npc-tab-1" />
            <Tab label="Relationship" id="npc-tab-2" />
            <Tab
              disabled={questsLocked}
              label="Quests"
              id="npc-tab-3"
              title={questsLocked ? 'Requires Affinity 20' : undefined}
            />
            <Tab
              disabled={traitsLocked}
              label="Traits"
              id="npc-tab-4"
              title={traitsLocked ? 'Requires Connection Depth 1' : undefined}
            />
            <Tab
              disabled={tradeLocked}
              label="Trade"
              id="npc-tab-5"
              title={tradeLocked ? 'Requires Affinity 40' : undefined}
            />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <NPCOverviewTab npc={npc} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <NPCDialogueTab npcId={npc.id} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          {usesRelationshipAuthority ? (
            <MigratedRelationshipSummary npc={npc} />
          ) : (
            <NPCRelationshipTab npc={npc} />
          )}
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <NPCQuestsTab npcId={npc.id} />
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          <NPCTraitsTab npcId={npc.id} />
        </TabPanel>
        <TabPanel value={currentTab} index={5}>
          <NPCTradeTab npcId={npc.id} />
        </TabPanel>
      </Box>

      <CreateCopyModal
        open={isCreateCopyModalOpen}
        onClose={() => setCreateCopyModalOpen(false)}
        npcId={npc.id}
        npcName={npc.name}
      />
    </>
  );
};

export default NPCPanelContainer;
