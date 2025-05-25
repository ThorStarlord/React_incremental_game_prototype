/**
 * @file NpcSelectors.ts
 * @description Memoized selectors for the NPC state management system
 * Provides comprehensive, type-safe access to NPC data with performance optimizations
 * and sophisticated filtering capabilities for UI components and game logic.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { 
  NPC, 
  NPCState, 
  NPCFilterCriteria, 
  NPCSortOptions, 
  RelationshipLevel 
} from './NPCTypes';

// ============================================================================
// CONSTANTS AND UTILITIES
// ============================================================================

/** Relationship thresholds for connection depth calculation */
const RELATIONSHIP_THRESHOLDS = {
  BELOVED: 90,
  TRUSTED: 75,
  ALLY: 50,
  FRIEND: 25,
  ACQUAINTANCE: 10,
  NEUTRAL: 0
} as const;

/**
 * Determines relationship tier from numerical value
 * @param relationshipValue - Numerical relationship value (0-100)
 * @returns Relationship tier name
 */
const getRelationshipTier = (relationshipValue: number): keyof typeof RELATIONSHIP_THRESHOLDS => {
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.BELOVED) return 'BELOVED';
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.TRUSTED) return 'TRUSTED';
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.ALLY) return 'ALLY';
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.FRIEND) return 'FRIEND';
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return 'ACQUAINTANCE';
  return 'NEUTRAL';
};

/**
 * Validates NPC ID format and existence preparation
 * @param npcId - NPC identifier to validate
 * @returns Boolean indicating if ID format is valid
 */
const isValidNPCId = (npcId: string): boolean => {
  return typeof npcId === 'string' && npcId.length > 0;
};

/**
 * Calculates time difference from last interaction
 * @param lastInteraction - Last interaction timestamp
 * @returns Hours since last interaction
 */
const getHoursSinceLastInteraction = (lastInteraction?: Date): number => {
  if (!lastInteraction) return Infinity;
  const now = new Date().getTime();
  const lastTime = new Date(lastInteraction).getTime();
  return (now - lastTime) / (1000 * 60 * 60);
};

// ============================================================================
// BASE SELECTORS
// ============================================================================

/**
 * Selects the entire NPC state slice
 * @param state - Root Redux state
 * @returns Complete NPC state object
 */
export const selectNPCState = (state: RootState): NPCState => state.npcs;

/**
 * Selects the NPCs record object
 * @param state - Root Redux state
 * @returns Record of all NPCs keyed by ID
 */
export const selectNPCsRecord = createSelector(
  [selectNPCState],
  (npcState) => npcState.npcs
);

/**
 * Selects all NPCs as an array
 * @param state - Root Redux state
 * @returns Array of all NPC objects
 */
export const selectAllNPCs = createSelector(
  [selectNPCsRecord],
  (npcs) => Object.values(npcs)
);

/**
 * Selects discovered NPC IDs array
 * @param state - Root Redux state
 * @returns Array of discovered NPC IDs
 */
export const selectDiscoveredNPCIds = createSelector(
  [selectNPCState],
  (npcState) => npcState.discoveredNPCs
);

/**
 * Selects current interaction data
 * @param state - Root Redux state
 * @returns Current NPC interaction object or null
 */
export const selectCurrentInteraction = createSelector(
  [selectNPCState],
  (npcState) => npcState.currentInteraction
);

/**
 * Selects dialogue history record
 * @param state - Root Redux state
 * @returns Record of dialogue history keyed by NPC ID
 */
export const selectDialogueHistory = createSelector(
  [selectNPCState],
  (npcState) => npcState.dialogueHistory
);

/**
 * Selects relationship changes array
 * @param state - Root Redux state
 * @returns Array of recent relationship changes
 */
export const selectRelationshipChanges = createSelector(
  [selectNPCState],
  (npcState) => npcState.relationshipChanges
);

/**
 * Selects NPC loading state
 * @param state - Root Redux state
 * @returns Boolean indicating if NPCs are loading
 */
export const selectNPCLoading = createSelector(
  [selectNPCState],
  (npcState) => npcState.loading
);

