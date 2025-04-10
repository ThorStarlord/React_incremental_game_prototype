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
 * Interface defining a trait in the game
 */
export interface Trait {
  /** Unique identifier for the trait */
  id: string;
  
  /** Display name of the trait */
  name: string;
  
  /** Description of what the trait does */
  description: string;
  
  /** Category/type of the trait */
  category: string;
  
  /** Effects provided by this trait */
  effects: TraitEffect[] | TraitEffectValues;
  
  /** Rarity classification (common, uncommon, rare, etc.) */
  rarity: string;
  
  /** Tier level of the trait (higher means more powerful) */
  tier?: number;
  
  /** Source where the trait can be obtained */
  source?: string;
  
  /** Cost in essence to acquire the trait */
  essenceCost?: number;
  
  /** Optional icon identifier for UI */
  iconPath?: string;
  
  /** Requirements for obtaining this trait */
  requirements?: {
    level?: number;
    relationshipLevel?: string;
    npcId?: string;
    prerequisiteTrait?: string;
    quest?: string;
    [key: string]: any;
  };

  /** Level of the trait if traits can be leveled up */
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
  type?: string; // Corresponds to trait.category
  maxCost?: number; // Corresponds to trait.essenceCost
  searchTerm?: string;
  // Add other potential filters like rarity, source, etc.
}

/**
 * Interface for a trait slot
 */
export interface TraitSlot {
  /** Unique identifier for this slot */
  id: string;
  
  /** Index position of this slot */
  index: number;
  
  /** Whether this slot is unlocked and available */
  isUnlocked: boolean;
  
  /** ID of the trait currently equipped in this slot, if any */
  traitId?: string | null;
  
  /** Requirements to unlock this slot */
  unlockRequirements?: {
    type: string;
    value: any;
  };
}

/**
 * Interface for trait progression
 */
export interface TraitProgression {
  /** Number of traits discovered */
  discovered: number;
  
  /** Number of total traits in the game */
  total: number;
  
  /** Number of trait slots unlocked */
  slotsUnlocked: number;
  
  /** Maximum possible trait slots */
  maxSlots: number;
}

/**
 * Interface for a saved trait preset
 */
export interface TraitPreset {
  /** Unique identifier for this preset */
  id: string;
  
  /** Name of this preset */
  name: string;
  
  /** Array of trait IDs in this preset */
  traits: string[];
  
  /** Optional description */
  description?: string;
  
  /** Created timestamp */
  created: number;
}

/**
 * Interface for the traits state
 */
export interface TraitsState {
  /** All available traits in the game */
  traits: Record<string, Trait>;
  
  /** Traits the player has acquired */
  acquiredTraits: string[];
  
  /** Traits the player has permanently unlocked (always active) */
  permanentTraits: string[];
  
  /** Traits currently equipped */
  equippedTraits: string[];
  
  /** Available trait slots */
  slots: TraitSlot[];
  
  /** Maximum number of equippable traits */
  maxTraitSlots: number;
  
  /** Currently active presets */
  presets: TraitPreset[];
  
  /** Trait discovery status */
  discoveredTraits: string[];
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Error message if any */
  error: string | null;
}
