import React, { useContext } from 'react';
import { 
  Box, Typography, Divider, List, ListItem, 
  ListItemText, Paper, Chip, IconButton, Button 
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { GameStateContext } from '../context/GameStateContext';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getRelationshipTier } from '../config/relationshipConstants';

const DialogueHistoryItem = ({ entry, onRevisit }) => {
  const { dialogueId, choice, timestamp, relationshipChange } = entry;
  
  return (
    <ListItem 
      alignItems="flex-start"
      sx={{
        borderLeft: '3px solid',
        borderLeftColor: relationshipChange > 0 ? 'success.main' : 
                         relationshipChange < 0 ? 'error.main' : 
                         'grey.300',
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: '4px',
      }}
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowRightIcon fontSize="small" />
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {choice}
            </Typography>
          </Box>
        }
        secondary={
          <React.Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </Typography>
              
              {relationshipChange !== 0 && (
                <Chip
                  size="small"
                  icon={relationshipChange > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  label={`Relationship ${relationshipChange > 0 ? '+' : ''}${relationshipChange}`}
                  color={relationshipChange > 0 ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {dialogueId}
            </Typography>
          </React.Fragment>
        }
      />
      {/* "Revisit" button */}
      <Button 
        variant="text" 
        onClick={() => onRevisit(dialogueId)}
        disabled={dialogueId === 'unknown'} 
        size="small"
      >
        Revisit
      </Button>
    </ListItem>
  );
};

const DialogueHistory = ({ npcId, onRevisitDialogue }) => {
  const { npcs } = useContext(GameStateContext);
  const npc = npcs.find(n => n.id === npcId);
  
  if (!npc || !npc.dialogueHistory || npc.dialogueHistory.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography color="text.secondary">No previous conversations recorded.</Typography>
      </Paper>
    );
  }

  // Group conversations by day
  const groupedHistory = npc.dialogueHistory.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Conversation History with {npc.name}
      </Typography>
      
      {Object.entries(groupedHistory).map(([date, entries], index) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {date}
          </Typography>
          <List sx={{ p: 0 }}>
            {entries.map((entry, i) => (
              <DialogueHistoryItem 
                key={i} 
                entry={entry} 
                onRevisit={onRevisitDialogue} 
              />
            ))}
          </List>
          {index < Object.entries(groupedHistory).length - 1 && (
            <Divider sx={{ my: 2 }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default DialogueHistory;