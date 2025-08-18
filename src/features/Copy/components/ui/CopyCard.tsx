import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardActions, LinearProgress, Typography, Box, Button, Tooltip, TextField, Collapse, Stack, Chip } from '@mui/material';
import CopyTraitSlots from './CopyTraitSlots';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BoltIcon from '@mui/icons-material/Bolt';
import type { Copy } from '../../state/CopyTypes';
import { useAppDispatch } from '../../../../app/hooks';
import { applySharePreferencesForCopyThunk, bolsterCopyLoyaltyThunk, promoteCopyToAcceleratedThunk } from '../../state/CopyThunks';
import { setCopyTask } from '../../state/CopySlice';
import CopyDetailPanel from './CopyDetailPanel';

interface CopyCardProps {
  copy: Copy;
}

export const CopyCard: React.FC<CopyCardProps> = ({ copy }) => {
  const dispatch = useAppDispatch();
  const [taskEditOpen, setTaskEditOpen] = useState(false);
  const [taskValue, setTaskValue] = useState(copy.currentTask || '');
  const [busy, setBusy] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [busyApply, setBusyApply] = useState(false);

  const handleBolster = useCallback(async () => {
    setBusy(true);
    await dispatch(bolsterCopyLoyaltyThunk(copy.id));
    setBusy(false);
  }, [dispatch, copy.id]);

  const handlePromote = useCallback(async () => {
    setBusy(true);
    try {
      await dispatch(promoteCopyToAcceleratedThunk(copy.id));
    } catch (error) {
      console.error('Failed to promote copy to accelerated:', error);
    } finally {
      setBusy(false);
    }
  }, [dispatch, copy.id]);

  const handleSaveTask = useCallback(() => {
    dispatch(setCopyTask({ copyId: copy.id, task: taskValue.trim() || null }));
    setTaskEditOpen(false);
  }, [dispatch, copy.id, taskValue]);

  const handleApplyPrefs = useCallback(async () => {
    setBusyApply(true);
    try {
      await (dispatch as unknown as import('../../../../app/store').AppDispatch)(applySharePreferencesForCopyThunk(copy.id));
    } finally {
      setBusyApply(false);
    }
  }, [dispatch, copy.id]);

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{copy.name}</Typography>
            {copy.growthType === 'accelerated' && <Chip size="small" color="warning" label="Accelerated" icon={<BoltIcon fontSize="small"/>} />}
            {copy.role && copy.role !== 'none' && (
              <Chip size="small" color="info" variant="outlined" label={copy.role.charAt(0).toUpperCase() + copy.role.slice(1)} />
            )}
          </Box>
        }
        subheader={`ID: ${copy.id}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box mb={1}>
          <Typography variant="caption" color="text.secondary">Maturity</Typography>
          <LinearProgress value={copy.maturity} variant="determinate" sx={{ mt: 0.5 }} />
          <Typography variant="body2" sx={{ mt: 0.5 }}>{copy.maturity.toFixed(1)}%</Typography>
        </Box>
        <Box mb={1}>
          <Typography variant="caption" color="text.secondary">Loyalty</Typography>
          <LinearProgress value={copy.loyalty} color="secondary" variant="determinate" sx={{ mt: 0.5 }} />
          <Typography variant="body2" sx={{ mt: 0.5 }}>{copy.loyalty.toFixed(1)}%</Typography>
        </Box>
  <CopyTraitSlots copyId={copy.id} />
        <Typography variant="body2" color="text.secondary">Location: {copy.location}</Typography>
        <Typography variant="body2" color="text.secondary">Parent NPC: {copy.parentNPCId}</Typography>
        {copy.currentTask && !taskEditOpen && (
          <Typography variant="body2" sx={{ mt: 1 }}>Task: {copy.currentTask}</Typography>
        )}
        <Collapse in={taskEditOpen} unmountOnExit>
          <TextField
            fullWidth
            size="small"
            label="Assign Task"
            value={taskValue}
            onChange={(e) => setTaskValue(e.target.value)}
            sx={{ mt: 1 }}
            placeholder="e.g., Gathering intel"
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button size="small" variant="contained" onClick={handleSaveTask} startIcon={<TaskAltIcon />}>Save</Button>
            <Button size="small" onClick={() => { setTaskEditOpen(false); setTaskValue(copy.currentTask || ''); }}>Cancel</Button>
          </Stack>
        </Collapse>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Tooltip title="Bolster Loyalty (costs Essence)">
          <span>
            <Button size="small" disabled={busy || copy.loyalty >= 100} variant="outlined" onClick={handleBolster} startIcon={<FavoriteIcon />}>Bolster</Button>
          </span>
        </Tooltip>
        <Tooltip title="Promote to Accelerated Growth">
          <span>
            <Button size="small" disabled={busy || copy.growthType === 'accelerated'} variant="outlined" color="warning" onClick={handlePromote} startIcon={<RocketLaunchIcon />}>Promote</Button>
          </span>
        </Tooltip>
  <Button size="small" variant="outlined" onClick={handleApplyPrefs} disabled={busyApply}>Apply Prefs</Button>
  <Button size="small" variant="text" onClick={() => setTaskEditOpen(o => !o)}>{taskEditOpen ? 'Hide Task' : (copy.currentTask ? 'Edit Task' : 'Assign Task')}</Button>
        <Button size="small" variant="text" onClick={() => setDetailsOpen(true)}>Details</Button>
      </CardActions>
      <CopyDetailPanel copyId={copy.id} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </Card>
  );
};

export default CopyCard;
