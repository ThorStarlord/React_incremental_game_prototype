import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Grid, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Panel from '../Panel';
import BreadcrumbNav from '../BreadcrumbNav';
import { towns } from '../../modules/data';

const TownArea = ({ townId }) => {
  const navigate = useNavigate();
  const town = towns.find(t => t.id === townId);

  const npcs = [
    { id: 'merchant', name: 'Town Merchant', description: 'Sells various goods and equipment' },
    { id: 'blacksmith', name: 'Blacksmith', description: 'Can forge and upgrade weapons' },
    { id: 'elder', name: 'Town Elder', description: 'Offers quests and wisdom' }
  ];

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
          {npcs.map((npc) => (
            <Grid item xs={12} sm={6} md={4} key={npc.id}>
              <Panel title={npc.name}>
                <Typography sx={{ mb: 2 }}>{npc.description}</Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/npc/${npc.id}`)}
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