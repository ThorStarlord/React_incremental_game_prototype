/**
 * @file factionsInitialState.ts
 * @description Defines the initial state for all factions in the game.
 */

import { 
  FactionSystem, 
  Faction, 
  FactionType, 
  FactionStanding, 
  MembershipStatus,
  FactionRelationship,
  PlayerFactionStanding 
} from '../types/FactionGameStateTypes';

/**
 * Initial factions that exist in the game world
 */
const convertedFactions: Record<string, Faction> = {
  'village_council': {
    id: 'village_council',
    name: 'Village Council',
    description: 'The governing body of the starting village. They maintain order and distribute resources.',
    type: FactionType.City,
    baseLocation: 'village_square',
    influence: 60,
    joinable: true,
    hidden: false,
    colors: {
      primary: '#2a4b8d',
      secondary: '#b7c9e2',
      accent: '#ffd700'
    },
    iconPath: 'assets/factions/village_council.png'
  },
  'merchant_guild': {
    id: 'merchant_guild',
    name: 'Merchant Guild',
    description: 'A powerful network of traders and craftsmen who control most commerce in the region.',
    type: FactionType.Guild,
    baseLocation: 'market_district',
    influence: 75,
    joinable: true,
    hidden: false,
    membershipRequirements: {
      level: 5
    },
    colors: {
      primary: '#8b4513',
      secondary: '#d2b48c',
      accent: '#daa520'
    }
  },
  'forest_bandits': {
    id: 'forest_bandits',
    name: 'Forest Bandits',
    description: 'Outlaws who prey on travelers and merchants in the nearby woods.',
    type: FactionType.Outlaw,
    baseLocation: 'hidden_camp',
    influence: 30,
    joinable: true,
    hidden: true,
    colors: {
      primary: '#355e3b',
      secondary: '#8f9779',
      accent: '#ff4500'
    }
  }
};

/**
 * Initial state for factions
 */
const factionsInitialState: FactionSystem = {
  // All factions in the game
  factions: convertedFactions,
  
  // How factions relate to each other
  relationships: {
    'village_council': [
      { factionId: 'merchant_guild', standing: FactionStanding.Friendly, locked: false },
      { factionId: 'forest_bandits', standing: FactionStanding.Hostile, locked: false }
    ],
    'merchant_guild': [
      { factionId: 'village_council', standing: FactionStanding.Friendly, locked: false },
      { factionId: 'forest_bandits', standing: FactionStanding.Hostile, locked: false }
    ],
    'forest_bandits': [
      { factionId: 'village_council', standing: FactionStanding.Hostile, locked: false },
      { factionId: 'merchant_guild', standing: FactionStanding.Hostile, locked: false }
    ]
  },
  
  // Player reputation with factions
  playerStandings: [
    {
      factionId: 'village_council',
      standing: FactionStanding.Neutral,
      reputation: 0,
      reputationNextLevel: 1000,
      membershipStatus: MembershipStatus.NonMember,
      completedQuests: [],
      availableQuests: [],
      unlockedPerks: [],
      history: []
    },
    {
      factionId: 'merchant_guild',
      standing: FactionStanding.Neutral,
      reputation: 0,
      reputationNextLevel: 1000,
      membershipStatus: MembershipStatus.NonMember,
      completedQuests: [],
      availableQuests: [],
      unlockedPerks: [],
      history: []
    },
    {
      factionId: 'forest_bandits',
      standing: FactionStanding.Unfriendly,
      reputation: -300,
      reputationNextLevel: 0,
      membershipStatus: MembershipStatus.NonMember,
      completedQuests: [],
      availableQuests: [],
      unlockedPerks: [],
      history: []
    }
  ],
  
  // Other required properties
  discoveredFactions: ['village_council', 'merchant_guild'],
  activeMemberships: [],
  factionQuests: {},
  factionPerks: {},
  displayedNotifications: []
};

export default factionsInitialState;
