/**
 * Redux slice for Factions state management
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FactionsState,
  Faction,
  FactionStanding,
  MembershipStatus,
  PlayerFactionStanding,
  ChangeReputationPayload,
  CompleteQuestPayload,
  ApplyForMembershipPayload,
  DiscoverFactionPayload,
  UnlockPerkPayload,
  FactionHistoryEntry,
  FactionNotification
} from './FactionsTypes';
import { 
  changeReputation, 
  completeQuest, 
  applyForMembership, 
  discoverFaction 
} from './FactionsThunks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Initial state for factions
 */
const initialState: FactionsState = {
  factions: {},
  relationships: {},
  playerStandings: [],
  discoveredFactions: [],
  activeMemberships: [],
  factionQuests: {},
  factionPerks: {},
  notifications: [],
  displayedNotifications: [],
  selectedFaction: null,
  loading: false
};

/**
 * Utility to create a notification
 */
const createNotification = (
  factionId: string,
  title: string,
  message: string,
  type: 'reputation' | 'quest' | 'membership' | 'other' = 'other'
): FactionNotification => ({
  id: uuidv4(),
  factionId,
  title,
  message,
  type,
  timestamp: Date.now(),
  read: false
});

/**
 * Create a history entry for faction reputation changes
 */
const createHistoryEntry = (
  action: string,
  reputationChange: number,
  description: string
): FactionHistoryEntry => ({
  date: Date.now(),
  action,
  reputationChange,
  description
});

/**
 * Calculate faction standing based on reputation
 */
const calculateStanding = (reputation: number): FactionStanding => {
  if (reputation >= 10000) return FactionStanding.Revered;
  if (reputation >= 8000) return FactionStanding.Exalted;
  if (reputation >= 6000) return FactionStanding.Honored;
  if (reputation >= 3000) return FactionStanding.Friendly;
  if (reputation >= 0) return FactionStanding.Neutral;
  if (reputation >= -3000) return FactionStanding.Unfriendly;
  if (reputation >= -6000) return FactionStanding.Hostile;
  return FactionStanding.Hated;
};

/**
 * Calculate next reputation level threshold
 */
const calculateNextLevelThreshold = (reputation: number): number => {
  if (reputation < 0) return 0;
  if (reputation < 3000) return 3000;
  if (reputation < 6000) return 6000;
  if (reputation < 8000) return 8000;
  if (reputation < 10000) return 10000;
  return reputation; // Already at max
};

/**
 * Factions slice
 */
