import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Button,
  Tabs,
  Tab,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { ContentCopy as CopiesIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectAllCopies, selectCopySegments } from '../features/Copy/state/CopySelectors';
import { applySharePreferencesForCopyThunk, bolsterCopyLoyaltyThunk } from '../features/Copy/state/CopyThunks';
import CopyCard from '../features/Copy/components/ui/CopyCard';
import { selectCurrentEssence } from '../features/Essence/state/EssenceSelectors';
import { addNotification } from '../shared/state/NotificationSlice';
// import { COPY_SYSTEM } from '../constants/gameConstants';

// Reserved for future copy stats summary UI
// const CopyStat: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
//   <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
//     <Typography variant="body2" color="text.secondary">{label}</Typography>
//     <Typography variant="body2">{value}</Typography>
//   </Box>
// );

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
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'infiltrator' | 'researcher' | 'guardian' | 'agent' | 'none'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'maturity' | 'loyalty' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // const handleBolsterLoyalty = (copyId: string) => {
  //   dispatch(bolsterCopyLoyaltyThunk(copyId));
  // };

  const baseList = useMemo(() => (tab === 0 ? segments.mature : tab === 1 ? segments.growing : segments.lowLoyalty), [tab, segments]);

  const visibleCopies = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = baseList;
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q));
    if (roleFilter !== 'all') list = list.filter(c => (c.role ?? 'none') === roleFilter);
  const dir = sortDir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'name':
      return dir * a.name.localeCompare(b.name);
        case 'maturity':
      return dir * (a.maturity - b.maturity);
        case 'loyalty':
      return dir * (a.loyalty - b.loyalty);
        case 'createdAt':
        default:
      return dir * (a.createdAt - b.createdAt);
      }
    });
  }, [baseList, search, roleFilter, sortBy, sortDir]);

  const handleApplyPrefsAll = async () => {
    setBusyApplyAll(true);
    try {
      for (const c of visibleCopies) {
  // eslint-disable-next-line no-await-in-loop
  await dispatch(applySharePreferencesForCopyThunk({ copyId: c.id, suppressNotify: true }));
      }
      // Single coalesced notification
      dispatch(addNotification({
        type: 'success',
        message: `Applied share preferences to ${visibleCopies.length} cop${visibleCopies.length === 1 ? 'y' : 'ies'}.`,
      }));
    } finally {
      setBusyApplyAll(false);
    }
  };

  const handleBolsterAll = async () => {
    setBusyBolsterAll(true);
    try {
      for (const c of visibleCopies) {
  // eslint-disable-next-line no-await-in-loop
  await dispatch(bolsterCopyLoyaltyThunk({ copyId: c.id, suppressNotify: true }));
      }
      dispatch(addNotification({
        type: 'success',
        message: `Bolstered loyalty for ${visibleCopies.length} low-loyalty cop${visibleCopies.length === 1 ? 'y' : 'ies'}.`,
      }));
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
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <TextField
              select
              size="small"
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="all">All roles</MenuItem>
              <MenuItem value="infiltrator">Infiltrator</MenuItem>
              <MenuItem value="researcher">Researcher</MenuItem>
              <MenuItem value="guardian">Guardian</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="none">None</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="createdAt">Created</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="maturity">Maturity</MenuItem>
              <MenuItem value="loyalty">Loyalty</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Order"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as any)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="desc">Desc</MenuItem>
              <MenuItem value="asc">Asc</MenuItem>
            </TextField>
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