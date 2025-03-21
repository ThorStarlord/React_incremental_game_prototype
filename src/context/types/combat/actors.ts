/**
 * Combat actors (player and enemies)
 */

import { DamageType } from './basic';
import { StatusEffect } from './effects';
import { ActiveSkill, Ability } from './skills';
import { LootItem } from './rewards';

/**
 * Base interface for any actor in combat (player or enemy)
 */
export interface CombatActor {
  id: string;               // Unique identifier
  name: string;             // Display name
  type: 'player' | 'enemy'; // Actor type (player or enemy)
  currentHealth: number;    // Current health points
  maxHealth: number;        // Maximum health points
  attack: number;           // Base attack power
  defense: number;          // Base defense power
  speed: number;            // Determines turn order
  level: number;            // Actor level
  skills: ActiveSkill[];    // Skills available (empty array if none)
  statusEffects: StatusEffect[]; // Active status effects
  critChance: number;       // Chance to land critical hits (0-1)
  dodgeChance: number;      // Chance to dodge attacks (0-1)
  resistances: Record<DamageType, number>; // Damage resistances
}

/**
 * Interface for actors that use mana
 */
export interface ManaUser extends CombatActor {
  mana: number;            // Current mana points
  maxMana: number;         // Maximum mana points
}

/**
 * Enemy definition with combat properties
 */
export interface Enemy extends CombatActor {
  type: 'enemy';            // Always 'enemy' for Enemy type
  enemyType: string;        // Type of enemy (goblin, dragon, etc.)
  experience: number;       // XP rewarded when defeated
  gold: number;             // Gold rewarded when defeated
  lootTable: LootItem[];    // Possible item drops
  abilities: Ability[];     // Special abilities
  immunities: DamageType[]; // Damage types that cause no damage
  weaknesses: DamageType[]; // Damage types that cause increased damage
  baseHealth: number;       // Base health for scaling
  baseAttack: number;       // Base attack for scaling
  baseDefense: number;      // Base defense for scaling
  imageUrl?: string;        // Image URL for display
  spawnRate?: number;       // Relative spawn frequency
  faction?: string;         // Faction this enemy belongs to
  isBoss?: boolean;         // Whether this is a boss enemy
}
