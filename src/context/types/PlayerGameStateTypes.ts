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
 * Status effect applied to the player
 */
export interface StatusEffect {
  /** Unique identifier for the effect */
  id: string;
  
  /** Display name of the effect */
  name: string;
  
  /** Detailed description of what the effect does */
  description: string;
  
  /** Duration in seconds (0 for permanent effects) */
  duration: number;
  
  /** Timestamp when effect was applied */
  startTime: number;
  
  /** Classification of the effect's nature */
  type: StatusEffectType;
  
  /** Stat modifications applied by this effect */
  effects: {
    [statName: string]: number;
  };
  
  /** Alternative way to specify stat modifications */
  statModifiers?: StatModifier[];
  
  /** Source that applied this effect */
  source?: StatusEffectSource;
  
  /** Whether multiple instances of this effect can be active simultaneously */
  stackable?: boolean;
  
  /** Maximum number of stacks allowed (if stackable) */
  maxStacks?: number;
  
  /** Current number of stacks (if stackable) */
  currentStacks?: number;
  
  /** Visual representation in UI */
  visualEffect?: VisualEffectType;
  
  /** Custom effect handler (for special effects that aren't just stat modifications) */
  customHandler?: string;
  
  /** Whether the effect should be displayed in the UI */
  hidden?: boolean;
  
  /** Tooltip text to show on hover */
  tooltip?: string;
  
  /** Whether the effect can be removed by "dispel" actions */
  isDispellable?: boolean;
  
  /** Unique ID of another effect this effect counters */
  counters?: string[];
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