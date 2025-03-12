/**
 * Type definitions for faction system
 */

/**
 * Faction status/standing levels
 */
export enum FactionStanding {
  Hated = 'hated',           // Faction members attack on sight
  Hostile = 'hostile',       // Cannot interact with faction
  Unfriendly = 'unfriendly', // Limited interaction, high prices
  Neutral = 'neutral',       // Default standing
  Friendly = 'friendly',     // Better prices, some quests available
  Honored = 'honored',       // Access to special items and quests
  Revered = 'revered',       // Major benefits and special equipment
  Exalted = 'exalted'        // Maximum standing, all benefits unlocked
}

/**
 * Types of factions in the game
 */
export enum FactionType {
  City = 'city',             // Urban centers and governments
  Guild = 'guild',           // Trade or professional organizations
  Military = 'military',     // Army or defense forces
  Religious = 'religious',   // Faith-based organizations
  Outlaw = 'outlaw',         // Bandits and criminal groups
  Merchant = 'merchant',     // Trading companies
  Tribal = 'tribal',         // Indigenous or clan-based groups
  Arcane = 'arcane',         // Magic-focused organizations
  Beast = 'beast',           // Non-human entities like beasts
  Ancient = 'ancient',       // Historical or legendary groups
  Custom = 'custom'          // For user-created factions
}

/**
 * Membership status in a faction
 */
export enum MembershipStatus {
  NonMember = 'non-member',  // Not a member
  Initiate = 'initiate',     // Just joined
  Member = 'member',         // Regular member
  Veteran = 'veteran',       // Experienced member
  Elite = 'elite',           // High-ranking member
  Leader = 'leader'          // Leading the faction
}

/**
 * Core faction interface
 */
export interface Faction {
  id: string;                // Unique identifier
  name: string;              // Display name
  description: string;       // Brief description
  type: FactionType;         // Type of faction
  leaderId?: string;         // ID of NPC faction leader
  baseLocation: string;      // Main location ID
  influence: number;         // 0-100 representing faction power
  joinable: boolean;         // Can player join this faction
  hidden: boolean;           // Is faction initially hidden
  membershipRequirements?: { // Requirements to join
    level?: number;
    questsCompleted?: string[];
    stats?: Record<string, number>;
    opposingFactions?: string[];
  };
  colors: {                  // UI theme colors
    primary: string;
    secondary: string;
    accent: string;
  };
  iconPath?: string;         // Path to faction emblem
  ranks?: string[];          // Possible ranks in the faction
  specialization?: string;   // What the faction is known for
}

/**
 * Inter-faction relationships
 */
export interface FactionRelationship {
  factionId: string;         // Target faction ID
  standing: FactionStanding; // Relationship level
  locked: boolean;           // Can this relationship change
}

/**
 * Player's standing with a specific faction
 */
export interface PlayerFactionStanding {
  factionId: string;                  // The faction identifier
  standing: FactionStanding;          // Current relationship level
  reputation: number;                 // Reputation points (0-10000)
  reputationNextLevel: number;        // Points needed for next level
  membershipStatus: MembershipStatus; // Current membership status
  rank?: string;                      // Current rank if a member
  joinDate?: string;                  // When player joined (ISO date)
  completedQuests: string[];          // Faction quest IDs completed
  availableQuests: string[];          // Available faction quest IDs
  unlockedPerks: string[];            // Unlocked faction perks
  history: {                          // History of reputation changes
    date: string;                     // When the change occurred
    amount: number;                   // Reputation points changed
    reason: string;                   // Reason for the change
  }[];
}

/**
 * Faction-specific quest
 */
export interface FactionQuest {
  id: string;                // Unique identifier
  factionId: string;         // Associated faction
  name: string;              // Quest name
  description: string;       // Quest description
  minStanding: FactionStanding; // Min standing to receive quest
  reputationReward: number;  // Reputation points awarded
  repeatable: boolean;       // Can be completed multiple times
  cooldown?: number;         // Hours before repeatable
  exclusiveTo?: string[];    // Faction IDs that make this exclusive
  requirements: {            // Requirements to start quest
    playerLevel?: number;
    previousQuests?: string[];
    items?: {id: string, quantity: number}[];
    skills?: Record<string, number>;
  };
}

/**
 * Faction perk/reward from reputation
 */
export interface FactionPerk {
  id: string;                // Unique identifier
  factionId: string;         // Associated faction
  name: string;              // Perk name
  description: string;       // Perk description
  requiredStanding: FactionStanding; // Required standing level
  memberOnly: boolean;       // Only available to members
  type: 'discount' | 'item' | 'ability' | 'passive' | 'service' | 'training';
  effect: {                  // Effect details
    type: string;
    value: number | string | Record<string, unknown>;
  };
  iconPath?: string;         // Path to perk icon
}

/**
 * Complete faction system state
 */
export interface FactionSystem {
  factions: Record<string, Faction>;  // All factions in the game
  relationships: {                    // How factions relate to each other
    [factionId: string]: FactionRelationship[];
  };
  playerStandings: PlayerFactionStanding[]; // Player reputation with factions
  discoveredFactions: string[];       // Factions the player has discovered
  activeMemberships: string[];        // Factions the player is a member of
  factionQuests: Record<string, FactionQuest[]>; // Available faction quests
  factionPerks: Record<string, FactionPerk[]>;   // Available faction perks
  displayedNotifications: string[];   // IDs of shown reputation notifications
}
