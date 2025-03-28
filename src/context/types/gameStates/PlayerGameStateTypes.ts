/**
 * Type definitions for player-related game state
 */

/**
 * Player attributes that can be increased through leveling
 */
export interface PlayerAttributes {
  strength: number;     // Physical power
  dexterity: number;    // Agility and reflexes
  intelligence: number; // Mental acuity
  vitality: number;     // Physical resilience
  wisdom: number;       // Mental resilience
  charisma: number;     // Social influence
  luck: number;         // Fortune
  perception: number;   // Awareness
  [key: string]: number; // Allow for custom attributes
}

/**
 * Player stats derived from attributes, equipment, and effects
 */
export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  healthRegen: number;
  manaRegen: number;
  physicalDamage: number;
  magicalDamage: number;
  armor: number;
  magicResistance: number;
  critChance: number;
  critMultiplier: number;
  evasion: number;
  accuracy: number;
  speed: number;
  // Make these required instead of optional for consistency
  attack: number;
  defense: number;
  // Allow for extensibility with a more specific type
  [key: string]: number;
}

/**
 * Types of status effects
 */
export type StatusEffectType = 'buff' | 'debuff' | 'mixed' | 'neutral';

/**
 * Types of visual representations for effects
 */
export type VisualEffectType = 'glow' | 'particles' | 'aura' | 'icon' | 'animation' | 'none';

/**
 * Source that applied a status effect
 */
export interface StatusEffectSource {
  type: 'item' | 'skill' | 'trait' | 'environment' | 'npc' | 'event' | 'system';
  id: string;
  name?: string;
}

/**
 * Single stat modification applied by an effect
 */
export interface StatModifier {
  stat: string;
  value: number;
  isPercentage?: boolean;
}

/**
 * Interface for status effects that can be applied to entities
 */
export interface StatusEffect {
  /** Unique identifier for the effect */
  id: string;
  /** Display name of the effect */
  name: string;
  /** How long the effect lasts (in turns, seconds, etc.) */
  duration: number;
  /** Description of what the effect does */
  description: string;
  /** When the effect started */
  startTime?: number;
  /** When the effect was applied (for sorting) */
  timestamp?: number;
  /** Type of effect (buff, debuff, etc.) */
  type?: string;
  /** Strength/magnitude of the effect */
  strength?: number;
  /** Specific effect modifiers and values */
  effects?: Record<string, any>;
  /** Additional metadata for the effect */
  [key: string]: any;
}

/**
 * Complete player state
 */
export interface PlayerState {
  name: string;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  gold: number;
  energy?: number;
  maxEnergy?: number;
  inventory?: any[]; // Simplified from InventoryItem[]
  attributePoints?: number;
  skills?: any[]; // Simplified from Skill[]
  activeEffects?: StatusEffect[];
  
  // Add experience property for player progression
  experience?: number;
  
  // Add the missing properties
  level?: number;
  experienceToNextLevel?: number;
  
  // Trait system
  equippedTraits: string[];
  permanentTraits: string[];
  traitSlots: number;
  acquiredTraits: string[];
  
  // Time tracking
  creationDate: string;
  lastSaved: string;
  totalPlayTime: number;
  
  // Additional fields with more specific types
  activeCharacterId?: string;
  lastRestLocation?: string;
  lastRestTime?: number;
}