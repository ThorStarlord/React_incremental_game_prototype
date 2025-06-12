/**
 * @file NPCPanelContainer.tsx
 * @description Container component that connects NPCPanelUI to Redux state
 */

import React, { useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
// FIXED: Corrected selector names from selectNPCsLoading/Error to selectNPCLoading/Error
import { selectAllNPCs, selectSelectedNPCId, selectNPCLoading, selectNPCError } from '../../state/NPCSelectors';
import { npcActions, updateNpcRelationship } from '../../state/NPCSlice';
// FIXED: Removed non-existent processDialogueChoiceThunk import
import { processNPCInteractionThunk } from '../../state/NPCThunks';
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

  // Get NPCs state using corrected selectors
  const allNPCs = useAppSelector(selectAllNPCs);
  const selectedNPCId = useAppSelector(selectSelectedNPCId);
  const loading = useAppSelector(selectNPCLoading); // FIXED: Using correct selector
  const error = useAppSelector(selectNPCError);     // FIXED: Using correct selector

  // Determine which NPC to show
  const currentNPCId = npcId || selectedNPCId;
  const currentNPC = currentNPCId ? allNPCs[currentNPCId] as NPC : undefined;

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
    // FIXED: The `processDialogueChoiceThunk` is deprecated.
    // Dialogue choices should now be handled as a type of `processNPCInteractionThunk`.
    // Also, the payload property is `context`, not `options`.
    switch (interactionType) {
      case 'dialogue':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'dialogue', context: data }));
        break;
      case 'trade':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'trade', context: data }));
        break;
      case 'quest':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'quest', context: data }));
        break;
      case 'trait':
        dispatch(processNPCInteractionThunk({ npcId, interactionType: 'trait_sharing', context: data }));
        break;
      case 'relationship':
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