import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  List,
  ListItem,
  Divider,
  Chip,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { ContentCopy as CopiesIcon, Favorite as LoyaltyIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAllCopies, selectCopySegments } from '../features/Copy/state/CopySelectors';
import { applySharePreferencesForCopyThunk, bolsterCopyLoyaltyThunk } from '../features/Copy/state/CopyThunks';
import CopyCard from '../features/Copy/components/ui/CopyCard';
import { selectCurrentEssence } from '../features/Essence/state/EssenceSelectors';
import { COPY_SYSTEM } from '../constants/gameConstants';

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
  const dispatch = useAppDispatch();
  const copies = useAppSelector(selectAllCopies);
  const segments = useAppSelector(selectCopySegments);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const [tab, setTab] = useState(0);
  const [busyApplyAll, setBusyApplyAll] = useState(false);
  const [busyBolsterAll, setBusyBolsterAll] = useState(false);

  const handleBolsterLoyalty = (copyId: string) => {
    dispatch(bolsterCopyLoyaltyThunk(copyId));
  };

  const visibleCopies = useMemo(() => (tab === 0 ? segments.mature : tab === 1 ? segments.growing : segments.lowLoyalty), [tab, segments]);

  const handleApplyPrefsAll = async () => {
    setBusyApplyAll(true);
    try {
      for (const c of visibleCopies) {
        // eslint-disable-next-line no-await-in-loop
        await (dispatch as unknown as import('../app/store').AppDispatch)(applySharePreferencesForCopyThunk(c.id));
      }
    } finally {
      setBusyApplyAll(false);
    }
  };

  const handleBolsterAll = async () => {
    setBusyBolsterAll(true);
    try {
      for (const c of visibleCopies) {
        // eslint-disable-next-line no-await-in-loop
        await (dispatch as unknown as import('../app/store').AppDispatch)(bolsterCopyLoyaltyThunk(c.id));
      }
    } finally {
      setBusyBolsterAll(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6">{currentEssence.toFixed(2)}</Typography>
            <Typography variant="caption" color="text.secondary">Current Essence</Typography>
        </Box>
      </Box>

      {copies.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>No Copies Created</AlertTitle>
          You have not created any Copies yet. Explore the world and build deep connections to unlock this potential.
        </Alert>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label={`Mature (${segments.mature.length})`} />
            <Tab label={`Growing (${segments.growing.length})`} />
            <Tab label={`Low Loyalty (${segments.lowLoyalty.length})`} />
          </Tabs>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Button size="small" variant="contained" onClick={handleApplyPrefsAll} disabled={busyApplyAll || visibleCopies.length === 0}>Apply Share Prefs to All</Button>
            <Button size="small" variant="outlined" color="secondary" onClick={handleBolsterAll} disabled={busyBolsterAll || tab !== 2 || visibleCopies.length === 0}>Bolster All (Low Loyalty)</Button>
          </Box>
          <Grid container spacing={2}>
            {visibleCopies.map((copy) => (
              <Grid item xs={12} md={6} lg={4} key={copy.id}>
                <CopyCard copy={copy} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

    </Container>
  );
});

CopiesPage.displayName = 'CopiesPage';

export default CopiesPage;