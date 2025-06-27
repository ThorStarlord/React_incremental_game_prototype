/**
 * @file NPCPanelContainer.tsx
 * @description Container component that connects NPCPanelUI to Redux state
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
// Corrected: Import everything from the feature's public API (index.ts)
import {
    selectAllNPCs,
    selectSelectedNPCId,
    selectNPCLoading,
    selectNPCError,
    npcActions,
    updateNPCRelationshipThunk,
    processNPCInteractionThunk,
} from '../../';
import { NPCPanelUI } from '../ui/NPCPanelUI';
import type { NPC } from '../../state/NPCTypes';
import { selectCurrentNPC } from '../../state/NPCSelectors';
import { Box, Paper, Typography, Button, Tabs, Tab } from '@mui/material';
import NPCOverviewTab from '../ui/tabs/NPCOverviewTab';
import NPCTradeTab from '../ui/tabs/NPCTradeTab';
import NPCQuestsTab from '../ui/tabs/NPCQuestsTab';
import NPCTraitsTab from '../ui/tabs/NPCTraitsTab';

export interface NPCPanelContainerProps {
  /** ID of the NPC to display */
  npcId?: string;
  /** Additional CSS class name */
  className?: string;
  /** Callback when NPC panel is closed */
  onClose?: () => void;
  onBack?: () => void;
}

/**
 * Container component that manages NPC panel state and provides data to NPCPanelUI
 */
export const NPCPanelContainer: React.FC<NPCPanelContainerProps> = ({
  npcId,
  className,
  onClose,
  onBack
}) => {
  const dispatch = useAppDispatch();

  const allNPCs = useAppSelector(selectAllNPCs);
  const selectedNPCId = useAppSelector(selectSelectedNPCId);
  const loading = useAppSelector(selectNPCLoading);
  const error = useAppSelector(selectNPCError);
  const npc = useAppSelector(selectCurrentNPC);
  const [currentTab, setCurrentTab] = useState(0);

  const currentNPCId = npcId || selectedNPCId;
  const currentNPC = currentNPCId ? allNPCs[currentNPCId] as NPC : undefined;

  const npcList = useMemo(() =>
    Object.values(allNPCs).sort((a, b) => a.name.localeCompare(b.name)),
    [allNPCs]
  );

  const handleNPCSelect = useCallback((selectedId: string) => {
    dispatch(npcActions.setSelectedNPCId(selectedId));
  }, [dispatch]);

  const handleRelationshipChange = useCallback((npcId: string, change: number, reason: string) => {
    dispatch(updateNPCRelationshipThunk({ npcId, change, reason }));
  }, [dispatch]);

  const handleInteraction = useCallback((npcId: string, interactionType: string, data?: any) => {
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
      default:
        console.warn(`Unknown interaction type: ${interactionType}`);
    }
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  React.useEffect(() => {
    if (!currentNPCId && npcList.length > 0 && !loading) {
      handleNPCSelect(npcList[0].id);
    }
  }, [currentNPCId, npcList, loading, handleNPCSelect]);

  if (!npc) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">NPC not found</Typography>
        <Typography>The selected NPC could not be found. They might not be discovered yet.</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>Back to List</Button>
      </Paper>
    );
  }

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