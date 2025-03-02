import React, { useContext, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Paper, 
  IconButton, 
  Tooltip, 
  Chip,
  Alert 
} from '@mui/material';
import { 
  History as HistoryIcon,
  ArrowBack as ArrowBackIcon,
  Replay as ReplayIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { GameStateContext } from '../../../context/GameStateContext';
import { formatDistanceToNow } from 'date-fns';

/**
 * @component DialogueHistory
 * @description Displays the history of dialogues between the player and a specific NPC.
 * Allows players to revisit previous conversation branches.
 * 
 * @param {Object} props Component properties
 * @param {string} props.npcId ID of the NPC whose dialogue history to display
 * @param {Function} props.onRevisitDialogue Callback function when player wants to revisit a dialogue
 * @returns {JSX.Element} Rendered component
 */
const DialogueHistory = ({ npcId, onRevisitDialogue }) => {
  const { playerState, npcs } = useContext(GameStateContext);
  
  // Get the specific NPC data
  const npc = useMemo(() => 
    npcs.find(n => n.id === npcId), 
    [npcs, npcId]
  );
  
  // Get dialogue history for this NPC
  const dialogueHistory = useMemo(() => {
    if (!playerState?.dialogueHistory || !npcId) return [];
    
    const history = playerState.dialogueHistory[npcId] || [];
    // Sort by most recent first
    return [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [playerState?.dialogueHistory, npcId]);
  
  // Track unique dialogue branches to avoid duplicates
  const uniqueBranches = useMemo(() => {
    const branches = new Set();
    const uniqueEntries = [];
    
    dialogueHistory.forEach(entry => {
      if (!branches.has(entry.dialogueBranch)) {
        branches.add(entry.dialogueBranch);
        uniqueEntries.push(entry);
      }
    });
    
    return uniqueEntries;
  }, [dialogueHistory]);
  
  if (!npc) {
    return <Alert severity="error">NPC not found</Alert>;
  }
  
  if (dialogueHistory.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <HistoryIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          You haven't had any memorable conversations with {npc.name} yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <HistoryIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Conversation History with {npc.name}</Typography>
      </Box>
      
      {/* Stats about interactions */}
      <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'background.subtle' }}>
        <Typography variant="body2">
          First met: {formatDistanceToNow(
            new Date(dialogueHistory[dialogueHistory.length - 1].timestamp),
            { addSuffix: true }
          )}
        </Typography>
        <Typography variant="body2">
          Total interactions: {dialogueHistory.length}
        </Typography>
      </Paper>
      
      {/* Dialogue branches list */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Remembered Conversations:
      </Typography>
      
      <List sx={{ 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        maxHeight: '350px',
        overflow: 'auto'
      }}>
        {uniqueBranches.map((entry, index) => (
          <React.Fragment key={`${entry.dialogueBranch}-${index}`}>
            {index > 0 && <Divider component="li" />}
            <ListItem 
              alignItems="flex-start"
              secondaryAction={
                <Tooltip title="Revisit this conversation">
                  <IconButton 
                    edge="end" 
                    onClick={() => onRevisitDialogue(entry.dialogueBranch)}
                  >
                    <ReplayIcon />
                  </IconButton>
                </Tooltip>
              }
              sx={{ 
                '&:hover': { bgcolor: 'action.hover' },
                cursor: 'pointer'
              }}
              onClick={() => onRevisitDialogue(entry.dialogueBranch)}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" component="span" sx={{ mr: 1 }}>
                      {npc.dialogue?.[entry.dialogueBranch]?.title || entry.dialogueBranch}
                    </Typography>
                    <Chip 
                      label={entry.category || 'General'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{
                        display: 'inline',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {npc.dialogue?.[entry.dialogueBranch]?.snippet || 'A conversation you had...'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                      </Typography>
                    </Box>
                  </>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default DialogueHistory;