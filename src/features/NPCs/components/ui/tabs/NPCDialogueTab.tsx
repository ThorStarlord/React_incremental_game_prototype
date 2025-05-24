import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, List, ListItem, ListItemText, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

import type { NpcState } from '../../../state/NpcTypes';

interface NPCDialogueTabProps {
  npc: NpcState;
}

interface DialogueMessage {
  id: string;
  speaker: 'player' | 'npc';
  text: string;
  timestamp: Date;
}

const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npc }) => {
  const [message, setMessage] = useState('');
  const [dialogueHistory, setDialogueHistory] = useState<DialogueMessage[]>([
    {
      id: '1',
      speaker: 'npc',
      text: `Hello! It's good to see you again.`,
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const playerMessage: DialogueMessage = {
      id: Date.now().toString(),
      speaker: 'player',
      text: message,
      timestamp: new Date()
    };

    // Add player message
    setDialogueHistory(prev => [...prev, playerMessage]);

    // Simulate NPC response
    setTimeout(() => {
      const npcResponse: DialogueMessage = {
        id: (Date.now() + 1).toString(),
        speaker: 'npc',
        text: generateNPCResponse(message, npc),
        timestamp: new Date()
      };
      setDialogueHistory(prev => [...prev, npcResponse]);
    }, 1000);

    setMessage('');
  };

  const generateNPCResponse = (playerMessage: string, npc: NpcState): string => {
    // Simple response generation based on relationship level
    const responses = {
      low: [
        "I appreciate you talking to me.",
        "Thank you for your interest.",
        "I'm still getting to know you."
      ],
      medium: [
        "I'm glad we're becoming friends.",
        "You seem like someone I can trust.",
        "I enjoy our conversations."
      ],
      high: [
        "You've become very important to me.",
        "I feel like we really understand each other.",
        "I'm grateful for our deep connection."
      ]
    };

    let responseLevel: keyof typeof responses;
    if (npc.relationshipValue >= 3) responseLevel = 'high';
    else if (npc.relationshipValue >= 2) responseLevel = 'medium';
    else responseLevel = 'low';

    const availableResponses = responses[responseLevel];
    return availableResponses[Math.floor(Math.random() * availableResponses.length)];
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
            {dialogueHistory.map((msg, index) => (
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
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {msg.speaker === 'player' ? 'You' : npc.name} • {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </ListItem>
                {index < dialogueHistory.length - 1 && <Divider />}
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
