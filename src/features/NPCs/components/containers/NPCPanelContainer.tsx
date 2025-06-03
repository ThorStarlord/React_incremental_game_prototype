/**
 * @file NPCPanelContainer.tsx
 * @description Container component that connects NPCPanelUI to Redux state
 */

import React, { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectAllNPCs, selectSelectedNPCId, selectNPCsLoading, selectNPCsError } from '../../state/NPCSelectors';
import { npcActions, updateNpcRelationship } from '../../state/NPCSlice'; // Import npcActions
import { processDialogueChoiceThunk, processNPCInteractionThunk } from '../../state/NPCThunks';
import { NPCPanelUI } from '../ui/NPCPanelUI';
import type { NPC } from '../../state/NPCTypes';

export interface NPCPanelContainerProps {
  /** ID of the NPC to display */
  npcId?: string;
  /** Additional CSS class name */
  className?: string;
  /** Callback when NPC panel is closed */
  onClose?: () => void;
}

/**
 * Container component that manages NPC panel state and provides data to NPCPanelUI
 */
export const NPCPanelContainer: React.FC<NPCPanelContainerProps> = ({
  npcId,
  className,
  onClose
}) => {
  const dispatch = useAppDispatch();
  
  // Get NPCs state
  const allNPCs = useAppSelector(selectAllNPCs);
  const selectedNPCId = useAppSelector(selectSelectedNPCId);
  const loading = useAppSelector(selectNPCsLoading);
  const error = useAppSelector(selectNPCsError);
  
  // Determine which NPC to show
  const currentNPCId = npcId || selectedNPCId;
  const currentNPC = currentNPCId ? allNPCs[currentNPCId] as NPC : undefined; // Type assertion for safety
  
  // Memoized NPC list for selection
  const npcList = useMemo(() => 
    Object.values(allNPCs).sort((a, b) => a.name.localeCompare(b.name)),
    [allNPCs]
  );
  
  // Handlers
  const handleNPCSelect = useCallback((selectedId: string) => {
    dispatch(npcActions.selectNPC(selectedId));
  }, [dispatch]);
  
  const handleRelationshipChange = useCallback((npcId: string, change: number, reason: string) => {
    dispatch(updateNpcRelationship({ npcId, change, reason }));
  }, [dispatch]);
  
  const handleInteraction = useCallback((npcId: string, interactionType: string, data?: any) => {
    // Handle different types of interactions
    switch (interactionType) {
      case 'dialogue':
        dispatch(processDialogueChoiceThunk({ npcId, choiceId: data.choiceId, playerText: data.playerText }));
        break;
      case 'trade':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'trade', options: data }));
        break;
      case 'quest':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'quest', options: data }));
        break;
      case 'trait':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'trait_sharing', options: data }));
        break;
      case 'relationship': // Assuming relationship changes can also be triggered via onInteraction
        dispatch(updateNpcRelationship({ npcId, change: data.change, reason: data.reason }));
        break;
      default:
        console.warn(`Unknown interaction type: ${interactionType}`);
    }
  }, [dispatch]);
  
  // If no NPC is selected and we have NPCs available, select the first one
  React.useEffect(() => {
    if (!currentNPCId && npcList.length > 0 && !loading) {
      handleNPCSelect(npcList[0].id);
    }
  }, [currentNPCId, npcList, loading, handleNPCSelect]);
  
  return (
    <NPCPanelUI
      npc={currentNPC}
      npcList={npcList}
      selectedNPCId={currentNPCId}
      loading={loading}
      error={error}
      className={className}
      onNPCSelect={handleNPCSelect}
      onRelationshipChange={handleRelationshipChange}
      onInteraction={handleInteraction}
      onClose={onClose}
    />
  );
};

export default NPCPanelContainer;
