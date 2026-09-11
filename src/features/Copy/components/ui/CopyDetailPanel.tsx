import React, { useMemo } from 'react';
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
import { selectCopyById, selectCopyEffectiveTraitsWithSource, selectCopyEligibleShareTraitIds, selectCopySharePreferences, selectCopyShareEligibilityContext, selectCopyUnlockedEmptySlotCount, selectCopyHasRunningTask } from '../../state/CopySelectors';
import { assignCopyRoleThunk, startCopyProductionTaskThunk, setCopySharePreferenceThunk, applySharePreferencesForCopyThunk } from '../../state/CopyThunks';
import {
  setCopyRoutinePriorityThunk,
  startPreferredCopyProductionTaskThunk,
} from '../../state/CopyStrategyThunks';
import { selectTraits } from '../../../Traits/state/TraitsSelectors';
import type { CopyProductionTaskId, CopyRole } from '../../state/CopyTypes';
import {
  COPY_PRODUCTION_TASKS,
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
} from '../../CopyTaskDefinitions';
import { getFirstEligiblePreferredProductionTask } from '../../CopyRoutineStrategy';

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
  const hasRunningTask = useAppSelector((s: RootState) => selectCopyHasRunningTask(s, copyId));
  const routineFamiliarity = useAppSelector((s: RootState) => s.player.routineFamiliarity ?? {});

  const title = useMemo(() => (copy ? `${copy.name}` : 'Copy Details'), [copy]);

  const handleRoleChange = (role: CopyRole) => {
    if (!copy) return;
    dispatch(assignCopyRoleThunk({ copyId: copy.id, role }));
  };

  const active = copy?.activeTask;
  const activeDefinition = active?.productionTaskId
    ? getCopyProductionTaskDefinition(active.productionTaskId)
    : undefined;
  const routinePriority = copy?.routinePriority ?? [];
  const firstEligiblePreferredTask = copy
    ? getFirstEligiblePreferredProductionTask(copy, routineFamiliarity)
    : undefined;
  const priorityLabel = routinePriority.length > 0
    ? routinePriority
        .map(taskId => getCopyProductionTaskDefinition(taskId)?.name ?? taskId)
        .join(' → ')
    : 'No routine priority set.';

  const prioritizeRoutine = (taskId: CopyProductionTaskId) => {
    if (!copy) return;
    dispatch(setCopyRoutinePriorityThunk({
      copyId: copy.id,
      taskIds: [taskId, ...routinePriority.filter(id => id !== taskId)],
    }));
  };

  const removeRoutinePriority = (taskId: CopyProductionTaskId) => {
    if (!copy) return;
    dispatch(setCopyRoutinePriorityThunk({
      copyId: copy.id,
      taskIds: routinePriority.filter(id => id !== taskId),
    }));
  };

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
              <Box>
                <Typography variant="caption" color="text.secondary">Current Copy location</Typography>
                <Typography variant="body2">{copy.location}</Typography>
              </Box>
            </Stack>

            <Box>
              <Typography variant="overline" color="text.secondary">Production Delegation</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Experience a routine yourself before delegating repeatable execution. Narrative and irreversible decisions remain under player authority.
              </Typography>

              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5, mb: 1.5 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2">Routine Priority</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {priorityLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Start Preferred chooses only the first currently eligible routine from this player-approved order. It never chains another task automatically.
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={hasRunningTask || !firstEligiblePreferredTask}
                    onClick={() => dispatch(startPreferredCopyProductionTaskThunk(copy.id))}
                  >
                    Start Preferred
                  </Button>
                </Stack>
              </Box>

              <Stack spacing={1}>
                {COPY_PRODUCTION_TASKS.map(task => {
                  const isFamiliar = Boolean(routineFamiliarity[task.id]);
                  const taskEligibility = evaluateCopyProductionTaskEligibility(copy, task, isFamiliar);
                  const rewardParts: string[] = [];
                  if ((task.reward.gold ?? 0) > 0) rewardParts.push(`${task.reward.gold} Gold`);
                  if ((task.reward.essence ?? 0) > 0) rewardParts.push(`${task.reward.essence} Essence`);
                  const disabled = hasRunningTask || !taskEligibility.eligible;
                  const priorityIndex = routinePriority.indexOf(task.id);
                  return (
                    <Box
                      key={task.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 1.5,
                      }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between">
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2">{task.name}</Typography>
                            {priorityIndex >= 0 && (
                              <Chip size="small" label={`Priority ${priorityIndex + 1}`} variant="outlined" />
                            )}
                          </Stack>
                          <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Base duration: {task.baseDurationSeconds}s • Reward: {rewardParts.join(' + ')}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={isFamiliar ? 'success.main' : 'warning.main'}
                            display="block"
                            sx={{ mt: 0.5 }}
                          >
                            {isFamiliar ? 'Routine understood.' : `Locked: ${task.familiarityHint}`}
                          </Typography>
                          {taskEligibility.reasons.filter(reason => reason !== task.familiarityHint).length > 0 && (
                            <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 0.5 }}>
                              {taskEligibility.reasons.filter(reason => reason !== task.familiarityHint).join(' ')}
                            </Typography>
                          )}
                        </Box>
                        <Stack spacing={0.75} sx={{ alignSelf: { xs: 'stretch', sm: 'center' }, minWidth: 130 }}>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={disabled}
                            onClick={() => dispatch(startCopyProductionTaskThunk({ copyId: copy.id, taskId: task.id }))}
                          >
                            Assign
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => prioritizeRoutine(task.id)}
                          >
                            {priorityIndex === 0 ? 'Top Priority' : 'Prioritize'}
                          </Button>
                          {priorityIndex >= 0 && (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => removeRoutinePriority(task.id)}
                            >
                              Remove Priority
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {active && (
              <Box>
                <Typography variant="caption" color="text.secondary">Active Task</Typography>
                <Typography variant="body2">
                  {activeDefinition?.name ?? 'Legacy task'} • {Math.floor(active.progressSeconds)}/{active.durationSeconds}s
                </Typography>
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