/**
 * Type definitions for world-related game state
 */

// Import from progression types for compatibility
import { GameLocation as BaseGameLocation } from './ProgressionGameStateTypes';

// Re-export for backward compatibility
export type GameLocation = BaseGameLocation;

/**
 * Regional biome types
 */
export type BiomeType = 
  | 'forest'
  | 'desert'
  | 'mountain'
  | 'plains'
  | 'swamp'
  | 'tundra'
  | 'coastal'
  | 'volcanic'
  | 'underground'
  | 'urban'
  | 'magical';

/**
 * Weather condition types
 */
export type WeatherType =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'fog'
  | 'sandstorm'
  | 'heatwave'
  | 'blizzard'
  | 'magical';

/**
 * Time of day
 */
export type TimeOfDay = 
  | 'dawn'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'dusk'
  | 'evening'
  | 'midnight'
  | 'night';

/**
 * Seasons in the game world
 */
export type Season = 
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter';

/**
 * Weather effects
 */
export interface WeatherEffect {
  type: WeatherType;
  intensity: number; // 0 to 10
  effects: {
    gatheringRateModifier?: number;
    combatModifiers?: Record<string, number>;
    movementSpeedModifier?: number;
    visibilityRange?: number;
    statusEffectChance?: {
      effectId: string;
      chance: number;
    }[];
  };
  description: string;
  iconPath?: string;
  particleEffects?: string[];
  soundEffects?: string[];
}

/**
 * Extended location with more details
 */
export interface ExtendedLocation extends BaseGameLocation {
  biome: BiomeType;
  dangerLevel: number; // 0 to 10
  resources: LocationResource[];
  npcs: string[]; // NPC IDs present in this location
  shops: string[]; // Shop IDs available in this location
  quests: string[]; // Quest IDs that can be started here
  discoveredAt?: string; // ISO date string when player discovered this location
  visitCount: number;
  backgroundImage?: string;
  musicTrack?: string;
  ambientSounds?: string[];
  isResting: boolean; // Whether this is a safe resting area
  respawnPoint: boolean; // Whether player can respawn here
  weatherProbabilities: Record<WeatherType, number>; // Chance of each weather type
}

/**
 * Region containing multiple locations
 */
export interface Region {
  id: string;
  name: string;
  description: string;
  locations: string[]; // Location IDs in this region
  biomes: BiomeType[];
  controllingFaction?: string; // Faction ID that controls this region
  discoveryRequirement?: {
    level?: number;
    quest?: string;
    item?: string;
  };
  mapPosition: {
    x: number;
    y: number;
  };
  mapSize: {
    width: number;
    height: number;
  };
  difficulty: number; // 1-100, average enemy level
  isUnlocked: boolean;
  discoveredAt?: string; // ISO date string
}

/**
 * Resource that can be gathered in a location
 */
export interface LocationResource {
  id: string;
  type: string; // "ore", "herb", "wood", etc.
  name: string;
  requiredSkill: {
    name: string;
    level: number;
  };
  abundance: number; // 0 to 10
  respawnTime: number; // in seconds
  lastHarvested?: string; // ISO date string
  drops: {
    itemId: string;
    chance: number; // 0 to 1
    minQuantity: number;
    maxQuantity: number;
  }[];
  iconPath?: string;
}

/**
 * NPC in the game world
 */
export interface WorldNPC {
  id: string;
  name: string;
  type: 'merchant' | 'quest-giver' | 'trainer' | 'enemy' | 'neutral';
  faction?: string;
  portrait?: string;
  dialogue: {
    greeting: string[];
    farewell: string[];
    shop?: string[];
    quest?: Record<string, string[]>; // Quest ID -> related dialogue
    friendship?: Record<number, string[]>; // Friendship level -> dialogues
  };
  inventory?: string[]; // Item IDs the NPC sells or drops
  services?: {
    sells: boolean;
    repairs: boolean;
    teaches: boolean;
    quests: boolean;
  };
  schedule?: NPCScheduleEntry[];
  relationship: number; // 0-100, NPC's relationship with player
  isUnlocked: boolean;
  location: string; // Current location ID
  homeLocation: string; // Default location ID
}

