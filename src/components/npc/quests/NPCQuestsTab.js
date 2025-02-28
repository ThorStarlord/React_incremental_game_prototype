import React, { useState } from 'react';
import { 
  Box, Typography, Button, Divider, List, Tabs, Tab, 
  Chip, Badge, Menu, MenuItem, IconButton, Tooltip, Paper
} from '@mui/material';
import QuestItem from './QuestItem';
import { formatObjective } from '../utils/formatters';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { getQuestTypeIcon, getQuestDifficultyColor } from '../utils/questHelpers';

const NPCQuestsTab = ({ npc, player, dispatch, essence }) => {
  // State for tab selection
  const [activeTab, setActiveTab] = useState(0);
  
  // State for sorting and filtering
  const [sortMethod, setSortMethod] = useState('default');
  const [filterType, setFilterType] = useState('all');
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  const activeQuestIds = player.activeQuests?.map(q => q.id) || [];
  const completedQuestIds = player.completedQuests || [];
  
  // Filter available quests based on relationship requirement and other filters
  let availableQuests = npc.quests?.filter(quest => 
    !activeQuestIds.includes(quest.id) && 
    !completedQuestIds.includes(quest.id) &&
    quest.relationshipRequirement <= (player.npcRelationships?.[npc.id] || 0)
  ) || [];
  
  // Filter active quests that are from this NPC
  let activeQuests = (player.activeQuests || [])
    .filter(quest => npc.quests.some(q => q.id === quest.id));
  
  // Get completed quests from this NPC
  let completedQuests = completedQuestIds
    .map(id => npc.quests.find(q => q.id === id))
    .filter(quest => quest !== undefined);
  
  // Apply type filtering if needed
  if (filterType !== 'all') {
    availableQuests = availableQuests.filter(quest => quest.type === filterType);
    activeQuests = activeQuests.filter(quest => {
      const npcQuest = npc.quests.find(q => q.id === quest.id);
      return npcQuest?.type === filterType;
    });
    completedQuests = completedQuests.filter(quest => quest.type === filterType);
  }
  
  // Apply sorting
  const sortQuests = (quests) => {
    switch (sortMethod) {
      case 'difficulty-asc':
        return [...quests].sort((a, b) => a.difficulty - b.difficulty);
      case 'difficulty-desc':
        return [...quests].sort((a, b) => b.difficulty - a.difficulty);
      case 'rewards':
        return [...quests].sort((a, b) => 
          (b.rewards?.essence || 0) - (a.rewards?.essence || 0)
        );
      case 'relationship':
        return [...quests].sort((a, b) => 
          (a.relationshipRequirement || 0) - (b.relationshipRequirement || 0)
        );
      default:
        return quests;
    }
  };
  
  availableQuests = sortQuests(availableQuests);
  completedQuests = sortQuests(completedQuests);
  
  // For active quests, we might want to sort by progress
  if (sortMethod === 'progress') {
    activeQuests = [...activeQuests].sort((a, b) => {
      const aProgress = a.objectives.filter(o => o.completed).length / a.objectives.length;
      const bProgress = b.objectives.filter(o => o.completed).length / b.objectives.length;
      return bProgress - aProgress;
    });
  } else {
    activeQuests = sortQuests(activeQuests);
  }
  
  // Quest action handlers
  const acceptQuest = (quest) => {
    dispatch({
      type: 'ACCEPT_QUEST',
      payload: { quest }
    });
  };
  
  const turnInQuest = (quest) => {
    dispatch({
      type: 'COMPLETE_QUEST',
      payload: { 
        questId: quest.id,
        rewards: quest.rewards
      }
    });
  };
  
  // Check if a quest is ready to turn in
  const isQuestCompletable = (quest) => {
    const activeQuest = player.activeQuests.find(q => q.id === quest.id);
    if (!activeQuest) return false;
    
    return activeQuest.objectives.every(obj => obj.completed);
  };
  
  // Render quest count badges for tabs
  const getQuestCountBadge = (count) => {
    return count > 0 ? (
      <Badge 
        badgeContent={count} 
        color="primary" 
        sx={{ '& .MuiBadge-badge': { right: -15, top: -5 } }}
      />
    ) : null;
  };
  
  // Menu handlers
  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };
  
  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };
  
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };
  
  return (
    <Box>
      {/* Tabs for different quest categories */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="quest tabs"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Available {getQuestCountBadge(availableQuests.length)}
              </Box>
            }
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Active {getQuestCountBadge(activeQuests.length)}
              </Box>
            }
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Completed {getQuestCountBadge(completedQuests.length)}
              </Box>
            }
          />
        </Tabs>
      </Box>
      
      {/* Sorting and filtering controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Tooltip title="Filter quests by type">
          <IconButton onClick={handleFilterMenuOpen} size="small">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={() => { setFilterType('all'); handleFilterMenuClose(); }}>
            All Types
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('collection'); handleFilterMenuClose(); }}>
            Collection Quests
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('combat'); handleFilterMenuClose(); }}>
            Combat Quests
          </MenuItem>
          <MenuItem onClick={() => { setFilterType('exploration'); handleFilterMenuClose(); }}>
            Exploration Quests
          </MenuItem>
        </Menu>
        
        <Tooltip title="Sort quests">
          <IconButton onClick={handleSortMenuOpen} size="small" sx={{ ml: 1 }}>
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={handleSortMenuClose}
        >
          <MenuItem onClick={() => { setSortMethod('default'); handleSortMenuClose(); }}>
            Default Order
          </MenuItem>
          <MenuItem onClick={() => { setSortMethod('difficulty-asc'); handleSortMenuClose(); }}>
            Easiest First
          </MenuItem>
          <MenuItem onClick={() => { setSortMethod('difficulty-desc'); handleSortMenuClose(); }}>
            Hardest First
          </MenuItem>
          <MenuItem onClick={() => { setSortMethod('rewards'); handleSortMenuClose(); }}>
            Best Rewards
          </MenuItem>
          <MenuItem onClick={() => { setSortMethod('relationship'); handleSortMenuClose(); }}>
            Relationship Required
          </MenuItem>
          {activeTab === 1 && (
            <MenuItem onClick={() => { setSortMethod('progress'); handleSortMenuClose(); }}>
              Most Progress
            </MenuItem>
          )}
        </Menu>
        
        <Tooltip title="Quest information">
          <IconButton size="small" sx={{ ml: 1 }}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Available Quests Tab */}
      {activeTab === 0 && (
        <Box>
          {availableQuests.length > 0 ? (
            <List>
              {availableQuests.map(quest => (
                <QuestItem 
                  key={quest.id} 
                  quest={quest} 
                  buttonText="Accept Quest"
                  onAction={() => acceptQuest(quest)}
                  showRequirements={true}
                  showRewards={true}
                  currentRelationship={player.npcRelationships?.[npc.id] || 0}
                  essence={essence}
                  inventory={player.inventory}
                  type={quest.type}
                  difficulty={quest.difficulty}
                />
              ))}
            </List>
          ) : (
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
              <Typography>
                There are no quests available from {npc.name} at this time.
                Try improving your relationship to unlock more quests.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      
      {/* Active Quests Tab */}
      {activeTab === 1 && (
        <Box>
          {activeQuests.length > 0 ? (
            <List>
              {activeQuests.map(activeQuest => {
                const npcQuest = npc.quests.find(q => q.id === activeQuest.id);
                const isCompletable = isQuestCompletable(activeQuest);
                
                return (
                  <QuestItem 
                    key={activeQuest.id} 
                    quest={npcQuest}
                    progress={activeQuest.objectives}
                    status="active"
                    buttonText={isCompletable ? "Turn In Quest" : undefined}
                    onAction={isCompletable ? () => turnInQuest(npcQuest) : undefined}
                    showProgress={true}
                    showRewards={true}
                    type={npcQuest.type}
                    difficulty={npcQuest.difficulty}
                  />
                );
              })}
            </List>
          ) : (
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
              <Typography>
                You don't have any active quests from {npc.name}.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      
      {/* Completed Quests Tab */}
      {activeTab === 2 && (
        <Box>
          {completedQuests.length > 0 ? (
            <List>
              {completedQuests.map(quest => (
                <QuestItem 
                  key={quest.id} 
                  quest={quest} 
                  status="completed"
                  showRewards={true}
                  completedDate={player.questCompletionDates?.[quest.id]}
                  type={quest.type}
                  difficulty={quest.difficulty}
                />
              ))}
            </List>
          ) : (
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
              <Typography>
                You haven't completed any quests from {npc.name} yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NPCQuestsTab;