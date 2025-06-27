import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  initializeNPCsThunk,
  selectNPCLoading,
  selectNPCError,
  NPCPanelContainer,
  NPCListView,
  setSelectedNPCId, // Import the action
} from '../features/NPCs';

const NPCsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { npcId } = useParams<{ npcId?: string }>(); // This is the single source of truth

  const isLoading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  
  useEffect(() => {
    dispatch(initializeNPCsThunk());
  }, [dispatch]);

  // This is the only handler we need. It changes the URL.
  const handleSelectNPC = (id: string) => {
    dispatch(setSelectedNPCId(id));
    navigate(`/game/npcs/${id}`);
  };

  const handleBackToList = () => {
    dispatch(setSelectedNPCId(null));
    navigate('/game/npcs');
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return <Alert severity="error">Failed to load NPCs: {error}</Alert>;
  }

  // If we have an npcId in the URL, show the detail panel.
  if (npcId) {
    return (
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{p: 2, borderBottom: 1, borderColor: 'divider'}}>
                <Button onClick={handleBackToList}>← Back to NPC List</Button>
            </Box>
            <NPCPanelContainer npcId={npcId} onClose={handleBackToList} />
        </Paper>
    );
  }
  
  // Otherwise, show the list view.
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <NPCListView onSelectNPC={handleSelectNPC} selectedNPCId={npcId} />
    </Paper>
  );
};

export default NPCsPage;