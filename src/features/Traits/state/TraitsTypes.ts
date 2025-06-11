/**
 * Type definitions for the Traits system
 */

/**
 * Interface for trait effects that can be applied to player
 */
export interface TraitEffect {
  type: string;
  magnitude: number;
  duration?: number;
  description?: string;
}

/**
 * Interface for direct effect values (used for simple effects storage)
 */
export interface TraitEffectValues {
  [effectName: string]: number;
}

/**
 * Comprehensive trait rarity enumeration
 */
export type TraitRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/**
 * Trait category enumeration
 */
export type TraitCategory = 'combat' | 'social' | 'mental' | 'physical' | 'magical' | 'utility';

/**
 * Trait acquisition prerequisites interface
 */
export interface TraitRequirements {
  level?: number;
  attributes?: Partial<Record<string, number>>;
  prerequisiteTraits?: string[];
  relationshipLevel?: number;
  questCompletion?: string[];
  essence?: number;
  npcId?: string;
  quest?: string;
  [key: string]: any;
}

/**
 * Interface defining a trait in the game (Stored in Redux state)
 * Ensure this matches the structure produced by fetchTraitsThunk
 */
export interface Trait {
  /** Unique identifier for the trait (matches the key in the JSON) */
  id: string;
  
  /** Display name of the trait */
  name: string;
  
  /** Description of what the trait does */
  description: string;
  
  /** Category/type of the trait (e.g., Combat, Knowledge, Social) */
  category: string; 
  
  /** Effects provided by this trait (can be array or object) */
  effects: TraitEffect[] | TraitEffectValues;
  
  /** Rarity classification (Common, Uncommon, Rare, etc.) */
  rarity: string; 
  
  /** Tier level of the trait (optional) */
  tier?: number;
  
  /** Source NPC where the trait can be obtained (optional) */
  sourceNpc?: string; 
  
  /** Cost in essence to acquire the trait (optional) */
  essenceCost?: number;
  
  /** Optional icon identifier for UI (optional) */
  iconPath?: string; 
  
  /** Requirements for obtaining this trait (optional) */
  requirements?: {
    level?: number;
    relationshipLevel?: number; 
    npcId?: string;
    prerequisiteTraits?: string[]; 
    quest?: string;
    [key: string]: any;
  };

  /** Level of the trait if traits can be leveled up (optional) */
  level?: number;

  /** Cost to make trait permanent (optional) */
  permanenceCost?: number;

  /** Source description (optional) */
  source?: string;
}

/**
 * Interface for a trait with active status (used potentially in UI state, not core state)
 */
export interface ActiveTrait extends Trait {
  isActive: boolean;
}

/**
 * Interface for trait filtering criteria
 */
export interface TraitFilters {
  maxCost?: number; 
  searchTerm?: string;
}

/**
 * Robust TraitSlot interface for trait slot management
 * 
 * @interface TraitSlot
 * @property {string} id - Unique identifier for this slot
 * @property {number} index - Zero-based position in trait slot array
 * @property {boolean} isUnlocked - Whether this slot is accessible
 * @property {string | null} traitId - ID of equipped trait (null if empty)
 * @property {string} [unlockRequirement] - Optional description of unlock condition
 */
export interface TraitSlot {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId: string | null;
  unlockRequirement?: string;
}

/**
 * Interface for trait progression
 */
export interface TraitProgression {
  discovered: number;
  total: number;
  slotsUnlocked: number;
  maxSlots: number;
}

/**
 * Extended trait effect interface for complex trait mechanics
 */
export interface TraitEffectDetails {
  type: string;
  magnitude: number;
  duration?: number;
  description?: string;
  target?: 'self' | 'ally' | 'enemy' | 'area';
  condition?: string;
}

/**
 * Trait preset for saving/loading trait configurations
 */
export interface TraitPreset {
  id: string;
  name: string;
  traits: string[];
  description?: string;
  created: number;
}

/**
 * Main traits state interface - now focuses on slot management
 */
export interface TraitsState {
  traits: Record<string, Trait>;
  acquiredTraits: string[];
  discoveredTraits: string[];
  presets: TraitPreset[];
  loading: boolean;
  error: string | null;
}
