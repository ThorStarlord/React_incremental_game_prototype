import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import {
  selectNPCById,
  selectNPCDialogueHistory,
  selectAvailableNPCDialogueChoices,
} from '../../../state/NPCSelectors';
import { processNPCInteractionThunk } from '../../../state/NPCThunks';
import type { DialogueEntry } from '../../../state/NPCTypes';
import type { NPCDialogueChoice } from '../../../state/NPCSelectors';
import { selectCausalJournalEntries, selectRecentRecordedDialogueExperiences } from '../../../../Story/PlayerInsightSelectors';


interface NPCDialogueTabProps {
  npcId: string;
}


/**
 * NPCDialogueTab - Handles dialogue interactions with NPCs.
 * Authored topics can declare Relationship, active-experience, per-NPC
 * Knowledge, bounded institutional, and bounded objective-world prerequisites.
 * Already-available topics may surface a concise spoiler-safe explanation of
 * the canonical evidence that made them available.
 */
const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  useEffect(() => { setFeedback(null); }, [npcId]);

  const npc = useAppSelector(state => selectNPCById(state, npcId));
  const dialogueHistory = useAppSelector(state => selectNPCDialogueHistory(state, npcId));
  const availableDialogueChoices = useAppSelector(state =>
    selectAvailableNPCDialogueChoices(state, npcId)
  );
  const latestVisibleMemory = useAppSelector(state =>
    selectCausalJournalEntries(state, 10).find(entry => entry.npcId === npcId)
  );
  const latestRecordedDialogue = useAppSelector(state =>
    selectRecentRecordedDialogueExperiences(state, 1, npcId)[0]
  );

  if (!npc) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">NPC not found</Typography>
      </Box>
    );
  }

  const handleDialogueChoice = async (choice: NPCDialogueChoice, responseKey: string) => {
    if (busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const outcome = await dispatch(processNPCInteractionThunk({
        npcId,
        interactionType: 'dialogue',
        context: {
          choiceId: choice.id,
          selectedResponse: responseKey,
          timestamp: Date.now(),
        },
      })).unwrap();
      setFeedback(outcome.success
        ? { success: true, message: `Your choice in "${choice.title}" is part of your story. Review what changed below.` }
        : { success: false, message: outcome.message || 'This conversation is not currently available.' });
    } catch {
      setFeedback({ success: false, message: 'The conversation could not be completed. No success has been claimed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ChatIcon color="primary" />
        <Typography variant="h6">Conversation with {npc.name}</Typography>
      </Box>

      {feedback && (
        <Alert severity={feedback.success ? 'success' : 'warning'} role="status" aria-live="polite">
          {feedback.message}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: 'auto' }}>
        <Typography variant="subtitle2" gutterBottom>Recent Conversations</Typography>
        {dialogueHistory.length > 0 ? (
          dialogueHistory.map((msg: DialogueEntry) => (
            <Box key={msg.id} sx={{ mb: 2 }}>
              <Paper
                elevation={1}
                sx={{ p: 1.5, bgcolor: msg.playerText ? 'primary.main' : 'background.default', color: msg.playerText ? 'primary.contrastText' : 'text.primary' }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {msg.playerText || msg.npcResponse}
                </Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {msg.playerText ? 'You' : npc.name} • {new Date(msg.timestamp).toLocaleTimeString()}
                {!msg.playerText && msg.relationshipChange && (
                  <Typography variant="caption" component="span" sx={{ ml: 1, color: msg.relationshipChange > 0 ? 'success.main' : 'error.main' }}>
                    ({msg.relationshipChange > 0 ? '+' : ''}{msg.relationshipChange} Rel)
                  </Typography>
                )}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No conversations yet. Choose a topic when you are ready.
          </Typography>
        )}
      </Paper>

      {availableDialogueChoices.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Conversation Topics</Typography>
          <Grid container spacing={1}>
            {availableDialogueChoices.map((choice: NPCDialogueChoice) => (
              <Grid item xs={12} key={choice.id}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {choice.title}
                </Typography>
                {choice.decisionContext && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                    {choice.decisionContext}
                  </Typography>
                )}
                {choice.availabilityReasons.length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mb: 0.75 }}
                  >
                    Available because: {choice.availabilityReasons.join(' · ')}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {choice.responses.length > 0 ? (
                    choice.responses.map(response => (
                      <Button
                        key={`${choice.id}-${response.id}`}
                        variant="outlined"
                        size="small"
                        disabled={busy}
                        onClick={() => handleDialogueChoice(choice, response.id)}
                      >
                        {response.label}
                      </Button>
                    ))
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={busy}
                      onClick={() => handleDialogueChoice(choice, '')}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {latestVisibleMemory && (
        <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
          <Typography variant="subtitle2">A remembered consequence</Typography>
          <Typography variant="body2" fontWeight={600}>{latestVisibleMemory.title}</Typography>
          <Typography variant="body2" color="text.secondary">{latestVisibleMemory.causeLabel}: {latestVisibleMemory.summary}</Typography>
        </Paper>
      )}

      {!latestVisibleMemory && latestRecordedDialogue && (
        <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
          <Typography variant="subtitle2">Recently recorded experience</Typography>
          <Typography variant="body2" fontWeight={600}>{latestRecordedDialogue.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Your dialogue with {latestRecordedDialogue.npcName} is part of your recorded history.
          </Typography>
        </Paper>
      )}

      {availableDialogueChoices.length === 0 && (
        <Typography variant="body2" color="text.secondary" role="status">
          There is nothing new to discuss right now. A shared experience or a change in circumstances may open another conversation.
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(NPCDialogueTab);
