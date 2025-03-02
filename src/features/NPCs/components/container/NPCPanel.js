import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Box, Typography, Avatar, Chip, Divider, Icon, 
         Tooltip, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import { GameStateContext, GameDispatchContext, ACTION_TYPES } from '../../../../context/GameStateContext';
import { getRelationshipTier, getAvailableInteractions } from '../../../config/relationshipConstants';
import Panel from '../../../components/common/Panel';

// Import child components
import NPCHeader from '../NPCHeader';
import DialogueTab from '../dialogue/DialogueTab';
import DialogueHistory from '../DialogueHistory';
import RelationshipTab from '../relationship/RelationshipTab';
import NPCQuestsTab from '../quests/NPCQuestsTab';
import TradeTab from '../../trade/TradeTab';

// Import utilities 
import { useNPCDiscovery } from '../../../hooks/useNPCDiscovery';
import { useNotification } from '../../../hooks/useNotification';

/**
 * @component NPCPanel
 * @description Main container component for NPC interactions. Manages the different tabs and
 * interaction options available to the player when conversing with an NPC. This panel handles
 * dialogue, quests, relationship management, and dialogue history with a specific NPC.
 * 
 * @param {Object} props - Component props
 * @param {string} props.npcId - Unique identifier for the NPC to display
 * @returns {JSX.Element} Rendered NPC interaction panel
 */
const NPCPanel = ({ npcId }) => {
  // Access global game state and dispatcher
  const { npcs, essence, player, traits } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  
  /**
   * Find the current NPC from the list using their ID
   * Memoized to prevent unnecessary re-renders
   */
  const npc = useMemo(() => npcs.find(n => n.id === npcId), [npcs, npcId]);
  
  /**
   * State to track which interaction tab is currently active
   * @type {string} - One of: 'dialogue', 'quests', 'history', 'relationship'
   */
  const [activeTab, setActiveTab] = useState('dialogue');
  
  // Hook to handle system notifications
  const { notification, showNotification } = useNotification();
  
  /**
   * Custom hook that handles NPC discovery mechanics and initial dialogue setup
   * Manages the flow of conversation based on player's previous interactions
   */
  const { currentDialogue, setCurrentDialogue } = useNPCDiscovery({
    npc,
    npcId,
    player,
    dispatch
  });

  /**
   * Navigates back to a previously encountered dialogue branch
   * @param {string} dialogueId - Identifier for the dialogue branch to revisit
   */
  const handleRevisitDialogue = (dialogueId) => {
    if (npc?.dialogue?.[dialogueId]) {
      setCurrentDialogue(npc.dialogue[dialogueId]);
      dispatch({ 
        type: ACTION_TYPES.UPDATE_DIALOGUE_STATE, 
        payload: { npcId, dialogueBranch: dialogueId } 
      });
      setActiveTab('dialogue');
    }
  };

  // Early return if NPC doesn't exist
  if (!npc) return <Panel title="NPC Not Found">This character doesn't seem to exist.</Panel>;

  // Calculate derived values from NPC data
  const relationship = npc.relationship || 0;
  
  /**
   * Get the current relationship tier based on relationship value
   * This determines available interactions and benefits
   */
  const relationshipTier = useMemo(() => getRelationshipTier(relationship), [relationship]);
  
  /**
   * Determine which interactions are available based on relationship level
   */
  const availableInteractions = useMemo(() => getAvailableInteractions(relationship), [relationship]);

  return (
    <Panel title={`Conversation with ${npc.name}`}>
      {/* NPC Header - Displays NPC avatar and basic information */}
      <NPCHeader 
        npc={npc} 
        relationshipTier={relationshipTier}
        relationship={relationship}
      />
      
      <Divider sx={{ my: 2 }} />
      
      {/* Relationship tier benefits summary - Shows current perks from relationship level */}
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
      
      {/* Tab navigation - Switches between different interaction modes */}
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
          {/* Future feature: Trade tab can be added when implementation is ready */}
        </Tabs>
      </Box>

      {/* Tab content - Different interaction interfaces based on selected tab */}
      <Box sx={{ mt: 2, minHeight: 300 }}>
        {activeTab === 'dialogue' && (
          <DialogueTab
            npc={npc}
            npcId={npcId}
            currentDialogue={currentDialogue}
            setCurrentDialogue={setCurrentDialogue}
            player={player}
            essence={essence}
            dispatch={dispatch}
            showNotification={showNotification}
          />
        )}
        
        {activeTab === 'history' && (
          <DialogueHistory 
            npcId={npcId}
            onRevisitDialogue={handleRevisitDialogue}
          />
        )}
        
        {activeTab === 'relationship' && (
          <RelationshipTab 
            relationshipValue={relationship} 
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
            traits={traits}
            showNotification={showNotification}
          />
        )}
      </Box>

      {/* Notification system - Shows alerts for important game events */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => showNotification({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => showNotification({ open: false })} 
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