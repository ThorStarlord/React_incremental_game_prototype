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