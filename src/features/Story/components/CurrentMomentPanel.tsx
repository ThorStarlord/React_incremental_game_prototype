import React from 'react';
import { Alert, Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentMoment } from '../CurrentMomentSelectors';

/** Reversible situation-first layer above the existing advanced Dashboard. */
export const CurrentMomentPanel: React.FC = React.memo(() => {
  const moment = useAppSelector(selectCurrentMoment);

  return (
    <Card variant="outlined" data-testid="current-moment">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>Current Moment</Typography>
        <Typography variant="subtitle1">You are in {moment.locationName}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {moment.locationDescription}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{moment.situation}</Typography>

        <Typography variant="subtitle2" gutterBottom>What you can do</Typography>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {moment.actions.map(action => (
            <Button key={action.id} size="small" variant="outlined" component={RouterLink} to={action.to} title={action.description}>
              {action.label}
            </Button>
          ))}
        </Stack>

        {moment.attention.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Needs your attention</Typography>
            <Stack spacing={0.75} alignItems="flex-start">
              {moment.attention.map(item => (
                <Button key={item.id} component={RouterLink} to={item.to} size="small" color="inherit">
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Alert>
        )}

        <Divider sx={{ my: 1.5 }} />
        <Typography variant="subtitle2" gutterBottom>What changed</Typography>
        {moment.consequences.length ? (
          <Stack spacing={1}>
            {moment.consequences.map(change => (
              <Box key={change.id}>
                <Typography variant="body2" fontWeight={600}>{change.title}</Typography>
                <Typography variant="body2" color="text.secondary">{change.explanation}</Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No player-visible relationship memories have been recorded yet. Your choices and their consequences will appear here as they become known.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

CurrentMomentPanel.displayName = 'CurrentMomentPanel';
export default CurrentMomentPanel;
