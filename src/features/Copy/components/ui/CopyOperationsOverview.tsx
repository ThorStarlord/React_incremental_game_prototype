import React from 'react';
import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectMasteredRoutines } from '../../../Story/PlayerInsightSelectors';

interface CopyOperationsOverviewProps {
  copyCount: number;
  unresolvedCount: number;
}

/** Read-only mastery journey; actual eligibility and orders stay per-Copy. */
export const CopyOperationsOverview: React.FC<CopyOperationsOverviewProps> = React.memo(({
  copyCount,
  unresolvedCount,
}) => {
  const mastered = useAppSelector(selectMasteredRoutines);
  return (
    <Paper variant="outlined" data-testid="copy-mastery-journey" sx={{ p: 2, mb: 2, borderTop: 3, borderTopColor: 'secondary.main' }}>
      <Typography variant="overline" color="secondary.main">From practice to responsible delegation</Typography>
      <Typography variant="h6" component="h2" gutterBottom>Mastery &amp; Copy Operations</Typography>
      <Grid container spacing={1} sx={{ mb: 1.5 }}>
        {[
          { title: '1 · Learn', detail: `${mastered.length} personally mastered routines` },
          { title: '2 · Prepare', detail: `${copyCount} Copies exist; each must separately qualify` },
          { title: '3 · Delegate', detail: 'Authorize only eligible one-shot or standing work' },
          { title: '4 · Judge', detail: unresolvedCount === 0 ? 'No unresolved exceptions recorded' : `${unresolvedCount} unresolved exceptions need your judgment` },
        ].map(step => (
          <Grid key={step.title} item xs={12} sm={6} md={3}>
            <Box sx={{ p: 1.5, height: '100%', border: 1, borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2">{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">{step.detail}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      {mastered.length ? (
        <Stack spacing={1}>
          {mastered.map(routine => (
            <Box key={routine.taskId} sx={{ borderLeft: 3, borderColor: 'success.main', pl: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                <Typography variant="body2" fontWeight={600}>{routine.name}</Typography>
                <Chip label="Personally mastered" size="small" color="success" />
              </Stack>
              <Typography variant="caption" display="block" color="text.secondary">{routine.sourceLabel}</Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          First practice a repeatable routine yourself. A Copy can never earn that familiarity on your behalf.
        </Typography>
      )}
      <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1.5 }}>
        Mastery alone does not make any Copy eligible: role, maturity, loyalty, location and the specific task still matter. Acknowledging an exception is not resolving it; consequential decisions stay yours.
      </Typography>
    </Paper>
  );
});

CopyOperationsOverview.displayName = 'CopyOperationsOverview';
