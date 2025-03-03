import React, { useMemo } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Chip, Divider, Tooltip, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import HelpIcon from '@mui/icons-material/Help';

/**
 * @component NPCQuestsTab
 * @description Displays quests available from this NPC, including active, completed, and available quests.
 * Players can accept new quests or turn in completed quests through this interface.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.npc - NPC data object
 * @param {Object} props.player - Player data object
 * @param {Function} props.dispatch - Redux dispatch function
 * @param {number} props.essence - Player's current essence amount
 * @param {Array} props.traits - Player's traits
 * @param {Function} props.showNotification - Function to show notifications
 * @returns {JSX.Element} Rendered NPCQuestsTab component
 */
const NPCQuestsTab = ({ npc, player, dispatch, essence, traits, showNotification }) => {
  // Get all quests available from this NPC
  const availableQuests = useMemo(() => {
    return npc.quests?.filter(questId => {
      const quest = player.quests?.find(q => q.id === questId);
      
      // Quest doesn't exist in player data yet, so it's available
      if (!quest) return true;
      
      // If it's completed, it's not available
      if (quest.completed) return false;
      
      // If it's active, it's not available (already accepted)
      if (quest.active) return false;
      
      // Otherwise it's available
      return true;
    }) || [];
  }, [npc.quests, player.quests]);
  
  // Get quests the player has accepted from this NPC
  const activeQuests = useMemo(() => {
    return player.quests?.filter(quest => 
      npc.quests?.includes(quest.id) && quest.active && !quest.completed
    ) || [];
  }, [npc.quests, player.quests]);
  
  // Get quests the player has completed for this NPC
  const completedQuests = useMemo(() => {
    return player.quests?.filter(quest => 
      npc.quests?.includes(quest.id) && quest.completed
    ) || [];
  }, [npc.quests, player.quests]);
  
  // Get quests that are ready to be turned in
  const readyToTurnIn = useMemo(() => {
    return activeQuests.filter(quest => {
      const allObjectivesComplete = quest.objectives?.every(obj => obj.completed) || false;
      return allObjectivesComplete && !quest.turnedIn;
    });
  }, [activeQuests]);

  /**
   * Handles accepting a new quest from the NPC
   * @param {string} questId - ID of the quest to accept
   */
  const handleAcceptQuest = (questId) => {
    dispatch({
      type: 'ACCEPT_QUEST',
      payload: { questId, npcId: npc.id }
    });
    
    showNotification({
      open: true,
      message: `Accepted new quest from ${npc.name}!`,
      severity: 'success'
    });
  };

  /**
   * Handles turning in a completed quest
   * @param {string} questId - ID of the quest to turn in
   */
  const handleTurnInQuest = (questId) => {
    const quest = player.quests?.find(q => q.id === questId);
    
    if (quest && quest.objectives?.every(obj => obj.completed)) {
      dispatch({
        type: 'COMPLETE_QUEST',
        payload: { questId, npcId: npc.id }
      });
      
      // Handle quest rewards
      if (quest.rewards) {
        // Process experience rewards
        if (quest.rewards.experience) {
          dispatch({
            type: 'ADD_EXPERIENCE',
            payload: { amount: quest.rewards.experience }
          });
        }
        
        // Process essence rewards
        if (quest.rewards.essence) {
          dispatch({
            type: 'ADD_ESSENCE',
            payload: { amount: quest.rewards.essence }
          });
        }
        
        // Process relationship rewards
        if (quest.rewards.relationship) {
          dispatch({
            type: 'UPDATE_NPC_RELATIONSHIP',
            payload: { 
              npcId: npc.id, 
              amount: quest.rewards.relationship 
            }
          });
        }
        
        // Process item rewards
        if (quest.rewards.items) {
          quest.rewards.items.forEach(item => {
            dispatch({
              type: 'INVENTORY_ADD_ITEM',
              payload: { 
                itemId: item.id, 
                quantity: item.quantity || 1 
              }
            });
          });
        }
      }
      
      showNotification({
        open: true,
        message: `Quest completed! Received rewards from ${npc.name}.`,
        severity: 'success'
      });
    }
  };

  // If no quests are available from this NPC
  if (!npc.quests || npc.quests.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {npc.name} doesn't have any quests available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Ready to turn in quests */}
      {readyToTurnIn.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AssignmentTurnedInIcon sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="subtitle1">Ready to Turn In</Typography>
          </Box>
          
          <Paper variant="outlined" sx={{ mb: 3, p: 1 }}>
            <List dense>
              {readyToTurnIn.map(quest => (
                <ListItem
                  key={quest.id}
                  secondaryAction={
                    <Button 
                      variant="contained" 
                      color="success"
                      size="small"
                      onClick={() => handleTurnInQuest(quest.id)}
                    >
                      Turn In
                    </Button>
                  }
                >
                  <ListItemText
                    primary={quest.title}
                    secondary={quest.description}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}

      {/* Active quests */}
      {activeQuests.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle1">Active Quests</Typography>
          </Box>
          
          <Paper variant="outlined" sx={{ mb: 3, p: 1 }}>
            <List dense>
              {activeQuests.map(quest => (
                <ListItem key={quest.id}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight="medium">{quest.title}</Typography>
                        {quest.objectives?.every(obj => obj.completed) && (
                          <Chip 
                            label="Complete" 
                            size="small" 
                            color="success" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">{quest.description}</Typography>
                        
                        <Box sx={{ mt: 1 }}>
                          {quest.objectives?.map((obj, i) => (
                            <Typography 
                              key={i} 
                              variant="caption" 
                              component="div"
                              sx={{ 
                                color: obj.completed ? 'success.main' : 'text.primary',
                                textDecoration: obj.completed ? 'line-through' : 'none'
                              }}
                            >
                              • {obj.description} 
                              {obj.current !== undefined && obj.target !== undefined && (
                                <span> ({obj.current}/{obj.target})</span>
                              )}
                            </Typography>
                          ))}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}

      {/* Available quests */}
      {availableQuests.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <HelpIcon sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="subtitle1">Available Quests</Typography>
          </Box>
          
          <Paper variant="outlined" sx={{ mb: 3, p: 1 }}>
            <List dense>
              {availableQuests.map(questId => {
                // Find quest details from quest database
                // Using a placeholder structure here - replace with actual quest data source
                const questDetails = {
                  id: questId,
                  title: `Quest for ${npc.name}`,
                  description: "Quest details would be loaded here from your quest database",
                  level: 1,
                  rewards: {
                    experience: 100,
                    essence: 10
                  }
                };
                
                return (
                  <ListItem
                    key={questId}
                    secondaryAction={
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        onClick={() => handleAcceptQuest(questId)}
                      >
                        Accept
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight="medium">
                            {questDetails.title}
                          </Typography>
                          <Chip 
                            label={`Lvl ${questDetails.level}`} 
                            size="small" 
                            variant="outlined" 
                            sx={{ ml: 1 }} 
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">{questDetails.description}</Typography>
                          
                          {questDetails.rewards && (
                            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Rewards:
                              </Typography>
                              {questDetails.rewards.experience && (
                                <Chip 
                                  size="small" 
                                  variant="outlined" 
                                  label={`${questDetails.rewards.experience} XP`} 
                                  sx={{ height: 20 }}
                                />
                              )}
                              {questDetails.rewards.essence && (
                                <Chip 
                                  size="small" 
                                  variant="outlined" 
                                  label={`${questDetails.rewards.essence} Essence`} 
                                  sx={{ height: 20 }}
                                />
                              )}
                            </Box>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </>
      )}

      {/* Completed quests */}
      {completedQuests.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AssignmentTurnedInIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="subtitle1">Completed Quests</Typography>
          </Box>
          
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List dense>
              {completedQuests.map(quest => (
                <ListItem key={quest.id}>
                  <ListItemText
                    primary={quest.title}
                    secondary={quest.description}
                    sx={{ color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default NPCQuestsTab;
