/**
 * Player System Type Definitions
 * 
 * This file contains all TypeScript type definitions for the Player feature,
 * following Feature-Sliced Design principles with comprehensive type safety.
 */

/**
 * Represents a player's stats in the game
 */
export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  healthRegen: number;
  manaRegen: number;
  critChance: number;
  critDamage: number;
  [key: string]: number; // For dynamic stats
}

/**
 * Represents a status effect applied to a player
 */
export interface StatusEffect {
  id: string;
  name: string;
  type: string;
  duration: number;
  magnitude?: number;
  source?: string;
  timestamp: number;
  effects: Partial<PlayerStats>;
}

/**
 * Represents a player skill
 */
export interface Skill {
  id: string;
  level: number;
  experience: number;
}

/**
 * Represents a player attribute
 */
export interface Attribute {
  name: string;
  value: number;
  baseValue: number;
}

/**
 * Player's complete state
 */
export interface PlayerState {
  // Basic Identity
  name: string;
  level: number;
  experience: number;
  
  // Core Stats
  stats: PlayerStats;
  
  // Character Attributes
  attributes: Record<string, Attribute>;
  attributePoints: number;
  
  // Skills and Progression
  skills: Skill[];
  skillPoints: number;
  
  // Temporary Effects
  statusEffects: StatusEffect[];
  
  // Trait System Integration
  acquiredTraits: string[];
  permanentTraits: string[];
  traitSlots: number;
  totalEssenceEarned: number;
  
  // Resources
  gold: number;
  
  // Game State
  lastRestLocation: string;
  lastRestTime: number;
  creationDate: string;
  lastSaved: string;
  totalPlayTime: number;
  isAlive: boolean;
  activeCharacterId: string;
}

/**
 * Payload types for player actions
 */
export interface SetNamePayload {
  name: string;
}

export interface ResetPlayerPayload {
  keepName?: boolean;
}

export interface RestPayload {
  duration: number;
  location?: string;
}

export interface HealthModificationPayload {
  amount: number; 
  reason?: string;
}

export interface EnergyModificationPayload {
  amount: number;
  reason?: string;
}

export interface ActiveCharacterPayload {
  characterId: string;
}

export interface AttributeUpdatePayload {
  attributeId: string;
  value: number;
}

export interface AttributeAllocationPayload {
  attributeId: string;
  amount: number;
}

export interface SkillUpdatePayload {
  skillId: string;
  experience: number;
}

export interface SkillIdPayload {
  skillId: string;
}

export interface SkillUpgradePayload {
  skillId: string;
  level: number;
}

export interface TraitPayload {
  traitId: string;
}

export interface StatusEffectIdPayload {
  effectId: string;
}

export interface StatUpdatePayload {
  statId: string;
  value: number;
}

export interface UpdateAttributesPayload {
  [attributeId: string]: number;
}

export interface UpdateStatsPayload {
  [statId: string]: number;
}

export interface UpdateTotalPlayTimePayload {
  amount: number;
}

// Legacy payload types for backward compatibility
export interface UpdatePlayerPayload {
  updates: Partial<PlayerState>;
}

export interface ModifyHealthPayload {
  amount: number;
  type?: 'damage' | 'heal';
}

export interface AllocateAttributePayload {
  attributeName: string;
  points: number;
}

/**
 * Initial state for the player
 */
export const PlayerInitialState: PlayerState = {
  // Basic Identity
  name: "Adventurer",
  level: 1,
  experience: 0,
  
  // Core Stats
  stats: {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 10,
    defense: 5,
    speed: 1,
    healthRegen: 0.5,
    manaRegen: 0.5,
    critChance: 0.05,
    critDamage: 1.5
  },
  
  // Character Attributes
  attributes: {
    strength: { name: "Strength", value: 5, baseValue: 5 },
    dexterity: { name: "Dexterity", value: 5, baseValue: 5 },
    intelligence: { name: "Intelligence", value: 5, baseValue: 5 },
    wisdom: { name: "Wisdom", value: 5, baseValue: 5 },
    constitution: { name: "Constitution", value: 5, baseValue: 5 },
    charisma: { name: "Charisma", value: 5, baseValue: 5 }
  },
  attributePoints: 0,
  
  // Skills and Progression
  skills: [],
  skillPoints: 0,
  
  // Temporary Effects
  statusEffects: [],
  
  // Trait System Integration
  acquiredTraits: [],
  permanentTraits: [],
  traitSlots: 1,
  totalEssenceEarned: 0,
  
  // Resources
  gold: 50,
  
  // Game State
  lastRestLocation: "village",
  lastRestTime: Date.now(),
  creationDate: new Date().toISOString(),
  lastSaved: new Date().toISOString(),
  totalPlayTime: 0,
  isAlive: true,
  activeCharacterId: "player"
};
