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
 * @typedef {Object} DialogueMessage
 * @property {string} id - Unique identifier for the message
 * @property {string} npcId - ID of the NPC who spoke this message
 * @property {string} npcName - Name of the NPC who spoke
 * @property {string} message - Content of the dialogue message
 * @property {number} timestamp - Unix timestamp when the message was spoken
 * @property {boolean} isPlayerResponse - Whether this message was a player response
 * @property {string} [emotion] - Optional emotion/tone of the message
 */

/**
 * DialogueHistory Component
 * 
 * Displays a chronological history of dialogue exchanges between the player and NPCs.
 * Allows filtering by NPC and clearing conversation history.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.compact=false] - Whether to show the compact view with limited messages
 * @param {string} [props.filterNpcId] - Optional NPC ID to filter conversation by specific NPC
 * @param {number} [props.maxMessages=50] - Maximum number of messages to display
 * 
 * @returns {JSX.Element} Rendered DialogueHistory component
 */
const DialogueHistory = ({ compact = false, filterNpcId, maxMessages = 50 }) => {
  const theme = useTheme();
  const { dialogueHistory, clearDialogueHistory } = useContext(GameStateContext);
  const [filteredHistory, setFilteredHistory] = useState([]);

  // Format timestamp to a readable time
  const formatTime = (timestamp) => {
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

  // Handle clearing dialogue history
  const handleClearHistory = () => {
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