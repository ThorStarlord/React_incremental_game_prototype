import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import CopyDetailPanel from '../features/Copy/components/ui/CopyDetailPanel';
import { COPY_SYSTEM } from '../constants/gameConstants';
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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const copies = useAppSelector(selectAllCopies);
  const segments = useAppSelector(selectCopySegments);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const selectedCopyId = params.get('copy');
  const selectedCopy = copies.find(copy => copy.id === selectedCopyId);
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

  // Bulk commands apply to the currently filtered list, not every Copy in the save.
  // A resolved dispatch does not mean the thunk was fulfilled.
  const handleApplyPrefsAll = async () => {
    setBusyApplyAll(true);
    let changed = 0;
    let failed = 0;
    try {
      for (const copy of visibleCopies) {
        // eslint-disable-next-line no-await-in-loop
        const result = await dispatch(applySharePreferencesForCopyThunk({ copyId: copy.id, suppressNotify: true }));
        if (applySharePreferencesForCopyThunk.fulfilled.match(result)) {
          changed += result.payload.applied;
        } else {
          failed += 1;
        }
      }
      dispatch(addNotification({
        type: failed ? 'warning' : changed ? 'success' : 'info',
        message: failed
          ? `Applied ${changed} Trait share(s); ${failed} Copy operation(s) failed. Inspect individual Copy readiness.`
          : changed
            ? `Applied ${changed} Trait share(s) to the filtered Copies.`
            : 'No eligible Trait share preferences were applied to the filtered Copies.',
      }));
    } finally {
      setBusyApplyAll(false);
    }
  };

  const handleBolsterAll = async () => {
    setBusyBolsterAll(true);
    let succeeded = 0;
    let failed = 0;
    try {
      for (const copy of visibleCopies) {
        // eslint-disable-next-line no-await-in-loop
        const result = await dispatch(bolsterCopyLoyaltyThunk({ copyId: copy.id, suppressNotify: true }));
        if (bolsterCopyLoyaltyThunk.fulfilled.match(result)) succeeded += 1;
        else failed += 1;
      }
      dispatch(addNotification({
        type: failed ? 'warning' : succeeded ? 'success' : 'info',
        message: `Bolstered ${succeeded} of ${visibleCopies.length} filtered Copies.` +
          (failed ? ` ${failed} could not be bolstered (e.g. insufficient Essence or maximum loyalty).` : ''),
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
              Delegate mastered routines, manage standing orders, and develop your Copies.
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
            <Button size="small" variant="contained" onClick={handleApplyPrefsAll} disabled={busyApplyAll || busyBolsterAll || visibleCopies.length === 0}>Apply Share Prefs ({visibleCopies.length})</Button>
            <Button size="small" variant="outlined" color="secondary" onClick={handleBolsterAll} disabled={busyBolsterAll || busyApplyAll || tab !== 2 || visibleCopies.length === 0}>Bolster Filtered ({visibleCopies.length})</Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Bulk actions target the {visibleCopies.length} Copies visible in this tab after search and role filters. Bolstering costs {COPY_SYSTEM.BOLSTER_LOYALTY_COST} Essence per successful Copy (up to {COPY_SYSTEM.BOLSTER_LOYALTY_COST * visibleCopies.length} Essence); insufficient funds may prevent some actions.
          </Typography>
          <Grid container spacing={2}>
            {visibleCopies.map((copy) => (
              <Grid item xs={12} md={6} lg={4} key={copy.id}>
                <CopyCard copy={copy} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      {selectedCopy && (
        <CopyDetailPanel copyId={selectedCopy.id} open onClose={() => navigate('/game/copies', { replace: true })} />
      )}
    </Container>
  );
});

CopiesPage.displayName = 'CopiesPage';

export default CopiesPage;