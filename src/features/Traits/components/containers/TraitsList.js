import React from 'react';
import { Grid } from '@mui/material';
import TraitCard from './TraitCard';

const TraitsList = ({ traits, npcs, onAcquire, essence, acquiredTraits }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(traits).map(([id, trait]) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <TraitCard 
            id={id} 
            trait={trait} 
            npcs={npcs}
            onAcquire={onAcquire}
            essence={essence}
            isAcquired={(acquiredTraits || []).includes(id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TraitsList;