/**
 * Selects NPC error message
 * @param state - Root Redux state
 * @returns Error message string or null
 */
export const selectNPCError = createSelector(
  [selectNPCState],
  (npcState) => npcState.error
);

// ============================================================================
// INDIVIDUAL NPC SELECTORS
// ============================================================================

/**
 * Creates a selector for a specific NPC by ID
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns NPC object or null if not found
 */
export const selectNPCById = createSelector(
  [selectNPCsRecord, (_state: RootState, npcId: string) => npcId],
  (npcs, npcId) => {
    if (!isValidNPCId(npcId)) {
      console.warn(`Invalid NPC ID provided to selectNPCById: ${npcId}`);
      return null;
    }
    return npcs[npcId] || null;
  }
);

/**
 * Selects relationship value for a specific NPC
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns Relationship value (0-100) or 0 if NPC not found
 */
export const selectNPCRelationship = createSelector(
  [selectNPCById],
  (npc) => npc?.relationshipValue ?? 0
);

/**
 * Selects connection depth for a specific NPC
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns Connection depth level or 0 if NPC not found
 */
export const selectNPCConnectionDepth = createSelector(
  [selectNPCById],
  (npc) => npc?.connectionDepth ?? 0
);

/**
 * Selects loyalty level for a specific NPC
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns Loyalty value or 0 if NPC not found
 */
export const selectNPCLoyalty = createSelector(
  [selectNPCById],
  (npc) => npc?.loyalty ?? 0
);

/**
 * Selects availability status for a specific NPC
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns Boolean indicating if NPC is available for interaction
 */
export const selectNPCAvailability = createSelector(
  [selectNPCById],
  (npc) => npc?.isAvailable ?? false
);

/**
 * Selects comprehensive NPC interaction data
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns Object with relationship, loyalty, and availability data
 */
export const selectNPCInteractionData = createSelector(
  [selectNPCById],
  (npc) => ({
    relationship: npc?.relationshipValue ?? 0,
    connectionDepth: npc?.connectionDepth ?? 0,
    loyalty: npc?.loyalty ?? 0,
    isAvailable: npc?.isAvailable ?? false,
    status: npc?.status ?? 'unknown',
    lastInteraction: npc?.lastInteraction,
    hoursSinceLastInteraction: getHoursSinceLastInteraction(npc?.lastInteraction)
  })
);

// ============================================================================
// DISCOVERED NPCS SELECTORS
// ============================================================================

/**
 * Selects discovered NPCs as complete objects
 * @param state - Root Redux state
 * @returns Array of discovered NPC objects
 */
export const selectDiscoveredNPCs = createSelector(
  [selectNPCsRecord, selectDiscoveredNPCIds],
  (npcs, discoveredIds) => {
    return discoveredIds
      .map(id => npcs[id])
      .filter((npc): npc is NPC => Boolean(npc));
  }
);

/**
 * Selects count of discovered NPCs
 * @param state - Root Redux state
 * @returns Number of discovered NPCs
 */
export const selectDiscoveredNPCCount = createSelector(
  [selectDiscoveredNPCIds],
  (discoveredIds) => discoveredIds.length
);

/**
 * Checks if specific NPC is discovered
 * @param state - Root Redux state
 * @param npcId - NPC identifier
 * @returns Boolean indicating if NPC is discovered
 */
export const selectIsNPCDiscovered = createSelector(
  [selectDiscoveredNPCIds, (_state: RootState, npcId: string) => npcId],
  (discoveredIds, npcId) => discoveredIds.includes(npcId)
);

// ============================================================================
// LOCATION-BASED SELECTORS
// ============================================================================

/**
 * Selects NPCs by specific location
 * @param state - Root Redux state
 * @param location - Location name
 * @returns Array of NPCs at the specified location
 */
export const selectNPCsByLocation = createSelector(
  [selectDiscoveredNPCs, (_state: RootState, location: string) => location],
  (npcs, location) => npcs.filter(npc => npc.location === location)
);

/**
 * Selects all unique NPC locations
 * @param state - Root Redux state
 * @returns Array of unique location names
 */
