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
import CopyPortfolioPanel from '../features/Copy/components/ui/CopyPortfolioPanel';
import { selectCurrentEssence } from '../features/Essence/state/EssenceSelectors';
import { addNotification } from '../shared/state/NotificationSlice';

/**
 * CopiesPage component.
 *
 * This page serves as the main UI for the Copy System, allowing players
 * to view, manage, and explicitly allocate work across their created Copies.
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

  const baseList = useMemo(
    () => (tab === 0 ? segments.mature : tab === 1 ? segments.growing : segments.lowLoyalty),
    [tab, segments]
  );

  const visibleCopies = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = baseList;
    if (q) list = list.filter(copy => copy.name.toLowerCase().includes(q));
    if (roleFilter !== 'all') list = list.filter(copy => (copy.role ?? 'none') === roleFilter);
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
      for (const copy of visibleCopies) {
        // eslint-disable-next-line no-await-in-loop
        await dispatch(applySharePreferencesForCopyThunk({ copyId: copy.id, suppressNotify: true }));
      }
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
      for (const copy of visibleCopies) {
        // eslint-disable-next-line no-await-in-loop
        await dispatch(bolsterCopyLoyaltyThunk({ copyId: copy.id, suppressNotify: true }));
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
              View, develop, and deliberately allocate routine work across your created Copies.
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
        <>
          <CopyPortfolioPanel />

          <Paper sx={{ p: 2 }}>
            <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
              <Tab label={`Mature (${segments.mature.length})`} />
              <Tab label={`Growing (${segments.growing.length})`} />
              <Tab label={`Low Loyalty (${segments.lowLoyalty.length})`} />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                label="Search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                select
                size="small"
                label="Role"
                value={roleFilter}
                onChange={event => setRoleFilter(event.target.value as any)}
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
                onChange={event => setSortBy(event.target.value as any)}
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
                onChange={event => setSortDir(event.target.value as any)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="desc">Desc</MenuItem>
                <MenuItem value="asc">Asc</MenuItem>
              </TextField>
              <Button
                size="small"
                variant="contained"
                onClick={handleApplyPrefsAll}
                disabled={busyApplyAll || visibleCopies.length === 0}
              >
                Apply Share Prefs to All
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handleBolsterAll}
                disabled={busyBolsterAll || tab !== 2 || visibleCopies.length === 0}
              >
                Bolster All (Low Loyalty)
              </Button>
            </Box>
            <Grid container spacing={2}>
              {visibleCopies.map(copy => (
                <Grid item xs={12} md={6} lg={4} key={copy.id}>
                  <CopyCard copy={copy} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}
    </Container>
  );
});

CopiesPage.displayName = 'CopiesPage';

export default CopiesPage;