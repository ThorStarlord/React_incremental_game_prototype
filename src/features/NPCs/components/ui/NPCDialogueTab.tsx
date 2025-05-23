/**
 * @file NPCDialogueTab.tsx
 * @description Tab component for NPC dialogue interactions
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectNPCById, selectDialogueHistory } from '../state/NPCSelectors';
import { npcActions } from '../state/NPCSlice';

// Mock dialogue data - this would come from game data in a real implementation
const MOCK_DIALOGUES = {
  'greeting': {
    id: 'greeting',
    text: "Hello there! I haven't seen you around these parts before.",
    speaker: 'npc' as const,
    options: [
      {
        id: 'introduce',
        text: "I'm new here. What can you tell me about this place?",
        nextNodeId: 'introduction',
        effects: [{ type: 'relationship', target: 'relationship', operation: 'add', value: 1 }],
      },
      {
        id: 'business',
        text: "I'm just passing through. What do you do here?",
        nextNodeId: 'business_talk',
        effects: [],
      },
      {
        id: 'goodbye',
        text: "Sorry, I can't chat right now.",
        nextNodeId: 'goodbye',
        effects: [],
      },
    ],
  },
  'introduction': {
    id: 'introduction',
    text: "Welcome to our village! We're a peaceful community of farmers and artisans. I'm always happy to help newcomers settle in.",
    speaker: 'npc' as const,
    options: [
      {
        id: 'ask_help',
        text: "What kind of help do you offer?",
        nextNodeId: 'help_options',
        effects: [{ type: 'relationship', target: 'relationship', operation: 'add', value: 2 }],
      },
      {
        id: 'thank',
        text: "Thank you for the warm welcome!",
        nextNodeId: 'end_positive',
        effects: [{ type: 'relationship', target: 'relationship', operation: 'add', value: 1 }],
      },
    ],
  },
  'business_talk': {
    id: 'business_talk',
    text: "I run the local general store. We have supplies for travelers and tools for those settling down.",
    speaker: 'npc' as const,
    options: [
      {
        id: 'interested',
        text: "I might be interested in browsing your wares.",
        nextNodeId: 'trade_introduction',
        effects: [],
      },
      {
        id: 'not_now',
        text: "Maybe another time.",
        nextNodeId: 'end_neutral',
        effects: [],
      },
    ],
  },
  'help_options': {
    id: 'help_options',
    text: "I can share knowledge about local customs, point you toward work opportunities, or even teach you some useful skills if we become good friends!",
    speaker: 'npc' as const,
    options: [
      {
        id: 'customs',
        text: "Tell me about the local customs.",
        nextNodeId: 'customs_explanation',
        effects: [],
      },
      {
        id: 'work',
        text: "What kind of work is available?",
        nextNodeId: 'work_opportunities',
        effects: [],
      },
      {
        id: 'skills',
        text: "What skills could you teach me?",
        nextNodeId: 'skills_tease',
        effects: [],
      },
    ],
  },
  'end_positive': {
    id: 'end_positive',
    text: "It was a pleasure meeting you! Feel free to visit anytime.",
    speaker: 'npc' as const,
    options: [],
  },
  'end_neutral': {
    id: 'end_neutral',
    text: "Safe travels, then.",
    speaker: 'npc' as const,
    options: [],
  },
  'goodbye': {
    id: 'goodbye',
    text: "Of course, no worries. See you around!",
    speaker: 'npc' as const,
    options: [],
  },
};

// Styled components
const DialogueContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: theme.palette.background.default,
}));

const NPCSpeechBubble = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const PlayerSpeechBubble = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  marginLeft: theme.spacing(4),
}));

interface NPCDialogueTabProps {
  npcId: string;
}

/**
 * NPCDialogueTab - Interactive dialogue system for NPCs
 * 
 * Features:
 * - Branching conversation trees
 * - Relationship effects from dialogue choices
 * - Dialogue history tracking
 * - Contextual options based on relationship level
 */
