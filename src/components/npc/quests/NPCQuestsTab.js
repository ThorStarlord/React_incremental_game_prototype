import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Tabs, Tab, Icon, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';

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

const NPCQuestsTab = ({ npc, player, dispatch, essence, traits, notifications }) => {
  const [questView, setQuestView] = useState('available');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
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
      type: 'START_QUEST',
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
      type: 'COMPLETE_QUEST', 
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
      const traitName = traits?.copyableTraits[questData.reward.trait]?.name || questData.reward.trait;
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
                  <Tooltip title={traits?.copyableTraits[quest.reward.trait]?.description || "A special trait"}>
                    <Chip 
                      size="small" 
                      icon={<Icon>stars</Icon>} 
                      label={traits?.copyableTraits[quest.reward.trait]?.name || quest.reward.trait}
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
                        <Tooltip title={traits?.copyableTraits[quest.reward.trait]?.description || "A special trait"}>
                          <Chip 
                            size="small" 
                            icon={<Icon>stars</Icon>} 
                            label={traits?.copyableTraits[quest.reward.trait]?.name || quest.reward.trait}
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

export default NPCQuestsTab;