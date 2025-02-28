import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Button, Paper, Fade, Avatar, Chip, Divider, 
         List, ListItem, ListItemIcon, ListItemText, Tooltip, Snackbar, Alert, LinearProgress, Tabs, Tab } from '@mui/material';
import { GameStateContext, GameDispatchContext, ACTION_TYPES } from '../context/GameStateContext';
import { getRelationshipTier, getAvailableInteractions, canLearnTrait, getTierBenefits } from '../config/relationshipConstants';
import Panel from './common/Panel';
import Icon from '@mui/material/Icon';
import DialogueHistory from './DialogueHistory';

const DialogueOption = ({ option, onSelect, disabled, playerEssence }) => {
  // Check if this is a trait option the player can't afford
  const isEssenceLimited = option.action === "copyTrait" && 
                          option.essenceCost > playerEssence && 
                          !disabled;
  
  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={() => onSelect(option)}
      disabled={disabled}
      sx={{ 
        my: 1, 
        textAlign: 'left', 
        justifyContent: 'flex-start', 
        whiteSpace: 'normal', 
        height: 'auto', 
        p: 1.5,
        position: 'relative',
        // Add red border when can't afford
        borderColor: isEssenceLimited ? 'error.main' : undefined,
        '&:hover': {
          borderColor: isEssenceLimited ? 'error.main' : undefined,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Typography>{option.text}</Typography>
        
        {option.action === "copyTrait" && (
          <Chip 
            size="small" 
            label={`${option.essenceCost} Essence`}
            color={isEssenceLimited ? "error" : "primary"}
            sx={{ ml: 1 }}
          />
        )}
      </Box>
      
      {/* Show warning if not enough essence */}
      {isEssenceLimited && (
        <Typography 
          variant="caption" 
          color="error"
          sx={{ display: 'block', mt: 0.5 }}
        >
          Not enough essence
        </Typography>
      )}
    </Button>
  );
};

// Add a new function to calculate progress to the next tier
const calculateProgressToNextTier = (relationship, currentTier, nextTier) => {
  if (!nextTier) return 100; // Max progress if no next tier
  return ((relationship - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100;
};

// Use the new function in the RelationshipInfo component
const RelationshipInfo = ({ relationshipValue }) => {
  const tierInfo = getTierBenefits(relationshipValue);
  const nextTier = tierInfo.nextTier;
  const progressToNextTier = calculateProgressToNextTier(relationshipValue, tierInfo, nextTier);
  
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: tierInfo.color }}>
        Relationship: {tierInfo.name}
      </Typography>
      
      <LinearProgress 
        variant="determinate" 
        value={(relationshipValue + 100) / 2} // Convert -100...100 to 0...100
        sx={{ 
          height: 8, 
          my: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          '& .MuiLinearProgress-bar': {
            bgcolor: tierInfo.color
          }
        }} 
      />
      
      <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
        {relationshipValue}/100
      </Typography>
      
      <Divider sx={{ my: 1 }} />
      
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Current Benefits:
      </Typography>
      
      <Box component="ul" sx={{ pl: 2, mt: 0 }}>
        {tierInfo.benefits.map((benefit, index) => (
          <Typography component="li" key={index} variant="body2">
            {benefit}
          </Typography>
        ))}
      </Box>
      
      {nextTier && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Next Tier:
          </Typography>
          <Typography variant="body2">
            <span style={{ color: nextTier.color, fontWeight: 'bold' }}>
              {nextTier.name}
            </span> 
            {` (need ${nextTier.pointsNeeded} more points)`}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progressToNextTier} 
            sx={{ 
              height: 8, 
              my: 1,
              borderRadius: 1,
              bgcolor: 'background.paper',
              '& .MuiLinearProgress-bar': {
                bgcolor: nextTier.color
              }
            }} 
          />
        </>
      )}
    </Box>
  );
};