export const selectAllNPCLocations = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const locations = npcs.map(npc => npc.location);
    return Array.from(new Set(locations)).sort();
  }
);

/**
 * Groups NPCs by location
 * @param state - Root Redux state
 * @returns Record of NPCs grouped by location
 */
export const selectNPCsByLocationGroups = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const groups: Record<string, NPC[]> = {};
    
    npcs.forEach(npc => {
      const location = npc.location;
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(npc);
    });
    
    return groups;
  }
);

// ============================================================================
// RELATIONSHIP-BASED SELECTORS
// ============================================================================

/**
 * Groups NPCs by relationship tier
 * @param state - Root Redux state
 * @returns Record of NPCs grouped by relationship level
 */
export const selectNPCsByRelationshipTier = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const groups: Record<string, NPC[]> = {
      BELOVED: [],
      TRUSTED: [],
      ALLY: [],
      FRIEND: [],
      ACQUAINTANCE: [],
      NEUTRAL: []
    };
    
    npcs.forEach(npc => {
      const tier = getRelationshipTier(npc.relationshipValue);
      groups[tier].push(npc);
    });
    
    return groups;
  }
);

/**
 * Selects NPCs with high relationships (25+)
 * @param state - Root Redux state
 * @returns Array of NPCs with relationship >= 25
 */
export const selectHighRelationshipNPCs = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => npc.relationshipValue >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE)
);

/**
 * Selects NPCs with maximum relationship (90+)
 * @param state - Root Redux state
 * @returns Array of NPCs with beloved relationship level
 */
export const selectMaxRelationshipNPCs = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => npc.relationshipValue >= RELATIONSHIP_THRESHOLDS.BELOVED)
);

/**
 * Calculates average relationship across all discovered NPCs
 * @param state - Root Redux state
 * @returns Average relationship value
 */
export const selectAverageRelationship = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    if (npcs.length === 0) return 0;
    const total = npcs.reduce((sum, npc) => sum + npc.relationshipValue, 0);
    return Math.round((total / npcs.length) * 100) / 100;
  }
);

// ============================================================================
// AVAILABILITY AND STATUS SELECTORS
// ============================================================================

/**
 * Selects available NPCs (discovered and currently available)
 * @param state - Root Redux state
 * @returns Array of available NPCs
 */
export const selectAvailableNPCs = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => npc.isAvailable)
);

/**
 * Groups NPCs by availability status
 * @param state - Root Redux state
 * @returns Record with available and unavailable NPC arrays
 */
export const selectNPCsByAvailability = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => ({
    available: npcs.filter(npc => npc.isAvailable),
    unavailable: npcs.filter(npc => !npc.isAvailable)
  })
);

/**
 * Groups NPCs by status
 * @param state - Root Redux state
 * @returns Record of NPCs grouped by status
 */
export const selectNPCsByStatus = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const groups: Record<string, NPC[]> = {};
    
    npcs.forEach(npc => {
      const status = npc.status || 'unknown';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(npc);
    });
    
    return groups;
  }
);

// ============================================================================
// INTERACTION CAPABILITY SELECTORS
// ============================================================================

/**
 * Selects NPCs with available quests
 * @param state - Root Redux state
 * @returns Array of NPCs with quests available
 */
export const selectNPCsWithQuests = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => npc.availableQuests && npc.availableQuests.length > 0)
);

/**
 * Selects NPCs with teachable traits
 * @param state - Root Redux state
 * @returns Array of NPCs with traits the player can learn
 */
export const selectNPCsWithTraits = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => {
    const hasTraits = Object.keys(npc.traits || {}).length > 0;
    const hasTeachableTraits = npc.teachableTraits && npc.teachableTraits.length > 0;
    return hasTraits || hasTeachableTraits;
  })
);

/**
 * Selects NPCs with trading capabilities
 * @param state - Root Redux state
 * @returns Array of NPCs that can trade
 */
export const selectTradingNPCs = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => 
    npc.inventory && 
    npc.inventory.items && 
    npc.inventory.items.length > 0
  )
);

