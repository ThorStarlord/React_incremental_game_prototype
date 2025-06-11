/**
 * Type definitions for the Player system
 */

/**
 * Player statistics interface
 */
export interface PlayerStats {
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
  description: string;
  duration: number;
  effects: Partial<PlayerStats>;
  startTime: number;
  type?: string;
  category?: string;
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
  // Direct stat properties (flattened from nested stats object)
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
  
  // Attributes
  attributes: PlayerAttributes;
  
  // Progression
  availableAttributePoints: number;
  availableSkillPoints: number;
  resonanceLevel: number;
  maxTraitSlots: number;
  
  // Traits and effects
  statusEffects: StatusEffect[];
  permanentTraits: string[];
  traitSlots: TraitSlot[];
  
  // Character state
  totalPlaytime: number;
  isAlive: boolean;
}
