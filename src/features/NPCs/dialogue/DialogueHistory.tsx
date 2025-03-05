import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  useTheme
} from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import PersonIcon from '@mui/icons-material/Person';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { GameStateContext } from '../../../context/GameStateContext';
import Panel from '../../../shared/components/layout/Panel';

/**
 * Interface representing a dialogue message
 */
interface DialogueMessage {
  /** Unique identifier for the message */
  id: string;
  /** ID of the NPC who spoke this message */
  npcId: string;
  /** Name of the NPC who spoke */
  npcName: string;
  /** Content of the dialogue message */
  message: string;
  /** Unix timestamp when the message was spoken */
  timestamp: number;
  /** Whether this message was a player response */
  isPlayerResponse: boolean;
  /** Optional emotion/tone of the message */
  emotion?: string;
}

/**
 * Interface for the game state context
 */
interface GameState {
  /** Array of dialogue messages */
  dialogueHistory: DialogueMessage[];
  /** Function to clear dialogue history */
  clearDialogueHistory: () => void;
}

/**
 * Interface for DialogueHistory component props
 */
interface DialogueHistoryProps {
  /** Whether to show the compact view with limited messages */
  compact?: boolean;
  /** Optional NPC ID to filter conversation by specific NPC */
  filterNpcId?: string;
  /** Maximum number of messages to display */
  maxMessages?: number;
}

/**
 * DialogueHistory Component
 * 
 * Displays a chronological history of dialogue exchanges between the player and NPCs.
 * Allows filtering by NPC and clearing conversation history.
 * 
 * @component
 * @param props - Component props
 * @param props.compact - Whether to show the compact view with limited messages
 * @param props.filterNpcId - Optional NPC ID to filter conversation by specific NPC
 * @param props.maxMessages - Maximum number of messages to display
 * 
 * @example
 * // Basic usage
 * <DialogueHistory />
 * 
 * @example
 * // Compact view with specific NPC filter
 * <DialogueHistory compact={true} filterNpcId="npc-123" maxMessages={10} />
 * 
 * @returns Rendered DialogueHistory component
 */
const DialogueHistory: React.FC<DialogueHistoryProps> = ({ 
  compact = false, 
  filterNpcId, 
  maxMessages = 50 
}) => {
  const theme = useTheme();
  const { dialogueHistory, clearDialogueHistory } = useContext<GameState>(GameStateContext);
  const [filteredHistory, setFilteredHistory] = useState<DialogueMessage[]>([]);

  /**
   * Format timestamp to a readable time
   * @param timestamp - Unix timestamp to format
   * @returns Formatted time string
   */
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter and sort dialogue history
  useEffect(() => {
    let messages = [...dialogueHistory];
    
    // Apply NPC filter if specified
    if (filterNpcId) {
      messages = messages.filter(msg => msg.npcId === filterNpcId);
    }
    
    // Sort by timestamp (most recent last)
    messages.sort((a, b) => a.timestamp - b.timestamp);
    
    // Limit to maxMessages
    if (compact) {
      messages = messages.slice(-5); // Show only 5 most recent in compact mode
    } else {
      messages = messages.slice(-maxMessages);
    }
    
    setFilteredHistory(messages);
  }, [dialogueHistory, filterNpcId, compact, maxMessages]);

  /**
   * Handle clearing dialogue history
   * Requests confirmation before clearing
   */
  const handleClearHistory = (): void => {
    if (window.confirm('Are you sure you want to clear all dialogue history?')) {
      clearDialogueHistory();
    }
  };

  return (
    <Panel
      title="Dialogue History"
      icon={<AutoStoriesIcon />}
      defaultExpanded={!compact}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
        <Badge badgeContent={filteredHistory.length} color="primary">
          <Typography variant="subtitle1">
            {filterNpcId ? 'Conversation' : 'Recent Dialogues'}
          </Typography>
        </Badge>
        
        {!compact && (
          <Tooltip title="Clear History">
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleClearHistory}
              disabled={filteredHistory.length === 0}
            >
              <ClearAllIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {filteredHistory.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic', textAlign: 'center' }}>
          No dialogue history yet
        </Typography>
      ) : (
        <List sx={{ 
          maxHeight: compact ? '200px' : '400px',
          overflow: 'auto',
          bgcolor: theme.palette.background.default,
          borderRadius: 1
        }}>
          {filteredHistory.map((message, index) => (
            <React.Fragment key={message.id || index}>
              <ListItem 
                alignItems="flex-start"
                sx={{ 
                  py: 1,
                  px: 1,
                  bgcolor: message.isPlayerResponse 
                    ? theme.palette.action.hover 
                    : 'transparent'
                }}
              >
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      mr: 1, 
                      bgcolor: message.isPlayerResponse 
                        ? theme.palette.primary.main 
                        : theme.palette.secondary.main,
                      width: 32,
                      height: 32
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" component="span">
                        {message.isPlayerResponse ? 'You' : message.npcName}
                        {message.emotion && !compact && (
                          <Typography 
                            component="span" 
                            variant="caption" 
                            sx={{ ml: 1, fontStyle: 'italic' }}
                          >
                            ({message.emotion})
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                      {message.message}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              {index < filteredHistory.length - 1 && <Divider component="li" variant="inset" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Panel>
  );
};

export default DialogueHistory;
