import React from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { Box, Paper, Button } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import {
  NPCListView,
  setSelectedNPCId,
} from '../features/NPCs';

const NPCsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { npcId } = useParams<{ npcId?: string }>();

  const handleSelectNPC = (id: string) => {
    dispatch(setSelectedNPCId(id));
    navigate(id);
  };

  const handleBackToList = () => {
    dispatch(setSelectedNPCId(null));
    navigate('/game/npcs');
  };

  // If we have an npcId in the URL, show the detail panel via the Outlet.
  // The back button is now part of the panel itself.
  if (npcId) {
    return (
      <Paper
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Button onClick={handleBackToList}>← Back to NPC List</Button>
        </Box>
        <Outlet />
      </Paper>
    );
  }

  // Otherwise, show the list view.
  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <NPCListView onSelectNPC={handleSelectNPC} selectedNPCId={npcId} />
    </Paper>
  );
};

export default NPCsPage;
