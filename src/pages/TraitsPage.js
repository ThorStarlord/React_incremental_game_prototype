import React from 'react';
import { Box, Grid } from '@mui/material';
import TraitList from '../components/TraitList';
import TraitSlots from '../components/TraitSlots';
import Page from '../components/Page';

const TraitsPage = () => {
  return (
    <Page title="Traits Management">
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <TraitSlots />
        </Grid>
        <Grid item xs={12} md={7}>
          <TraitList />
        </Grid>
      </Grid>
    </Page>
  );
};

export default TraitsPage;