const NPCDialogueTab: React.FC<NPCDialogueTabProps> = ({ npcId }) => {
  const dispatch = useAppDispatch();
  const npc = useAppSelector((state) => selectNPCById(state, npcId));
  const dialogueHistory = useAppSelector(selectDialogueHistory);
  
  const [currentDialogueId, setCurrentDialogueId] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    speaker: 'npc' | 'player';
    text: string;
    timestamp: Date;
  }>>([]);

  const npcHistory = dialogueHistory[npcId] || [];

  const handleStartDialogue = useCallback((dialogueId: string) => {
    setCurrentDialogueId(dialogueId);
    setConversationHistory([]);
    
    const dialogue = MOCK_DIALOGUES[dialogueId as keyof typeof MOCK_DIALOGUES];
    if (dialogue) {
      setConversationHistory([{
        speaker: dialogue.speaker,
        text: dialogue.text,
        timestamp: new Date(),
      }]);
      
      dispatch(npcActions.startDialogue({ npcId, dialogueId }));
    }
  }, [dispatch, npcId]);

  const handleDialogueChoice = useCallback((optionId: string, optionText: string, nextNodeId: string, effects: any[]) => {
    // Add player response to conversation
    setConversationHistory(prev => [...prev, {
      speaker: 'player',
      text: optionText,
      timestamp: new Date(),
    }]);

    // Apply effects
    effects.forEach(effect => {
      if (effect.type === 'relationship') {
        dispatch(npcActions.updateRelationship({
          npcId,
          change: effect.value,
          reason: 'Dialogue choice',
        }));
      }
    });

    // Move to next dialogue node or end conversation
    if (nextNodeId && MOCK_DIALOGUES[nextNodeId as keyof typeof MOCK_DIALOGUES]) {
      const nextDialogue = MOCK_DIALOGUES[nextNodeId as keyof typeof MOCK_DIALOGUES];
      
      setTimeout(() => {
        setConversationHistory(prev => [...prev, {
          speaker: nextDialogue.speaker,
          text: nextDialogue.text,
          timestamp: new Date(),
        }]);
        
        setCurrentDialogueId(nextNodeId);
      }, 1000);
    } else {
      // End conversation
      setTimeout(() => {
        setCurrentDialogueId(null);
        dispatch(npcActions.completeDialogue({
          npcId,
          dialogueId: currentDialogueId!,
          effects,
        }));
      }, 1000);
    }
  }, [dispatch, npcId, currentDialogueId]);

  const handleEndConversation = useCallback(() => {
    setCurrentDialogueId(null);
    setConversationHistory([]);
  }, []);

  if (!npc) {
    return (
      <Typography variant="body1" color="text.secondary">
        NPC not found.
      </Typography>
    );
  }

  // Get available dialogue options
  const availableDialogues = npc.availableDialogues.filter(id => 
    !npcHistory.includes(id) || id === 'greeting' // Greeting can always be repeated
  );

  const currentDialogue = currentDialogueId ? 
    MOCK_DIALOGUES[currentDialogueId as keyof typeof MOCK_DIALOGUES] : null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        <ChatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Conversation with {npc.name}
      </Typography>

      {/* Active Conversation */}
      {currentDialogue ? (
        <DialogueContainer>
          {/* Conversation History */}
          <Box mb={2}>
            {conversationHistory.map((entry, index) => (
              entry.speaker === 'npc' ? (
                <NPCSpeechBubble key={index}>
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <PersonIcon />
                    <Box>
                      <Typography variant="body1">
                        {entry.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </NPCSpeechBubble>
              ) : (
                <PlayerSpeechBubble key={index}>
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <RecordVoiceOverIcon />
                    <Box>
                      <Typography variant="body1">
                        {entry.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </PlayerSpeechBubble>
              )
            ))}
          </Box>

          {/* Dialogue Options */}
          {currentDialogue.options.length > 0 ? (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Choose your response:
              </Typography>
              <List>
                {currentDialogue.options.map((option, index) => (
                  <ListItem 
                    key={option.id}
                    sx={{ p: 0, mb: 1 }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        py: 1.5,
                        px: 2,
                      }}
                      onClick={() => handleDialogueChoice(
                        option.id, 
                        option.text, 
                        option.nextNodeId, 
                        option.effects || []
                      )}
                    >
                      <Typography variant="body2">
                        {option.text}
                      </Typography>
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Conversation ended.
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleEndConversation}
                sx={{ mt: 1 }}
              >
                Continue
              </Button>
            </Box>
          )}
        </DialogueContainer>
      ) : (
        /* Dialogue Selection */
        <Box>
          {availableDialogues.length > 0 ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                What would you like to talk about?
              </Typography>
              <List>
                {availableDialogues.map((dialogueId) => (
                  <ListItem key={dialogueId} sx={{ p: 0, mb: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        py: 1.5,
                        px: 2,
                      }}
                      onClick={() => handleStartDialogue(dialogueId)}
                    >
                      <ChatIcon sx={{ mr: 1 }} />
                      {dialogueId === 'greeting' ? 'Start Conversation' : dialogueId}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                {npc.name} doesn't have anything new to say right now. 
                Try improving your relationship or completing some tasks to unlock new conversations.
              </Typography>
            </Alert>
          )}

          {/* Dialogue History */}
          {npcHistory.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Previous Conversations:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {npcHistory.map((dialogueId, index) => (
                  <Chip
                    key={index}
                    label={dialogueId}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NPCDialogueTab;
