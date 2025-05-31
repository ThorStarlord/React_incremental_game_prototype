import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

import type { NPC, DialogueEntry } from '../../../state/NPCTypes'; // Import DialogueEntry from NPCTypes
import { useAppDispatch } from '../../../../../app/hooks'; // Only need useAppDispatch here
import { processDialogueChoiceThunk } from '../../../state/NPCThunks'; // Import the thunk
// Removed addReduxDialogueEntry and selectDialogueHistoryForNPC as they are not used directly here

interface NPCDialogueTabProps {
  npc: NPC;
}

const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npc }) => { // Corrected prop type
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  
  const [localDialogueHistory, setLocalDialogueHistory] = useState<DialogueEntry[]>([]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const playerMessageText = message;
    setMessage(''); // Clear input immediately

    // Optimistically update local UI for player message
    const playerDisplayMessage: DialogueEntry = {
      id: `player-${Date.now()}`,
      npcId: npc.id,
      speaker: 'player', // Add speaker to DialogueEntry in NPCTypes.ts
      playerText: playerMessageText, // Use playerText for player's message
      npcResponse: '', // Empty for player message
      timestamp: Date.now(),
    };
    setLocalDialogueHistory(prev => [...prev, playerDisplayMessage]);

    try {
      const resultAction = await dispatch(processDialogueChoiceThunk({
        npcId: npc.id,
        choiceId: 'generic_talk', // Placeholder for now
        playerText: playerMessageText,
      }));

      if (processDialogueChoiceThunk.fulfilled.match(resultAction)) {
        const npcResponsePayload = resultAction.payload;
        // Optimistically update local UI for NPC message
        const npcDisplayMessage: DialogueEntry = {
          id: `npc-${Date.now()}`,
          npcId: npc.id,
          speaker: 'npc', // Add speaker to DialogueEntry in NPCTypes.ts
          playerText: playerMessageText, // Store player's text for context
          npcResponse: npcResponsePayload.npcResponse,
          timestamp: Date.now(),
          affinityDelta: npcResponsePayload.affinityDelta,
        };
        setLocalDialogueHistory(prev => [...prev, npcDisplayMessage]);
      } else {
        console.error("Dialogue thunk failed:", resultAction.payload || resultAction.error);
         const errorDisplayMessage: DialogueEntry = {
          id: `error-${Date.now()}`,
          npcId: npc.id,
          speaker: 'system',
          playerText: playerMessageText,
          npcResponse: "Sorry, I couldn't process that.",
          timestamp: Date.now(),
        };
        setLocalDialogueHistory(prev => [...prev, errorDisplayMessage]);
      }
    } catch (error) {
      console.error("Error dispatching dialogue thunk:", error);
       const errorDisplayMessage: DialogueEntry = {
          id: `error-${Date.now()}`,
          npcId: npc.id,
          speaker: 'system',
          playerText: playerMessageText,
          npcResponse: "An unexpected error occurred.",
          timestamp: Date.now(),
        };
        setLocalDialogueHistory(prev => [...prev, errorDisplayMessage]);
    }
  };

  // Removed generateNPCResponse as it's now handled by the thunk
  // The responses object was part of the commented-out function, so it's removed.

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ChatIcon color="primary" />
        <Typography variant="h6">Conversation with {npc.name}</Typography>
      </Box>

      {/* Dialogue History */}
      <Card sx={{ flexGrow: 1, mb: 2, overflow: 'hidden' }}>
        <CardContent sx={{ height: '100%', overflow: 'auto', p: 1 }}>
          <List dense>
            {localDialogueHistory.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.speaker === 'player' ? 'flex-end' : 'flex-start', // Assuming DialogueEntry has speaker
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.speaker === 'player' ? 'primary.main' : 'grey.100',
                      color: msg.speaker === 'player' ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2">
                      {msg.speaker === 'player' ? msg.playerText : msg.npcResponse}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {msg.speaker === 'player' ? 'You' : npc.name} • {new Date(msg.timestamp).toLocaleTimeString()}
                    {msg.speaker === 'npc' && msg.affinityDelta && (
                      <Typography variant="caption" component="span" sx={{ ml: 1, color: msg.affinityDelta > 0 ? 'success.main' : 'error.main' }}>
                        ({msg.affinityDelta > 0 ? '+' : ''}{msg.affinityDelta} Rel)
                      </Typography>
                    )}
                  </Typography>
                </ListItem>
                {index < localDialogueHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Type a message to ${npc.name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          startIcon={<SendIcon />}
          sx={{ alignSelf: 'flex-end' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(NPCDialogueTab);
