import React, { useState, useMemo } from 'react';
import { Divider, Snackbar, Alert } from '@mui/material';
import { useGameState, useGameDispatch } from '../../../../context/GameStateContext';
import { ACTION_TYPES } from '../../../../context/actions/actionTypes';
import { getRelationshipTier, getAvailableInteractions } from '../../utils/relationshipUtils';
import Panel from '../../../../shared/components/layout/Panel';

// Import child components
import NPCHeader from '../presentation/NPCHeader';
import NPCTabNav from '../presentation/NPCTabNav';
import NPCTabContent from './NPCTabContent';
import RelationshipBenefits from '../presentation/RelationshipBenefits';

// Import utilities 
// Removed useNPCDiscovery and useNotification imports

const NPCPanel = ({ npcId }) => {
  // Access global state using hooks instead of context directly
  const { npcs, essence, player, traits } = useGameState();
  const dispatch = useGameDispatch();
  const [activeTab, setActiveTab] = useState('dialogue');
  const { notification, showNotification } = useNotification();
  
  // Find NPC and set up dialogue
  const npc = useMemo(() => npcs.find(n => n.id === npcId), [npcs, npcId]);
  const { currentDialogue, setCurrentDialogue } = useNPCDiscovery({
    npc,
    npcId,
    player,
    dispatch
  });

  // Handle relationship changes
  const handleRelationshipChange = (amount, source = 'dialogue') => {
    dispatch({
      type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP,
      payload: { npcId, amount }
    });
    
    if (Math.abs(amount) >= 5) {
      showNotification({
        open: true,
        message: `Relationship with ${npc?.name} ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)}!`,
        severity: amount > 0 ? 'success' : 'warning'
      });
    }
  };

  // Handle dialogue revisits
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

  if (!npc) return <Panel title="NPC Not Found">This character doesn't seem to exist.</Panel>;

  // Calculate derived values
  const relationship = npc.relationship || 0;
  const relationshipTier = useMemo(() => getRelationshipTier(relationship), [relationship]);

  return (
    <Panel title={`Conversation with ${npc.name}`}>
      <NPCHeader 
        npc={npc} 
        relationshipTier={relationshipTier}
        relationship={relationship}
      />
      
      <Divider sx={{ my: 2 }} />
      
      <RelationshipBenefits relationshipTier={relationshipTier} />
      
      <NPCTabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <NPCTabContent
        activeTab={activeTab}
        npc={npc}
        npcId={npcId}
        currentDialogue={currentDialogue}
        setCurrentDialogue={setCurrentDialogue}
        player={player}
        essence={essence}
        traits={traits}
        dispatch={dispatch}
        handleRelationshipChange={handleRelationshipChange}
        showNotification={showNotification}
      />

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
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default NPCPanel;