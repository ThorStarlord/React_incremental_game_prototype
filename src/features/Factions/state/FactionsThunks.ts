/**
 * Redux Thunks for Faction-related async operations
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { 
  addNotification 
} from '../../Notifications/state/NotificationsSlice';
import {
  ChangeReputationPayload,
  CompleteQuestPayload,
  ApplyForMembershipPayload,
  DiscoverFactionPayload,
  UnlockPerkPayload,
  FactionStanding,
  MembershipStatus
} from './FactionsTypes';

/**
 * Change player's reputation with a faction
 */
export const changeReputation = createAsyncThunk<
  ChangeReputationPayload,
  ChangeReputationPayload,
  { state: RootState }
>(
  'factions/changeReputation',
  async (payload, { getState, dispatch }) => {
    const { factionId, amount, reason, silent } = payload;
    const state = getState();
    
    // Get the faction name for notification
    const factionName = state.factions.factions[factionId]?.name || 'Unknown Faction';
    
    // Add notification if not silent
    if (!silent && amount !== 0) {
      const reputationChange = amount > 0 ? `Gained ${amount}` : `Lost ${Math.abs(amount)}`;
      
      dispatch(addNotification(
        `${reputationChange} reputation with ${factionName}`,
        amount > 0 ? 'success' : 'warning',
        {
          duration: 5000,
          category: 'faction_reputation'
        }
      ));
    }
    
    return payload;
  }
);

/**
 * Complete a faction quest
 */
export const completeQuest = createAsyncThunk<
  { questId: string; factionId: string; rewards: any },
  CompleteQuestPayload,
  { state: RootState }
>(
  'factions/completeQuest',
  async (payload, { getState, dispatch }) => {
    const { questId, factionId } = payload;
    const state = getState();
    
    // Get quest details
    const quest = state.factions.factionQuests[questId];
    if (!quest) {
      throw new Error(`Quest ${questId} not found`);
    }
    
    // Award reputation for quest
    await dispatch(changeReputation({
      factionId,
      amount: quest.reputationReward,
      reason: `Completed quest: ${quest.name}`
    }));
    
    // Process other rewards here
    const rewards = quest.rewards || [];
    
    // Create a summary of rewards for notification
    const rewardSummary = [
      `${quest.reputationReward} Reputation with ${state.factions.factions[factionId]?.name || 'Unknown Faction'}`
    ];
    
    // Process each reward
    rewards.forEach(reward => {
      switch (reward.type) {
        case 'gold':
          // Add gold to player
          dispatch({
            type: 'player/addGold',
            payload: reward.amount || 0
          });
          rewardSummary.push(`${reward.amount} Gold`);
          break;
          
        case 'item':
          // Add item to player inventory
          dispatch({
            type: 'inventory/addItem',
            payload: {
              itemId: reward.id,
              quantity: reward.amount || 1
            }
          });
          rewardSummary.push(`${reward.amount || 1}x ${reward.name || reward.id}`);
          break;
          
        case 'experience':
          // Add experience to player
          dispatch({
            type: 'player/addExperience',
            payload: reward.amount || 0
          });
          rewardSummary.push(`${reward.amount} Experience`);
          break;
      }
    });
    
    // Show a notification with quest completion
    dispatch(addNotification(
      `Quest Completed: ${quest.name}`,
      'success',
      {
        duration: 5000,
        category: 'faction_quest',
        description: `Rewards: ${rewardSummary.join(', ')}`
      }
    ));
    
    return { 
      questId, 
      factionId,
      rewards: quest.rewards 
    };
  }
);

/**
 * Apply for membership in a faction
 */
export const applyForMembership = createAsyncThunk<
  { factionId: string; success: boolean; message: string },
  ApplyForMembershipPayload,
  { state: RootState }
>(
  'factions/applyForMembership',
  async (payload, { getState, dispatch }) => {
    const { factionId } = payload;
    const state = getState();
    
    // Get faction details
    const faction = state.factions.factions[factionId];
    if (!faction) {
      return {
        factionId,
        success: false,
        message: 'Faction not found'
      };
    }
    
    // Get player's standing with the faction
    const playerStanding = state.factions.playerStandings.find(s => s.factionId === factionId);
    if (!playerStanding) {
      return {
        factionId,
        success: false,
        message: 'No standing with this faction'
      };
    }
    
    // Check if already a member
    if (playerStanding.membershipStatus !== MembershipStatus.NonMember) {
      return {
        factionId,
        success: false,
        message: `You are already a ${playerStanding.membershipStatus} of this faction`
      };
    }
    
    // Check reputation requirements
    const requiredReputation = faction.membershipRequirements?.reputation || 0;
    if (playerStanding.reputation < requiredReputation) {
      return {
        factionId,
        success: false,
        message: `You need at least ${requiredReputation} reputation with ${faction.name}`
      };
    }
    
    // Check level requirements
    const requiredLevel = faction.membershipRequirements?.level || 1;
    const playerLevel = state.player.level || 1;
    if (playerLevel < requiredLevel) {
      return {
        factionId,
        success: false,
        message: `You need to be at least level ${requiredLevel}`
      };
    }
    
    // Check quest requirements
    const requiredQuests = faction.membershipRequirements?.quests || [];
    if (requiredQuests.length > 0) {
      const completedRequiredQuests = requiredQuests.every(questId => 
        playerStanding.completedQuests.includes(questId)
      );
      
      if (!completedRequiredQuests) {
        return {
          factionId,
          success: false,
          message: `You need to complete all required quests first`
        };
      }
    }
    
    // All checks passed, allow the player to join
    dispatch(addNotification(
      `Membership Application Accepted: ${faction.name}`,
      'success',
      {
        duration: 5000,
        category: 'faction_membership'
      }
    ));
    
    return {
      factionId,
      success: true,
      message: `Your application to join ${faction.name} has been accepted!`
    };
  }
);

