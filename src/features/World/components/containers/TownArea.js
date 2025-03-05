import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Grid, Button, LinearProgress, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Panel from '../../../../shared/components/layout/Panel';
import BreadcrumbNav from '../../../../shared/components/ui/BreadcrumbNav';
// Fix the import path for useThemeUtils
import useThemeUtils from '../../../../shared/hooks/useThemeUtils';
import { useGameState } from '../../../../context/index';

// Define towns data
const towns = [
  { id: 'oakhaven', name: 'Oakhaven', description: 'A peaceful village nestled among ancient oak trees.' },
  { id: 'riverwood', name: 'Riverwood', description: 'A small settlement by the flowing river.' },
  { id: 'stonefangHold', name: 'Stonefang Hold', description: 'A fortress carved into the mountain.' },
  { id: 'saltyWharf', name: 'Salty Wharf', description: 'A coastal trading port with bustling markets.' }
];

const TownArea = ({ townId }) => {
  const navigate = useNavigate();
  const { getProgressColor } = useThemeUtils();
  const { npcs: gameNpcs = [] } = useGameState();
  const town = towns.find(t => t.id === townId);

  // Add safety check to ensure gameNpcs is an array before filtering
  const townNpcs = Array.isArray(gameNpcs) 
    ? gameNpcs.filter(npc => npc && npc.location === townId)
    : [];

  const getRelationshipColor = (value) => {
    if (value >= 60) return '#4CAF50';
    if (value >= 30) return '#2196F3';
    if (value >= 0) return '#9E9E9E';
    if (value >= -30) return '#FF9800';
    return '#F44336';
  };

  return (
    <Box sx={{ p: 2 }}>
      <BreadcrumbNav />
      <Panel title={town?.name || 'Town'}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/game')} size="large">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{town?.description}</Typography>
        </Box>

        <Grid container spacing={2}>
          {townNpcs.map((npc) => (
            <Grid item xs={12} sm={6} md={4} key={npc.id}>
              <Panel 
                title={npc.name}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: getRelationshipColor(npc.relationship || 0),
                    transition: 'background-color 0.3s ease'
                  }
                }}
              >
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {npc.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Relationship
                  </Typography>
                  <Tooltip 
                    title={`${npc.relationship || 0}/100`}
                    arrow
                    placement="top"
                  >
                    <LinearProgress
                      variant="determinate"
                      value={(npc.relationship + 100) / 2} // Convert -100/100 to 0/100
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        bgcolor: 'grey.200',
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getRelationshipColor(npc.relationship || 0)
                        }
                      }}
                    />
                  </Tooltip>
                </Box>

                {npc.type === 'Trader' && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Has special items at higher relationship levels
                  </Typography>
                )}

                {npc.type === 'Mentor' && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Can teach new abilities at higher relationship levels
                  </Typography>
                )}

                {npc.type === 'Quest Giver' && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Offers more rewarding quests at higher relationship levels
                  </Typography>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/npc/${npc.id}`)}
                  sx={{ mt: 2 }}
                >
                  Talk to {npc.name}
                </Button>
              </Panel>
            </Grid>
          ))}
        </Grid>
      </Panel>
    </Box>
  );
};

export default TownArea;