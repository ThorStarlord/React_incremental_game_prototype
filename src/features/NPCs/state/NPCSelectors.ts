/**
 * @file NPCSelectors.ts
 * @description Memoized selectors for the NPC state
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NPC, NPCState } from './NPCTypes';
import { RELATIONSHIP_TIERS } from '../../../config/relationshipConstants';

// Base selectors
export const selectNPCState = (state: RootState): NPCState => state.npcs;
export const selectAllNPCs = (state: RootState) => state.npcs.npcs;
export const selectDiscoveredNPCs = (state: RootState) => state.npcs.discoveredNPCs;
export const selectCurrentInteraction = (state: RootState) => state.npcs.currentInteraction;
export const selectDialogueHistory = (state: RootState) => state.npcs.dialogueHistory;
export const selectRelationshipChanges = (state: RootState) => state.npcs.relationshipChanges;

// Individual NPC selectors
export const selectNPCById = createSelector(
  [selectAllNPCs, (state: RootState, npcId: string) => npcId],
  (npcs, npcId) => npcs[npcId] || null
);

export const selectNPCRelationship = createSelector(
  [selectNPCById],
  (npc) => npc ? npc.relationshipValue : 0
);

export const selectNPCConnectionDepth = createSelector(
  [selectNPCById],
  (npc) => npc ? npc.connectionDepth : 0
);

// Discovered NPCs list
export const selectDiscoveredNPCsList = createSelector(
  [selectAllNPCs, selectDiscoveredNPCs],
  (npcs, discoveredIds) => discoveredIds.map(id => npcs[id]).filter(Boolean)
);

// NPCs by location
export const selectNPCsByLocation = createSelector(
  [selectDiscoveredNPCsList, (state: RootState, location: string) => location],
  (npcs, location) => npcs.filter(npc => npc.location === location)
);

// Available NPCs (discovered and currently available)
export const selectAvailableNPCs = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => npcs.filter(npc => npc.isAvailable)
);

// NPCs by relationship tier
export const selectNPCsByRelationshipTier = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => {
    const result: Record<string, NPC[]> = {};
    
    Object.keys(RELATIONSHIP_TIERS).forEach(tier => {
      result[tier] = [];
    });
    
    npcs.forEach(npc => {
      const tier = getNPCRelationshipTier(npc.relationshipValue);
      if (result[tier]) {
        result[tier].push(npc);
      }
    });
    
    return result;
  }
);

// Helper function to get relationship tier from value
function getNPCRelationshipTier(relationshipValue: number): string {
  const tiers = Object.entries(RELATIONSHIP_TIERS);
  
  for (const [tierKey, tierData] of tiers) {
    if (relationshipValue >= tierData.min && relationshipValue <= tierData.max) {
      return tierKey;
    }
  }
  
  return 'NEUTRAL'; // Default fallback
}

// NPCs with available quests
export const selectNPCsWithQuests = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => npcs.filter(npc => npc.availableQuests.length > 0)
);

// NPCs with teachable traits
export const selectNPCsWithTraits = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => npcs.filter(npc => npc.teachableTraits.length > 0)
);

// NPCs with trading capabilities
export const selectTradingNPCs = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => npcs.filter(npc => npc.inventory && npc.inventory.items.length > 0)
);

// High relationship NPCs (for essence generation)
export const selectHighRelationshipNPCs = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => npcs.filter(npc => npc.relationshipValue >= 25) // Acquaintance level and above
);

// Recent interactions (last 24 hours)
export const selectRecentNPCInteractions = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return npcs.filter(npc => 
      npc.lastInteraction && new Date(npc.lastInteraction) > oneDayAgo
    );
  }
);

// NPCs grouped by faction
export const selectNPCsByFaction = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => {
    const result: Record<string, NPC[]> = {};
    
    npcs.forEach(npc => {
      const faction = npc.faction || 'Independent';
      if (!result[faction]) {
        result[faction] = [];
      }
      result[faction].push(npc);
    });
    
    return result;
  }
);

// Search and filter selectors
export const selectFilteredNPCs = createSelector(
  [
    selectDiscoveredNPCsList,
    (state: RootState, filters: {
      searchQuery?: string;
      location?: string;
      relationshipRange?: [number, number];
      faction?: string;
      hasQuests?: boolean;
      hasTraits?: boolean;
      canTrade?: boolean;
    }) => filters
  ],
  (npcs, filters) => {
    let filtered = [...npcs];
    
    // Search by name
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(npc => 
        npc.name.toLowerCase().includes(query) ||
        npc.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by location
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(npc => npc.location === filters.location);
    }
    
    // Filter by relationship range
    if (filters.relationshipRange) {
      const [min, max] = filters.relationshipRange;
      filtered = filtered.filter(npc => 
        npc.relationshipValue >= min && npc.relationshipValue <= max
      );
    }
    
    // Filter by faction
    if (filters.faction && filters.faction !== 'all') {
      filtered = filtered.filter(npc => npc.faction === filters.faction);
    }
    
    // Filter by quest availability
    if (filters.hasQuests) {
      filtered = filtered.filter(npc => npc.availableQuests.length > 0);
    }
    
    // Filter by trait availability
    if (filters.hasTraits) {
      filtered = filtered.filter(npc => npc.teachableTraits.length > 0);
    }
    
    // Filter by trading capability
    if (filters.canTrade) {
      filtered = filtered.filter(npc => npc.inventory && npc.inventory.items.length > 0);
    }
    
    return filtered;
  }
);

// Statistics selectors
export const selectNPCStatistics = createSelector(
  [selectDiscoveredNPCsList],
  (npcs) => {
    const total = npcs.length;
    const byTier = selectNPCsByRelationshipTier({ npcs: { npcs: {}, discoveredNPCs: npcs.map(n => n.id) } } as any);
    const withQuests = npcs.filter(npc => npc.availableQuests.length > 0).length;
    const withTraits = npcs.filter(npc => npc.teachableTraits.length > 0).length;
    const canTrade = npcs.filter(npc => npc.inventory?.items.length).length;
    
    const averageRelationship = total > 0 
      ? npcs.reduce((sum, npc) => sum + npc.relationshipValue, 0) / total 
      : 0;
    
    return {
      total,
      byTier,
      withQuests,
      withTraits,
      canTrade,
      averageRelationship: Math.round(averageRelationship * 100) / 100,
    };
  }
);

// Loading and error selectors
export const selectNPCLoading = (state: RootState) => state.npcs.loading;
export const selectNPCError = (state: RootState) => state.npcs.error;
