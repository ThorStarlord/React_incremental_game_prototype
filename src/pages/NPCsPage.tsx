import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  initializeNPCsThunk,
  selectNPCLoading,
  selectNPCError,
  NPCPanelContainer,
  NPCListView,
  setSelectedNPCId,
} from '../features/NPCs';

const NPCsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { npcId } = useParams<{ npcId?: string }>();

  const isLoading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  
  useEffect(() => {
    dispatch(initializeNPCsThunk());
  }, [dispatch]);

  const handleSelectNPC = (id: string) => {
    dispatch(setSelectedNPCId(id));
    navigate(id);
  };

  const handleBackToList = () => {
    dispatch(setSelectedNPCId(null));
    navigate('.');
  };

  return (
    <Routes>
      <Route path="/" element={
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <NPCListView onSelectNPC={handleSelectNPC} selectedNPCId={npcId} />
        </Paper>
      } />
      <Route path=":npcId" element={
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{p: 2, borderBottom: 1, borderColor: 'divider'}}>
            <Button onClick={handleBackToList}>← Back to NPC List</Button>
          </Box>
          <NPCPanelContainer npcId={npcId} onBack={handleBackToList} isLoading={isLoading} error={error} />
        </Paper>
      } />
    </Routes>
  );
};

export default NPCsPage;