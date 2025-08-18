/**
 * Type definitions for the Player system
 */

// This represents the player's stats WITHOUT any modifiers
export interface PlayerBaseStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  healthRegen: number;
  manaRegen: number;
  criticalChance: number;
  criticalDamage: number;
}

// PlayerStats now represents the FINAL, calculated stats
export type PlayerStats = PlayerBaseStats;

/**
 * Player attributes interface
 */
export interface PlayerAttributes {
  strength: number;
  dexterity: number;
  intelligence: number;
  constitution: number;
  wisdom: number;
  charisma: number;
}

/**
 * Status effect interface
 */
export interface StatusEffect {
  id: string;
  name: 'cursed_hands_debuff' | string;
  description?: string;
  duration: number;
  effects?: Partial<PlayerStats>;
  startTime?: number;
  type?: string;
  category?: string;
  potency?: number;
}

/**
 * Trait slot interface
 */
export interface TraitSlot {
  id: string;
  slotIndex: number;
  traitId: string | null;
  isLocked: boolean;
  unlockRequirement?: string;
}

/**
 * Core Player state interface
 */
export interface PlayerState {
  baseStats: PlayerBaseStats; // Holds the stats before trait/effect modifications
  stats: PlayerStats;         // Holds the final, calculated stats
  
  attributes: PlayerAttributes;
  
  availableAttributePoints: number;
  availableSkillPoints: number;
  resonanceLevel: number;
  maxTraitSlots: number;
  
  statusEffects: StatusEffect[];
  permanentTraits: string[];
  traitSlots: TraitSlot[];
  
  totalPlaytime: number;
  isAlive: boolean;
  location: string; // Current location of the player
  gold: number;
}