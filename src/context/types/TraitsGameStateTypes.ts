/**
 * Type definitions for character traits system
 */

// Import any relevant player types if needed
import { 
  Trait as PlayerTrait,
  TraitEffect as PlayerTraitEffect
} from './PlayerGameStateTypes';

// Re-export for backward compatibility
export type Trait = PlayerTrait;
export type TraitEffect = PlayerTraitEffect;

/**
 * Trait acquisition source
 */
export type TraitSource = 
  | 'starting'
  | 'level-up'
  | 'quest-reward'
  | 'achievement'
  | 'event'
  | 'purchase'
  | 'rare-encounter'
  | 'custom';

/**
 * Trait rarity levels
 */
export type TraitRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'unique';

/**
 * Trait categories for organization
 */
export type TraitCategory = 
  | 'combat'
  | 'magic'
  | 'crafting'
  | 'social'
  | 'exploration'
  | 'background'
  | 'personality'
  | 'special';

/**
 * Extended trait structure
 */
export interface ExtendedTrait extends Trait {
  id: string;
  name: string;
  description: string;
  effects: TraitEffect[];
  
  // Additional properties
  rarity: TraitRarity;
  category: TraitCategory;
  source: TraitSource;
  mutuallyExclusive?: string[];
  prerequisites?: {
    traits?: string[];
    level?: number;
    stats?: Record<string, number>;
    skills?: Record<string, number>;
  };
  isRemovable: boolean;
  removalCost?: number;
  iconPath?: string;
  lore?: string;
}

/**
 * Trait activation condition
 */
export interface TraitActivationCondition {
  type: 'combat-start' | 'health-below' | 'kill' | 'level-up' | 'skill-use' | 'custom';
  threshold?: number;
  skillId?: string;
  enemyType?: string;
  customCheck?: string;
}

/**
 * Active trait with conditional effects
 */
export interface ActiveTrait extends ExtendedTrait {
  isActive: boolean;
  cooldown?: number;
  currentCooldown?: number;
  charges?: number;
  currentCharges?: number;
  activationCondition?: TraitActivationCondition;
  activeEffects?: TraitEffect[];
  passiveEffects?: TraitEffect[];
}

/**
 * Upgradeable trait with multiple tiers
 */
export interface TieredTrait extends ExtendedTrait {
  currentTier: number;
  maxTier: number;
  tierEffects: Record<number, TraitEffect[]>;
  tierUpgradeCost: Record<number, number>;
  tierNames?: Record<number, string>;
  tierDescriptions?: Record<number, string>;
}

/**
 * Player trait slot configuration
 */
export interface TraitSlots {
  maxTraits: number;
  unlockedSlots: number;
  lockedSlotRequirements: {
    slotIndex: number;
    requirement: {
      type: 'level' | 'quest' | 'achievement' | 'purchase';
      id?: string;
      level?: number;
      cost?: number;
    };
  }[];
}

/**
 * Complete trait system state
 */
export interface TraitSystem {
  copyableTraits: Record<string, ExtendedTrait>;
  playerTraits: string[];
  availableTraits: string[];
  traitSlots: TraitSlots;
  discoveredTraits: Set<string>;
  favoriteTraits: Set<string>;
  traitPoints: number;
  traitHistory: {
    traitId: string;
    action: 'added' | 'removed' | 'upgraded';
    timestamp: string; // ISO date string
  }[];
}

/**
 * Trait interaction result
 */
export interface TraitInteractionResult {
  success: boolean;
  message: string;
  affectedTraitIds: string[];
  cost?: number;
  unlockedTraits?: string[];
}
