import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  IconButton, 
  Grid, 
  Typography, 
  Divider, 
  Button, 
  Stack,
  Paper,
  Chip,
  useTheme 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BreadcrumbNav from '../../../shared/components/ui/BreadcrumbNav';
import NPCPanel from './container/NPCPanel';
import DialogueHistory from './DialogueHistory';
import { useGameState, useGameDispatch } from '../../../context/index';

/**
 * NPCEncounter Component
 * 
 * Provides an interface for player interactions with an NPC, including dialogue,
 * trading, and relationship management.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.npcId - The unique ID of the NPC being encountered
 * 
 * @example
 * <NPCEncounter npcId="npc-merchant-1" />
 * 
 * @returns {JSX.Element} Rendered NPCEncounter component
 */
const NPCEncounter = ({ npcId }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const gameState = useGameState();
  const { npcs, player, addDialogueMessage } = gameState;
  
  // Component state
  const [activeTab, setActiveTab] = useState('talk'); // 'talk', 'trade', 'relationship'
  const [responseOptions, setResponseOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Find the current NPC from the game state
  // Add proper guard to prevent "Cannot read properties of undefined (reading 'find')" error
  const currentNpc = Array.isArray(npcs) 
    ? npcs.find(npc => npc && npc.id === npcId)
    : null;
  
  // Initialize encounter when component mounts
  useEffect(() => {
    if (currentNpc) {
      // Add greeting message from NPC
      addDialogueMessage({
        id: `msg-${Date.now()}`,
        npcId: currentNpc.id,
        npcName: currentNpc.name,
        message: currentNpc.greeting || `Hello there, ${player?.name || 'adventurer'}!`,
        timestamp: Date.now(),
        isPlayerResponse: false,
        emotion: 'greeting'
      });
      
      // Set initial response options
      setResponseOptions([
        {
          id: 'greeting-1',
          text: `Hello, ${currentNpc.name}.`,
          emotion: 'friendly'
        },
        {
          id: 'greeting-2',
          text: "What services do you offer?",
          emotion: 'curious'
        },
        {
          id: 'greeting-3',
          text: "I'd like to know more about you.",
          emotion: 'interested'
        }
      ]);
    }
  }, [currentNpc, player, addDialogueMessage]);

  // Handle player dialogue response selection
  const handleSelectResponse = (response) => {
    setIsLoading(true);
    
    // Add player's response to dialogue history
    addDialogueMessage({
      id: `msg-player-${Date.now()}`,
      npcId: currentNpc.id,
      npcName: player?.name || 'Player',
      message: response.text,
      timestamp: Date.now(),
      isPlayerResponse: true,
      emotion: response.emotion
    });
    
    // Simulate NPC response (in a real game, this would come from the dialogue system)
    setTimeout(() => {
      // Add NPC response
      addDialogueMessage({
        id: `msg-npc-${Date.now()}`,
        npcId: currentNpc.id,
        npcName: currentNpc.name,
        message: generateNpcResponse(response.id, currentNpc),
        timestamp: Date.now(),
        isPlayerResponse: false
      });
      
      // Generate new response options
      setResponseOptions(generateNewResponseOptions(response.id, currentNpc));
      setIsLoading(false);
    }, 800); // Small delay for realism
  };
  
  // Generate NPC response based on player's choice
  const generateNpcResponse = (responseId, npc) => {
    // In a real implementation, this would use a proper dialogue system
    // This is just a simple example
    switch(responseId) {
      case 'greeting-1':
        return `It's good to see you. How can I assist you today?`;
      case 'greeting-2':
        return `I can offer ${npc.services?.join(', ') || 'various services'} depending on your needs.`;
      case 'greeting-3':
        return `I've been in these parts for many years. ${npc.backstory || 'There\'s not much else to tell.'}`;
      default:
        return `What else would you like to know?`;
    }
  };
  
  // Generate new response options based on previous selection
  const generateNewResponseOptions = (previousResponseId, npc) => {
    // In a real implementation, this would use a proper dialogue system
    // This is just a simple example with hardcoded options
    switch(previousResponseId) {
      case 'greeting-1':
        return [
          { id: 'follow-1-1', text: "I'm looking for quests.", emotion: 'determined' },
          { id: 'follow-1-2', text: "Do you have anything to trade?", emotion: 'curious' },
          { id: 'follow-1-3', text: "I'll be going now.", emotion: 'neutral' }
        ];
      case 'greeting-2':
        return [
          { id: 'follow-2-1', text: "Tell me about your trading goods.", emotion: 'interested' },
          { id: 'follow-2-2', text: "Any quests available?", emotion: 'hopeful' },
          { id: 'follow-2-3', text: "Thanks for the information.", emotion: 'grateful' }
        ];
      case 'greeting-3':
        return [
          { id: 'follow-3-1', text: "How did you end up here?", emotion: 'curious' },
          { id: 'follow-3-2', text: "What do you know about this region?", emotion: 'curious' },
          { id: 'follow-3-3', text: "Let's talk about something else.", emotion: 'neutral' }
        ];
      default:
        return [
          { id: 'default-1', text: "I'd like to trade.", emotion: 'neutral' },
          { id: 'default-2', text: "Any news or rumors?", emotion: 'curious' },
          { id: 'default-3', text: "Goodbye.", emotion: 'neutral' }
        ];
    }
  };

  // If NPC isn't found
  if (!currentNpc) {
    return (
      <Box sx={{ p: 2 }}>
        <BreadcrumbNav />
        <Typography variant="h5" color="error">
          NPC not found. Invalid ID: {npcId}
        </Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <BreadcrumbNav />
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} size="large">
          <ArrowBackIcon />
        </IconButton>
      </Box>
      
      <Grid container spacing={2}>
        {/* Left Side - NPC Info */}
        <Grid item xs={12} md={4}>
          <NPCPanel npcId={npcId} />
          
          {/* Interaction Mode Tabs */}
          <Paper sx={{ mt: 2, p: 2, bgcolor: theme.palette.background.paper }}>
            <Typography variant="subtitle1" gutterBottom>
              Interaction Mode
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant={activeTab === 'talk' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('talk')}
                startIcon={<ChatIcon />}
                fullWidth
              >
                Talk
              </Button>
              <Button
                variant={activeTab === 'trade' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('trade')}
                startIcon={<ShoppingCartIcon />}
                fullWidth
                disabled={!currentNpc.canTrade}
              >
                Trade
              </Button>
            </Stack>
            
            <Button
              variant={activeTab === 'relationship' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('relationship')}
              startIcon={<HandshakeIcon />}
              fullWidth
            >
              Relationship
            </Button>
          </Paper>
        </Grid>
        
        {/* Right Side - Interaction Area */}
        <Grid item xs={12} md={8}>
          {activeTab === 'talk' && (
            <Box>
              {/* Dialogue History */}
              <Box sx={{ mb: 2 }}>
                <DialogueHistory filterNpcId={npcId} maxMessages={20} />
              </Box>
              
              {/* Response Options */}
              <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  <QuestionAnswerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Your Response
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={1}>
                  {responseOptions.map(option => (
                    <Button
                      key={option.id}
                      variant="outlined"
                      onClick={() => handleSelectResponse(option)}
                      disabled={isLoading}
                      sx={{ 
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        py: 1.5
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ flexGrow: 1 }}>{option.text}</Typography>
                        {option.emotion && (
                          <Chip 
                            label={option.emotion} 
                            size="small" 
                            sx={{ ml: 1 }}
                            color={getEmotionColor(option.emotion)}
                          />
                        )}
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}
          
          {activeTab === 'trade' && (
            <Paper sx={{ p: 3, height: '100%', minHeight: '400px' }}>
              <Typography variant="h6" gutterBottom>
                <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Trading with {currentNpc.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {currentNpc.canTrade ? (
                <Typography variant="body1">
                  Trade interface would go here.
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  This NPC doesn't have any items to trade.
                </Typography>
              )}
            </Paper>
          )}
          
          {activeTab === 'relationship' && (
            <Paper sx={{ p: 3, height: '100%', minHeight: '400px' }}>
              <Typography variant="h6" gutterBottom>
                <HandshakeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Relationship with {currentNpc.name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                Relationship status: {currentNpc.relationship || 'Neutral'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Building relationships with NPCs can unlock special quests, better trading deals, and other benefits.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

/**
 * Helper function to get chip color based on emotion
 * @param {string} emotion - Emotion string
 * @returns {string} MUI color string
 */
const getEmotionColor = (emotion) => {
  switch(emotion?.toLowerCase()) {
    case 'friendly':
    case 'grateful':
      return 'success';
    case 'curious':
    case 'interested':
    case 'hopeful':
      return 'info';
    case 'angry':
    case 'upset':
      return 'error';
    case 'determined':
      return 'warning';
    default:
      return 'default';
  }
};

export default NPCEncounter;