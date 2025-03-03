import React, { useContext, useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, List, ListItem, ListItemIcon, 
         ListItemText, Chip, Divider, Avatar, Button, Icon } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PersonIcon from '@mui/icons-material/Person';
import { formatDistanceToNow } from 'date-fns';
import Panel from '../components/common/Panel';

/**
 * @fileoverview QuestsPage Component - Manages and displays player quests
 * @module QuestsPage
 */

/**
 * Converts snake_case strings to Title Case format
 * 
 * @param {string} name - The snake_case string to format
 * @returns {string} The formatted string in Title Case
 */
const formatEntityName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats location names for display
 * Similar to formatEntityName but kept separate for potential future differences
 * 
 * @param {string} name - The location identifier to format
 * @returns {string} The formatted location name
 */
const formatLocationName = (name) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats quest objectives based on their type
 * 
 * @param {Object} objective - The quest objective data
 * @param {string} objective.type - Type of objective ('defeat', 'collect', etc.)
 * @param {number} objective.count - Target count required to complete
 * @param {string} objective.target - Target entity for the objective
 * @param {number} objective.progress - Current progress toward completion
 * @returns {string} Human-readable description of the objective
 */
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

/**
 * QuestsPage Component
 * 
 * @description Renders the quests management interface of the Incremental RPG game.
 * This component displays active and completed quests, allows players to track
 * objectives, abandon quests, and turn in completed quests for rewards.
 * 
 * The component uses Redux to fetch quest data and dispatch quest-related actions.
 * 
 * @component
 * @example
 * return (
 *   <QuestsPage />
 * )
 * 
 * @returns {JSX.Element} A page displaying active and completed quests
 */
const QuestsPage = () => {
  // State for managing the active tab (0 = Active Quests, 1 = Completed Quests)
  const [tabValue, setTabValue] = useState(0);
  
  // Redux selectors and dispatch
  const player = useSelector(state => state.player);
  const npcs = useSelector(state => state.npcs) || [];
  const dispatch = useDispatch();
  
  // Extract active and completed quests from player state
  const activeQuests = player.activeQuests || [];
  const completedQuests = player.completedQuests || [];
  
  /**
   * Handles tab change between active and completed quests
   * 
   * @param {Object} event - The change event
   * @param {number} newValue - The index of the selected tab
   */
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  /**
   * Handles quest abandonment with confirmation dialog
   * 
   * @param {string} questId - ID of the quest to abandon
   */
  const handleAbandonQuest = (questId) => {
    if (window.confirm("Are you sure you want to abandon this quest? All progress will be lost.")) {
      dispatch({
        type: 'ABANDON_QUEST',
        payload: { questId }
      });
    }
  };
  
  /**
   * Handles turning in a completed quest to receive rewards
   * 
   * @param {string} questId - ID of the quest to turn in
   */
  const handleTurnInQuest = (questId) => {
    dispatch({
      type: 'TURN_IN_QUEST',
      payload: { questId }
    });
  };

  return (
    <Panel title="Quests Journal">
      {/* Tab navigation for switching between active and completed quests */}
      <Tabs 
        value={tabValue} 
        onChange={handleChange} 
        sx={{ mb: 2 }}
        aria-label="Quest categories"
      >
        <Tab label={`Active (${activeQuests.length})`} id="active-quests-tab" aria-controls="active-quests-panel" />
        <Tab label={`Completed (${completedQuests.length})`} id="completed-quests-tab" aria-controls="completed-quests-panel" />
      </Tabs>
      
      {/* Active Quests Panel */}
      <div
        role="tabpanel"
        hidden={tabValue !== 0}
        id="active-quests-panel"
        aria-labelledby="active-quests-tab"
      >
        {tabValue === 0 && (
          <Box>
            {activeQuests.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                You have no active quests. Speak with NPCs to find quests.
              </Typography>
            ) : (
              activeQuests.map(quest => {
                const npc = Array.isArray(npcs) ? npcs.find(n => n && n.id === quest.npcId) : null;
                const isComplete = quest.objectives?.every(obj => obj.progress >= obj.count);
                
                return (
                  <Paper key={quest.id} sx={{ p: 2, mb: 2 }} component="article">
                    {/* Quest header with NPC avatar and title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        src={npc?.portrait || `https://api.dicebear.com/6.x/personas/svg?seed=${quest.npcId}`}
                        sx={{ mr: 1, width: 32, height: 32 }}
                        alt={`${npc?.name || 'NPC'} portrait`}
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
                    
                    {/* Objectives list */}
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Objectives:</Typography>
                    <List dense aria-label={`Objectives for ${quest.title}`}>
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
                    
                    {/* Quest actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleAbandonQuest(quest.id)}
                        aria-label={`Abandon ${quest.title} quest`}
                      >
                        Abandon
                      </Button>
                      
                      {isComplete && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<PersonIcon />}
                          onClick={() => handleTurnInQuest(quest.id)}
                          aria-label={`Turn in completed ${quest.title} quest`}
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
      </div>
      
      {/* Completed Quests Panel */}
      <div
        role="tabpanel"
        hidden={tabValue !== 1}
        id="completed-quests-panel"
        aria-labelledby="completed-quests-tab"
      >
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
                  <Paper key={quest.id} sx={{ p: 2, mb: 2 }} component="article">
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
      </div>
    </Panel>
  );
};

export default QuestsPage;