/**
 * Selects NPCs with available services
 * @param state - Root Redux state
 * @returns Array of NPCs offering services
 */
export const selectServiceNPCs = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => npcs.filter(npc => 
    npc.services && 
    npc.services.length > 0
  )
);

// ============================================================================
// RECENT ACTIVITY SELECTORS
// ============================================================================

/**
 * Selects NPCs with recent interactions (last 24 hours)
 * @param state - Root Redux state
 * @returns Array of recently interacted NPCs
 */
export const selectRecentlyInteractedNPCs = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return npcs.filter(npc => 
      npc.lastInteraction && 
      new Date(npc.lastInteraction) > twentyFourHoursAgo
    );
  }
);

/**
 * Selects recent relationship changes (last 10)
 * @param state - Root Redux state
 * @returns Array of recent relationship changes
 */
export const selectRecentRelationshipChanges = createSelector(
  [selectRelationshipChanges],
  (changes) => changes.slice(-10).reverse() // Most recent first
);

// ============================================================================
// FACTION-BASED SELECTORS
// ============================================================================

/**
 * Groups NPCs by faction
 * @param state - Root Redux state
 * @returns Record of NPCs grouped by faction
 */
export const selectNPCsByFaction = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const groups: Record<string, NPC[]> = {};
    
    npcs.forEach(npc => {
      const faction = npc.faction || 'Independent';
      if (!groups[faction]) {
        groups[faction] = [];
      }
      groups[faction].push(npc);
    });
    
    return groups;
  }
);

/**
 * Selects all unique factions
 * @param state - Root Redux state
 * @returns Array of unique faction names
 */
export const selectAllFactions = createSelector(
  [selectDiscoveredNPCs],
  (npcs) => {
    const factions = npcs.map(npc => npc.faction || 'Independent');
    return Array.from(new Set(factions)).sort();
  }
);

// ============================================================================
// ADVANCED FILTERING SELECTORS
// ============================================================================

/**
 * Advanced NPC filtering selector with multiple criteria
 * @param state - Root Redux state
 * @param filters - Filter criteria object
 * @returns Array of NPCs matching all filter criteria
 */
export const selectFilteredNPCs = createSelector(
  [
    selectDiscoveredNPCs,
    (_state: RootState, filters: NPCFilterCriteria) => filters
  ],
  (npcs, filters) => {
    let filtered = [...npcs];
    
    // Search by name or description
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(npc => 
        npc.name.toLowerCase().includes(query) ||
        (npc.description && npc.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by location
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(npc => npc.location === filters.location);
    }
    
    // Filter by relationship range
    if (filters.minRelationship !== undefined) {
      filtered = filtered.filter(npc => npc.relationshipValue >= filters.minRelationship!);
    }
    if (filters.maxRelationship !== undefined) {
      filtered = filtered.filter(npc => npc.relationshipValue <= filters.maxRelationship!);
    }
    
    // Filter by faction
    if (filters.faction && filters.faction !== 'all') {
      filtered = filtered.filter(npc => npc.faction === filters.faction);
    }
    
    // Filter by capability flags
    if (filters.hasQuests) {
      filtered = filtered.filter(npc => 
        npc.availableQuests && npc.availableQuests.length > 0
      );
    }
    
    if (filters.hasTraits) {
      filtered = filtered.filter(npc => 
        Object.keys(npc.traits || {}).length > 0 ||
        (npc.teachableTraits && npc.teachableTraits.length > 0)
      );
    }
    
    if (filters.isAvailable !== undefined) {
      filtered = filtered.filter(npc => npc.isAvailable === filters.isAvailable);
    }
    
    // Filter by tags (if implemented)
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(npc => {
        // This would require implementing a tags system on NPCs
        // For now, we'll skip this filter
        return true;
      });
    }
    
    return filtered;
  }
);

/**
 * Sorted NPC selector with configurable sort options
 * @param state - Root Redux state
 * @param npcs - NPCs to sort
 * @param sortOptions - Sort configuration
 * @returns Sorted array of NPCs
 */
