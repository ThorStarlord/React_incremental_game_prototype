/**
 * @file NPCDialogueTab.tsx
 * @description Dialogue interaction tab for conversations with NPCs
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Paper,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PlayerIcon,
  Chat as NPCIcon
} from '@mui/icons-material';
import type { NPC, NPCInteraction } from '../../state/NPCTypes';

interface NPCDialogueTabProps {
  npc: NPC;
  onStartInteraction?: (type: 'dialogue' | 'trade' | 'quest' | 'trait_sharing') => void;
  onEndInteraction?: () => void;
  onRelationshipChange?: (change: number, reason?: string) => void;
  onProcessInteraction?: (interactionType: string, options?: Record<string, any>) => void;
  onDialogueChoice?: (choiceId: string, playerText: string) => void;
  currentInteraction?: NPCInteraction | null;
  interactionData?: any;
}

interface DialogueMessage {
  id: string;
  speaker: 'player' | 'npc';
  text: string;
  timestamp: number;
  relationshipChange?: number;
}

const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({
  npc,
  onStartInteraction,
  onDialogueChoice,
  currentInteraction,
  interactionData
}) => {
  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: '1',
      speaker: 'npc',
      text: `Hello! It's nice to see you. How can I help you today?`,
      timestamp: Date.now() - 60000
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;

    const playerMessage: DialogueMessage = {
      id: Date.now().toString(),
      speaker: 'player',
      text: currentMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, playerMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate NPC response
    setTimeout(() => {
      const responses = [
        "That's very interesting! Tell me more.",
        "I understand your perspective on that.",
        "You raise a good point there.",
        "I appreciate you sharing that with me.",
        "That reminds me of something similar I experienced."
      ];

      const npcResponse: DialogueMessage = {
        id: (Date.now() + 1).toString(),
        speaker: 'npc',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        relationshipChange: Math.random() > 0.7 ? 1 : 0
      };

      setMessages(prev => [...prev, npcResponse]);
      setIsTyping(false);

      // Process dialogue choice if handler provided
      if (onDialogueChoice && npcResponse.relationshipChange) {
        onDialogueChoice('positive', currentMessage);
      }
    }, 1000 + Math.random() * 2000);
  }, [currentMessage, onDialogueChoice]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Dialogue Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={npc.avatar}>
              {npc.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                Conversation with {npc.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip 
                  label={`Relationship: ${interactionData?.relationship || 0}`}
                  color="primary"
                  size="small"
                />
                {currentInteraction && (
                  <Chip 
                    label="In Conversation"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mb: 2 }}>
        Build your relationship through meaningful conversations. Current relationship: {interactionData?.relationship || 0}/100
      </Alert>

      {/* Messages Area */}
      <Paper 
        variant="outlined" 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          mb: 2,
          maxHeight: '400px',
          backgroundColor: 'grey.50'
        }}
      >
        <List sx={{ p: 1 }}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: message.speaker === 'player' ? 'flex-end' : 'flex-start',
                  px: 1,
                  py: 0.5
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                    alignSelf: message.speaker === 'player' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {message.speaker === 'npc' && (
                    <Avatar 
                      src={npc.avatar}
                      sx={{ width: 24, height: 24 }}
                    >
                      <NPCIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {message.speaker === 'player' ? 'You' : npc.name}
                  </Typography>
                  {message.speaker === 'player' && (
                    <Avatar sx={{ width: 24, height: 24 }}>
                      <PlayerIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
                
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    backgroundColor: message.speaker === 'player' 
                      ? 'primary.light' 
                      : 'grey.100'
                  }}
                >
                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                    {message.relationshipChange && (
                      <Chip
                        label={`+${message.relationshipChange} relationship`}
                        color="success"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </Paper>
              </ListItem>
              {index < messages.length - 1 && <Divider variant="middle" />}
            </React.Fragment>
          ))}
          
          {isTyping && (
            <ListItem sx={{ justifyContent: 'flex-start', px: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  src={npc.avatar}
                  sx={{ width: 24, height: 24 }}
                >
                  <NPCIcon fontSize="small" />
                </Avatar>
                <Paper elevation={1} sx={{ p: 1.5, backgroundColor: 'grey.100' }}>
                  <Typography variant="body2" color="text.secondary">
                    {npc.name} is typing...
                  </Typography>
                </Paper>
              </Box>
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Message Input */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder={`Type your message to ${npc.name}...`}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || isTyping}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <SendIcon />
        </Button>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setCurrentMessage("How are you doing today?")}
          disabled={isTyping}
        >
          Ask about their day
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setCurrentMessage("Tell me about yourself.")}
          disabled={isTyping}
        >
          Learn more
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setCurrentMessage("Thank you for your time.")}
          disabled={isTyping}
        >
          Express gratitude
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Press Enter to send, Shift+Enter for new line
      </Typography>
    </Box>
  );
};

export default NPCDialogueTab;
