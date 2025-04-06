/**
 * Redux selectors for Factions state
 */
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { FactionsState, Faction, PlayerFactionStanding, FactionStanding, MembershipStatus } from './FactionsTypes';

// Basic selectors
export const selectFactionsState = (state: RootState) => state.factions;
export const selectAllFactions = (state: RootState) => state.factions.factions;
export const selectSelectedFactionId = (state: RootState) => state.factions.selectedFaction;
export const selectDiscoveredFactions = (state: RootState) => state.factions.discoveredFactions;
export const selectActiveMemberships = (state: RootState) => state.factions.activeMemberships;
export const selectPlayerStandings = (state: RootState) => state.factions.playerStandings;
export const selectFactionRelationships = (state: RootState) => state.factions.relationships;
export const selectFactionNotifications = (state: RootState) => state.factions.notifications;
export const selectFactionQuests = (state: RootState) => state.factions.factionQuests;
export const selectFactionPerks = (state: RootState) => state.factions.factionPerks;

// Individual faction selectors
export const selectFactionById = (factionId: string) => 
  (state: RootState) => state.factions.factions[factionId];

export const selectSelectedFaction = createSelector(
  [selectAllFactions, selectSelectedFactionId],
  (factions, selectedId) => selectedId ? factions[selectedId] : null
);

export const selectPlayerStandingWithFaction = (factionId: string) => 
  createSelector(
    [selectPlayerStandings],
    (standings) => standings.find(standing => standing.factionId === factionId)
  );

export const selectFactionRelationshipWithFaction = (factionId1: string, factionId2: string) => 
  createSelector(
    [selectFactionRelationships],
    (relationships) => {
      const relation = relationships[factionId1]?.find(rel => rel.factionId === factionId2);
      return relation?.standing || FactionStanding.Neutral;
    }
  );

// Collection-based selectors
export const selectVisibleFactions = createSelector(
  [selectAllFactions, selectDiscoveredFactions],
  (factions, discoveredIds) => {
    const result: Record<string, Faction> = {};
    discoveredIds.forEach(id => {
      if (factions[id]) {
        result[id] = factions[id];
      }
    });
    return result;
  }
);

export const selectVisibleFactionsArray = createSelector(
  [selectVisibleFactions],
  (factions) => Object.values(factions)
);

export const selectFactionsWithMembership = createSelector(
  [selectAllFactions, selectActiveMemberships],
  (factions, membershipIds) => {
    const result: Record<string, Faction> = {};
    membershipIds.forEach(id => {
      if (factions[id]) {
        result[id] = factions[id];
      }
    });
    return result;
  }
);

export const selectJoinableFactions = createSelector(
  [selectVisibleFactionsArray],
  (factions) => factions.filter(faction => faction.joinable)
);

export const selectUnreadNotifications = createSelector(
  [selectFactionNotifications],
  (notifications) => notifications.filter(notification => !notification.read)
);

export const selectUnreadNotificationCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications) => unreadNotifications.length
);

export const selectFactionsByType = (factionType: string) => 
  createSelector(
    [selectVisibleFactionsArray],
    (factions) => factions.filter(faction => faction.type === factionType)
  );

export const selectPlayerReputation = (factionId: string) => 
  createSelector(
    [selectPlayerStandingWithFaction(factionId)],
    (standing) => standing?.reputation || 0
  );

export const selectPlayerStandingLevel = (factionId: string) => 
  createSelector(
    [selectPlayerStandingWithFaction(factionId)],
    (standing) => standing?.standing || FactionStanding.Neutral
  );

export const selectPlayerMembershipStatus = (factionId: string) => 
  createSelector(
    [selectPlayerStandingWithFaction(factionId)],
    (standing) => standing?.membershipStatus || MembershipStatus.NonMember
  );

export const selectFactionQuestsByFaction = (factionId: string) => 
  createSelector(
    [selectFactionQuests],
    (quests) => Object.values(quests).filter(quest => quest.factionId === factionId)
  );

export const selectFactionPerksByFaction = (factionId: string) => 
  createSelector(
    [selectFactionPerks],
    (perks) => Object.values(perks).filter(perk => perk.factionId === factionId)
  );

export const selectAvailableFactionQuests = (factionId: string) => 
  createSelector(
    [selectPlayerStandingWithFaction(factionId), selectFactionQuestsByFaction(factionId)],
    (standing, quests) => {
      if (!standing) return [];
      
      return quests.filter(quest => 
        (standing.availableQuests.includes(quest.id) || 
        (quest.repeatable && standing.completedQuests.includes(quest.id))) &&
        satisfiesRequirements(standing.standing, standing.membershipStatus, quest.requiredStanding, quest.requiredMembership)
      );
    }
  );

export const selectCompletedFactionQuests = (factionId: string) => 
  createSelector(
    [selectPlayerStandingWithFaction(factionId), selectFactionQuestsByFaction(factionId)],
    (standing, quests) => {
      if (!standing) return [];
      return quests.filter(quest => standing.completedQuests.includes(quest.id));
    }
  );

export const selectUnlockedFactionPerks = (factionId: string) => 
  createSelector(
    [selectPlayerStandingWithFaction(factionId), selectFactionPerksByFaction(factionId)],
    (standing, perks) => {
      if (!standing) return [];
      return perks.filter(perk => standing.unlockedPerks.includes(perk.id));
    }
  );

// Helper function to check if player standing/membership satisfies requirements
function satisfiesRequirements(
  playerStanding: FactionStanding,
  playerMembership: MembershipStatus,
  requiredStanding: FactionStanding,
  requiredMembership?: MembershipStatus
): boolean {
  const standingValues: Record<FactionStanding, number> = {
    [FactionStanding.Hated]: 0,
    [FactionStanding.Hostile]: 1,
    [FactionStanding.Unfriendly]: 2,
    [FactionStanding.Neutral]: 3,
    [FactionStanding.Friendly]: 4,
    [FactionStanding.Honored]: 5,
    [FactionStanding.Exalted]: 6,
    [FactionStanding.Revered]: 7
  };

  const membershipValues: Record<MembershipStatus, number> = {
    [MembershipStatus.NonMember]: 0,
    [MembershipStatus.Applicant]: 1,
    [MembershipStatus.Initiate]: 2,
    [MembershipStatus.Member]: 3,
    [MembershipStatus.Trusted]: 4,
    [MembershipStatus.Officer]: 5,
    [MembershipStatus.Leader]: 6
  };

  // Check standing requirements
  const hasStanding = standingValues[playerStanding] >= standingValues[requiredStanding];
  
  // Check membership requirements if specified
  const hasMembership = !requiredMembership || 
    membershipValues[playerMembership] >= membershipValues[requiredMembership];
  
  return hasStanding && hasMembership;
}
