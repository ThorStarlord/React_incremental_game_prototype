/**
 * Represents a player's stats in the game
 */
export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  speed: number;
  healthRegen: number;
  manaRegen: number;
  defense: number;
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
  duration: number;
  magnitude: number;
  source?: string;
  timestamp?: number;
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
 * Represents an item that can be equipped
 */
export interface EquipmentItem {
  id: string;
  name: string;
  type: string; // e.g., 'weapon', 'armor', 'accessory'
  slot: string; // e.g., 'head', 'chest', 'mainHand'
  stats?: Partial<PlayerStats>; // Optional stats provided by the item
  // Add other item properties as needed (e.g., description, value, rarity)
}

/**
 * Represents the player's equipped items
 */
export interface EquipmentState {
  head?: EquipmentItem | null;
  chest?: EquipmentItem | null;
  legs?: EquipmentItem | null;
  feet?: EquipmentItem | null;
  mainHand?: EquipmentItem | null;
  offHand?: EquipmentItem | null;
  accessory1?: EquipmentItem | null;
  accessory2?: EquipmentItem | null;
  // Add other slots as needed
  [key: string]: EquipmentItem | null | undefined; // Allow dynamic access
}

/**
 * Player's complete state
 */
export interface PlayerState {
  name: string;
  level: number;
  experience: number;
  stats: PlayerStats;
  attributes: Record<string, Attribute>;
  attributePoints: number;
  skillPoints: number;
  skills: Skill[];
  statusEffects: StatusEffect[];
  acquiredTraits: string[];
  permanentTraits: string[];
  traitSlots: number;
  totalEssenceEarned: number;
  gold: number;
  lastRestLocation: string;
  lastRestTime: number;
  creationDate: string;
  lastSaved: string;
  totalPlayTime: number;
  isAlive: boolean;
  activeCharacterId: string;
  equipment: EquipmentState; // Add equipment to PlayerState
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

// New payload types for consistent typing
export interface UpdateAttributesPayload {
  [attributeId: string]: number;
}

export interface UpdateStatsPayload {
  [statId: string]: number;
}

export interface UpdateTotalPlayTimePayload {
  amount: number;
}

/**
 * Initial state for the player
 */
export const PlayerInitialState: PlayerState = {
  name: "Adventurer",
  level: 1,
  experience: 0,
  stats: {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 10,
    speed: 1,
    healthRegen: 0.5,
    manaRegen: 0.5,
    defense: 5,
    critChance: 0.05,
    critDamage: 1.5
  },
  attributes: {
    strength: { name: "Strength", value: 5, baseValue: 5 },
    dexterity: { name: "Dexterity", value: 5, baseValue: 5 },
    intelligence: { name: "Intelligence", value: 5, baseValue: 5 },
    wisdom: { name: "Wisdom", value: 5, baseValue: 5 },
    constitution: { name: "Constitution", value: 5, baseValue: 5 }
  },
  attributePoints: 0,
  skillPoints: 0,
  skills: [],
  statusEffects: [],
  acquiredTraits: [],
  permanentTraits: [],
  traitSlots: 1,
  totalEssenceEarned: 0,
  gold: 50,
  lastRestLocation: "village",
  lastRestTime: Date.now(),
  creationDate: new Date().toISOString(),
  lastSaved: new Date().toISOString(),
  totalPlayTime: 0,
  isAlive: true,
  activeCharacterId: "player",
  equipment: { // Add initial empty equipment
    head: null,
    chest: null,
    legs: null,
    feet: null,
    mainHand: null,
    offHand: null,
    accessory1: null,
    accessory2: null,
  },
};
