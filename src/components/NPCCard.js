import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import TraitAndNPCListDrawer from './TraitAndNPCListDrawer';
import TraitCard from './TraitCard';

const NPCCard = ({ npc, ...otherProps }) => {
  const [openList, setOpenList] = useState(false);

  return (
    <Card sx={{ position: 'relative', ...otherProps?.sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{npc.name}</Typography>
              <Typography variant="body2" color="text.secondary">{npc.role || "Character"}</Typography>
            </Box>
          </Box>
          
          <Box>
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpenList(true);
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {npc.powerLevel && npc.powerLevel > 1 && (
          <Chip 
            label={`Power Level: ${npc.powerLevel}x`} 
            color="warning" 
            size="small" 
            sx={{ mb: 1 }}
          />
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Relationship: <strong>{npc.relationship || 0}</strong>
          </Typography>
          
          {/* Add other NPC details here */}
        </Box>
      </CardContent>
      
      {/* Drawer component */}
      <TraitAndNPCListDrawer 
        open={openList} 
        onClose={() => setOpenList(false)} 
        focusedId={npc.id}
        sourceType="npc"
      />
    </Card>
  );
};

const TraitsList = ({ traits }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(traits).map(([id, trait]) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <TraitCard id={id} trait={trait} />
        </Grid>
      ))}
    </Grid>
  );
};

import React from 'react';
import { Grid } from '@mui/material';
import NPCCard from './NPCCard';

const NPCList = ({ npcs }) => {
  return (
    <Grid container spacing={2}>
      {npcs.map(npc => (
        <Grid item xs={12} sm={6} md={4} key={npc.id}>
          <NPCCard npc={npc} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NPCList;
export { TraitsList };