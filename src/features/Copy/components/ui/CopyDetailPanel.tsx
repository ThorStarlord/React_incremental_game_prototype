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
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Tooltip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { RootState } from '../../../../app/store';
import { selectCopyById, selectCopyEffectiveTraitsWithSource, selectCopyEligibleShareTraitIds, selectCopySharePreferences, selectCopyShareEligibilityContext, selectCopyUnlockedEmptySlotCount } from '../../state/CopySelectors';
import { assignCopyRoleThunk, startCopyTimedTaskThunk, setCopySharePreferenceThunk, applySharePreferencesForCopyThunk } from '../../state/CopyThunks';
import { selectTraits } from '../../../Traits/state/TraitsSelectors';
import type { CopyRole } from '../../state/CopyTypes';

interface CopyDetailPanelProps {
  copyId: string;
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS: CopyRole[] = ['none', 'infiltrator', 'researcher', 'guardian', 'agent'];
const ROLE_DESCRIPTIONS: Record<CopyRole, string> = {
  none: 'No specialization. Manual task assignment only.',
  infiltrator: 'Focus on stealth and social blending. Better at intel tasks.',
  researcher: 'Focus on analysis and study. Better at training and discovery.',
  guardian: 'Protective stance. Better at defense and safeguarding roles.',
  agent: 'Balanced field operative. Good at a bit of everything.'
};

const CopyDetailPanel: React.FC<CopyDetailPanelProps> = ({ copyId, open, onClose }) => {
  const dispatch = useAppDispatch();
  const copy = useAppSelector((s: RootState) => selectCopyById(s, copyId));
  const traits = useAppSelector((s: RootState) => selectCopyEffectiveTraitsWithSource(s, copyId));
  const eligibleShareIds = useAppSelector((s: RootState) => selectCopyEligibleShareTraitIds(s, copyId));
  const sharePrefs = useAppSelector((s: RootState) => selectCopySharePreferences(s, copyId));
  const eligibility = useAppSelector((s: RootState) => selectCopyShareEligibilityContext(s, copyId));
  const emptySlotCount = useAppSelector((s: RootState) => selectCopyUnlockedEmptySlotCount(s, copyId));
  const allTraits = useAppSelector(selectTraits);
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
  const emptySlots = emptySlotCount;
  const anyPrefEnabled = Object.values(sharePrefs).some(Boolean);
  const enableAll = () => {
    if (!copy) return;
    // enable all currently eligible
    eligibleShareIds.forEach((id) => {
      if (!sharePrefs[id]) {
        dispatch(setCopySharePreferenceThunk({ copyId, traitId: id, enabled: true, suppressNotify: true }));
      }
    });
  };
  const disableAll = () => {
    if (!copy) return;
    // disable everything currently enabled
    Object.keys(sharePrefs).forEach((id) => {
      if (sharePrefs[id]) {
        dispatch(setCopySharePreferenceThunk({ copyId, traitId: id, enabled: false, suppressNotify: true }));
      }
    });
  };

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
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="copy-role-label">Role</InputLabel>
                <Select
                  labelId="copy-role-label"
                  label="Role"
                  value={copy.role ?? 'none'}
                  onChange={(e) => handleRoleChange(e.target.value as CopyRole)}
                >
                  {ROLE_OPTIONS.map(r => (
                    <MenuItem key={r} value={r}>
                      <Box display="flex" flexDirection="column">
                        <Typography>{r.charAt(0).toUpperCase() + r.slice(1)}</Typography>
                        <Typography variant="caption" color="text.secondary">{ROLE_DESCRIPTIONS[r]}</Typography>
                      </Box>
                    </MenuItem>
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

            <Divider flexItem sx={{ my: 1 }} />

            <Box>
              <Typography variant="overline" color="text.secondary">Share Preferences</Typography>
              <Typography variant="caption" color="text.secondary">Available slots: {emptySlots}</Typography>
              <FormGroup sx={{ mt: 1 }}>
                {(copy?.traitSlots ?? []) && Object.keys(allTraits).length > 0 && eligibleShareIds.concat(
                  // Include prefs that are currently ineligible to show guidance
                  Object.keys(sharePrefs).filter((id) => sharePrefs[id] && !eligibleShareIds.includes(id))
                ).filter((v, i, a) => a.indexOf(v) === i).map((id) => {
                  const t = allTraits[id];
                  const label = t?.name ?? id;
                  const checked = !!sharePrefs[id];
                  const eligible = eligibleShareIds.includes(id);
                  let reason = '';
                  if (!eligible) {
                    const reasons: string[] = [];
                    if (!eligibility.equipped.includes(id)) reasons.push('not equipped');
                    if (eligibility.permanent.includes(id)) reasons.push('made permanent');
                    if (eligibility.already.has(id)) reasons.push('already present');
                    if (eligibility.emptySlots === 0) reasons.push('no empty slots');
                    reason = `Not eligible: ${reasons.join(', ')}`;
                  }
                  const control = (
                    <Switch
                      size="small"
                      checked={checked}
                      disabled={!eligible && !checked}
                      onChange={(e) => dispatch(setCopySharePreferenceThunk({ copyId, traitId: id, enabled: e.target.checked }))}
                    />
                  );
                  const labelNode = (
                    <FormControlLabel key={id} control={control} label={label} />
                  );
                  return eligible ? labelNode : (
                    <Tooltip key={id} title={reason} placement="right" arrow>
                      <Box component="span">{labelNode}</Box>
                    </Tooltip>
                  );
                })}
                {eligibleShareIds.length === 0 && (
                  <Typography variant="caption" color="text.secondary">No eligible player traits to share right now.</Typography>
                )}
              </FormGroup>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                <Button size="small" onClick={enableAll} disabled={eligibleShareIds.length === 0}>Enable all eligible</Button>
                <Button size="small" onClick={disableAll} disabled={!anyPrefEnabled}>Disable all</Button>
                <Button size="small" variant="contained" onClick={() => dispatch(applySharePreferencesForCopyThunk({ copyId, suppressNotify: false }))} disabled={!anyPrefEnabled || emptySlots === 0}>
                  Apply Now
                </Button>
                <Typography variant="caption" color="text.secondary">Will try to fill empty slots with enabled preferences.</Typography>
              </Stack>
            </Box>

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