/**
 * Entry in an NPC's schedule
 */
export interface NPCScheduleEntry {
  timeOfDay: TimeOfDay;
  location: string;
  activity: string;
  dialogue?: string[];
  availability: boolean; // Whether NPC can be interacted with during this time
}

/**
 * Faction in the game world
 */
export interface Faction {
  id: string;
  name: string;
  description: string;
  relationship: number; // -100 to 100, player's standing with this faction
  headquarters: string; // Location ID
  leaders: string[]; // NPC IDs
  enemyFactions: string[]; // Faction IDs
  allyFactions: string[]; // Faction IDs
  colors: {
    primary: string;
    secondary: string;
  };
  banner?: string;
  reputationTiers: {
    threshold: number;
    name: string;
    benefits: string[];
  }[];
  quests: string[]; // Quest IDs for this faction
  shops: string[]; // Shop IDs for this faction
  unlockRequirement?: {
    level?: number;
    quest?: string;
    reputation?: Record<string, number>; // Other faction ID -> required rep
  };
  isUnlocked: boolean;
}

/**
 * Shop in the game world
 */
export interface Shop {
  id: string;
  name: string;
  location: string; // Location ID
  owner: string; // NPC ID
  inventory: {
    items: ShopItem[];
    restockTime: number; // in seconds
    lastRestocked: string; // ISO date string
  };
  buyMultiplier: number; // How much the shop buys items for (e.g. 0.5 = 50% of value)
  sellMultiplier: number; // How much the shop marks up items (e.g. 1.2 = 120% of value)
  specialization?: string; // "weapons", "armor", "potions", etc.
  requiredReputation?: {
    faction: string;
    level: number;
  };
  isOpen: boolean;
  openingHours: {
    open: TimeOfDay;
    close: TimeOfDay;
  };
  iconPath?: string;
}

/**
 * Item sold in a shop
 */
export interface ShopItem {
  itemId: string;
  quantity: number;
  price: number; // Overrides the item's base value
  inStock: boolean;
  limitedTime?: {
    expiresAt: string; // ISO date string
  };
  requiredReputation?: {
    faction: string;
    level: number;
  };
  discountPercentage?: number;
}

/**
 * World event that affects multiple locations
 */
export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  affectedLocations: string[];
  affectedRegions: string[];
  effects: {
    resourceBonus?: Record<string, number>;
    enemyLevelModifier?: number;
    weatherOverride?: WeatherType;
    shopDiscounts?: Record<string, number>;
    experienceBonus?: number;
    specialEncounters?: string[];
    uniqueDrops?: string[];
  };
  isActive: boolean;
  iconPath?: string;
  questsAvailable?: string[];
  announcements: string[];
  priority: number; // Higher numbers = more important events
}

/**
 * Time system for the game world
 */
export interface WorldTime {
  day: number;
  timeOfDay: TimeOfDay;
  season: Season;
  year: number;
  totalMinutesPassed: number;
  realSecondsPerGameMinute: number;
  isPaused: boolean;
}

/**
 * Complete world state
 */
export interface WorldState {
  regions: Record<string, Region>;
  locations: Record<string, ExtendedLocation>;
  currentLocation: string;
  currentWeather: WeatherEffect;
  npcs: Record<string, WorldNPC>;
  factions: Record<string, Faction>;
  shops: Record<string, Shop>;
  activeEvents: Record<string, WorldEvent>;
  time: WorldTime;
  discoveredLocations: Set<string>;
  discoveredRegions: Set<string>;
  metNPCs: Set<string>;
  resourceNodes: Record<string, LocationResource[]>;
  worldFlags: Record<string, boolean>; // Track story/quest state affecting the world
  globalModifiers: Record<string, number>; // Global modifiers affecting gameplay
}
