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

// Import hooks
import useNPCDiscovery from '../../hooks/useNPCDiscovery';
import { useNotification } from '../../../../shared/hooks/resourceHooks';

const NPCPanel = ({ npcId, npc: propNpc, onClose }) => {
  // Access global state using hooks instead of context directly - with safe defaults
  const { npcs = [], essence = 0, player = {}, traits = {} } = useGameState();
  const dispatch = useGameDispatch();
  const [activeTab, setActiveTab] = useState('dialogue');
  const { notification, showNotification } = useNotification();
  
  // Find NPC - provide both ways to get the NPC - from props or from global state with proper safety checks
  // Important: Use useMemo to prevent unnecessary recalculation
  const npc = useMemo(() => {
    // First try to use the npc from props if available
    if (propNpc) return propNpc;
    
    // If not available in props, try to find it in the npcs array if both npcId and npcs are available
    if (npcId && Array.isArray(npcs)) {
      return npcs.find(n => n && n.id === npcId) || null;
    }
    
    // If neither works, return null as a fallback
    return null;
  }, [propNpc, npcs, npcId]);
  
  // Always call hooks unconditionally at the top level
  const { currentDialogue, setCurrentDialogue } = useNPCDiscovery({
    npc,
    npcId: npc?.id || npcId,
    player,
    dispatch
  });

  // Handle rendering when NPC doesn't exist
  if (!npc) {
    return (
      <Panel title="NPC Information">
        <div>No NPC found. Please select a valid NPC.</div>
      </Panel>
    );
  }
  
  // Calculate derived values
  const relationship = npc?.relationship || 0;
  const relationshipTier = getRelationshipTier(relationship);

  // Handle relationship changes
  const handleRelationshipChange = (amount, source = 'dialogue') => {
    const effectiveNpcId = npc?.id || npcId;
    if (!effectiveNpcId) return;
    
    dispatch({
      type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP,
      payload: { npcId: effectiveNpcId, amount }
    });
    
    if (Math.abs(amount) >= 5) {
      showNotification({
        open: true,
        message: `Relationship with ${npc?.name || 'NPC'} ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)}!`,
        severity: amount > 0 ? 'success' : 'warning'
      });
    }
  };

  // Handle dialogue revisits
  const handleRevisitDialogue = (dialogueId) => {
    if (npc?.dialogue && npc.dialogue[dialogueId]) {
      setCurrentDialogue(npc.dialogue[dialogueId]);
      dispatch({ 
        type: ACTION_TYPES.UPDATE_DIALOGUE_STATE, 
        payload: { npcId: npc.id, dialogueBranch: dialogueId } 
      });
      setActiveTab('dialogue');
    }
  };

  return (
    <Panel title={`Conversation with ${npc?.name || 'NPC'}`}>
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
        npcId={npc?.id || npcId || ''}
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
        open={notification?.open || false}
        autoHideDuration={4000}
        onClose={() => showNotification({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => showNotification({ open: false })} 
          severity={notification?.severity || 'info'}
          variant="filled"
        >
          {notification?.message || ''}
        </Alert>
      </Snackbar>
    </Panel>
  );
};

export default NPCPanel;