export const selectSortedNPCs = createSelector(
  [
    (_state: RootState, npcs: NPC[]) => npcs,
    (_state: RootState, _npcs: NPC[], sortOptions: NPCSortOptions) => sortOptions
  ],
  (npcs, sortOptions) => {
    const sorted = [...npcs].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'relationshipValue':
          aValue = a.relationshipValue;
          bValue = b.relationshipValue;
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'lastInteraction':
          aValue = a.lastInteraction ? new Date(a.lastInteraction).getTime() : 0;
          bValue = b.lastInteraction ? new Date(b.lastInteraction).getTime() : 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }
);

// ============================================================================
// STATISTICS AND ANALYTICS SELECTORS
// ============================================================================

/**
 * Comprehensive NPC statistics selector
 * @param state - Root Redux state
 * @returns Object with various NPC statistics
 */
export const selectNPCStatistics = createSelector(
  [
    selectDiscoveredNPCs,
    selectNPCsByRelationshipTier,
    selectNPCsWithQuests,
    selectNPCsWithTraits,
    selectTradingNPCs,
    selectAverageRelationship,
    selectMaxRelationshipNPCs
  ],
  (
    allNPCs,
    byTier,
    withQuests,
    withTraits,
    canTrade,
    averageRelationship,
    maxRelationshipNPCs
  ) => ({
    total: allNPCs.length,
    byRelationshipTier: Object.entries(byTier).reduce((acc, [tier, npcs]) => {
      acc[tier] = npcs.length;
      return acc;
    }, {} as Record<string, number>),
    withQuests: withQuests.length,
    withTraits: withTraits.length,
    canTrade: canTrade.length,
    averageRelationship,
    atMaxRelationship: maxRelationshipNPCs.length,
    relationshipDistribution: allNPCs.reduce((acc, npc) => {
      const bucket = Math.floor(npc.relationshipValue / 10) * 10;
      const key = `${bucket}-${bucket + 9}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  })
);

/**
 * NPC interaction statistics
 * @param state - Root Redux state
 * @returns Object with interaction-related statistics
 */
export const selectNPCInteractionStats = createSelector(
  [selectDiscoveredNPCs, selectRelationshipChanges],
  (npcs, relationshipChanges) => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentInteractions = npcs.filter(npc => 
      npc.lastInteraction && new Date(npc.lastInteraction) > oneDayAgo
    ).length;
    
    const weeklyInteractions = npcs.filter(npc => 
      npc.lastInteraction && new Date(npc.lastInteraction) > oneWeekAgo
    ).length;
    
    const recentChanges = relationshipChanges.filter(change => 
      new Date(change.timestamp) > oneDayAgo
    ).length;
    
    return {
      totalNPCs: npcs.length,
      recentInteractions: recentInteractions,
      weeklyInteractions: weeklyInteractions,
      recentRelationshipChanges: recentChanges,
      neverInteracted: npcs.filter(npc => !npc.lastInteraction).length
    };
  }
);

// ============================================================================
// ESSENCE GENERATION SELECTORS (Future Integration)
// ============================================================================

/**
 * Selects NPCs contributing to essence generation
 * @param state - Root Redux state
 * @returns Array of NPCs that contribute to essence generation
 */
export const selectEssenceGeneratingNPCs = createSelector(
  [selectHighRelationshipNPCs],
  (highRelationshipNPCs) => {
    // Filter for NPCs that actually contribute to essence generation
    return highRelationshipNPCs.filter(npc => 
      npc.connectionDepth && npc.connectionDepth > 0
    );
  }
);

/**
 * Calculates total essence generation rate from NPCs
 * @param state - Root Redux state
 * @returns Total essence generation rate per second
 */
export const selectTotalEssenceGeneration = createSelector(
  [selectEssenceGeneratingNPCs],
  (generatingNPCs) => {
    // This would integrate with the essence system
    // For now, return a placeholder calculation
    return generatingNPCs.reduce((total, npc) => {
      const baseRate = npc.connectionDepth * 0.1;
      const relationshipMultiplier = npc.relationshipValue / 100;
      return total + (baseRate * relationshipMultiplier);
    }, 0);
  }
);
