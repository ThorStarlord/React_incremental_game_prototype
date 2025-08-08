import React from 'react';
import { Box, Container, Typography, Alert, AlertTitle, Grid, Divider, Tabs, Tab } from '@mui/material';
import { ContentCopy as CopiesIcon } from '@mui/icons-material';
import { useAppSelector } from '../app/hooks';
import { selectAllCopies, selectCopySegments } from '../features/Copy/state/CopySelectors';
import CopyCard from '../features/Copy/components/ui/CopyCard';

const CopyStat: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

/**
 * CopiesPage component.
 * 
 * This page serves as the main UI for the Copy System, allowing players
 * to view, manage, and interact with their created Copies.
 */
export const CopiesPage: React.FC = React.memo(() => {
  const copies = useAppSelector(selectAllCopies);
  const segments = useAppSelector(selectCopySegments);
  const [tab, setTab] = React.useState(0);

  const currentList = tab === 0 ? copies : tab === 1 ? segments.mature : tab === 2 ? segments.growing : segments.lowLoyalty;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CopiesIcon color="primary" sx={{ fontSize: '2.5rem' }} />
        <Box>
          <Typography variant="h4" component="h1">
            Copy Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your created Copies. Assign tasks and develop their abilities.
          </Typography>
        </Box>
      </Box>

      {copies.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>No Copies Created</AlertTitle>
          You have not created any Copies yet. Explore the world and build deep connections to unlock this potential.
        </Alert>
      ) : (
        <Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable" allowScrollButtonsMobile>
            <Tab label={`All (${copies.length})`} />
            <Tab label={`Mature (${segments.mature.length})`} />
            <Tab label={`Growing (${segments.growing.length})`} />
            <Tab label={`Low Loyalty (${segments.lowLoyalty.length})`} />
          </Tabs>
          <Grid container spacing={2}>
            {currentList.map(copy => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={copy.id}>
                <CopyCard copy={copy} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

    </Container>
  );
});

CopiesPage.displayName = 'CopiesPage';

export default CopiesPage;