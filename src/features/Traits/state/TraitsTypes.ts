/**
 * @file TraitsTypes.ts
 * @description Type definitions for the Traits system
 */

/**
 * Core trait interface
 */
export interface Trait {
  id: string;              // Unique trait identifier
  name: string;            // Display name
  description: string;     // Detailed description
  category: string;        // Grouping category (combat, physical, social, etc.)
  rarity: string;          // Trait rarity level (common, rare, epic, legendary, mythic)
  effects: TraitEffect[] | TraitEffectValues;  // Stat modifications
  requirements?: Record<string, any>; // Acquisition requirements
  essenceCost?: number;    // Acquisition cost for Resonance
  permanenceCost?: number; // Cost to make permanent (deprecated)
  source?: string;         // Acquisition source (NPC ID, quest, etc.)
  tier?: number;           // Optional trait tier
  iconPath?: string;       // Optional icon path
  level?: number;          // Optional trait level
}

/**
 * Trait effect interface
 */
export interface TraitEffect {
  type: string;            // Type of effect (e.g., "STAT_MODIFIER", "ABILITY_GRANT")
  magnitude: number;       // Effect magnitude
  duration?: number;       // Effect duration (permanent if omitted)
  description?: string;    // Optional description of the specific effect instance
}

/**
 * Trait effect values as key-value pairs
 */
export interface TraitEffectValues {
  [effectName: string]: number;
}

/**
 * Trait slot interface
 */
export interface TraitSlot {
  id: string;              // Unique identifier for the trait slot
  slotIndex: number;       // Index position of the slot
  traitId: string | null;  // Associated trait ID or null if empty
  isLocked: boolean;       // Lock status of the slot
  unlockRequirement?: string; // Optional requirement to unlock the slot
}

/**
 * Trait preset interface
 */
export interface TraitPreset {
  id: string;              // Unique identifier for this preset
  name: string;            // Name of this preset
  traits: string[];        // Array of trait IDs in this preset
  description?: string;    // Optional description
  created: number;         // Created timestamp
}

/**
 * Core Traits state interface
 */
export interface TraitsState {
  traits: Record<string, Trait>; // All trait definitions
  acquiredTraits: string[];      // IDs of traits the player has generally acquired/learned
  presets: TraitPreset[];        // Trait presets
  discoveredTraits: string[];    // IDs of traits the player has discovered
  loading: boolean;
  error: string | null;
}

// Action payload types
export interface AcquireTraitPayload {
  traitId: string;
  essenceCost?: number;
}

export interface DiscoverTraitPayload {
  traitId: string;
}

export interface SaveTraitPresetPayload {
  preset: TraitPreset;
}

export interface LoadTraitPresetPayload {
  presetId: string;
}

export interface DeleteTraitPresetPayload {
  presetId: string;
}

// Acquisition thunk payload
export interface AcquireTraitWithEssencePayload {
  traitId: string;
  essenceCost: number;
}

// Trait validation result
export interface TraitValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
