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
  type?: string; 
  maxCost?: number; 
  searchTerm?: string;
}

/**
 * Interface for a trait slot
 */
export interface TraitSlot {
  id: string;
  index: number;
  isUnlocked: boolean;
  traitId?: string | null;
  unlockRequirements?: {
    type: 'resonanceLevel' | 'quest' | 'relationshipLevel'; 
    value: number | string; 
  };
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
 * Interface for a saved trait preset
 */
export interface TraitPreset {
  id: string;
  name: string;
  traits: string[];
  description?: string;
  created: number;
}

/**
 * Interface for the traits state
 */
export interface TraitsState {
  /** All available trait definitions in the game, keyed by ID. */
  traits: Record<string, Trait>;
  
  /** IDs of traits the player has acquired */
  acquiredTraits: string[];
  
  /** Currently active presets */
  presets: TraitPreset[];
  
  /** Trait discovery status */
  discoveredTraits: string[];
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Error message if any */
  error: string | null;
}
