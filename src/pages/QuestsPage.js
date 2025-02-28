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

// Helper function to format objectives
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

const QuestsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const player = useSelector(state => state.player);
  const npcs = useSelector(state => state.npcs);
  const dispatch = useDispatch();
  
  const activeQuests = player.activeQuests || [];
  const completedQuests = player.completedQuests || [];
  
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAbandonQuest = (questId) => {
    if (window.confirm("Are you sure you want to abandon this quest? All progress will be lost.")) {
      dispatch({
        type: 'ABANDON_QUEST',
        payload: { questId }
      });
    }
  };
  
  const handleTurnInQuest = (questId) => {
    dispatch({
      type: 'TURN_IN_QUEST',
      payload: { questId }
    });
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
                        endIcon={<PersonIcon />}
                        onClick={() => handleTurnInQuest(quest.id)}
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