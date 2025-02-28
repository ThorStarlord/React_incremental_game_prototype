import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Button, Paper, Fade, Avatar, Chip, Divider, 
         List, ListItem, ListItemIcon, ListItemText, Tooltip, Snackbar, Alert, LinearProgress, Tabs, Tab } from '@mui/material';
import { GameStateContext, GameDispatchContext, ACTION_TYPES } from '../context/GameStateContext';
import { getRelationshipTier, getAvailableInteractions, canLearnTrait, getTierBenefits } from '../config/relationshipConstants';
import Panel from './common/Panel';
import Icon from '@mui/material/Icon';
import DialogueHistory from './DialogueHistory';

const DialogueOption = ({ option, onSelect, disabled, playerEssence, traitStatus, isNewlyAvailable }) => {
  // Calculate styling based on trait status
  const getBorderStyles = () => {
    if (disabled) return {};
    
    if (isNewlyAvailable) {
      return {
        borderColor: 'success.main',
        borderWidth: '2px',
        boxShadow: '0 0 12px rgba(46, 125, 50, 0.6)',
        animation: 'pulse 1.5s infinite ease-in-out',
        '@keyframes pulse': {
          '0%': { boxShadow: `0 0 0 0 rgba(46, 125, 50, 0.4)` },
          '70%': { boxShadow: `0 0 0 8px rgba(46, 125, 50, 0)` },
          '100%': { boxShadow: `0 0 0 0 rgba(46, 125, 50, 0)` }
        }
      };
    }
    
    if (traitStatus?.type === "insufficient_essence") {
      return {
        borderColor: 'error.main'
      };
    }
    
    if (option.action === "copyTrait" || option.nextDialogue === "aboutTraits") {
      return {
        borderColor: 'primary.main',
        borderWidth: '2px',
        boxShadow: '0 0 8px rgba(25, 118, 210, 0.4)'
      };
    }
    
    return {};
  };
  
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
        ...getBorderStyles(),
        '&:hover': {
          ...getBorderStyles(),
          opacity: 0.9
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Typography>{option.text}</Typography>
        
        {option.action === "copyTrait" && (
          <Chip 
            size="small" 
            label={`${option.essenceCost} Essence`}
            color={traitStatus?.type === "insufficient_essence" ? "error" : 
                  isNewlyAvailable ? "success" : "primary"}
            sx={{ ml: 1 }}
          />
        )}
        
        {isNewlyAvailable && (
          <Chip
            size="small"
            label="New!"
            color="success"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
      </Box>
      
      {traitStatus?.type === "insufficient_essence" && (
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

// Add this component to show upcoming traits
const UpcomingTraits = ({ npc, nextTier, player }) => {
  // Get traits available from this NPC that require the next tier
  const upcomingTraits = npc.availableTraits?.filter(traitId => {
    const traitConfig = npc.traitRequirements?.[traitId] || {};
    const requiredRelationship = traitConfig.relationship || 0;
    
    return requiredRelationship >= nextTier?.threshold && 
           !player.acquiredTraits.includes(traitId);
  }) || [];
  
  if (upcomingTraits.length === 0) return null;
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Traits Available at Next Tier:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {upcomingTraits.map(traitId => (
          <Chip
            key={traitId}
            label={traitId}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ 
              borderColor: nextTier.color,
              color: nextTier.color,
              animation: 'pulse 1.5s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': { boxShadow: `0 0 0 0 rgba(${hexToRgb(nextTier.color)}, 0.4)` },
                '70%': { boxShadow: `0 0 0 6px rgba(${hexToRgb(nextTier.color)}, 0)` },
                '100%': { boxShadow: `0 0 0 0 rgba(${hexToRgb(nextTier.color)}, 0)` }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Helper function to convert hex to rgb for animation
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

// Use the new function in the RelationshipInfo component
const RelationshipInfo = ({ relationshipValue, npc, player }) => {
  const tierInfo = getTierBenefits(relationshipValue);
  const nextTier = tierInfo.nextTier;
  const progressToNextTier = calculateProgressToNextTier(relationshipValue, tierInfo, nextTier);
  
  // Calculate milestone markers to show on the progress bar
  const milestones = [];
  if (nextTier) {
    const currentThreshold = tierInfo.threshold;
    const nextThreshold = nextTier.threshold;
    const range = nextThreshold - currentThreshold;
    
    // Add milestone markers at 25%, 50%, 75%
    for (let i = 1; i <= 3; i++) {
      const milestone = currentThreshold + (range * (i/4));
      milestones.push({ 
        position: ((i * 25)), 
        value: Math.round(milestone) 
      });
    }
  }
  
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
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path to {nextTier.name}:</span>
              <span>{Math.round(progressToNextTier)}% Complete</span>
            </Typography>
            
            {/* Enhanced progress bar with markers */}
            <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progressToNextTier} 
                sx={{ 
                  height: 12,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: nextTier.color,
                    transition: 'transform 1s ease-in-out'
                  }
                }} 
              />
              
              {/* Milestone markers */}
              {milestones.map((milestone, i) => (
                <Tooltip key={i} title={`${milestone.value} relationship`}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      left: `${milestone.position}%`,
                      height: 20,
                      width: 2,
                      bgcolor: relationshipValue >= milestone.value ? nextTier.color : 'grey.400',
                      zIndex: 1
                    }}
                  />
                </Tooltip>
              ))}
              
              {/* Current position indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: `${progressToNextTier}%`,
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: nextTier.color,
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'left 1s ease-in-out'
                }}
              />
            </Box>
            
            {/* Points remaining indicator */}
            <Typography variant="body2" sx={{ textAlign: 'right', mt: 1 }}>
              {nextTier.pointsNeeded} more points needed
            </Typography>
          </Box>
          
          <UpcomingTraits npc={npc} nextTier={nextTier} player={player} />
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
    const isFirstMeeting = !player.discoveredNPCs?.includes(npcId);
    
    // Handle discovery
    if (npc && isFirstMeeting) {
      dispatch({ 
        type: ACTION_TYPES.DISCOVER_NPC, 
        payload: { 
          npcId,
          npcName: npc.name  // Pass name for notifications
        }
      });
      
      // Show first meeting dialogue if available
      if (npc.dialogue?.firstMeeting) {
        setCurrentDialogue(npc.dialogue.firstMeeting);
      } else if (!currentDialogue) {
        setCurrentDialogue(npc.dialogue?.initial || { text: npc.greeting || "Hello there.", options: [] });
      }
    } else if (npc && !currentDialogue) {
      // Regular dialogue for returning visits
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

  // Add this helper inside NPCPanel
  const getTraitAvailability = (option, npc) => {
    if (option.action !== "copyTrait" || !option.relationshipRequirement) {
      return { available: true };
    }
  
    const currentRelationship = npc.relationship || 0;
    const required = option.relationshipRequirement;
    
    if (currentRelationship >= required) {
      return { available: true };
    }
    
    // Calculate how many points needed
    return { 
      available: false,
      pointsNeeded: required - currentRelationship,
      required
    };
  };

  // Add this function to check trait status
  const getTraitStatus = (option, player, essence) => {
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
          <Tab label="Quests" value="quests" />
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
                const traitStatus = getTraitStatus(option, player, essence);
                const isDisabled = showResponse || traitStatus.type !== "available" && traitStatus.type !== "normal";
                
                // Add a glow effect for newly available traits (not yet acquired but available)
                const isNewlyAvailable = traitStatus.type === "available" && !player.seenTraits?.includes(option.traitId);
                
                return (
                  <Box key={index}>
                    <DialogueOption
                      option={option}
                      onSelect={() => {
                        // Mark trait as seen if it's newly available
                        if (isNewlyAvailable && option.traitId) {
                          dispatch({
                            type: ACTION_TYPES.MARK_TRAIT_SEEN,
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
          </Box>
        )}
        
        {activeTab === 'history' && (
          <DialogueHistory 
            npcId={npcId}
            onRevisitDialogue={handleRevisitDialogue}
          />
        )}
        
        {activeTab === 'relationship' && (
          <RelationshipInfo 
            relationshipValue={npc.relationship || 0} 
            npc={npc}
            player={player}
          />
        )}

        {activeTab === 'quests' && (
          <NPCQuestsTab 
            npc={npc}
            player={player}
            dispatch={dispatch}
            essence={essence}
          />
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

// Add this component to your NPCPanel.js file
const NPCQuestsTab = ({ npc, player, dispatch, essence }) => {
  const [questView, setQuestView] = useState('available'); // 'available' or 'active'
  
  // Filter quests by availability and relationship requirements
  const availableQuests = (npc.quests || []).filter(quest => {
    const isActive = player.activeQuests?.some(q => q.id === quest.id);
    const isCompleted = player.completedQuests?.some(q => q.id === quest.id);
    const meetsRelationship = (npc.relationship || 0) >= (quest.relationshipRequirement || 0);
    
    return !isActive && !isCompleted && meetsRelationship;
  });
  
  // Get quests from this NPC that are currently active
  const activeQuests = (player.activeQuests || []).filter(quest => quest.npcId === npc.id);
  
  const handleStartQuest = (questId) => {
    dispatch({
      type: ACTION_TYPES.START_QUEST,
      payload: { questId, npcId: npc.id }
    });
    
    // Show notification
    setNotification({
      open: true,
      message: "New quest started!",
      severity: "success"
    });
  };
  
  const handleTurnInQuest = (questId) => {
    // Find the quest data to get rewards info
    const questData = npc.quests?.find(q => q.id === questId);
    const activeQuest = player.activeQuests?.find(q => q.id === questId);
    
    if (!questData || !activeQuest) return;
    
    const isComplete = activeQuest.objectives?.every(obj => obj.progress >= obj.count);
    
    if (!isComplete) {
      setNotification({
        open: true,
        message: "Complete all objectives before turning in the quest",
        severity: "warning"
      });
      return;
    }
    
    dispatch({
      type: ACTION_TYPES.COMPLETE_QUEST, 
      payload: { questId }
    });
    
    // Generate reward message
    let rewardMessage = "Quest completed!";
    if (questData.reward.essence) {
      rewardMessage += ` Gained ${questData.reward.essence} essence.`;
    }
    if (questData.reward.relationship) {
      rewardMessage += ` Relationship improved by ${questData.reward.relationship}.`;
    }
    if (questData.reward.trait) {
      const traitName = traits.copyableTraits[questData.reward.trait]?.name || questData.reward.trait;
      rewardMessage += ` Learned "${traitName}" trait.`;
    }
    
    setNotification({
      open: true,
      message: rewardMessage,
      severity: "success"
    });
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Tabs 
          value={questView} 
          onChange={(e, val) => setQuestView(val)}
          sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
        >
          <Tab 
            label={`Available (${availableQuests.length})`} 
            value="available" 
          />
          <Tab 
            label={`In Progress (${activeQuests.length})`} 
            value="active" 
          />
        </Tabs>
      </Box>
      
      {questView === 'available' && (
        availableQuests.length > 0 ? (
          availableQuests.map(quest => (
            <Paper key={quest.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{quest.title}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {quest.description}
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2">Rewards:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                {quest.reward.essence && (
                  <Chip 
                    size="small" 
                    icon={<Icon>toll</Icon>} 
                    label={`${quest.reward.essence} Essence`}
                    color="primary" 
                    variant="outlined" 
                  />
                )}
                {quest.reward.relationship && (
                  <Chip 
                    size="small" 
                    icon={<Icon>favorite</Icon>} 
                    label={`+${quest.reward.relationship} Relationship`}
                    color="secondary" 
                    variant="outlined" 
                  />
                )}
                {quest.reward.trait && (
                  <Tooltip title={traits.copyableTraits[quest.reward.trait]?.description || "A special trait"}>
                    <Chip 
                      size="small" 
                      icon={<Icon>stars</Icon>} 
                      label={traits.copyableTraits[quest.reward.trait]?.name || quest.reward.trait}
                      color="success" 
                      variant="outlined" 
                    />
                  </Tooltip>
                )}
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleStartQuest(quest.id)}
              >
                Accept Quest
              </Button>
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">
            No quests available. Improve your relationship with {npc.name} to unlock more quests.
          </Typography>
        )
      )}
      
      {questView === 'active' && (
        activeQuests.length > 0 ? (
          activeQuests.map(quest => {
            const questData = npc.quests?.find(q => q.id === quest.id);
            const isComplete = quest.objectives?.every(obj => obj.progress >= obj.count);
            
            return (
              <Paper key={quest.id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">{quest.title}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {questData?.description || "Complete the objectives"}
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle2">Objectives:</Typography>
                <List dense>
                  {quest.objectives.map((obj, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        {obj.progress >= obj.count ? 
                          <CheckCircleIcon color="success" /> : 
                          <CircleIcon color="disabled" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${formatObjective(obj)}`}
                        secondary={`${obj.progress}/${obj.count}`} 
                      />
                    </ListItem>
                  ))}
                </List>
                
                {isComplete && questData?.reward && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2">Rewards:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                      {questData.reward.essence && (
                        <Chip 
                          size="small" 
                          icon={<Icon>toll</Icon>} 
                          label={`${questData.reward.essence} Essence`}
                          color="primary" 
                          variant="outlined" 
                        />
                      )}
                      {questData.reward.relationship && (
                        <Chip 
                          size="small" 
                          icon={<Icon>favorite</Icon>} 
                          label={`+${questData.reward.relationship} Relationship`}
                          color="secondary" 
                          variant="outlined" 
                        />
                      )}
                      {questData.reward.trait && (
                        <Tooltip title={traits.copyableTraits[questData.reward.trait]?.description || "A special trait"}>
                          <Chip 
                            size="small" 
                            icon={<Icon>stars</Icon>} 
                            label={traits.copyableTraits[questData.reward.trait]?.name || questData.reward.trait}
                            color="success" 
                            variant="outlined" 
                          />
                        </Tooltip>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleTurnInQuest(quest.id)}
                    >
                      Complete Quest
                    </Button>
                  </>
                )}
              </Paper>
            );
          })
        ) : (
          <Typography color="text.secondary">
            You don't have any active quests from {npc.name}.
          </Typography>
        )
      )}
    </Box>
  );
};

const NPCLocation = () => {
  const { npcs, gameTime } = useContext(GameStateContext);
  const { period } = gameTime;
  
  // Get NPCs available at current time and their locations
  const availableNPCs = npcs.filter(npc => 
    npc.availability && npc.availability[period] !== null
  );
  
  // Group NPCs by location
  const npcsByLocation = availableNPCs.reduce((acc, npc) => {
    const location = npc.availability[period];
    if (!acc[location]) acc[location] = [];
    acc[location].push(npc);
    return acc;
  }, {});
  
  return (
    <Box>
      <Typography variant="h6">
        Current Time: Day {gameTime.day}, {period.charAt(0).toUpperCase() + period.slice(1)}
      </Typography>
      
      {Object.entries(npcsByLocation).map(([location, npcsInLocation]) => (
        <Box key={location}>
          <Typography variant="subtitle1">{formatLocationName(location)}</Typography>
          <List>
            {npcsInLocation.map(npc => (
              <ListItem 
                key={npc.id}
                component={Link}
                to={`/npc/${npc.id}`}
                button
              >
                <ListItemAvatar>
                  <Avatar src={npc.portrait || `https://api.dicebear.com/6.x/personas/svg?seed=${npc.id}`} />
                </ListItemAvatar>
                <ListItemText 
                  primary={npc.name} 
                  secondary={npc.title || npc.type} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

const QuestPanel = () => {
  const { player, npcs } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const activeQuests = player.activeQuests || [];
  
  // Check if any quests are complete
  const checkQuestCompletion = (quest) => {
    return quest.objectives.every(obj => obj.progress >= obj.count);
  };
  
  // Complete a quest
  const handleCompleteQuest = (questId) => {
    dispatch({ type: ACTION_TYPES.COMPLETE_QUEST, payload: { questId } });
  };
  
  return (
    <Panel title="Active Quests">
      {activeQuests.length === 0 ? (
        <Typography>You have no active quests. Talk to NPCs to discover quests.</Typography>
      ) : (
        activeQuests.map(quest => {
          const npc = npcs.find(n => n.id === quest.npcId);
          const isComplete = checkQuestCompletion(quest);
          
          return (
            <Paper key={quest.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{quest.title}</Typography>
              <Typography variant="subtitle2">
                From: {npc?.name || "Unknown"}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="body2">Objectives:</Typography>
              <List dense>
                {quest.objectives.map((obj, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      {obj.progress >= obj.count ? 
                        <CheckCircleIcon color="success" /> : 
                        <CircleIcon color="disabled" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${formatObjective(obj)}`}
                      secondary={`${obj.progress}/${obj.count}`} 
                    />
                  </ListItem>
                ))}
              </List>
              
              {isComplete && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={() => handleCompleteQuest(quest.id)}
                >
                  Complete Quest
                </Button>
              )}
            </Paper>
          );
        })
      )}
    </Panel>
  );
};

// Add this helper function to format quest objectives
const formatObjective = (objective) => {
  switch (objective.type) {
    case 'defeat':
      return `Defeat ${objective.count} ${formatEntityName(objective.target)}`;
    case 'collect':
      return `Collect ${objective.count} ${formatEntityName(objective.target)}`;
    case 'visit':
      return `Visit ${formatLocationName(objective.target)}`;
    case 'talk':
      return `Talk to ${formatEntityName(objective.target)}`;
    case 'craft':
      return `Craft ${objective.count} ${formatEntityName(objective.target)}`;
    default:
      return `Complete objective (${objective.progress}/${objective.count})`;
  }
};

const formatEntityName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatLocationName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default NPCPanel;

{
  id: 'npc2',
  name: 'Master Thorn', // Add semicolon here or check if it's part of an object
  type: 'Combat Instructor',
  title: 'Blademaster',
  location: 'training_grounds',
  relationship: 0,
  description: "A stern veteran with countless scars and unmatched combat prowess.",
  portrait: '/assets/npcs/thorn.png',
  backgrounds: {
    default: "A former mercenary who found purpose in training the next generation of fighters.",
    ally: "After years of bloodshed, Thorn seeks to forge warriors who fight for purpose, not coin."
  },
  availability: {
    morning: 'training_grounds',
    afternoon: 'training_grounds',
    evening: 'tavern',
    night: null // unavailable
  },
  dialogue: {
    firstMeeting: { /* dialogue */ },
    initial: { /* dialogue */ },
    combatAdvice: { /* dialogue */ },
    aboutWeapons: { /* dialogue */ }
    // more dialogue branches...
  },
  availableTraits: ['CombatReflexes', 'BattleHardened', 'WeaponMastery'],
  traitRequirements: {
    'CombatReflexes': { relationship: 20, prerequisiteTrait: null },
    'BattleHardened': { relationship: 40, prerequisiteTrait: 'CombatReflexes' },
    'WeaponMastery': {
      name: "Weapon Mastery",
      type: 'Combat',
      description: "Master Thorn's fighting techniques increase your attack damage by 15%",
      essenceCost: 85,
      sourceNpc: 'npc2',
      requiredRelationship: 70,
      effects: {
        attackDamageMultiplier: 1.15
      },
      tier: 3,
      rarity: "Rare",
      icon: "swords_crossing"
    }
  },
  quests: [
    {
      id: 'basic_training',
      title: 'Basic Combat Training',
      description: 'Master Thorn wants you to defeat 5 training dummies.',
      relationshipRequirement: 0,
      objectives: [{ type: 'defeat', target: 'training_dummy', count: 5 }],
      reward: { essence: 20, relationship: 10 }
    },
    {
      id: 'advanced_training',
      title: 'Advanced Combat Techniques',
      description: 'Prove your worth by defeating a veteran fighter.',
      relationshipRequirement: 30,
      objectiveType: 'defeat_npc',
      objectives: [{ type: 'defeat', target: 'veteran_fighter', count: 1 }],
      reward: { essence: 50, relationship: 20, trait: 'BattleHardened' }
    }
  ]
}

// Herbalist Willow - an NPC specializing in healing and plant knowledge
{
  id: 'npc3',
  name: 'Herbalist Willow',
  type: 'Healer',
  title: 'Master Botanist',
  location: 'forest_grove',
  relationship: 0,
  description: "A gentle soul with an encyclopedic knowledge of the healing properties of plants.",
  portrait: '/assets/npcs/willow.png',
  backgrounds: {
    default: "Willow learned her craft from her grandmother, a renowned healer in these parts.",
    ally: "After losing her family to illness, Willow dedicated herself to healing, saving countless lives."
  },
  availability: {
    morning: 'forest_grove',
    afternoon: 'forest_grove',
    evening: 'village_square',
    night: 'cottage'
  },
  dialogue: {
    firstMeeting: {
      id: 'firstMeeting',
      text: "Oh, hello there! I don't believe we've met. I'm Willow, the herbalist. Are you new to these parts?",
      options: [
        {
          text: "Yes, I'm just beginning my journey.",
          relationshipChange: 5,
          nextDialogue: "welcomeNewcomer"
        },
        {
          text: "I've been around, but we haven't crossed paths.",
          nextDialogue: "crossedPaths"
        }
      ]
    },
    // Other dialogue branches...
  },
  availableTraits: ['NaturalHealing', 'HerbalExpertise', 'VitalityBoost'],
  traitRequirements: {
    'NaturalHealing': { relationship: 20, prerequisiteTrait: null },
    'HerbalExpertise': { relationship: 50, prerequisiteTrait: 'NaturalHealing' },
    'VitalityBoost': { relationship: 80, prerequisiteTrait: 'HerbalExpertise' }
  },
  quests: [
    {
      id: 'simple_remedy',
      title: 'Simple Remedy',
      description: "Willow needs some red berries for a healing potion. She's asked you to collect some from bushes near the river.",
      relationshipRequirement: 0,
      category: 'exploration',
      objectives: [
        { type: 'collect', target: 'red_berries', count: 10 }
      ],
      reward: { 
        essence: 15, 
        relationship: 10,
        items: [{ id: 'minor_healing_potion', count: 2 }]
      }
    },
    {
      id: 'healing_herbs',
      title: 'Rare Healing Herbs',
      description: "A special patient needs rare moonbloom flowers that only grow deep in the forest. Willow asks you to gather some, but beware of forest wolves.",
      relationshipRequirement: 30,
      category: 'exploration',
      objectives: [
        { type: 'collect', target: 'moonbloom', count: 5 },
        { type: 'defeat', target: 'forest_wolf', count: 3 }
      ],
      reward: { 
        essence: 40, 
        relationship: 15,
        trait: 'NaturalHealing',
        items: [{ id: 'healing_salve', count: 1 }]
      }
    },
    {
      id: 'master_remedy',
      title: 'Master Herbalist',
      description: "Willow will teach you her most powerful healing techniques if you can prove your dedication by creating a masterwork potion.",
      relationshipRequirement: 70,
      category: 'crafting',
      objectives: [
        { type: 'collect', target: 'golden_root', count: 1 },
        { type: 'collect', target: 'crystal_dew', count: 3 },
        { type: 'craft', target: 'masterwork_elixir', count: 1 }
      ],
      reward: { 
        essence: 100, 
        relationship: 20,
        trait: 'VitalityBoost' 
      }
    }
  ]
}

// Add to GameStateContext.js

const initialGameState = {
  // ...existing state
  gameTime: {
    day: 1,
    period: 'morning', // morning, afternoon, evening, night
    timestamp: Date.now()
  }
};

// Time reducer
const timeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADVANCE_TIME:
      const { periods, days } = action.payload;
      const currentPeriodIndex = ['morning', 'afternoon', 'evening', 'night'].indexOf(state.gameTime.period);
      let newPeriodIndex = (currentPeriodIndex + periods) % 4;
      let dayAdvance = Math.floor((currentPeriodIndex + periods) / 4);
      dayAdvance += (days || 0);
      
      return {
        ...state,
        gameTime: {
          day: state.gameTime.day + dayAdvance,
          period: ['morning', 'afternoon', 'evening', 'night'][newPeriodIndex],
          timestamp: Date.now()
        }
      };
    default:
      return state;
  }
};

// In your GameLoop component:
useEffect(() => {
  const timeInterval = setInterval(() => {
    // Advance time by one period every 5 minutes of real time
    dispatch({ type: ACTION_TYPES.ADVANCE_TIME, payload: { periods: 1 } });
  }, 5 * 60 * 1000); // 5 minutes
  
  return () => clearInterval(timeInterval);
}, [dispatch]);

// Add to ACTION_TYPES
export const ACTION_TYPES = {
  // ...existing types
  START_QUEST: 'START_QUEST',
  UPDATE_QUEST_PROGRESS: 'UPDATE_QUEST_PROGRESS',
  COMPLETE_QUEST: 'COMPLETE_QUEST'
};

// Quest reducer
const questReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.START_QUEST: {
      const { questId, npcId } = action.payload;
      // Find the quest in the NPC's quests
      const npc = state.npcs.find(n => n.id === npcId);
      if (!npc) return state;
      
      const quest = npc.quests.find(q => q.id === questId);
      if (!quest) return state;
      
      // Check if already active
      if (state.player.activeQuests?.some(q => q.id === questId)) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: [
            ...(state.player.activeQuests || []),
            {
              id: questId,
              npcId,
              title: quest.title,
              started: Date.now(),
              objectives: quest.objectives.map(obj => ({
                ...obj,
                progress: 0
              }))
            }
          ]
        }
      };
    }
    
    case ACTION_TYPES.UPDATE_QUEST_PROGRESS: {
      const { questId, objectiveIndex, progress } = action.payload;
      
      return {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.map(quest => 
            quest.id === questId
              ? {
                  ...quest,
                  objectives: quest.objectives.map((obj, i) => 
                    i === objectiveIndex
                      ? { ...obj, progress: Math.min(obj.progress + progress, obj.count) }
                      : obj
                  )
                }
              : quest
          )
        }
      };
    }
    
    case ACTION_TYPES.COMPLETE_QUEST: {
      const { questId } = action.payload;
      
      // Get the quest to apply rewards
      const activeQuest = state.player.activeQuests?.find(q => q.id === questId);
      if (!activeQuest) return state;
      
      // Find original quest in NPC data
      const npc = state.npcs.find(n => n.id === activeQuest.npcId);
      const questData = npc?.quests.find(q => q.id === questId);
      
      if (!questData) return state;
      
      // Apply rewards
      let newState = {
        ...state,
        player: {
          ...state.player,
          activeQuests: state.player.activeQuests.filter(q => q.id !== questId),
          completedQuests: [
            ...(state.player.completedQuests || []),
            {
              ...activeQuest,
              completed: Date.now()
            }
          ]
        }
      };
      
      // Add essence reward if present
      if (questData.reward.essence) {
        newState = {
          ...newState,
          essence: newState.essence + questData.reward.essence
        };
      }
      
      // Add relationship reward if present
      if (questData.reward.relationship) {
        newState = {
          ...newState,
          npcs: newState.npcs.map(n => 
            n.id === activeQuest.npcId
              ? { 
                  ...n, 
                  relationship: Math.min(100, (n.relationship || 0) + questData.reward.relationship)
                }
              : n
          )
        };
      }
      
      // Add trait reward if present
      if (questData.reward.trait && !newState.player.acquiredTraits.includes(questData.reward.trait)) {
        newState = {
          ...newState,
          player: {
            ...newState.player,
            acquiredTraits: [
              ...newState.player.acquiredTraits,
              questData.reward.trait
            ]
          }
        };
      }
      
      return newState;
    }
    
    default:
      return state;
  }
};

// QuestTypes.js
export const QUEST_TYPES = {
  DEFEAT: 'defeat',
  COLLECT: 'collect',
  VISIT: 'visit',
  TALK: 'talk',
  CRAFT: 'craft',
  DELIVER: 'deliver',
};

export const QUEST_CATEGORIES = {
  COMBAT: 'combat',
  EXPLORATION: 'exploration',
  CRAFTING: 'crafting',
  SOCIAL: 'social',
  TRAINING: 'training',
};

// Add to your GameLoop component
useEffect(() => {
  // Event handler for combat victories
  const handleCombatVictory = (enemy) => {
    // Update any quests with defeat objectives
    player.activeQuests?.forEach((quest, questIndex) => {
      quest.objectives.forEach((obj, objIndex) => {
        if (obj.type === 'defeat' && obj.target === enemy.id && obj.progress < obj.count) {
          dispatch({
            type: ACTION_TYPES.UPDATE_QUEST_PROGRESS,
            payload: {
              questId: quest.id,
              objectiveIndex: objIndex,
              progress: 1
            }
          });
        }
      });
    });
  };
  
  // Event handler for item collections
  const handleItemCollected = (item, amount) => {
    // Update any quests with collect objectives
    player.activeQuests?.forEach((quest, questIndex) => {
      quest.objectives.forEach((obj, objIndex) => {
        if (obj.type === 'collect' && obj.target === item.id && obj.progress < obj.count) {
          dispatch({
            type: ACTION_TYPES.UPDATE_QUEST_PROGRESS,
            payload: {
              questId: quest.id,
              objectiveIndex: objIndex,
              progress: amount
            }
          });
        }
      });
    });
  };
  
  // Register event listeners for game events
  gameEvents.on('combatVictory', handleCombatVictory);
  gameEvents.on('itemCollected', handleItemCollected);
  
  return () => {
    // Clean up event listeners
    gameEvents.off('combatVictory', handleCombatVictory);
    gameEvents.off('itemCollected', handleItemCollected);
  };
}, [dispatch, player.activeQuests]);

// Add these traits to your traits.js file
'NaturalHealing': {
  name: 'Natural Healing',
  type: 'Survival',
  description: 'Willow\'s teachings allow your body to naturally recover health over time.',
  essenceCost: 40,
  sourceNpc: 'npc3',
  requiredRelationship: 20,
  effects: {
    healthRegeneration: 1 // 1 health per minute
  },
  tier: 1,
  rarity: 'Common',
  icon: 'eco'
},
'HerbalExpertise': {
  name: 'Herbal Expertise',
  type: 'Crafting',
  description: 'Your knowledge of herbs increases the potency of crafted potions by 25%.',
  essenceCost: 65,
  sourceNpc: 'npc3',
  requiredRelationship: 50,
  effects: {
    potionEfficiency: 1.25
  },
  tier: 2,
  rarity: 'Uncommon',
  icon: 'spa'
},
'VitalityBoost': {
  name: 'Vitality Boost',
  type: 'Survival',
  description: 'Willow\'s master techniques permanently increase your maximum health by 20%.',
  essenceCost: 120,
  sourceNpc: 'npc3',
  requiredRelationship: 80,
  effects: {
    maxHealthMultiplier: 1.2
  },
  tier: 3,
  rarity: 'Rare',
  icon: 'favorite'
}

// QuestsPage.js
import React, { useContext } from 'react';
import { Box, Typography, Tabs, Tab, Paper, List, ListItem, ListItemIcon, 
         ListItemText, Chip, Divider, Avatar, Button, Icon } from '@mui/material';
import { GameStateContext, GameDispatchContext, ACTION_TYPES } from '../context/GameStateContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { formatDistanceToNow } from 'date-fns';
import { formatObjective } from '../utils/questUtils';
import Panel from './common/Panel';

const QuestsPage = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { player, npcs } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  const activeQuests = player.activeQuests || [];
  const completedQuests = player.completedQuests || [];
  
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAbandonQuest = (questId) => {
    if (window.confirm("Are you sure you want to abandon this quest? All progress will be lost.")) {
      dispatch({
        type: ACTION_TYPES.ABANDON_QUEST,
        payload: { questId }
      });
    }
  };

  return (
    <Panel title="Quests Journal">
      <Tabs value={tabValue} onChange={handleChange} sx={{ mb: 2 }}>
        <Tab label={`Active (${activeQuests.length})`} />
        <Tab label={`Completed (${completedQuests.length})`} />
      </Tabs>
      
      {tabValue === 0 && (
        <Box>
          {activeQuests.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              You have no active quests. Speak with NPCs to find quests.
            </Typography>
          ) : (
            activeQuests.map(quest => {
              const npc = npcs.find(n => n.id === quest.npcId);
              const isComplete = quest.objectives?.every(obj => obj.progress >= obj.count);
              
              return (
                <Paper key={quest.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      src={npc?.portrait || `https://api.dicebear.com/6.x/personas/svg?seed=${quest.npcId}`}
                      sx={{ mr: 1, width: 32, height: 32 }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {quest.title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip 
                      size="small"
                      icon={<AccessTimeIcon fontSize="small" />}
                      label={`Started ${formatDistanceToNow(quest.started)} ago`}
                      variant="outlined"
                      color="default"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    From: {npc?.name || quest.npcId}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Objectives:</Typography>
                  <List dense>
                    {quest.objectives.map((obj, i) => (
                      <ListItem key={i} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {obj.progress >= obj.count ? 
                            <CheckCircleIcon color="success" fontSize="small" /> : 
                            <CircleIcon color="disabled" fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={formatObjective(obj)}
                          secondary={`${obj.progress}/${obj.count}`} 
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleAbandonQuest(quest.id)}
                    >
                      Abandon
                    </Button>
                    
                    {isComplete && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<Icon>person</Icon>}
                      >
                        Return to {npc?.name || "NPC"}
                      </Button>
                    )}
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
      )}
      
      {tabValue === 1 && (
        <Box>
          {completedQuests.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              You haven't completed any quests yet.
            </Typography>
          ) : (
            completedQuests.map(quest => {
              const npc = npcs.find(n => n.id === quest.npcId);
              
              return (
                <Paper key={quest.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TaskAltIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="subtitle1">
                      {quest.title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip 
                      size="small"
                      label={`Completed ${formatDistanceToNow(quest.completed)} ago`}
                      variant="outlined"
                      color="success"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 0.5 }}>
                    From: {npc?.name || quest.npcId}
                  </Typography>
                </Paper>
              );
            })
          )}
        </Box>
      )}
    </Panel>
  );
};

export default QuestsPage;
