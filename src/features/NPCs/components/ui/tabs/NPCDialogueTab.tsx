import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, List, ListItem, ListItemText, Divider, Grid } from '@mui/material'; // Added Grid
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

import type { NPC, DialogueEntry } from '../../../state/NPCTypes';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { processDialogueChoiceThunk } from '../../../state/NPCThunks';
import { mockDialogues } from '../../../data'; // Import from index.ts
import { selectNPCDialogueHistory } from '../../../state/NPCSelectors'; // Corrected selector name

interface NPCDialogueTabProps {
  npc: NPC;
}

const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npc }) => {
  const dispatch = useAppDispatch();
  const dialogueHistory = useAppSelector(state => selectNPCDialogueHistory(state, npc.id)); // Use global history

  const [message, setMessage] = useState(''); // For free-text input, if still desired

  // Filter available dialogues based on NPC's availableDialogues array
  const availableDialogueChoices = React.useMemo(() => {
    return npc.availableDialogues
      .map(dialogueId => mockDialogues[dialogueId])
      .filter(Boolean); // Filter out undefined entries if ID not found in mockDialogues
  }, [npc.availableDialogues]);

  const handleSendFreeTextMessage = async () => {
    if (!message.trim()) return;

    const playerMessageText = message;
    setMessage(''); // Clear input immediately

    try {
      // Use a generic choiceId for free text, or remove free text if not desired
      await dispatch(processDialogueChoiceThunk({
        npcId: npc.id,
        choiceId: 'generic_talk', // Keep 'generic_talk' for free text
        playerText: playerMessageText,
      }));
    } catch (error) {
      console.error("Error dispatching free text dialogue thunk:", error);
      // Error handling for UI could be added here, e.g., a temporary system message
    }
  };

  const handleSelectDialogueChoice = async (choiceId: string, playerText: string) => {
    try {
      await dispatch(processDialogueChoiceThunk({
        npcId: npc.id,
        choiceId: choiceId,
        playerText: playerText,
      }));
    } catch (error) {
      console.error("Error dispatching dialogue choice thunk:", error);
      // Error handling for UI
    }
  };

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
            {dialogueHistory.map((msg: DialogueEntry, index: number) => ( // Explicitly type msg and index
              <React.Fragment key={msg.id}>
                <ListItem
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.speaker === 'player' ? 'flex-end' : 'flex-start',
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
                {index < dialogueHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Dialogue Choices */}
      {availableDialogueChoices.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Choose a topic:
          </Typography>
          <Grid container spacing={1}>
            {availableDialogueChoices.map((choice) => (
              <Grid item key={choice.id}>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectDialogueChoice(choice.id, choice.title)} // Pass choice.id and choice.title as playerText
                >
                  {choice.title}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Free-text Message Input (Optional, can be removed if only choices are desired) */}
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
              handleSendFreeTextMessage();
            }
          }}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          onClick={handleSendFreeTextMessage}
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