const NPCPanel = ({ npcId }) => {
  const { npcs, essence, player, traits } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const npc = npcs.find(n => n.id === npcId);
  const [showResponse, setShowResponse] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('dialogue');
  
  useEffect(() => {
    if (npc && !player.discoveredNPCs?.includes(npcId)) {
      dispatch({ type: ACTION_TYPES.DISCOVER_NPC, payload: { npcId } });
    }
    
    if (npc && !currentDialogue) {
      setCurrentDialogue(npc.dialogue?.initial || { text: npc.greeting || "Hello there.", options: [] });
    }

    // Mark this NPC as met if not already
    if (npc && !player.metNPCs?.includes(npcId)) {
      dispatch({ type: ACTION_TYPES.MEET_NPC, payload: { npcId } });
    }
  }, [npc, player.discoveredNPCs, npcId, currentDialogue, player.metNPCs, dispatch]);

  const handleDialogueChoice = (option, index) => {
    setShowResponse(true);
    
    // Record this dialogue choice in history
    dispatch({
      type: ACTION_TYPES.UPDATE_DIALOGUE_HISTORY,
      payload: {
        npcId,
        dialogueId: currentDialogue?.id || 'unknown',
        choice: option.text,
        choiceIndex: index,
        relationshipChange: option.relationshipChange || 0
      }
    });
    
    // Handle relationship changes
    if (option.relationshipChange) {
      dispatch({
        type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP,
        payload: { 
          npcId, 
          changeAmount: option.relationshipChange, 
          source: 'dialogue' 
        }
      });
    }
    
    // Handle trait copying
    if (option.action === "copyTrait" && option.traitId) {
      // Check if player has enough essence before dispatching
      if (essence >= option.essenceCost) {
        dispatch({ 
          type: ACTION_TYPES.COPY_TRAIT, 
          payload: { 
            traitId: option.traitId, 
            essenceCost: option.essenceCost,
            npcId: npcId,
            relationshipRequirement: option.relationshipRequirement
          } 
        });
      } else {
        // Show not enough essence message
        setNotification({
          open: true,
          message: `Not enough essence! Need ${option.essenceCost} but you have ${essence}.`,
          severity: 'error'
        });
        return; // Don't proceed with dialogue
      }
    }
    
    // Move to next dialogue
    if (option.nextDialogue) {
      setTimeout(() => {
        setShowResponse(false);
        
        // If string, it's a dialogue key
        if (typeof option.nextDialogue === 'string') {
          setCurrentDialogue(npc.dialogue[option.nextDialogue]);
          
          // Update dialogue state in game state
          dispatch({ 
            type: ACTION_TYPES.UPDATE_DIALOGUE_STATE, 
            payload: { npcId, dialogueBranch: option.nextDialogue } 
          });
        } else {
          // If object, it's an inline dialogue
          setCurrentDialogue(option.nextDialogue);
        }
      }, 1000);
    }
  };

  const handleRevisitDialogue = (dialogueId) => {
    if (npc.dialogue?.[dialogueId]) {
      setCurrentDialogue(npc.dialogue[dialogueId]);
      dispatch({ 
        type: ACTION_TYPES.UPDATE_DIALOGUE_STATE, 
        payload: { npcId, dialogueBranch: dialogueId } 
      });
      // Jump back to the dialogue tab
      setActiveTab('dialogue');
    }
  };

  if (!npc) return <Panel title="NPC Not Found">This character doesn't seem to exist.</Panel>;

  const relationship = npc.relationship || 0;
  const relationshipTier = getRelationshipTier(relationship);
  const availableInteractions = getAvailableInteractions(relationship);

  return (
    <Panel title={`Conversation with ${npc.name}`}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
        <Avatar 
          src={npc.avatar || `https://api.dicebear.com/6.x/personas/svg?seed=${npc.id}`} 
          sx={{ width: 64, height: 64 }} 
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{npc.name}</Typography>
          {npc.title && (
            <Typography variant="subtitle2" color="text.secondary">{npc.title}</Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {npc.description}
          </Typography>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Icon sx={{ color: relationshipTier.color, mr: 1 }}>
              {relationshipTier.icon}
            </Icon>
            <Tooltip title={`${relationship}/100`}>
              <Typography variant="body2" sx={{ color: relationshipTier.color }}>
                {relationshipTier.name} ({relationship})
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Relationship tier benefits */}
      <Box sx={{ mb: 2, backgroundColor: 'background.paper', p: 1, borderRadius: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Current Relationship Benefits:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
          {relationshipTier.benefits.map((benefit, index) => (
            <Chip 
              key={index} 
              label={benefit} 
              size="small" 
              variant="outlined"
              sx={{ borderColor: relationshipTier.color, color: relationshipTier.color }}
            />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="NPC interaction tabs"
        >
          <Tab label="Dialogue" value="dialogue" />
          <Tab label="History" value="history" />
          <Tab label="Relationship" value="relationship" />
        </Tabs>
      </Box>

      {/* Tab content */}
      <Box sx={{ mt: 2, minHeight: 300 }}>
        {activeTab === 'dialogue' && (
          <Box>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                minHeight: 80, 
                bgcolor: 'background.paper',
                borderLeft: '4px solid',
                borderColor: 'primary.main'
              }}
            >
              <Fade in={!showResponse} timeout={500}>
                <Typography variant="body1">
                  {currentDialogue?.text || "..."}
                </Typography>
              </Fade>
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              {currentDialogue?.options?.map((option, index) => {
                // Check if option should be disabled based on relationship requirements
                const hasRelationshipRequirement = option.relationshipRequirement && 
                                                  npc.relationship < option.relationshipRequirement;
                
                const isTraitAlreadyAcquired = option.action === "copyTrait" && 
                                               player.acquiredTraits.includes(option.traitId);
                
                const notEnoughEssence = option.essenceCost > essence;
                
                const isDisabled = showResponse || hasRelationshipRequirement || 
                                  isTraitAlreadyAcquired || notEnoughEssence;
                
                return (
                  <DialogueOption
                    key={index}
                    option={option}
                    onSelect={() => handleDialogueChoice(option, index)}
                    disabled={isDisabled}
                    playerEssence={essence}
                  />
                );
              })}
              
              {(!currentDialogue?.options || currentDialogue.options.length === 0) && (
                <Button 
                  fullWidth 
                  variant="outlined" 
                  onClick={() => setCurrentDialogue(npc.dialogue?.initial)}
                  sx={{ mt: 2 }}
                >
                  End conversation
                </Button>
              )}
            </Box>
          </Box>
        )}
        
        {activeTab === 'history' && (
          <DialogueHistory 
            npcId={npcId}
            onRevisitDialogue={handleRevisitDialogue}
          />
        )}
        
        {activeTab === 'relationship' && (
          <RelationshipInfo relationshipValue={npc.relationship || 0} />
        )}
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({...notification, open: false})} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default NPCPanel;