const factionsSlice = createSlice({
  name: 'factions',
  initialState,
  reducers: {
    /**
     * Initialize factions from context
     */
    initializeFactions(state, action: PayloadAction<FactionsState>) {
      return {
        ...state,
        ...action.payload
      };
    },
    
    /**
     * Set all faction data
     */
    setFactions(state, action: PayloadAction<Record<string, Faction>>) {
      state.factions = action.payload;
    },
    
    /**
     * Update a single faction
     */
    updateFaction(state, action: PayloadAction<Faction>) {
      const { id } = action.payload;
      state.factions[id] = {
        ...state.factions[id],
        ...action.payload
      };
    },
    
    /**
     * Update player standing with a faction
     */
    updatePlayerStanding(state, action: PayloadAction<Partial<PlayerFactionStanding> & { factionId: string }>) {
      const { factionId, ...updates } = action.payload;
      const standingIndex = state.playerStandings.findIndex(s => s.factionId === factionId);
      
      if (standingIndex !== -1) {
        state.playerStandings[standingIndex] = {
          ...state.playerStandings[standingIndex],
          ...updates
        };
      } else {
        state.playerStandings.push({
          factionId,
          standing: FactionStanding.Neutral,
          reputation: 0,
          reputationNextLevel: 3000,
          membershipStatus: MembershipStatus.NonMember,
          completedQuests: [],
          availableQuests: [],
          unlockedPerks: [],
          history: [],
          ...updates
        });
      }
    },
    
    /**
     * Select a faction for UI focus
     */
    selectFaction(state, action: PayloadAction<string | null>) {
      state.selectedFaction = action.payload;
    },
    
    /**
     * Mark notification as read
     */
    markNotificationRead(state, action: PayloadAction<string>) {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].read = true;
      }
    },
    
    /**
     * Mark all notifications as read
     */
    markAllNotificationsRead(state) {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
    },
    
    /**
     * Add a notification to displayed list
     */
    addDisplayedNotification(state, action: PayloadAction<string>) {
      if (!state.displayedNotifications.includes(action.payload)) {
        state.displayedNotifications.push(action.payload);
      }
    },
    
    /**
     * Reset a faction relationship
     */
    resetFactionRelationship(state, action: PayloadAction<{ factionId1: string; factionId2: string }>) {
      const { factionId1, factionId2 } = action.payload;
      
      // Update first faction's relationships
      if (state.relationships[factionId1]) {
        const relationshipIndex = state.relationships[factionId1].findIndex(r => r.factionId === factionId2);
        if (relationshipIndex !== -1) {
          state.relationships[factionId1][relationshipIndex].standing = FactionStanding.Neutral;
        }
      }
      
      // Update second faction's relationships
      if (state.relationships[factionId2]) {
        const relationshipIndex = state.relationships[factionId2].findIndex(r => r.factionId === factionId1);
        if (relationshipIndex !== -1) {
          state.relationships[factionId2][relationshipIndex].standing = FactionStanding.Neutral;
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Handle changeReputation thunk
    builder.addCase(changeReputation.fulfilled, (state, action) => {
      const { factionId, amount, reason } = action.payload;
      const standingIndex = state.playerStandings.findIndex(s => s.factionId === factionId);
      
      if (standingIndex !== -1) {
        // Update reputation
        const newReputation = state.playerStandings[standingIndex].reputation + amount;
        
        // Update faction standing based on new reputation
        const newStanding = calculateStanding(newReputation);
        const previousStanding = state.playerStandings[standingIndex].standing;
        
        // Update standing record
        state.playerStandings[standingIndex] = {
          ...state.playerStandings[standingIndex],
          reputation: newReputation,
          standing: newStanding,
          reputationNextLevel: calculateNextLevelThreshold(newReputation),
          history: [
            createHistoryEntry(reason, amount, reason),
            ...state.playerStandings[standingIndex].history
          ]
        };
        
        // If standing changed, create a notification
        if (newStanding !== previousStanding) {
          const faction = state.factions[factionId];
          const notificationId = uuidv4();
          
          state.notifications.push(createNotification(
            factionId,
            `${faction.name} Standing Change`,
            `Your standing with ${faction.name} has changed to ${newStanding}.`,
            'reputation'
          ));
        }
      }
    });
    
    // Handle completeQuest thunk
    builder.addCase(completeQuest.fulfilled, (state, action) => {
      const { questId, factionId, rewards } = action.payload;
      const standingIndex = state.playerStandings.findIndex(s => s.factionId === factionId);
      
      if (standingIndex !== -1) {
        // Add quest to completed quests
        if (!state.playerStandings[standingIndex].completedQuests.includes(questId)) {
          state.playerStandings[standingIndex].completedQuests.push(questId);
        }
        
        // Remove quest from available quests
        state.playerStandings[standingIndex].availableQuests = 
          state.playerStandings[standingIndex].availableQuests.filter(q => q !== questId);
        
        // Add notification
        const faction = state.factions[factionId];
        const quest = state.factionQuests[questId];
        
        state.notifications.push(createNotification(
          factionId,
          `Quest Completed`,
          `You've completed the quest "${quest.name}" for ${faction.name}.`,
          'quest'
        ));
      }
    });
    
    // Handle applying for membership
    builder.addCase(applyForMembership.fulfilled, (state, action) => {
      const { factionId, success, message } = action.payload;
      const standingIndex = state.playerStandings.findIndex(s => s.factionId === factionId);
      
      if (standingIndex !== -1 && success) {
        // Update membership status
        state.playerStandings[standingIndex].membershipStatus = MembershipStatus.Applicant;
        
        // Add to active memberships if not already there
        if (!state.activeMemberships.includes(factionId)) {
          state.activeMemberships.push(factionId);
        }
        
        // Add notification
        const faction = state.factions[factionId];
        state.notifications.push(createNotification(
          factionId,
          `Membership Application`,
          message || `You've applied for membership with ${faction.name}.`,
          'membership'
        ));
      }
    });
    
    // Handle discovering a faction
    builder.addCase(discoverFaction.fulfilled, (state, action) => {
      const { factionId } = action.payload;
      
      // Add faction to discovered factions if not already there
      if (!state.discoveredFactions.includes(factionId)) {
        state.discoveredFactions.push(factionId);
        
        // Initialize player standing with this faction
        if (!state.playerStandings.some(s => s.factionId === factionId)) {
          state.playerStandings.push({
            factionId,
            standing: FactionStanding.Neutral,
            reputation: 0,
            reputationNextLevel: 3000,
            membershipStatus: MembershipStatus.NonMember,
            completedQuests: [],
            availableQuests: [],
            unlockedPerks: [],
            history: []
          });
        }
        
        // Add notification
        const faction = state.factions[factionId];
        state.notifications.push(createNotification(
          factionId,
          `New Faction Discovered`,
          `You've discovered ${faction.name}!`,
          'other'
        ));
      }
    });
  }
});

// Export actions
export const { 
  initializeFactions,
  setFactions,
  updateFaction,
  updatePlayerStanding,
  selectFaction,
  markNotificationRead,
  markAllNotificationsRead,
  addDisplayedNotification,
  resetFactionRelationship
} = factionsSlice.actions;

// Export the reducer
export default factionsSlice.reducer;
