import React from 'react';
import { Alert, Box, Button, Card, CardContent, Divider, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useAppSelector } from '../../../app/hooks';
import { selectCurrentMoment } from '../CurrentMomentSelectors';
import { LocationVignette } from './LocationVignette';

export const CurrentMomentPanel: React.FC = React.memo(() => {
  const moment = useAppSelector(selectCurrentMoment);
  const immediateActions = moment.actions.filter(action => action.kind === 'encounter' || action.kind === 'quest' || action.kind === 'travel');
  const referenceActions = moment.actions.filter(action => action.kind === 'reference');

  return (
    <Card variant="outlined" data-testid="current-moment" sx={{ mb: 2, borderColor: 'primary.light', borderTop: 4, borderTopColor: 'primary.main' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="overline" color="primary.main">Explorer's journal · Current place</Typography>
        <Typography variant="h5" component="h2" gutterBottom>Current Moment</Typography>
        <Box sx={{ p: { xs: 1.5, md: 2 }, mb: 2, borderRadius: 2,
          background: theme => `linear-gradient(120deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.21 : 0.09)}, ${theme.palette.background.paper} 92%)`,
          border: 1, borderColor: 'divider' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" component="h3">You are in {moment.locationName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{moment.locationDescription}</Typography>
              <Typography variant="body1">{moment.situation}</Typography>
            </Box>
            <LocationVignette locationName={moment.locationName} />
          </Stack>
        </Box>

        <Typography variant="subtitle2" gutterBottom>What you can do next</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} gap={1.5} flexWrap="wrap" sx={{ mb: 2 }}>
          {immediateActions.map(action => (
            <Paper key={action.id} variant="outlined" sx={{ p: 1.5, flex: { xs: '1 1 auto', md: '1 1 190px' }, width: { xs: '100%', md: 'auto' }, minWidth: 0 }}>
              <Button size="small" sx={{ minHeight: 44, whiteSpace: 'normal', textAlign: 'left' }} variant={action.kind === 'encounter' || action.id === 'prologue-travel' ? 'contained' : 'outlined'} component={RouterLink} to={action.to}>
                {action.label}
              </Button>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                {action.description}
              </Typography>
            </Paper>
          ))}
          {immediateActions.length === 0 && <Typography variant="body2" color="text.secondary">Nothing needs your attention here right now. Revisit someone you know, or take the next road.</Typography>}
        </Stack>

        {moment.storyContacts.length > 0 && (
          <Box sx={{ mb: 2 }} data-testid="story-contacts">
            <Typography variant="subtitle2">Conversations beyond the map</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              These people have something new to discuss. The map does not confirm where they are.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} flexWrap="wrap" alignItems="flex-start">
              {moment.storyContacts.map(action => (
                <Box key={action.id} sx={{ maxWidth: 310 }}>
                  <Button component={RouterLink} variant="outlined" size="small" sx={{ minHeight: 44, whiteSpace: 'normal' }} to={action.to}>{action.label}</Button>
                  <Typography variant="caption" color="text.secondary" display="block">{action.description}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {referenceActions.length > 0 && (
          <Stack spacing={0.5} sx={{ mb: 2 }} alignItems="flex-start">
            <Typography variant="caption" color="text.secondary">People and references</Typography>
            {referenceActions.map(action => (
              <Button key={action.id} size="small" variant="text" component={RouterLink} to={action.to}>
                {action.label}
              </Button>
            ))}
          </Stack>
        )}

        {moment.attention.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Needs your judgment</Typography>
            <Stack spacing={0.75} alignItems="flex-start">
              {moment.attention.map(item => (
                <Button key={item.id} component={RouterLink} to={item.to} size="small" color="inherit">{item.label}</Button>
              ))}
            </Stack>
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>Recent choices and consequences</Typography>
        {moment.consequences.length ? (
          <Stack spacing={1}>
            {moment.consequences.map(change => (
              <Paper key={change.id} variant="outlined" sx={{ p: 1.5, borderLeft: 3, borderLeftColor: 'primary.main', backgroundColor: 'background.paper' }}>
                <Typography variant="body2" fontWeight={600}>{change.title}</Typography>
                <Typography variant="body2" color="text.secondary">{change.explanation}</Typography>
                {change.to && (
                  <Button size="small" variant="text" component={RouterLink} to={change.to} sx={{ mt: 0.5 }}>
                    Review this relationship
                  </Button>
                )}
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Your story is just beginning. Memories and known consequences will appear here as you make choices.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

CurrentMomentPanel.displayName = 'CurrentMomentPanel';
export default CurrentMomentPanel;
