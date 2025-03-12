/**
 * @file factionsInitialState.ts
 * @description Defines the initial state for all factions in the game.
 * 
 * Factions represent different groups in the game world that the player can interact with.
 * Players can gain or lose reputation with factions through various actions such as:
 * - Completing faction-specific quests
 * - Donating valuable items
 * - Defeating enemies associated with the faction or rival factions
 * - Making choices in dialogues and events
 * 
 * Each faction has reputation tiers that unlock various benefits as the player progresses:
 * - Access to unique vendors and merchandise
 * - Special quests and storylines
 * - Unique abilities or bonuses
 * - Access to restricted areas
 * - Discounts on goods and services
 */

/**
 * Interface for reputation tier
 */
export interface ReputationTier {
  name: string;
  threshold: number;
  benefits: string[];
}

/**
 * Interface for faction unlock requirements
 */
export interface FactionUnlockRequirement {
  playerLevel?: number;
  questCompleted?: string;
  combatVictories?: number;
  stealthMissions?: number;
  otherFactions?: string[];
}

/**
 * Interface for faction
 */
export interface Faction {
  id: string;
  name: string;
  description: string;
  reputation: number;
  unlocked: boolean;
  unlockRequirements: FactionUnlockRequirement;
  reputationTiers: ReputationTier[];
  allies: string[];
  enemies: string[];
  specialCurrency?: string;
  specialCurrencyAmount?: number;
  perks?: Record<string, any>;
}

/**
 * Interface for factions state
 */
export interface FactionsState {
  factions: Record<string, Faction>;
  config: {
    reputationDecayEnabled: boolean;
    maxFactionRelationship: number;
    unlockProgressTracking: boolean;
  };
}

/**
 * Initial state for factions
 */
const factionsInitialState: FactionsState = {
  factions: {},
  config: {
    reputationDecayEnabled: false,
    maxFactionRelationship: 100,
    unlockProgressTracking: true
  }
};

export default factionsInitialState;
