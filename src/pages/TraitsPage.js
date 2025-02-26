import React from 'react';
import { Grid, Box } from '@mui/material';
import TraitList from '../components/TraitList';
import TraitSlots from '../components/TraitSlots';
import Page from '../components/Page';

const TraitsPage = () => {
  return (
    <Page title="Traits">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TraitSlots />
        </Grid>
        <Grid item xs={12}>
          <TraitList />
        </Grid>
      </Grid>
    </Page>
  );
};

export default TraitsPage;