/**
 * Redux selectors for NPCs state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { NPC, NPCsState, PlayerInteractions } from './NPCsTypes';
import { getRelationshipStatus } from '../../../shared/utils/npcUtils';

// Basic selectors
export const selectNPCsState = (state: RootState) => state.npcs;
export const selectAllNPCs = (state: RootState) => state.npcs.npcs;
export const selectGlobalState = (state: RootState) => state.npcs.globalState;
export const selectPlayerInteractions = (state: RootState) => state.npcs.playerInteractions;
export const selectActiveDialogue = (state: RootState) => state.npcs.playerInteractions.activeDialogue;
export const selectSelectedNpcId = (state: RootState) => state.npcs.selectedNpcId;
export const selectIsLoading = (state: RootState) => state.npcs.isLoading;
export const selectError = (state: RootState) => state.npcs.error;

// Derived selectors
export const selectNpcsAsArray = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs)
);

export const selectDiscoveredNpcs = createSelector(
  [selectAllNPCs, selectPlayerInteractions],
  (npcs, playerInteractions) => 
    Object.values(npcs).filter(npc => 
      playerInteractions.discoveredNpcs.includes(npc.id)
    )
);

export const selectFavoriteNpcs = createSelector(
  [selectAllNPCs, selectPlayerInteractions],
  (npcs, playerInteractions) => 
    Object.values(npcs).filter(npc => 
      playerInteractions.favoriteNpcs?.includes(npc.id)
    )
);

export const selectUnlockedNpcs = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc => npc.unlocked)
);

export const selectSelectedNpc = createSelector(
  [selectAllNPCs, selectSelectedNpcId],
  (npcs, selectedId) => selectedId ? npcs[selectedId] : null
);

export const selectNpcById = (npcId: string) => createSelector(
  [selectAllNPCs],
  (npcs) => npcs[npcId] || null
);

export const selectNpcByLocation = (location: string) => createSelector(
  [selectNpcsAsArray],
  (npcs) => npcs.filter(npc => npc.location === location)
);

export const selectTraders = createSelector(
  [selectNpcsAsArray],
  (npcs) => npcs.filter(npc => npc.shop?.isOpen)
);

export const selectQuestGivers = createSelector(
  [selectNpcsAsArray],
  (npcs) => npcs.filter(npc => npc.quests && npc.quests.some(q => q.available && !q.completed))
);

export const selectTrainers = createSelector(
  [selectNpcsAsArray],
  (npcs) => npcs.filter(npc => npc.training?.availableSkills.length > 0)
);

export const selectCraftsmen = createSelector(
  [selectNpcsAsArray],
  (npcs) => npcs.filter(npc => npc.crafting?.available)
);

export const selectAvailableQuestsForNpc = (npcId: string) => createSelector(
  [selectNpcById(npcId)],
  (npc) => npc?.quests?.filter(q => q.available && !q.completed) || []
);

export const selectCompletedQuestsForNpc = (npcId: string) => createSelector(
  [selectNpcById(npcId)],
  (npc) => npc?.quests?.filter(q => q.completed) || []
);

export const selectNpcsByFaction = (faction: string) => createSelector(
  [selectNpcsAsArray],
  (npcs) => npcs.filter(npc => npc.faction === faction)
);

export const selectFactionReputation = (faction: string) => createSelector(
  [selectGlobalState],
  (globalState) => globalState.reputationsByFaction[faction] || 0
);

export const selectNpcRelationship = (npcId: string) => createSelector(
  [selectNpcById(npcId)],
  (npc) => npc?.relationship || { level: 'neutral', value: 0 }
);

export const selectNpcRelationshipStatus = (npcId: string) => createSelector(
  [selectNpcRelationship(npcId)],
  (relationship) => getRelationshipStatus(relationship.value)
);

export const selectInteractionHistory = (npcId: string) => createSelector(
  [selectPlayerInteractions],
  (playerInteractions) => playerInteractions.interactionHistory[npcId] || { interactionCount: 0 }
);

export const selectLastInteractedNpc = createSelector(
  [selectPlayerInteractions, selectAllNPCs],
  (playerInteractions, npcs) => {
    const lastNpcId = playerInteractions.lastInteractedNpc;
    return lastNpcId ? npcs[lastNpcId] : null;
  }
);

export const selectNpcsByTimeOfDay = (timeOfDay: string) => createSelector(
  [selectNpcsAsArray, selectGlobalState],
  (npcs, globalState) => {
    // This is a simplified implementation - in a real game, you'd have a 
    // schedule for each NPC to determine their availability based on time of day
    if (timeOfDay === 'night') {
      return npcs.filter(npc => npc.tags?.includes('nocturnal'));
    }
    return npcs.filter(npc => npc.unlocked);
  }
);

export const selectNpcsAtLocation = (location: string, gameHour: number, isWeekend: boolean = false) => 
  createSelector(
    [selectNpcsAsArray],
    (npcs) => {
      // Use the utility function for determining NPC location
      // This would require additional implementation to track NPC schedules
      return npcs.filter(npc => {
        // Simple implementation just checks static location
        return npc.location === location && npc.unlocked;
      });
    }
  );

export const selectNpcsSortedByRelationship = createSelector(
  [selectNpcsAsArray],
  (npcs) => [...npcs].sort((a, b) => 
    (b.relationship?.value || 0) - (a.relationship?.value || 0)
  )
);

export const selectTradableItems = (npcId: string) => createSelector(
  [selectNpcById(npcId)],
  (npc) => npc?.shop?.inventory.map(item => ({
    id: item.itemId,
    name: item.itemId, // In a real implementation, you'd look up the proper name
    price: item.price,
    quantity: item.quantity
  })) || []
);

export const selectDialogueOptions = (npcId: string) => createSelector(
  [selectNpcById(npcId), selectPlayerInteractions],
  (npc, playerInteractions) => {
    if (!npc) return [];
    
    // Get relationship level for filtering options
    const relationshipValue = npc.relationship.value;
    
    // This is a placeholder - in a real game, you'd have more complex dialogue option filtering
    // based on relationship, player choices, quest state, etc.
    const baseOptions = [
      { text: "Talk", value: "talk" },
      { text: "Farewell", value: "farewell" }
    ];
    
    // Add trade option if NPC is a merchant
    if (npc.shop?.isOpen) {
      baseOptions.push({ text: "Trade", value: "trade" });
    }
    
    // Add quest option if NPC has available quests
    if (npc.quests?.some(q => q.available && !q.completed)) {
      baseOptions.push({ text: "Quests", value: "quests" });
    }
    
    // Add faction-specific options if relationship is good
    if (relationshipValue >= 50) {
      baseOptions.push({ text: "Ask about the faction", value: "faction_info" });
    }
    
    return baseOptions;
  }
);
