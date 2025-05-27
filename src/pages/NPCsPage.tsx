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
import { useAppSelector } from '../app/hooks';
import { selectNPCs, selectNPCById } from '../features/NPCs';
import { NPCListView } from '../features/NPCs';

/**
 * NPCsPage - Main page for NPC interactions
 * 
 * Features:
 * - NPC list/grid view with search and filtering
 * - Individual NPC interaction panel
 * - Responsive layout
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
  
  const npcs = useAppSelector(selectNPCs);
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
  const handleBreadcrumbClick = (event: React.MouseEvent, path: string) => {
    event.preventDefault();
    navigate(path);
  };

  // Check if NPCs are available
  const npcCount = Object.keys(npcs).length;
  const hasNPCs = npcCount > 0;

  // Mobile view: show either list or detail
  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
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
        <Fade in={true} timeout={300}>
          <Box>
            {hasNPCs ? (
              <NPCListView
                onSelectNPC={handleSelectNPC}
                selectedNPCId={selectedNPCId || undefined}
                viewMode={viewMode}
              />
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
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
        </Fade>
      </Box>
    );
  }

  // Desktop view: responsive layout
  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'hidden' }}>
      {/* Desktop Header */}
      <Box sx={{ mb: 3 }}>
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
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            NPCs ({npcCount})
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
          
          {hasNPCs && (
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
        </Box>
      </Box>

      {/* Desktop Layout */}
      {hasNPCs ? (
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 140px)' }}>
          {/* Left Column: NPC List */}
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={8}>
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
                  <Box sx={{ height: '100%', overflow: 'auto' }}>
                    {/* Use NPCPanel directly for detailed NPC view */}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h5" gutterBottom>
                        {selectedNPC.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Detailed NPC interaction interface will be displayed here.
                        This area is reserved for the comprehensive NPC panel with tabs for
                        Overview, Dialogue, Trade, Quests, and Traits.
                      </Typography>
                      {/* TODO: Replace with actual NPCPanel component when available */}
                      <Box sx={{ 
                        p: 3, 
                        bgcolor: 'background.default', 
                        borderRadius: 1,
                        border: '1px dashed',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          NPCPanel Component Integration Pending
                        </Typography>
                      </Box>
                    </Box>
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
                    p: 3,
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
      ) : (
        <Paper 
          sx={{ 
            height: 'calc(100vh - 140px)', 
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
  );
};

export default NPCsPage;
