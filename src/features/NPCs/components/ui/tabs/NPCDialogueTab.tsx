import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
// FIXED: Importing the correct parameterized selector
import { selectNPCById, selectNPCDialogueHistory } from '../../../state/NPCSelectors';
import { processNPCInteractionThunk } from '../../../state/NPCThunks';
import type { NPC, DialogueEntry } from '../../../state/NPCTypes';

interface NPCDialogueTabProps {
  npcId: string;
}

interface MockDialogue {
  id: string;
  title: string;
  responses: Record<string, string>;
}

const mockDialogues: Record<string, MockDialogue> = {
  greeting: {
    id: 'greeting',
    title: 'Greetings',
    responses: {
      friendly: "Hello there! It's good to see you.",
      formal: "Good day to you.",
      curious: "What brings you here today?"
    }
  }
};

/**
 * NPCDialogueTab - Handles dialogue interactions with NPCs
 */
const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  const npc = useAppSelector(state => selectNPCById(state, npcId));
  // FIXED: Correctly calling the parameterized selector inside useAppSelector
  const dialogueHistory = useAppSelector((state) => selectNPCDialogueHistory(state, npcId));

  const availableDialogueChoices = useMemo(() => {
    if (!npc?.availableDialogues) return [];
    
    return npc.availableDialogues
      .map((dialogueId: string) => mockDialogues[dialogueId])
      .filter(Boolean);
  }, [npc?.availableDialogues]);

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
          timestamp: Date.now()
        }
      })).unwrap();
      
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDialogueChoice = async (choice: MockDialogue, responseKey: string) => {
    try {
      await dispatch(processNPCInteractionThunk({
        npcId,
        interactionType: 'dialogue',
        context: {
          choiceId: choice.id,
          selectedResponse: responseKey,
          timestamp: Date.now()
        }
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
                sx={{ p: 1.5, bgcolor: msg.speaker === 'player' ? 'primary.light' : 'grey.100', color: msg.speaker === 'player' ? 'primary.contrastText' : 'text.primary' }}
              >
                <Typography variant="body2">
                  {msg.speaker === 'player' ? msg.playerText : msg.npcResponse}
                </Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {msg.speaker === 'player' ? 'You' : npc.name} • {new Date(msg.timestamp).toLocaleTimeString()}
                {msg.speaker === 'npc' && msg.relationshipChange && (
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
            {availableDialogueChoices.map((choice: MockDialogue) => (
              <Grid item key={choice.id}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const responseKeys = Object.keys(choice.responses);
                    const randomResponse = responseKeys[Math.floor(Math.random() * responseKeys.length)];
                    handleDialogueChoice(choice, randomResponse);
                  }}
                >
                  {choice.title}
                </Button>
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
          onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendFreeTextMessage(); } }}
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