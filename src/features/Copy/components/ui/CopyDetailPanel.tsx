import React, { useMemo, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { RootState } from '../../../../app/store';
import { selectCopyById, selectCopyEffectiveTraitsWithSource } from '../../state/CopySelectors';
import { assignCopyRoleThunk, startCopyTimedTaskThunk } from '../../state/CopyThunks';
import type { CopyRole } from '../../state/CopyTypes';

interface CopyDetailPanelProps {
  copyId: string;
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS: CopyRole[] = ['none', 'infiltrator', 'researcher', 'guardian', 'agent'];

const CopyDetailPanel: React.FC<CopyDetailPanelProps> = ({ copyId, open, onClose }) => {
  const dispatch = useAppDispatch();
  const copy = useAppSelector((s: RootState) => selectCopyById(s, copyId));
  const traits = useAppSelector((s: RootState) => selectCopyEffectiveTraitsWithSource(s, copyId));
  const [taskSeconds, setTaskSeconds] = useState<number>(60);

  const title = useMemo(() => (copy ? `${copy.name}` : 'Copy Details'), [copy]);

  const handleRoleChange = (role: CopyRole) => {
    if (!copy) return;
    dispatch(assignCopyRoleThunk({ copyId: copy.id, role }));
  };

  const startTask = () => {
    if (!copy) return;
    dispatch(startCopyTimedTaskThunk({ copyId: copy.id, durationSeconds: taskSeconds }));
  };

  const active = copy?.activeTask;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {!copy ? (
          <Typography variant="body2">Copy not found.</Typography>
        ) : (
          <Stack spacing={2}>
            <Box>
              <Typography variant="overline" color="text.secondary">Progress</Typography>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption">Maturity</Typography>
                  <LinearProgress variant="determinate" value={copy.maturity} />
                </Box>
                <Box>
                  <Typography variant="caption">Loyalty</Typography>
                  <LinearProgress variant="determinate" color="secondary" value={copy.loyalty} />
                </Box>
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="copy-role-label">Role</InputLabel>
                <Select
                  labelId="copy-role-label"
                  label="Role"
                  value={copy.role ?? 'none'}
                  onChange={(e) => handleRoleChange(e.target.value as CopyRole)}
                >
                  {ROLE_OPTIONS.map(r => (
                    <MenuItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">Start timed task:</Typography>
                <Stack direction="row" spacing={1}>
                  {[30, 60, 120].map(s => (
                    <Button key={s} size="small" variant={taskSeconds === s ? 'contained' : 'outlined'} onClick={() => setTaskSeconds(s)}>{s}s</Button>
                  ))}
                </Stack>
                <Button size="small" variant="contained" onClick={startTask} disabled={!!active && active.status === 'running'}>Start</Button>
              </Stack>
            </Stack>

            {active && (
              <Box>
                <Typography variant="caption" color="text.secondary">Active Task</Typography>
                <Typography variant="body2">{active.type} • {Math.floor(active.progressSeconds)}/{active.durationSeconds}s</Typography>
                <LinearProgress variant="determinate" value={(active.progressSeconds / active.durationSeconds) * 100} sx={{ mt: 0.5 }} />
              </Box>
            )}

            <Box>
              <Typography variant="overline" color="text.secondary">Effective Traits</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                {traits.map((t, idx) => (
                  <Chip
                    key={`${t.trait?.id ?? idx}-${t.source}`}
                    label={t.trait?.name ?? t.trait?.id ?? 'Unknown'}
                    color={t.source === 'inherited' ? 'default' : 'primary'}
                    variant={t.source === 'inherited' ? 'outlined' : 'filled'}
                  />
                ))}
                {traits.length === 0 && (
                  <Typography variant="caption" color="text.secondary">No traits yet.</Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopyDetailPanel;
