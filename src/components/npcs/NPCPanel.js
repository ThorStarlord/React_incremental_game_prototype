import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  ListItemAvatar,
  Chip,
  Badge,
  Paper
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Panel from '../ui/Panel';
import { GameStateContext, GameDispatchContext } from '../../context/GameStateContext';
import { useNavigate } from 'react-router-dom';

const NPCPanel = () => {
  const { npcs, player, tutorial } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const navigate = useNavigate();
  
  // Active location is either from tutorial or default to woodhaven
  const activeLocation = tutorial?.currentLocation || 'woodhaven';
  
  // Filter NPCs by current location
  const locationNPCs = npcs.filter(npc => npc.location === activeLocation);
  
  // Handle NPC interaction
  const handleNPCClick = (npc) => {
    // If this is the first NPC interaction and tutorial is active
    if (tutorial?.active && tutorial?.step === 'meetFirstNPC' && npc.id === tutorial?.targetNPCId) {
      // Mark this tutorial step as complete
      dispatch({ 
        type: 'TUTORIAL_PROGRESS', 
        payload: { step: 'meetFirstNPC', completed: true }
      });
      
      // Move to next tutorial step
      dispatch({
        type: 'SET_TUTORIAL_STEP',
        payload: 'acquireFirstTrait'
      });
    }
    
    // Navigate to NPC detail view
    navigate(`/npc/${npc.id}`);
  };
  
  // If no NPCs found in this location
  if (locationNPCs.length === 0) {
    return (
      <Panel title="Town Residents">
        <Typography variant="body2" color="text.secondary">
          There doesn't seem to be anyone around here.
        </Typography>
      </Panel>
    );
  }
  
  // Tutorial highlight for the target NPC
  const highlightNPC = tutorial?.active && tutorial?.step === 'meetFirstNPC' ? tutorial.targetNPCId : null;
  
  return (
    <Panel title={`${activeLocation.charAt(0).toUpperCase() + activeLocation.slice(1)} Residents`}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        People you can interact with in this area:
      </Typography>
      <List sx={{ pt: 0 }}>
        {locationNPCs.map(npc => {
          // Check if this NPC has been met before
          const hasInteracted = (player.metNPCs || []).includes(npc.id);
          const isHighlighted = npc.id === highlightNPC;
          
          return (
            <Paper 
              key={npc.id} 
              elevation={isHighlighted ? 3 : 1}
              sx={{ 
                mb: 1.5, 
                position: 'relative',
                border: isHighlighted ? '2px solid' : 'none',
                borderColor: isHighlighted ? 'primary.main' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              {isHighlighted && (
                <Chip 
                  label="Talk to this NPC" 
                  color="primary"
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: 10,
                    zIndex: 2
                  }} 
                />
              )}
              <ListItem
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => handleNPCClick(npc)}
              >
                <ListItemAvatar>
                  <Badge 
                    color={hasInteracted ? "success" : "default"}
                    variant="dot"
                    overlap="circular"
                    invisible={!hasInteracted}
                  >
                    <Avatar sx={{ bgcolor: npc.hasTrait ? 'secondary.main' : 'primary.main' }}>
                      {npc.hasTrait ? <AutoFixHighIcon /> : <PersonIcon />}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {npc.name}
                      {npc.hasTrait && (
                        <Chip 
                          label="Has Trait" 
                          size="small" 
                          color="secondary" 
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={npc.description}
                  primaryTypographyProps={{
                    fontWeight: isHighlighted ? 'bold' : 'regular'
                  }}
                />
                <ArrowForwardIcon fontSize="small" color="action" />
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </Panel>
  );
};

export default NPCPanel;