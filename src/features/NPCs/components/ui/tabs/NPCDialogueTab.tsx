import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import {
  selectNPCById,
  selectNPCDialogueHistory,
  processNPCInteractionThunk,
} from '../../../';
import type { DialogueEntry } from '../../../state/NPCTypes';

interface NPCDialogueTabProps {
  npcId: string;
}

type DialogueResponse = { id: string; label: string };
type Choice = { id: string; title: string; responses: DialogueResponse[] };

/**
 * NPCDialogueTab - Handles dialogue interactions with NPCs.
 * Authored relationship topics can declare Experience prerequisites so future
 * beats do not spoil themselves or become clickable out of causal order.
 */
const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  const npc = useAppSelector(state => selectNPCById(state, npcId));
  const dialogueHistory = useAppSelector(state => selectNPCDialogueHistory(state, npcId));
  const dialogueNodes = useAppSelector(state => state.npcs.dialogueNodes || {});
  const recordedExperiences = useAppSelector(
    state => state.relationships?.experiencesById ?? {}
  );

  const availableDialogueChoices: Choice[] = useMemo(() => {
    if (!npc?.availableDialogues) return [];
    return npc.availableDialogues
      .map((dialogueId: string) => {
        const node: any = (dialogueNodes as any)[dialogueId];
        if (!node) return null;

        const requiredExperienceIds = Array.isArray(node.requiredExperienceIds)
          ? node.requiredExperienceIds as string[]
          : [];
        if (requiredExperienceIds.some(id => !recordedExperiences[id])) {
          return null;
        }

        const anyOfExperienceIds = Array.isArray(node.anyOfExperienceIds)
          ? node.anyOfExperienceIds as string[]
          : [];
        if (
          anyOfExperienceIds.length > 0 &&
          !anyOfExperienceIds.some(id => Boolean(recordedExperiences[id]))
        ) {
          return null;
        }

        const responses = node.responses || {};
        return {
          id: node.id,
          title: node.title || node.text || node.id,
          responses: Object.entries(responses).map(([id, label]) => ({
            id,
            label: String(label),
          })),
        } as Choice;
      })
      .filter(Boolean) as Choice[];
  }, [npc?.availableDialogues, dialogueNodes, recordedExperiences]);

  if (!npc) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">NPC not found</Typography>
      </Box>
    );
  }

  const handleSendFreeTextMessage = async () => {
    if (!message.trim()) return;

    try {
      await dispatch(processNPCInteractionThunk({
        npcId,
        interactionType: 'dialogue',
        context: {
          choiceId: 'freetext',
          playerMessage: message,
          timestamp: Date.now(),
        },
      })).unwrap();
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDialogueChoice = async (choice: Choice, responseKey: string) => {
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
            No previous conversations. Start a dialogue below!
          </Typography>
        )}
      </Paper>

      {availableDialogueChoices.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Conversation Topics</Typography>
          <Grid container spacing={1}>
            {availableDialogueChoices.map((choice: Choice) => (
              <Grid item xs={12} key={choice.id}>
                <Typography variant="body2" sx={{ mb: 0.75 }}>
                  {choice.title}
                </Typography>
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

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Type a message to ${npc.name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendFreeTextMessage();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendFreeTextMessage}
          disabled={!message.trim()}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(NPCDialogueTab);
