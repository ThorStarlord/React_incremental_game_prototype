/**
 * Combat-related action type definitions
 * 
 * This module defines the types and interfaces for combat actions
 * in the game.
 * 
 * @module combatActionTypes
 */

/**
 * Combat action type constants
 */
export const COMBAT_ACTIONS = {
  START_COMBAT: 'combat/start' as const,
  END_COMBAT: 'combat/end' as const,
  PERFORM_ATTACK: 'combat/performAttack' as const,
  USE_ABILITY: 'combat/useAbility' as const,
  TAKE_DAMAGE: 'combat/takeDamage' as const,
  HEAL_CHARACTER: 'combat/healCharacter' as const,
  APPLY_STATUS_EFFECT: 'combat/applyStatusEffect' as const,
  REMOVE_STATUS_EFFECT: 'combat/removeStatusEffect' as const,
  RETREAT_FROM_COMBAT: 'combat/retreat' as const,
  COLLECT_COMBAT_REWARDS: 'combat/collectRewards' as const,
  ENEMY_ACTION: 'combat/enemyAction' as const,
  UPDATE_COMBAT_STATE: 'combat/updateState' as const,

  /**
   * Start a random encounter with an enemy
   */
  START_ENCOUNTER: 'combat/startEncounter',

  /**
   * Player performs an attack action
   */
  ATTACK_ACTION: 'combat/attackAction',

  /**
   * Player uses a combat skill
   */
  USE_COMBAT_SKILL: 'combat/useCombatSkill',

  /**
   * End current turn in combat
   */
  END_TURN: 'combat/endTurn',

  /**
   * Attempt to flee from combat
   */
  FLEE_COMBAT: 'combat/fleeCombat',

  /**
   * Collect loot after combat
   */
  COLLECT_LOOT: 'combat/collectLoot'
};

// Create a union type of all combat action types
export type CombatActionType = typeof COMBAT_ACTIONS[keyof typeof COMBAT_ACTIONS];

/**
 * Base combat action interface
 */
export interface CombatAction {
  type: CombatActionType;
  payload?: any;
}

// Enemy interface
export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  stats?: Record<string, number>;
  [key: string]: any;
}

// Combat Statistics interface
export interface CombatStatistics {
  damageDealt?: number;
  damageTaken?: number;
  turnsElapsed?: number;
  criticalHits?: number;
  abilitiesUsed?: number;
  [key: string]: any;
}

// Ability option interface
export interface AbilityOptions {
  powerModifier?: number;
  ignoreDefense?: boolean;
  areaOfEffect?: boolean;
  [key: string]: any;
}

// Status effect data interface
export interface EffectData {
  strength?: number;
  tickDamage?: number;
  statModifiers?: Record<string, number>;
  [key: string]: any;
}

// Combat reward items interface
export interface RewardItem {
  id: string;
  name: string;
  type: string;
  rarity?: string;
  [key: string]: any;
}

// Reputation changes interface
export interface ReputationChanges {
  [factionId: string]: number;
}

// Enemy action data interface
export interface EnemyActionData {
  targetId?: string;
  abilityId?: string;
  damage?: number;
  [key: string]: any;
}

// Action payload interfaces
export interface StartCombatPayload {
  enemies: Enemy[];
  location: string;
  ambush: boolean;
  startTime: number;
  turn: 'player' | 'enemy';
  round: number;
}

export interface EndCombatPayload {
  result: 'victory' | 'defeat' | 'retreat';
  statistics: CombatStatistics;
  endTime: number;
}

export interface PerformAttackPayload {
  attackerId: string;
  targetId: string;
  attackType: string;
  modifiers: Record<string, any>;
  timestamp: number;
}

export interface UseAbilityPayload {
  characterId: string;
  abilityId: string;
  targetIds: string[];
  options: AbilityOptions;
  timestamp: number;
}

export interface TakeDamagePayload {
  targetId: string;
  amount: number;
  damageType: string;
  sourceId: string | null;
  timestamp: number;
}

export interface HealCharacterPayload {
  targetId: string;
  amount: number;
  healType: string;
  sourceId: string | null;
  timestamp: number;
}

export interface ApplyStatusEffectPayload {
  targetId: string;
  effectId: string;
  duration: number;
  effectData: EffectData;
  sourceId: string | null;
  timestamp: number;
}

export interface RemoveStatusEffectPayload {
  targetId: string;
  effectId: string;
  reason: string;
  timestamp: number;
}

export interface RetreatFromCombatPayload {
  successful: boolean;
  penaltyPercent: number;
  timestamp: number;
}

export interface CollectCombatRewardsPayload {
  experience: number;
  items: RewardItem[];
  currency: number;
  reputation: ReputationChanges;
  timestamp: number;
}

export interface EnemyActionPayload {
  enemyId: string;
  actionType: string;
  actionData: EnemyActionData;
  timestamp: number;
}

export interface UpdateCombatStatePayload {
  [key: string]: any;
  timestamp: number;
}

// Typed action templates
export type StartCombatAction = { type: typeof COMBAT_ACTIONS.START_COMBAT; payload: StartCombatPayload };
export type EndCombatAction = { type: typeof COMBAT_ACTIONS.END_COMBAT; payload: EndCombatPayload };
export type PerformAttackAction = { type: typeof COMBAT_ACTIONS.PERFORM_ATTACK; payload: PerformAttackPayload };
export type UseAbilityAction = { type: typeof COMBAT_ACTIONS.USE_ABILITY; payload: UseAbilityPayload };
export type TakeDamageAction = { type: typeof COMBAT_ACTIONS.TAKE_DAMAGE; payload: TakeDamagePayload };
export type HealCharacterAction = { type: typeof COMBAT_ACTIONS.HEAL_CHARACTER; payload: HealCharacterPayload };
export type ApplyStatusEffectAction = { type: typeof COMBAT_ACTIONS.APPLY_STATUS_EFFECT; payload: ApplyStatusEffectPayload };
export type RemoveStatusEffectAction = { type: typeof COMBAT_ACTIONS.REMOVE_STATUS_EFFECT; payload: RemoveStatusEffectPayload };
export type RetreatFromCombatAction = { type: typeof COMBAT_ACTIONS.RETREAT_FROM_COMBAT; payload: RetreatFromCombatPayload };
export type CollectCombatRewardsAction = { type: typeof COMBAT_ACTIONS.COLLECT_COMBAT_REWARDS; payload: CollectCombatRewardsPayload };
export type EnemyActionAction = { type: typeof COMBAT_ACTIONS.ENEMY_ACTION; payload: EnemyActionPayload };
export type UpdateCombatStateAction = { type: typeof COMBAT_ACTIONS.UPDATE_COMBAT_STATE; payload: UpdateCombatStatePayload };

/**
 * Union of all typed combat actions
 */
export type TypedCombatAction =
  | StartCombatAction
  | EndCombatAction
  | PerformAttackAction
  | UseAbilityAction
  | TakeDamageAction
  | HealCharacterAction
  | ApplyStatusEffectAction
  | RemoveStatusEffectAction
  | RetreatFromCombatAction
  | CollectCombatRewardsAction
  | EnemyActionAction
  | UpdateCombatStateAction;