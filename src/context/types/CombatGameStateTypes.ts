/**
 * @file CombatGameStateTypes.ts
 * @description Type definitions specifically related to the combat system
 * 
 * This file contains all the interfaces and types that define the combat system,
 * including combat state, skills, enemy data, and combat actions.
 */

// Import GameItem for proper typing of rewards
import { GameItem } from './InventoryGameStateTypes';

/**
 * Damage types in the combat system
 */
export enum DamageType {
  Physical = 'physical',
  Fire = 'fire',
  Ice = 'ice',
  Lightning = 'lightning',
  Poison = 'poison',
  Magical = 'magical'
}

/**
 * Resource types used in combat rewards and costs
 */
export type ResourceType = 
  | 'gold' 
  | 'experience' 
  | 'essence' 
  | 'mana' 
  | 'health' 
  | 'stamina';

/**
 * Environment types for combat locations
 */
export type EnvironmentType = 
  | 'forest' 
  | 'desert' 
  | 'mountain' 
  | 'dungeon' 
  | 'cave' 
  | 'castle' 
  | 'plains' 
  | 'swamp' 
  | 'ocean';

// Define a type for combat sources to improve type safety
export type CombatSource = 
  | 'player' 
  | 'enemy' 
  | 'item' 
  | 'ability' 
  | 'environment' 
  | 'trap'
  | 'status_effect' 
  | 'system';

// Define a type for combat targets to improve type safety
export type CombatTarget = 
  | 'player'
  | 'enemy'
  | 'all'
  | 'self'
  | 'allies'
  | 'enemies';

/**
 * Status effect that can be applied during combat
 */
export interface StatusEffect {
  id: string;               // Unique identifier
  name: string;             // Display name
  description: string;      // Description of effect
  duration: number;         // Number of turns effect lasts
  strength?: number;        // Power/magnitude of the effect
  type: 'buff' | 'debuff';  // Whether it's beneficial or harmful
  damageOverTime?: number;  // Damage applied each turn
  damageType?: DamageType;  // Type of damage dealt
  statsModifier?: Record<string, number>; // Stat modifications
  sourceId?: string;        // ID of the entity that applied this effect
  iconPath?: string;        // Path to icon for UI display
}

/**
 * Effect that can be applied by skills or abilities
 */
export interface Effect {
  id: string;
  name: string;
  description?: string;
  duration: number;
  strength: number;
  type: 'buff' | 'debuff' | 'damage' | 'heal' | 'status';
  statusEffect?: StatusEffect;
  damageType?: DamageType;
}

/**
 * Combat skill definition
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown?: number;
  effect: Effect;
  manaCost?: number;
  requiredLevel?: number;
  targeting: 'single' | 'all' | 'self' | 'random';
  iconPath?: string;
}

/**
 * Special ability that can be used in combat
 */
export interface Ability {
  id: string;
  name: string;
  description: string;
  effect: Effect;
  cooldown?: number;
  currentCooldown?: number;
  charges?: number;
  requiredResource?: number;
  iconPath?: string;
}

/**
 * Combat skills for the player
 */
export interface CombatSkills {
  swordplay: number;
  archery: number;
  defense: number;
  dualWielding: number;
  [key: string]: number; // For additional skills
}

/**
 * Base interface for any actor in combat (player or enemy)
 */
export interface CombatActor {
  id: string;               // Unique identifier
  name: string;             // Display name
  type: 'player' | 'enemy'; // Actor type (player or enemy)
  currentHealth: number;    // Current health points
  maxHealth: number;        // Maximum health points
  mana?: number;            // Current mana points
  maxMana?: number;         // Maximum mana points
  attack: number;           // Base attack power
  defense: number;          // Base defense power
  speed: number;            // Determines turn order
  level?: number;           // Actor level
  skills: Skill[];          // Skills available (empty array if none)
  statusEffects: StatusEffect[]; // Active status effects
  critChance?: number;      // Chance to land critical hits (0-1)
  dodgeChance?: number;     // Chance to dodge attacks (0-1)
  resistances?: Partial<Record<DamageType, number>>; // Damage resistances
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

/**
 * Item that can be dropped by enemies
 */
export interface LootItem {
  id: string;
  name: string;
  quantity: number;
  dropChance: number; // 0-1 probability
  minQuantity?: number;
  maxQuantity?: number;
  requiredLevel?: number;
}

/**
 * Combat log entry for damage events
 */
export interface CombatLogDamageEntry {
  type: 'damage';
  source: CombatSource;
  target: CombatTarget;
  amount: number;
  damageType: DamageType | string;
  critical: boolean;
}

/**
 * Combat log entry for healing events
 */
export interface CombatLogHealEntry {
  type: 'heal';
  source: CombatSource;
  target: CombatTarget;
  amount: number;
  healType: 'potion' | 'spell' | 'ability' | 'passive' | string;
}

/**
 * Combat log entry for status effect events
 */
export interface CombatLogStatusEntry {
  type: 'status';
  source: CombatSource;
  target: CombatTarget;
  effect: string;
  duration: number;
}

/**
 * Combat log entry for misc events
 */
export interface CombatLogMiscEntry {
  type: 'misc';
  source: CombatSource;    // Made required for consistency
  target: CombatTarget;    // Made required for consistency
  message: string;         // Description of the event
}

/**
 * Union type for all combat log data
 */
export type CombatLogData = 
  | CombatLogDamageEntry 
  | CombatLogHealEntry 
  | CombatLogStatusEntry
  | CombatLogMiscEntry;

/**
 * An entry in the combat log
 */
export interface CombatLogEntry {
  timestamp: number;       // Unix timestamp for easy sorting
  source: CombatSource;    // Source of the action
  action: CombatActionType; // Type of action performed
  target: CombatTarget;    // Target of the action
  result: CombatActionResult; // Result of the action
  data: CombatLogData;     // Detailed data about the event
  message: string;         // Human-readable description (now required)
}

/**
 * Rewards given after combat
 */
export interface CombatRewards {
  experience: number;
  gold: number;
  items: GameItem[];
  bonusLoot?: GameItem[];
}

/**
 * Possible results of a combat action
 */
export type CombatActionResult = 
  | 'hit' 
  | 'miss' 
  | 'critical' 
  | 'block' 
  | 'dodge' 
  | 'immune' 
  | 'resisted';

/**
 * Combat state object
 */
export interface CombatState {
  inCombat: boolean;         // Whether combat is active
  playerTurn: boolean;       // Whether it's the player's turn
  round: number;             // Current combat round
  combatants: CombatActor[]; // All actors in combat
  combatLog: CombatLogEntry[]; // History of combat actions
  rewards?: CombatRewards;   // Rewards for victory
  activeEffects: Record<'player' | 'enemy', StatusEffect[]>; // Active effects
  lastUpdated: number;       // Timestamp of last update (made required)
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare'; // Made required
  environment: EnvironmentType; // Combat location (now typed and required)
  isAutoMode: boolean;       // Whether auto-combat is enabled (made required)
}

/**
 * Action type for combat actions
 */
export type CombatActionType =
  | 'attack'
  | 'skill'
  | 'defend'
  | 'item'
  | 'flee'
  | 'special';
