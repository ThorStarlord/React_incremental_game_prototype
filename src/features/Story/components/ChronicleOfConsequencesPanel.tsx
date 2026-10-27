import React from 'react';
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectCausalJournalEntries, selectRecentRecordedDialogueExperiences } from '../PlayerInsightSelectors';
import { selectRecordedDistrictRequests } from '../DistrictAftercareProjection';

/**
 * A grouped, read-only Chronicle. Records from different domains are NOT
 * interleaved into a fabricated causal sequence or a universal timestamp.
 */
export const ChronicleOfConsequencesPanel: React.FC = React.memo(() => {
  const memories = useAppSelector(state => selectCausalJournalEntries(state, 6));
  const conversations = useAppSelector(state => selectRecentRecordedDialogueExperiences(state, 6));
  const districtRequests = useAppSelector(selectRecordedDistrictRequests);

  return (
    <Paper variant="outlined" data-testid="chronicle-of-consequences" sx={{ p: 2, my: 2 }}>
      <Typography variant="overline" color="secondary.main">Recorded history, not predictions</Typography>
      <Typography variant="h6" component="h3" gutterBottom>Chronicle of Consequences</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        A conversation is not automatically a lasting Memory. A request made to one person is not evidence that an institution acted or anyone else learned it.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600}>Lasting Memories</Typography>
          {memories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No player-visible Memories have been recorded yet.</Typography>
          ) : (
            <Stack spacing={1}>
              {memories.map(memory => (
                <Box key={memory.id} sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Chip label="Memory" size="small" color="secondary" sx={{ mb: 0.5 }} />
                  <Typography variant="body2" fontWeight={600}>{memory.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{memory.summary}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">From {memory.causeLabel} · {memory.npcName}</Typography>
                  <Button size="small" component={RouterLink} to={`/game/npcs/${encodeURIComponent(memory.npcId)}`}>
                    Review relationship
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600}>Recorded Conversations</Typography>
          {conversations.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No conversations are recorded yet.</Typography>
          ) : (
            <Stack spacing={1}>
              {conversations.map(conversation => (
                <Box key={conversation.id} sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Chip label="Recorded dialogue" size="small" variant="outlined" sx={{ mb: 0.5 }} />
                  <Typography variant="body2" fontWeight={600}>{conversation.title}</Typography>
                  <Typography variant="caption" display="block" color="text.secondary">With {conversation.npcName}</Typography>
                  <Button size="small" component={RouterLink} to={`/game/npcs/${encodeURIComponent(conversation.npcId)}?view=dialogue`}>
                    Review conversation
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
      {districtRequests.length > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }} data-testid="chronicle-district-requests">
          <Typography variant="subtitle1" fontWeight={600}>District requests on record</Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            These identify the recipient of your request and any actual standing effects; they do not assert that an audit or review was completed.
          </Typography>
          <Stack spacing={1}>
            {districtRequests.map(request => (
              <Box key={request.id}>
                <Typography variant="body2" fontWeight={600}>{request.title} · {request.npcName}</Typography>
                <Typography variant="body2">{request.recordedChoice ?? 'A request was recorded; its exact option is unavailable.'}</Typography>
                {request.authoredStandingChanges.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Recorded standing changes: {request.authoredStandingChanges.join(' · ')}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
});

ChronicleOfConsequencesPanel.displayName = 'ChronicleOfConsequencesPanel';
