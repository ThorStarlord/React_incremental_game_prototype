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

/** Bounded routines whose manual experience may unlock later Copy delegation. */
export type RoutineFamiliarityId = 'forge_assistance' | 'resonance_calibration';

export type RoutineFamiliaritySource =
  | 'city_center_forge_assistance'
  | 'trait_resonance';

export interface RoutineFamiliarityRecord {
  source: RoutineFamiliaritySource;
  learnedAt: number;
}

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
  name: string;
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

  /**
   * Player-owned knowledge that a bounded routine has been personally learned.
   * Optional for backward-compatible current-schema saves created before the
   * Checkpoint C repair; absence safely means unfamiliar.
   */
  routineFamiliarity?: Partial<Record<RoutineFamiliarityId, RoutineFamiliarityRecord>>;
  
  totalPlaytime: number;
  isAlive: boolean;
  location: string; // Current location of the player
  gold: number;
}