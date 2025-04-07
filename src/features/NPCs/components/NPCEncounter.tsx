import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Button, Avatar, Chip, Divider } from '@mui/material';

// Import from Redux store - access state directly instead of through selectors
import { RootState } from '../../../app/store';

// Import NPC-related actions and selectors
import { manuallyUpdateRelationship } from '../state/NPCsSlice';
import { selectNpcById } from '../state/NPCsSelectors';

// Import other component dependencies
import TabNavigation from './container/TabNavigation';
import DialogueTab from '../dialogue/DialogueTab';

// Import NPC types
import { NPC } from '../state/NPCsTypes';

// Temporary component until the actual one is created
const TradeTab: React.FC<any> = ({ npc, player, dispatch, currentRelationship, essence }) => (
  <Box>
    <Typography variant="h6">Trade with {npc.name}</Typography>
    <Typography variant="body2" color="text.secondary">
      This is a placeholder for the Trade tab functionality.
    </Typography>
  </Box>
);

// Temporary component until the actual one is created
const QuestTab: React.FC<any> = ({ npc, player, dispatch }) => (
  <Box>
    <Typography variant="h6">Quests from {npc.name}</Typography>
    <Typography variant="body2" color="text.secondary">
      This is a placeholder for the Quest tab functionality.
    </Typography>
  </Box>
);

// Temporary component until the actual one is created
const RelationshipDisplay: React.FC<{ value: number, level: string }> = ({ value, level }) => (
  <Chip
    label={`${level} (${value})`}
    color={value >= 50 ? 'success' : value >= 0 ? 'primary' : 'error'}
    variant="outlined"
    size="small"
  />
);

interface NPCEncounterProps {
  npcId: string;
  onClose?: () => void;
}

/**
 * NPCEncounter component handles player interactions with NPCs
 * Displays dialogue, trade, and quest options
 */
const NPCEncounter: React.FC<NPCEncounterProps> = ({ npcId, onClose }) => {
  // Use Redux instead of context
  const dispatch = useDispatch();
  
  // Get NPC data from Redux store
  const npc = useSelector((state: RootState) => selectNpcById(state, npcId));
  
  // Get player data directly from Redux store state
  const playerName = useSelector((state: RootState) => state.player?.name || "Player");
  const playerLevel = useSelector((state: RootState) => state.player?.level || 1);
  const playerEssence = useSelector((state: RootState) => state.essence?.amount || 0);
  
  // Get player's inventory from Redux store
  const playerInventory = useSelector((state: RootState) => state.inventory?.items || []);
  
  // Get traits data from Redux store
  const traits = useSelector((state: RootState) => state.traits?.traits || {});
  
  // Local state
  const [activeTab, setActiveTab] = useState<string>('dialogue');
  const [availableTabs, setAvailableTabs] = useState<Array<{id: string, label: string}>>([]);
  
  // Simplify player object for component props
  const playerData = {
    name: playerName,
    level: playerLevel,
    inventory: playerInventory,
    acquiredTraits: useSelector((state: RootState) => state.player?.acquiredTraits || []),
    discoveredNPCs: useSelector((state: RootState) => 
      state.npcs?.playerInteractions?.discoveredNpcs || []
    ),
    seenTraits: useSelector((state: RootState) => 
      state.player?.seenTraits || []
    )
  };
  
  // Handle relationship changes - using correct action name
  const handleRelationshipChange = (amount: number, source: string) => {
    if (npc) {
      dispatch(manuallyUpdateRelationship({
        npcId: npc.id,
        amount,
        notifyPlayer: true,
        source
      }));
    }
  };
  
  // Determine available tabs based on NPC capabilities
  useEffect(() => {
    if (!npc) return;
    
    const tabs = [{ id: 'dialogue', label: 'Talk' }];
    
    if (npc.canTrade || npc.shop) {
      tabs.push({ id: 'trade', label: 'Trade' });
    }
    
    if (npc.hasQuests || (npc.quests && npc.quests.length > 0)) {
      tabs.push({ id: 'quests', label: 'Quests' });
    }
    
    setAvailableTabs(tabs);
  }, [npc]);
  
  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  // If NPC data isn't loaded yet, show loading state
  if (!npc) {
    return (
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography>Loading NPC data...</Typography>
      </Paper>
    );
  }
  
  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      {/* NPC Header */}
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Avatar 
          src={npc.portrait || npc.image} 
          alt={npc.name}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5">{npc.name}</Typography>
              {npc.title && (
                <Typography variant="subtitle1" color="text.secondary">
                  {npc.title}
                </Typography>
              )}
            </Box>
            
            <Box>
              <RelationshipDisplay 
                value={npc.relationship?.value || 0} 
                level={npc.relationship?.level || 'neutral'} 
              />
            </Box>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            {npc.tags && npc.tags.map(tag => (
              <Chip 
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Tab Navigation */}
      <TabNavigation 
        tabs={availableTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Tab Content */}
      <Box sx={{ mt: 3, minHeight: 300 }}>
        {activeTab === 'dialogue' && (
          <DialogueTab 
            npc={npc}
            player={playerData}
            dispatch={dispatch}
            essence={playerEssence || 0}
            onRelationshipChange={handleRelationshipChange}
            traits={traits}
          />
        )}
        
        {activeTab === 'trade' && (
          <TradeTab
            npc={npc}
            player={playerData}
            dispatch={dispatch}
            currentRelationship={npc.relationship?.value || 0}
            essence={playerEssence || 0}
          />
        )}
        
        {activeTab === 'quests' && (
          <QuestTab
            npc={npc}
            player={playerData}
            dispatch={dispatch}
          />
        )}
      </Box>
      
      {/* Close Button */}
      {onClose && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="outlined" onClick={onClose}>
            Leave Conversation
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default NPCEncounter;
