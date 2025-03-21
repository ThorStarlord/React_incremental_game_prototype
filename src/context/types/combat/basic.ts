/**
 * Basic combat type definitions
 */

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
export enum ResourceType {
  Gold = 'gold',
  Experience = 'experience',
  Essence = 'essence',
  Mana = 'mana',
  Health = 'health',
  Stamina = 'stamina'
}

/**
 * Environment types for combat locations
 */
export enum EnvironmentType {
  Forest = 'forest',
  Desert = 'desert',
  Mountain = 'mountain',
  Dungeon = 'dungeon',
  Cave = 'cave',
  Castle = 'castle',
  Plains = 'plains',
  Swamp = 'swamp',
  Ocean = 'ocean'
}

/**
 * Combat source types
 */
export enum CombatSource {
  Player = 'player',
  Enemy = 'enemy',
  Item = 'item',
  Ability = 'ability',
  Environment = 'environment',
  Trap = 'trap',
  StatusEffect = 'status_effect',
  System = 'system'
}

/**
 * Combat target types
 */
export enum CombatTarget {
  Player = 'player',
  Enemy = 'enemy',
  All = 'all',
  Self = 'self',
  Allies = 'allies',
  Enemies = 'enemies'
}

/**
 * Action type for combat actions
 */
export enum CombatActionType {
  Attack = 'attack',
  Skill = 'skill',
  Defend = 'defend',
  Item = 'item',
  Flee = 'flee',
  Special = 'special'
}

/**
 * Possible results of a combat action
 */
export enum CombatActionResult {
  Hit = 'hit',
  Miss = 'miss',
  Critical = 'critical',
  Block = 'block',
  Dodge = 'dodge',
  Immune = 'immune',
  Resisted = 'resisted'
}

/**
 * Combat status enum
 */
export enum CombatStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PLAYER_VICTORY = 'PLAYER_VICTORY',
  PLAYER_DEFEAT = 'PLAYER_DEFEAT',
  FLED = 'FLED'
}
