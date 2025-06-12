/**
 * @file NPCsPage.tsx
 * @description Main page component for NPC management and interactions
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Fade,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Grid, // Import Grid as it might be used by NPCListView
} from '@mui/material';
import {
  Home,
  People,
  ArrowBack,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
// FIXED: Changed fetchNPCsThunk to initializeNPCsThunk
import {
  selectNPCs,
  selectNPCById,
  initializeNPCsThunk,
  selectNPCLoading,
  selectNPCError
} from '../features/NPCs';
import { NPCListView, NPCPanelContainer } from '../features/NPCs';

const NPCsPage: React.FC = () => {
  const navigate = useNavigate();
  const { npcId } = useParams<{ npcId?: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNPCId, setSelectedNPCId] = useState<string | null>(npcId || null);

  const npcs = useAppSelector(selectNPCs);
  const isLoading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  const selectedNPC = useAppSelector(state =>
    selectedNPCId ? selectNPCById(state, selectedNPCId) : null
  );

  useEffect(() => {
    // FIXED: Dispatch the correct thunk to load NPC data
    dispatch(initializeNPCsThunk());
  }, [dispatch]);

  useEffect(() => {
    setSelectedNPCId(npcId || null);
  }, [npcId]);

  const handleSelectNPC = (id: string) => {
    setSelectedNPCId(id);
    navigate(`/game/npcs/${id}`, { replace: true });
  };

  const handleBackToList = () => {
    setSelectedNPCId(null);
    navigate('/game/npcs', { replace: true });
  };

  const handleBreadcrumbClick = (event: React.MouseEvent, path: string) => {
    event.preventDefault();
    navigate(path);
  };

  const npcCount = Object.keys(npcs).length;
  const hasNPCs = npcCount > 0 && !isLoading && !error;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to load NPCs: {error}</Alert>
      </Box>
    );
  }
  
  // The rest of the component remains the same...
  if (isMobile) {
    return (
      <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header */}
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="/game"
              onClick={(e) => handleBreadcrumbClick(e, '/game')}
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Game
            </Link>
            {selectedNPCId && selectedNPC ? (
              <Link
                color="inherit"
                href="/game/npcs"
                onClick={(e) => { e.preventDefault(); handleBackToList(); }}
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <People sx={{ mr: 0.5 }} fontSize="inherit" />
                NPCs
              </Link>
            ) : (
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ mr: 0.5 }} fontSize="inherit" />
                NPCs
              </Typography>
            )}
            {selectedNPC && (
              <Typography color="text.primary">
                {selectedNPC.name}
              </Typography>
            )}
          </Breadcrumbs>
        </Box>

        {/* Mobile Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {selectedNPCId && selectedNPC ? (
             <Fade in={true} timeout={300} key={selectedNPCId}>
               <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                 <Box sx={{p:1, borderBottom: 1, borderColor: 'divider'}}>
                    <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBackToList}
                    fullWidth
                    >
                    Back to NPC List
                    </Button>
                 </Box>
                <NPCPanelContainer npcId={selectedNPCId} />
              </Paper>
            </Fade>
          ) : hasNPCs ? (
            <NPCListView
              onSelectNPC={handleSelectNPC}
              selectedNPCId={selectedNPCId || undefined}
              viewMode={viewMode}
            />
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <People sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6" gutterBottom>
                No NPCs Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NPCs will appear here once they are discovered or initialized
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="/game"
            onClick={(e) => handleBreadcrumbClick(e, '/game')}
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Game
          </Link>
          {selectedNPCId && selectedNPC ? (
            <Link
              color="inherit"
              href="/game/npcs"
              onClick={(e) => {
                e.preventDefault();
                handleBackToList();
              }}
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <People sx={{ mr: 0.5 }} fontSize="inherit" />
              NPCs ({npcCount})
            </Link>
          ) : (
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ mr: 0.5 }} fontSize="inherit" />
              NPCs ({npcCount})
            </Typography>
          )}
          {selectedNPC && (
            <Typography color="text.primary">
              {selectedNPC.name}
            </Typography>
          )}
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {selectedNPCId && selectedNPC ? selectedNPC.name : 'NPC Directory'}
          </Typography>
          
          {hasNPCs && !selectedNPCId && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                startIcon={<ViewModule />}
                onClick={() => setViewMode('grid')}
                size="small"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                startIcon={<ViewList />}
                onClick={() => setViewMode('list')}
                size="small"
              >
                List
              </Button>
            </Box>
          )}
           {selectedNPCId && selectedNPC && (
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackToList}
              variant="outlined"
            >
              Back to NPC List
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {hasNPCs ? (
          selectedNPCId && selectedNPC ? (
            <Fade in={true} timeout={300} key={selectedNPCId}>
              <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <NPCPanelContainer npcId={selectedNPCId} />
              </Paper>
            </Fade>
          ) : (
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <NPCListView
                onSelectNPC={handleSelectNPC}
                selectedNPCId={selectedNPCId || undefined}
                viewMode={viewMode}
              />
            </Paper>
          )
        ) : (
          <Paper 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 3 
            }}
          >
            <People sx={{ fontSize: 64, mb: 2, color: 'text.secondary' }} />
            <Typography variant="h5" gutterBottom>
              No NPCs Available
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              NPCs will appear here once they are discovered or initialized through gameplay
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default NPCsPage;