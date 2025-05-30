/**
 * @file NPCSelectors.ts
 * @description Memoized selectors for NPC state management with performance optimization
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, NPCState } from './NPCTypes';

// Base selectors
export const selectNPCState = (state: RootState): NPCState => state.npcs;

export const selectNPCs = createSelector(
  [selectNPCState],
  (npcState) => npcState.npcs
);

export const selectDiscoveredNPCs = createSelector(
  [selectNPCState],
  (npcState) => npcState.discoveredNPCs
);

export const selectNPCLoading = createSelector(
  [selectNPCState],
  (npcState) => npcState.loading
);

export const selectNPCError = createSelector(
  [selectNPCState],
  (npcState) => npcState.error
);

export const selectCurrentInteraction = createSelector(
  [selectNPCState],
  (npcState) => npcState.currentInteraction
);

export const selectDialogueHistory = createSelector(
  [selectNPCState],
  (npcState) => npcState.dialogueHistory || []
);

export const selectRelationshipHistory = createSelector( // Renamed from selectRelationshipChanges
  [selectNPCState],
  (npcState) => npcState.relationshipHistory || [] // Updated to relationshipHistory
);

// Note: Using dialogueHistory with proper property names from DialogueEntry interface
export const selectInteractionHistory = createSelector(
  [selectDialogueHistory],
  (dialogueHistory) => dialogueHistory.map(entry => ({
    id: entry.id,
    npcId: entry.npcId,
    timestamp: entry.timestamp,
    type: 'dialogue' as const,
    content: `Player: ${entry.playerText}\nNPC: ${entry.npcResponse}` // Combine both parts of dialogue
  }))
);

// Parameterized selectors
export const selectNPCById = createSelector(
  [selectNPCs, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId] || null
);

export const selectNPCRelationshipValue = createSelector(
  [selectNPCs, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId]?.relationshipValue || 0
);

export const selectNPCsByLocation = createSelector(
  [selectNPCs],
  (npcs) => (location: string) => Object.values(npcs).filter(npc => npc.location === location)
);

export const selectNPCsByStatus = createSelector(
  [selectNPCs],
  (npcs) => (status: string) => Object.values(npcs).filter(npc => npc.status === status)
);

// Computed selectors
// selectAllNPCs now returns the Record<string, NPC> directly
// Other selectors that need an array of NPCs should use Object.values(npcs)
export const selectAllNPCs = createSelector(
  [selectNPCs],
  (npcs) => npcs
);

export const selectDiscoveredNPCsList = createSelector(
  [selectNPCs, selectDiscoveredNPCs],
  (npcs, discoveredIds) => discoveredIds.map(id => npcs[id]).filter(Boolean) as NPC[]
);

export const selectAvailableNPCs = createSelector(
  [selectDiscoveredNPCsList],
  (discoveredNPCs) => discoveredNPCs.filter(npc => npc.isAvailable)
);

export const selectOnlineNPCs = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc => npc.status === 'available' || npc.status === 'busy')
);

export const selectNPCDialogueHistory = createSelector(
  [selectDialogueHistory, (_state: RootState, npcId: string) => npcId],
  (dialogueHistory, npcId) => 
    dialogueHistory.filter(entry => entry.npcId === npcId)
);

export const selectNPCRelationshipHistory = createSelector(
  [selectRelationshipHistory, (_state: RootState, npcId: string) => npcId], // Use renamed selector
  (relationshipHistory, npcId) => 
    relationshipHistory.filter(entry => entry.npcId === npcId)
);

export const selectRecentInteractions = createSelector(
  [selectInteractionHistory],
  (history) => {
    const oneHourAgo = Date.now() - 3600000;
    return history.filter((interaction: any) => interaction.timestamp > oneHourAgo);
  }
);

export const selectRecentlyActiveNPCs = createSelector(
  [selectAllNPCs],
  (npcs) => {
    const oneHourAgo = Date.now() - 3600000;
    return Object.values(npcs).filter(npc => npc.lastInteraction && npc.lastInteraction > oneHourAgo);
  }
);

// Enhanced selectors for UI components
export const selectNPCWithRelationshipData = createSelector(
  [selectNPCs, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => {
    const npc = npcs[npcId];
    if (!npc) return null;
    
    return {
      ...npc,
      relationshipLevel: Math.floor(npc.relationshipValue / 20), // 0-5 levels
      relationshipProgress: (npc.relationshipValue % 20) / 20, // Progress within current level
      canDialogue: npc.relationshipValue >= 1,
      canTrade: npc.relationshipValue >= 2,
      canQuest: npc.relationshipValue >= 3,
      canShareTraits: npc.relationshipValue >= 4
    };
  }
);

export const selectNPCInteractionCapabilities = createSelector(
  [selectNPCs, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => {
    const npc = npcs[npcId];
    if (!npc) return null;
    
    return {
      npcId,
      canDialogue: npc.relationshipValue >= 1,
      canTrade: npc.relationshipValue >= 2,
      canQuest: npc.relationshipValue >= 3,
      canShareTraits: npc.relationshipValue >= 4,
      relationshipValue: npc.relationshipValue,
      isAvailable: npc.isAvailable
    };
  }
);

export const selectHighRelationshipNPCs = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc => npc.relationshipValue >= 25)
);

// Trait-related selectors with safe property access
export const selectNPCTraits = createSelector(
  [selectNPCById],
  (npc) => npc?.traits ? Object.values(npc.traits) : []
);

export const selectNPCDiscoveredTraits = createSelector(
  [selectNPCById],
  (npc) => {
    // Return trait IDs from the traits object since discoveredTraits may not exist
    return npc?.traits ? Object.keys(npc.traits) : [];
  }
);

export const selectNPCsWithTraits = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).filter(npc => npc.traits && Object.keys(npc.traits).length > 0)
);

// Utility selectors
export const selectNPCLocations = createSelector(
  [selectAllNPCs],
  (npcs) => Array.from(new Set(Object.values(npcs).map(npc => npc.location)))
);

export const selectNPCStatistics = createSelector(
  [selectNPCs, selectDiscoveredNPCs],
  (npcs, discoveredIds) => {
    const allNPCsArray = Object.values(npcs);
    const discoveredNPCs = discoveredIds.map(id => npcs[id]).filter(Boolean) as NPC[];
    
    return {
      totalNPCs: allNPCsArray.length,
      discoveredCount: discoveredNPCs.length,
      availableCount: discoveredNPCs.filter(npc => npc.isAvailable).length,
      onlineCount: discoveredNPCs.filter(npc => npc.status === 'available' || npc.status === 'busy').length,
      averageRelationship: discoveredNPCs.length > 0 
        ? discoveredNPCs.reduce((sum, npc) => sum + npc.relationshipValue, 0) / discoveredNPCs.length 
        : 0,
      maxRelationship: discoveredNPCs.length > 0 
        ? Math.max(...discoveredNPCs.map(npc => npc.relationshipValue)) 
        : 0,
      highRelationshipCount: discoveredNPCs.filter(npc => npc.relationshipValue >= 25).length
    };
  }
);

// Relationship selectors
export const selectNPCRelationships = createSelector(
  [selectAllNPCs],
  (npcs) => Object.values(npcs).reduce((acc: Record<string, { value: number; depth: number; loyalty: number }>, npc) => {
    acc[npc.id] = {
      value: npc.relationshipValue,
      depth: npc.connectionDepth,
      loyalty: npc.loyalty
    };
    return acc;
  }, {} as Record<string, { value: number; depth: number; loyalty: number }>)
);

// Performance and status selectors
export const selectNPCsLoading = createSelector(
  [selectNPCState],
  (npcState) => npcState.loading || false
);

export const selectNPCsError = createSelector(
  [selectNPCState],
  (npcState) => npcState.error || null
);

export const selectCurrentNPCInteraction = createSelector(
  [selectNPCState],
  (npcState) => npcState.currentInteraction || null
);

// Mock data integration selector (for development)
export const selectMockNPCData = createSelector(
  [selectNPCs],
  (npcs) => {
    // Transform NPCs data for development usage
    return Object.values(npcs).map(npc => ({
      ...npc,
      isMockData: true,
      developmentNote: 'NPC loaded from mock data for development'
    }));
  }
);

// Advanced filtering selectors
export const selectNPCsByRelationshipRange = createSelector(
  [selectAllNPCs],
  (npcs) => (minValue: number, maxValue: number) => 
    Object.values(npcs).filter(npc => npc.relationshipValue >= minValue && npc.relationshipValue <= maxValue)
);

// Session management selectors
export const selectActiveInteractionSession = createSelector(
  [selectCurrentInteraction],
  (currentInteraction) => currentInteraction !== null
);

export const selectInteractionSessionNPC = createSelector(
  [selectCurrentInteraction, selectNPCs],
  (currentInteraction, npcs) => {
    if (!currentInteraction) return null;
    return npcs[currentInteraction.npcId] || null;
  }
);

// Essence generation selectors (for integration with Essence system)
export const selectNPCEssenceGeneration = createSelector(
  [selectAllNPCs],
  (npcs) => {
    return Object.values(npcs).reduce((total, npc) => {
      // Calculate essence generation based on relationship and connection depth
      const baseGeneration = Math.max(0, npc.relationshipValue - 10) * 0.1;
      const depthMultiplier = 1 + (npc.connectionDepth * 0.2);
      return total + (baseGeneration * depthMultiplier);
    }, 0);
  }
);

export const selectTopEssenceGenerators = createSelector(
  [selectAllNPCs],
  (npcs) => {
    return Object.values(npcs)
      .map(npc => ({
        ...npc,
        essenceGeneration: Math.max(0, npc.relationshipValue - 10) * 0.1 * (1 + (npc.connectionDepth * 0.2))
      }))
      .filter(npc => npc.essenceGeneration > 0)
      .sort((a, b) => b.essenceGeneration - a.essenceGeneration)
      .slice(0, 5);
  }
);
