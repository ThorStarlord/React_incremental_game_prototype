import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Fade, Snackbar, Alert } from '@mui/material';
import DialogueOption from './DialogueOption';

const DialogueTab = ({ 
  npc, 
  player, 
  dispatch, 
  essence,
  onRelationshipChange,
  traits
}) => {
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  useEffect(() => {
    const isFirstMeeting = !player.discoveredNPCs?.includes(npc.id);
    
    // Handle discovery
    if (isFirstMeeting) {
      dispatch({ 
        type: 'DISCOVER_NPC', 
        payload: { 
          npcId: npc.id,
          npcName: npc.name  // Pass name for notifications
        }
      });
      
      // Show first meeting dialogue if available
      if (npc.dialogue?.firstMeeting) {
        setCurrentDialogue(npc.dialogue.firstMeeting);
      } else if (!currentDialogue) {
        setCurrentDialogue(npc.dialogue?.initial || { 
          text: npc.greeting || "Hello there.", 
          options: [] 
        });
      }
    } else if (!currentDialogue) {
      // Regular dialogue for returning visits
      setCurrentDialogue(npc.dialogue?.initial || { 
        text: npc.greeting || "Hello there.", 
        options: [] 
      });
    }
  }, [npc, player.discoveredNPCs, dispatch, currentDialogue]);

  const handleDialogueChoice = (option, index) => {
    setShowResponse(true);
    
    // Record this dialogue choice in history
    dispatch({
      type: 'UPDATE_DIALOGUE_HISTORY',
      payload: {
        npcId: npc.id,
        dialogueId: currentDialogue?.id || 'unknown',
        choice: option.text,
        choiceIndex: index,
        relationshipChange: option.relationshipChange || 0
      }
    });
    
    // Handle relationship changes
    if (option.relationshipChange) {
      onRelationshipChange(option.relationshipChange, 'dialogue');
    }
    
    // Handle trait copying
    if (option.action === "copyTrait" && option.traitId) {
      // Check if player has enough essence before dispatching
      if (essence >= option.essenceCost) {
        dispatch({ 
          type: 'COPY_TRAIT', 
          payload: { 
            traitId: option.traitId, 
            essenceCost: option.essenceCost,
            npcId: npc.id,
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
            type: 'UPDATE_DIALOGUE_STATE', 
            payload: { npcId: npc.id, dialogueBranch: option.nextDialogue } 
          });
        } else {
          // If object, it's an inline dialogue
          setCurrentDialogue(option.nextDialogue);
        }
      }, 1000);
    }
  };

  // Check trait status
  const getTraitStatus = (option) => {
    if (option.action !== "copyTrait") return { type: "normal" };
    
    if (player.acquiredTraits.includes(option.traitId)) {
      return { type: "acquired", message: "Already acquired" };
    }
    
    if (essence < option.essenceCost) {
      return { 
        type: "insufficient_essence", 
        message: `Need ${option.essenceCost - essence} more essence` 
      };
    }
    
    if (option.relationshipRequirement && npc.relationship < option.relationshipRequirement) {
      return { 
        type: "insufficient_relationship", 
        message: `Need ${option.relationshipRequirement - npc.relationship} more relationship` 
      };
    }
    
    return { type: "available", message: "Available to learn" };
  };

  return (
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
          const traitStatus = getTraitStatus(option);
          const isDisabled = showResponse || 
            (traitStatus.type !== "available" && traitStatus.type !== "normal");
          
          // Check if trait is newly available (not yet acquired but available)
          const isNewlyAvailable = traitStatus.type === "available" && 
            !player.seenTraits?.includes(option.traitId);
          
          return (
            <Box key={index}>
              <DialogueOption
                option={option}
                onSelect={() => {
                  // Mark trait as seen if it's newly available
                  if (isNewlyAvailable && option.traitId) {
                    dispatch({
                      type: 'MARK_TRAIT_SEEN',
                      payload: { traitId: option.traitId }
                    });
                  }
                  handleDialogueChoice(option, index);
                }}
                disabled={isDisabled}
                playerEssence={essence}
                traitStatus={traitStatus}
                isNewlyAvailable={isNewlyAvailable}
              />
              
              {traitStatus.type !== "normal" && traitStatus.type !== "available" && (
                <Typography 
                  variant="caption" 
                  color={traitStatus.type === "acquired" ? "text.secondary" : "error"}
                  sx={{ display: 'block', mb: 1, ml: 2 }}
                >
                  {traitStatus.message}
                </Typography>
              )}
            </Box>
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
    </Box>
  );
};

export default DialogueTab;