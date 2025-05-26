/**
 * @file NPCsPage.tsx
 * @description Main page component for NPC management and interactions
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  People,
  ArrowBack,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllNPCs, selectNPCById } from '../features/NPCs/state/NPCSelectors';
import { NPCListView } from '../features/NPCs/components/containers/NPCListView';

/**
 * NPCsPage - Main page for NPC interactions
 * 
 * Features:
 * - NPC list/grid view with search and filtering
 * - Individual NPC interaction panel
 * - Responsive three-column layout
 * - Breadcrumb navigation
 * - View mode toggle (list/grid)
 */
const NPCsPage: React.FC = () => {
  const navigate = useNavigate();
  const { npcId } = useParams<{ npcId?: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNPCId, setSelectedNPCId] = useState<string | null>(npcId || null);
  
  const npcs = useAppSelector(selectAllNPCs);
  const selectedNPC = useAppSelector(state => 
    selectedNPCId ? selectNPCById(state, selectedNPCId) : null
  );

  // Update selected NPC when URL parameter changes
  useEffect(() => {
    if (npcId && npcId !== selectedNPCId) {
      setSelectedNPCId(npcId);
    }
  }, [npcId, selectedNPCId]);

  // Handle NPC selection
  const handleSelectNPC = (npcId: string) => {
    setSelectedNPCId(npcId);
    navigate(`/game/npcs/${npcId}`, { replace: true });
  };

  // Handle back to list (mobile)
  const handleBackToList = () => {
    setSelectedNPCId(null);
    navigate('/game/npcs', { replace: true });
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  // Mobile view: show either list or detail
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {/* Mobile Header */}
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="#"
              onClick={() => handleBreadcrumbClick('/game')}
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Game
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ mr: 0.5 }} fontSize="inherit" />
              NPCs
            </Typography>
            {selectedNPC && (
              <Typography color="text.primary">
                {selectedNPC.name}
              </Typography>
            )}
          </Breadcrumbs>

          {selectedNPC && (
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackToList}
              sx={{ mb: 2 }}
            >
              Back to NPCs
            </Button>
          )}
        </Box>

        {/* Mobile Content */}
        {selectedNPCId && selectedNPC ? (
          <Fade in={true} timeout={300}>
            <Box>
              <NPCListView
                onSelectNPC={handleSelectNPC}
                selectedNPCId={selectedNPCId || undefined}
                viewMode={viewMode}
              />
            </Box>
          </Fade>
        ) : (
          <Fade in={true} timeout={300}>
            <Box>
              <NPCListView
                onSelectNPC={handleSelectNPC}
                selectedNPCId={selectedNPCId || undefined}
                viewMode={viewMode}
              />
            </Box>
          </Fade>
        )}
      </Box>
    );
  }

  // Desktop view: three-column layout
  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'hidden' }}>
      {/* Desktop Header */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            color="inherit"
            href="#"
            onClick={() => handleBreadcrumbClick('/game')}
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Game
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            NPCs
          </Typography>
          {selectedNPC && (
            <Typography color="text.primary">
              {selectedNPC.name}
            </Typography>
          )}
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            NPC Interactions
          </Typography>
          
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
        </Box>
      </Box>

      {/* Desktop Three-Column Layout */}
      <Grid container spacing={3} sx={{ height: 'calc(100vh - 140px)' }}>
        {/* Left Column: NPC List */}
        <Grid item xs={4}>
          <Paper
            sx={{
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NPCListView
              onSelectNPC={handleSelectNPC}
              selectedNPCId={selectedNPCId || undefined}
              viewMode={viewMode}
            />
          </Paper>
        </Grid>

        {/* Right Column: NPC Details */}
        <Grid item xs={8}>
          <Paper
            sx={{
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {selectedNPCId && selectedNPC ? (
              <Fade in={true} timeout={300} key={selectedNPCId}>
                <Box sx={{ height: '100%' }}>
                  <NPCListView npcId={selectedNPCId} />
                </Box>
              </Fade>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'text.secondary',
                }}
              >
                <People sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select an NPC
                </Typography>
                <Typography variant="body2" textAlign="center">
                  Choose an NPC from the list to view their details and interact with them
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NPCsPage;