/**
 * Discover a new faction
 */
export const discoverFaction = createAsyncThunk<
  { factionId: string },
  DiscoverFactionPayload,
  { state: RootState }
>(
  'factions/discoverFaction',
  async (payload, { getState, dispatch }) => {
    const { factionId } = payload;
    const state = getState();
    
    // Get faction details
    const faction = state.factions.factions[factionId];
    if (!faction) {
      throw new Error(`Faction ${factionId} not found`);
    }
    
    // Notify player about the discovery
    dispatch(addNotification(
      `New Faction Discovered: ${faction.name}`,
      'info',
      {
        duration: 5000,
        category: 'faction_discovery',
        description: faction.description
      }
    ));
    
    return { factionId };
  }
);

/**
 * Unlock a faction perk
 */
export const unlockPerk = createAsyncThunk<
  { perkId: string; factionId: string; success: boolean; message: string },
  UnlockPerkPayload,
  { state: RootState }
>(
  'factions/unlockPerk',
  async (payload, { getState, dispatch }) => {
    const { perkId, factionId } = payload;
    const state = getState();
    
    // Get perk details
    const perk = state.factions.factionPerks[perkId];
    if (!perk) {
      return {
        perkId,
        factionId,
        success: false,
        message: 'Perk not found'
      };
    }
    
    // Get player's standing with the faction
    const playerStanding = state.factions.playerStandings.find(s => s.factionId === factionId);
    if (!playerStanding) {
      return {
        perkId,
        factionId,
        success: false,
        message: 'No standing with this faction'
      };
    }
    
    // Check if already unlocked
    if (playerStanding.unlockedPerks.includes(perkId)) {
      return {
        perkId,
        factionId,
        success: false,
        message: 'Perk already unlocked'
      };
    }
    
    // Check standing requirements
    if (standingValue(playerStanding.standing) < standingValue(perk.requiredStanding)) {
      return {
        perkId,
        factionId,
        success: false,
        message: `You need ${perk.requiredStanding} standing with this faction`
      };
    }
    
    // Check membership requirements
    if (perk.requiredMembership && 
        membershipValue(playerStanding.membershipStatus) < membershipValue(perk.requiredMembership)) {
      return {
        perkId,
        factionId,
        success: false,
        message: `You need to be a ${perk.requiredMembership} of this faction`
      };
    }
    
    // All checks passed, unlock the perk
    dispatch({
      type: 'factions/updatePlayerStanding',
      payload: {
        factionId,
        unlockedPerks: [...playerStanding.unlockedPerks, perkId]
      }
    });
    
    // Apply perk effects
    perk.effects.forEach(effect => {
      // Process different effect types
      switch (effect.type) {
        case 'multiplier':
          // Handle multiplier effects
          break;
        
        case 'discount':
          // Handle discount effects
          break;
        
        case 'unlock':
          // Handle unlock effects
          break;
        
        default:
          // Unknown effect
          break;
      }
    });
    
    // Notify player
    const faction = state.factions.factions[factionId];
    dispatch(addNotification(
      `Faction Perk Unlocked: ${perk.name}`,
      'success',
      {
        duration: 5000,
        category: 'faction_perk',
        description: `New perk unlocked from ${faction?.name || 'Unknown Faction'}: ${perk.description}`
      }
    ));
    
    return {
      perkId,
      factionId,
      success: true,
      message: `You've unlocked the ${perk.name} perk!`
    };
  }
);

/**
 * Helper functions to convert enums to numeric values for comparisons
 */
function standingValue(standing: FactionStanding): number {
  const values: Record<FactionStanding, number> = {
    [FactionStanding.Hated]: 0,
    [FactionStanding.Hostile]: 1,
    [FactionStanding.Unfriendly]: 2,
    [FactionStanding.Neutral]: 3,
    [FactionStanding.Friendly]: 4,
    [FactionStanding.Honored]: 5,
    [FactionStanding.Exalted]: 6,
    [FactionStanding.Revered]: 7
  };
  return values[standing] || 0;
}

function membershipValue(membership: MembershipStatus): number {
  const values: Record<MembershipStatus, number> = {
    [MembershipStatus.NonMember]: 0,
    [MembershipStatus.Applicant]: 1,
    [MembershipStatus.Initiate]: 2,
    [MembershipStatus.Member]: 3,
    [MembershipStatus.Trusted]: 4,
    [MembershipStatus.Officer]: 5,
    [MembershipStatus.Leader]: 6
  };
  return values[membership] || 0;
}
