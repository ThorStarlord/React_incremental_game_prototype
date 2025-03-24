/**
 * Combat Actors Module
 * 
 * Defines interfaces for entities that participate in combat.
 */

import { DamageType } from './basic';
import { StatusEffect } from './effects';
import { ActiveSkill } from './skills';
import { LootDrop } from './enemyTypes';

/**
 * Base interface for any actor in combat (player or enemy)
 */
export interface CombatActor {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Actor type */
  type: 'player' | 'enemy' | 'ally';
  
  /** Current health points */
  currentHealth: number;
  
  /** Maximum health points */
  maxHealth: number;
  
  /** Base attack power */
  attack: number;
  
  /** Base defense power */
  defense: number;
  
  /** Speed (affects turn order) */
  speed: number;
  
  /** Actor level */
  level: number;
  
  /** Available skills */
  skills: ActiveSkill[];
  
  /** Active status effects */
  statusEffects: StatusEffect[];
  
  /** Critical hit chance (0-1) */
  critChance: number;
  
  /** Dodge chance (0-1) */
  dodgeChance: number;
  
  /** Damage resistances by type */
  resistances: Record<DamageType, number>;
}

/**
 * Interface for combat actors that use mana
 */
export interface ManaUser extends CombatActor {
  /** Current mana points */
  mana: number;
  
  /** Maximum mana points */
  maxMana: number;
}

/**
 * Base enemy data interface (not for combat)
 */
export interface BaseEnemy {
  id: string;
  name: string;
  level: number;
  maxHealth: number;
  attack: number;
  defense: number;
  baseHealth?: number;
  baseAttack?: number;
  baseDefense?: number;
  category?: string;
  enemyType?: string;
  imageUrl?: string;
  lootTable?: LootDrop[];
  experience?: number;
  gold?: number;
}

/**
 * Combat-ready Enemy interface
 * Combines BaseEnemy with CombatActor for use in combat scenarios
 */
export interface Enemy extends CombatActor {
  /** Always 'enemy' for Enemy type */
  type: 'enemy';
  
  /** Enemy classification */
  enemyType: string;
  
  /** Experience reward when defeated */
  experience: number;
  
  /** Gold reward when defeated */
  gold: number;
  
  /** Loot table for drops */
  lootTable: LootDrop[];
  
  /** Special abilities */
  abilities: Ability[];
  
  /** Damage types that cause no damage */
  immunities: DamageType[];
  
  /** Damage types that cause increased damage */
  weaknesses: DamageType[];
  
  /** Base health for scaling */
  baseHealth: number;
  
  /** Base attack for scaling */
  baseAttack: number;
  
  /** Base defense for scaling */
  baseDefense: number;
  
  /** Image URL for display */
  imageUrl?: string;
}

/**
 * Interface for enemy abilities
 */
export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  isAoE?: boolean;
  manaCost?: number;
  damageMultiplier?: number;
  effectId?: string;
}

/**
 * Player character in combat
 */
export interface Player extends ManaUser {
  // Note: We don't redefine 'type' as it's inherited from CombatActor
  /** Player class */
  characterClass: string;
  
  /** Current experience points */
  experience: number;
  
  /** Experience points needed for next level */
  experienceToNextLevel: number;
  
  /** Inventory items available in combat */
  inventory: Item[];
  
  /** Additional player stats */
  stats: Record<string, number>;
}

/**
 * Interface for inventory items
 */
export interface Item {
  id: string;
  name: string;
  description?: string;
  type: string;
  value?: number;
  quantity: number;
  effect?: Record<string, any>;
  rarity?: string;
  usable?: boolean;
}
