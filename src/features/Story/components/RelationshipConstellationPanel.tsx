import React from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectKnownRelationshipConstellation } from '../RelationshipConstellationSelectors';

/** Earned links only: a visual index, not a simulated relationship network. */
export const RelationshipConstellationPanel: React.FC = React.memo(() => {
  const people = useAppSelector(selectKnownRelationshipConstellation);
  return (
    <Paper component="details" variant="outlined" data-testid="relationship-constellation" sx={{ p: 2, mb: 2, borderTop: 3, borderTopColor: 'secondary.main' }}>
      <Typography component="summary" variant="subtitle1" sx={{ fontWeight: 600, cursor: 'pointer' }}>
        Relationship Constellation · {people.length} known people
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="secondary.main">Your recorded connections</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Each person is linked only to your recorded experiences, visible Memories and already discovered Trait patterns. This does not show where they are in the world.
      </Typography>
      {people.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Your constellation begins with the people you actually meet.</Typography>
      ) : (
        <Grid container spacing={1.5}>
          {people.map(person => (
            <Grid item xs={12} sm={6} lg={4} key={person.npcId}>
              <Paper variant="outlined" sx={{ p: 1.5, height: '100%', borderLeft: 3, borderLeftColor: 'secondary.light' }}>
                <Typography variant="subtitle1" fontWeight={600}>{person.name}</Typography>
                <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ my: 1 }}>
                  <Chip size="small" variant="outlined" label={person.visibleMemoryCount === 1 ? '1 lasting Memory' : person.visibleMemoryCount + ' lasting Memories'} />
                  <Chip size="small" variant="outlined" label={person.recordedDialogueCount === 1 ? '1 recorded conversation' : person.recordedDialogueCount + ' recorded conversations'} />
                </Stack>
                {person.latestMemoryTitle && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Remembered:</strong> {person.latestMemoryTitle}
                  </Typography>
                )}
                {person.traitPatterns.length > 0 && (
                  <Box sx={{ borderLeft: 2, borderColor: 'divider', pl: 1, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Known capability links</Typography>
                    {person.traitPatterns.map(pattern => (
                      <Typography key={pattern.id} variant="body2">
                        {pattern.name} · {pattern.expressed ? 'Expressed' : pattern.assimilated ? 'Assimilated, suppressed' : 'Discovered'}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Button component={RouterLink} size="small" to={`/game/npcs/${encodeURIComponent(person.npcId)}`} sx={{ minHeight: 44 }}>
                  Review {person.name}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      </Box>
    </Paper>
  );
});

RelationshipConstellationPanel.displayName = 'RelationshipConstellationPanel';
