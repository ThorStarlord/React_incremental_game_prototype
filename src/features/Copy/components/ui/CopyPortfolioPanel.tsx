import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  selectCopyPortfolioRows,
  selectCopyPortfolioSummary,
} from '../../state/CopyPortfolioSelectors';
import { startCopyPortfolioThunk } from '../../state/CopyPortfolioThunks';

export const CopyPortfolioPanel: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const rows = useAppSelector(selectCopyPortfolioRows);
  const summary = useAppSelector(selectCopyPortfolioSummary);
  const [plan, setPlan] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const assignments = useMemo(
    () => Object.entries(plan)
      .filter(([, taskId]) => Boolean(taskId))
      .map(([copyId, taskId]) => ({ copyId, taskId })),
    [plan]
  );

  const startPortfolio = async () => {
    if (assignments.length === 0) return;
    setSubmitting(true);
    try {
      const result = await dispatch(startCopyPortfolioThunk({ assignments }));
      if (startCopyPortfolioThunk.fulfilled.match(result)) {
        setPlan({});
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }} data-testid="copy-portfolio-panel">
      <Stack spacing={2}>
        <Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
            <Typography variant="h6">Copy Portfolio</Typography>
            <Chip label={`${summary.runningCopies}/${summary.totalCopies} active`} size="small" />
            <Chip label={`${summary.availableCopies} available`} size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Allocate already-understood routines across several Copies. You choose every assignment; Copies do not choose narrative goals or irreversible actions.
          </Typography>
          <LinearProgress
            variant="determinate"
            value={summary.utilizationPercent}
            sx={{ mt: 1 }}
          />
        </Box>

        <Stack spacing={1.25}>
          {rows.map(row => (
            <Box
              key={row.copyId}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(160px, 1fr) minmax(240px, 2fr)' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle2">{row.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.role} · {row.location}
                </Typography>
              </Box>

              {row.runningTaskName ? (
                <Chip
                  label={`Running: ${row.runningTaskName}`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ justifySelf: 'start' }}
                />
              ) : (
                <FormControl size="small" fullWidth>
                  <InputLabel id={`portfolio-task-${row.copyId}`}>Portfolio assignment</InputLabel>
                  <Select
                    labelId={`portfolio-task-${row.copyId}`}
                    label="Portfolio assignment"
                    value={plan[row.copyId] ?? ''}
                    onChange={event => setPlan(current => ({
                      ...current,
                      [row.copyId]: event.target.value,
                    }))}
                  >
                    <MenuItem value="">Leave available</MenuItem>
                    {row.taskOptions.map(option => (
                      <MenuItem
                        key={option.taskId}
                        value={option.taskId}
                        disabled={!option.eligible}
                      >
                        <Box>
                          <Typography variant="body2">{option.name}</Typography>
                          {!option.eligible && (
                            <Typography variant="caption" color="text.secondary">
                              {option.reasons.join(' ')}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="contained"
            onClick={startPortfolio}
            disabled={submitting || assignments.length === 0}
          >
            Start selected portfolio
          </Button>
          <Button
            variant="text"
            onClick={() => setPlan({})}
            disabled={submitting || assignments.length === 0}
          >
            Clear plan
          </Button>
          <Typography variant="caption" color="text.secondary">
            {assignments.length} explicit assignment{assignments.length === 1 ? '' : 's'} selected
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
});

CopyPortfolioPanel.displayName = 'CopyPortfolioPanel';

export default CopyPortfolioPanel;