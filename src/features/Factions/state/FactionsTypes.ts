/**
 * Types for the Factions slice of the Redux store
 */

/**
 * Enum for faction types
 */
export enum FactionType {
  City = 'city',
  Guild = 'guild',
  Religious = 'religious',
  Military = 'military',
  Academic = 'academic',
  Outlaw = 'outlaw',
  Wilderness = 'wilderness'
}

/**
 * Enum for faction standing levels
 */
export enum FactionStanding {
  Revered = 'revered',
  Exalted = 'exalted',
  Honored = 'honored',
  Friendly = 'friendly',
  Neutral = 'neutral',
  Unfriendly = 'unfriendly',
  Hostile = 'hostile',
  Hated = 'hated'
}

/**
 * Enum for membership status
 */
export enum MembershipStatus {
  NonMember = 'non_member',
  Applicant = 'applicant',
  Initiate = 'initiate',
  Member = 'member',
  Trusted = 'trusted',
  Officer = 'officer',
  Leader = 'leader'
}

/**
 * Faction colors configuration
 */
export interface FactionColors {
  primary: string;
  secondary: string;
  accent: string;
}

/**
 * Faction membership requirements
 */
export interface MembershipRequirements {
  level?: number;
  quests?: string[];
  reputation?: number;
  attributes?: Record<string, number>;
  skills?: Record<string, number>;
  items?: Array<{ id: string; quantity: number }>;
}

/**
 * Reputation tier with threshold and benefits
 */
export interface ReputationTier {
  threshold: number;
  name: string;
  benefits?: string[];
  description?: string;
}

/**
 * Faction data
 */
export interface Faction {
  id: string;
  name: string;
  description: string;
  type: FactionType;
  baseLocation: string;
  influence: number;
  joinable: boolean;
  hidden: boolean;
  colors: FactionColors;
  iconPath?: string;
  membershipRequirements?: MembershipRequirements;
  reputationTiers?: ReputationTier[];
}

/**
 * Relationship between factions
 */
export interface FactionRelationship {
  factionId: string;
  standing: FactionStanding;
  locked: boolean;
}

/**
 * Historical event in player-faction relationship
 */
export interface FactionHistoryEntry {
  date: number;
  action: string;
  reputationChange: number;
  description: string;
}

/**
 * Player's standing with a faction
 */
export interface PlayerFactionStanding {
  factionId: string;
  standing: FactionStanding;
  reputation: number;
  reputationNextLevel: number;
  membershipStatus: MembershipStatus;
  completedQuests: string[];
  availableQuests: string[];
  unlockedPerks: string[];
  history: FactionHistoryEntry[];
}

/**
 * Faction perk that can be unlocked
 */
export interface FactionPerk {
  id: string;
  factionId: string;
  name: string;
  description: string;
  requiredStanding: FactionStanding;
  requiredMembership?: MembershipStatus;
  effects: Array<{
    type: string;
    value: number | string | boolean;
  }>;
  iconPath?: string;
}

/**
 * Faction quest
 */
export interface FactionQuest {
  id: string;
  factionId: string;
  name: string;
  description: string;
  requiredStanding: FactionStanding;
  requiredMembership?: MembershipStatus;
  reputationReward: number;
  rewards: Array<{
    type: string;
    id?: string;
    amount?: number;
    name?: string;
  }>;
  repeatable: boolean;
  objectives: Array<{
    id: string;
    description: string;
    type: string;
    targetId?: string;
    amount?: number;
    completed: boolean;
  }>;
}

/**
 * Notification about faction-related events
 */
export interface FactionNotification {
  id: string;
  factionId: string;
  title: string;
  message: string;
  type: 'reputation' | 'quest' | 'membership' | 'other';
  timestamp: number;
  read: boolean;
}

/**
 * State for the Factions slice
 */
export interface FactionsState {
  // All factions in the game
  factions: Record<string, Faction>;
  
  // How factions relate to each other
  relationships: Record<string, FactionRelationship[]>;
  
  // Player reputation with factions
  playerStandings: PlayerFactionStanding[];
  
  // Discovered factions by the player
  discoveredFactions: string[];
  
  // Factions the player is a member of
  activeMemberships: string[];
  
  // Available and completed faction quests
  factionQuests: Record<string, FactionQuest>;
  
  // Available faction perks
  factionPerks: Record<string, FactionPerk>;
  
  // Notifications about faction-related events
  notifications: FactionNotification[];
  
  // UI state
  displayedNotifications: string[];
  selectedFaction: string | null;
  
  // Loading state
  loading: boolean;
}

/**
 * Payload for changing faction reputation
 */
export interface ChangeReputationPayload {
  factionId: string;
  amount: number;
  reason: string;
  silent?: boolean;
}

/**
 * Payload for completing a faction quest
 */
export interface CompleteQuestPayload {
  questId: string;
  factionId: string;
}

/**
 * Payload for applying for faction membership
 */
export interface ApplyForMembershipPayload {
  factionId: string;
}

/**
 * Payload for discovering a faction
 */
export interface DiscoverFactionPayload {
  factionId: string;
}

/**
 * Payload for unlocking a faction perk
 */
export interface UnlockPerkPayload {
  perkId: string;
  factionId: string;
}
