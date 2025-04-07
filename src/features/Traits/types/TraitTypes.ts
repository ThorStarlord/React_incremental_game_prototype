/**
 * Trait system type definitions that were previously in TraitsGameStateTypes
 */

// Trait categories
export const TRAIT_CATEGORIES = {
  COMBAT: 'combat',
  MAGIC: 'magic',
  SOCIAL: 'social',
  SURVIVAL: 'survival',
  CRAFTING: 'crafting',
  MENTAL: 'mental',
  PHYSICAL: 'physical',
  SPECIAL: 'special'
} as const;

// Trait sources
export const TRAIT_SOURCES = {
  DEFAULT: 'default',
  QUEST: 'quest',
  NPC: 'npc',
  EXPLORATION: 'exploration',
  ACHIEVEMENT: 'achievement',
  EVENT: 'event'
} as const;

// Trait rarities
export const TRAIT_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const;

// Trait effect interface
export interface TraitEffect {
  type: string;
  magnitude: number;
  description?: string;
}

// Trait identifier type
export type TraitId = string;

// Extended trait with additional metadata
export interface ExtendedTrait {
  id: TraitId;
  name: string;
  description: string;
  category: typeof TRAIT_CATEGORIES[keyof typeof TRAIT_CATEGORIES];
  icon?: string;
  effect?: string;
  effects?: TraitEffect[];
  level?: number;
  source?: typeof TRAIT_SOURCES[keyof typeof TRAIT_SOURCES];
  rarity?: typeof TRAIT_RARITIES[keyof typeof TRAIT_RARITIES];
  isRemovable?: boolean;
  cost?: number;
  [key: string]: any;
}

// Trait system state
export interface TraitSystem {
  traits: Record<TraitId, ExtendedTrait>;
  equippedTraits: TraitId[];
  permanentTraits: TraitId[];
  traitSlots: number;
}

// Helper function to create a trait ID
export const createTraitId = (baseName: string): TraitId => {
  return `trait_${baseName.toLowerCase().replace(/\s+/g, '_')}`;
};
