import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
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
import { selectCausalJournalEntries } from '../../../../Story/PlayerInsightSelectors';


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

  const npc = useAppSelector(state => selectNPCById(state, npcId));
  const dialogueHistory = useAppSelector(state => selectNPCDialogueHistory(state, npcId));
  const availableDialogueChoices = useAppSelector(state =>
    selectAvailableNPCDialogueChoices(state, npcId)
  );
  const latestVisibleMemory = useAppSelector(state =>
    selectCausalJournalEntries(state, 10).find(entry => entry.npcId === npcId)
  );

  if (!npc) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">NPC not found</Typography>
      </Box>
    );
  }

  const handleDialogueChoice = async (choice: NPCDialogueChoice, responseKey: string) => {
    try {
      await dispatch(processNPCInteractionThunk({
        npcId,
        interactionType: 'dialogue',
        context: {
          choiceId: choice.id,
          selectedResponse: responseKey,
          timestamp: Date.now(),
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to process dialogue choice:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ChatIcon color="primary" />
        <Typography variant="h6">Conversation with {npc.name}</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: 'auto' }}>
        <Typography variant="subtitle2" gutterBottom>Recent Conversations</Typography>
        {dialogueHistory.length > 0 ? (
          dialogueHistory.map((msg: DialogueEntry) => (
            <Box key={msg.id} sx={{ mb: 2 }}>
              <Paper
                elevation={1}
                sx={{ p: 1.5, bgcolor: msg.playerText ? 'primary.light' : 'grey.100', color: msg.playerText ? 'primary.contrastText' : 'text.primary' }}
              >
                <Typography variant="body2">
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
            No previous conversations. Choose an available conversation topic when you are together.
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
                        onClick={() => handleDialogueChoice(choice, response.id)}
                      >
                        {response.label}
                      </Button>
                    ))
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
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

      {availableDialogueChoices.length === 0 && (
        <Typography variant="body2" color="text.secondary" role="status">
          No authored conversation topics are available right now. New topics may require a recorded experience or a change in circumstances.
        </Typography>
      )}
    </Box>
  );
};

export default React.memo(NPCDialogueTab);
