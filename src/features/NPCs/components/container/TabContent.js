import React from 'react';
import { Box } from '@mui/material';
import DialogueTab from '../../dialogue/DialogueTab';
import DialogueHistory from '../../dialogue/DialogueHistory';
import RelationshipTab from '../relationship/RelationshipTab';
import NPCQuestsTab from '../quests/NPCQuestsTab';

const NPCTabContent = ({ 
  activeTab, 
  npc, 
  npcId, 
  currentDialogue, 
  setCurrentDialogue,
  player,
  essence,
  traits,
  dispatch,
  handleRelationshipChange,
  showNotification
}) => {
  return (
    <Box sx={{ mt: 2, minHeight: 300 }}>
      {activeTab === 'dialogue' && (
        <DialogueTab
          npc={npc}
          npcId={npcId}
          currentDialogue={currentDialogue}
          setCurrentDialogue={setCurrentDialogue}
          player={player}
          essence={essence}
          traits={traits}
          dispatch={dispatch}
          onRelationshipChange={handleRelationshipChange}
        />
      )}
      
      {activeTab === 'history' && (
        <DialogueHistory 
          filterNpcId={npcId}
          maxMessages={50}
        />
      )}
      
      {activeTab === 'relationship' && (
        <RelationshipTab 
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
          traits={traits}
          showNotification={showNotification}
        />
      )}
    </Box>
  );
};

export default NPCTabContent;