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
import DialogueHistory from '../dialogue/DialogueHistory';
import { useGameState, useGameDispatch } from '../../../context/index';

/**
 * Interface for a response option in dialogue
 */
interface ResponseOption {
  /** Unique identifier for this option */
  id: string;
  /** Text displayed to the player */
  text: string;
  /** Emotional tone of this response */
  emotion?: string;
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Interface for an NPC object
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Initial greeting message */
  greeting?: string;
  /** Services offered by this NPC */
  services?: string[];
  /** Background story information */
  backstory?: string;
  /** Whether the NPC can trade */
  canTrade?: boolean;
  /** Additional NPC properties */
  [key: string]: any;
}

/**
 * Interface for a player object
 */
interface Player {
  /** Player's name */
  name?: string;
  /** Additional player properties */
  [key: string]: any;
}

/**
 * Interface for game state
 */
interface GameState {
  /** Array of all NPCs in the game */
  npcs: NPC[];
  /** Player data */
  player?: Player;
  /** Function to add dialogue message to history */
  addDialogueMessage: (message: DialogueMessage) => void;
}

/**
 * Interface for a dialogue message
 */
interface DialogueMessage {
  /** Unique message identifier */
  id: string;
  /** ID of the NPC who spoke or was spoken to */
  npcId: string;
  /** Name of the NPC */
  npcName: string;
  /** Message content */
  message: string;
  /** Timestamp when the message was created */
  timestamp: number;
  /** Whether this is a player response */
  isPlayerResponse: boolean;
  /** Emotional tone of the message */
  emotion?: string;
}

/**
 * Interface for NPCEncounter component props
 */
interface NPCEncounterProps {
  /** ID of the NPC being encountered */
  npcId: string;
}

/**
 * NPCEncounter Component
 * 
 * Provides an interface for player interactions with an NPC, including dialogue,
 * trading, and relationship management.
 * 
 * @param props - Component props
 * @returns Rendered NPCEncounter component
 */
const NPCEncounter: React.FC<NPCEncounterProps> = ({ npcId }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const gameState = useGameState() as GameState;
  const { npcs, player, addDialogueMessage } = gameState;
  
  // Component state
  const [activeTab, setActiveTab] = useState<'talk' | 'trade' | 'relationship'>('talk');
  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  /**
   * Handle player dialogue response selection
   * @param response - The selected response option
   */
  const handleSelectResponse = (response: ResponseOption): void => {
    setIsLoading(true);
    
    // Add player's response to dialogue history
    addDialogueMessage({
      id: `msg-player-${Date.now()}`,
      npcId: currentNpc!.id,
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
        npcId: currentNpc!.id,
        npcName: currentNpc!.name,
        message: generateNpcResponse(response.id, currentNpc!),
        timestamp: Date.now(),
        isPlayerResponse: false
      });
      
      // Generate new response options
      setResponseOptions(generateNewResponseOptions(response.id, currentNpc!));
      setIsLoading(false);
    }, 800); // Small delay for realism
  };
  
  /**
   * Generate NPC response based on player's choice
   * @param responseId - ID of the selected response
   * @param npc - The NPC data
   * @returns Response message from the NPC
   */
  const generateNpcResponse = (responseId: string, npc: NPC): string => {
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
  
  /**
   * Generate new response options based on previous selection
   * @param previousResponseId - ID of the previously selected response
   * @param npc - The NPC data
   * @returns New array of response options
   */
  const generateNewResponseOptions = (previousResponseId: string, npc: NPC): ResponseOption[] => {
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
 * @param emotion - Emotion string
 * @returns MUI color string
 */
const getEmotionColor = (emotion?: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  if (!emotion) return 'default';
  
  switch(emotion.toLowerCase()) {
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
