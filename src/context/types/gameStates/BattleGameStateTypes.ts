/**
 * Type definitions for battle system that reuses combat system types
 * This file imports types from CombatGameStateTypes.ts to avoid duplication
 * and extends them with battle-specific functionality if needed.
 */

// Import types from the combat system
import {
  // Enums
  DamageType,
  ResourceType,
  EnvironmentType,
  CombatSource,
  CombatTarget,
  CombatActionType,
  CombatActionResult,
  CombatStatus,
  
  // Interfaces
  StatusEffect,
  Effect,
  Skill,
  ActiveSkill,
  Ability,
  CombatActor,
  ManaUser,
  Enemy,
  LootItem,
  CombatLogEntry,
  CombatLogData,
  CombatRewards,
  CombatState,
  CombatStateContainer,
  CombatEffect,
  HookCombatState,
  ExtendedCombatState // Import the ExtendedCombatState from combat/hooks
} from '../combat';

// Import specific types from their source modules
import { CombatSkills } from '../combat/skills';
import { UseCombatLogicProps } from '../combat/hooks';

// Re-export types for use in battle components
export {
  // Enums
  DamageType,
  ResourceType,
  EnvironmentType,
  CombatSource,
  CombatTarget,
  CombatActionType,
  CombatActionResult,
  CombatStatus,
  
  // Interfaces
  StatusEffect,
  Effect,
  Skill,
  ActiveSkill,
  Ability,
  CombatActor,
  ManaUser,
  Enemy,
  LootItem,
  CombatLogEntry,
  CombatLogData,
  CombatRewards,
  CombatState,
  CombatStateContainer,
  CombatEffect,
  HookCombatState,
  ExtendedCombatState,
  
  // Types from specific modules
  CombatSkills,
  UseCombatLogicProps
};

/**
 * Battle Result interface - specific to the Battle component
 */
export interface BattleResult {
  victory: boolean;
  rewards: Partial<CombatRewards>;
  retreat: boolean;
}

/**
 * Enemy stats used in battle UI components
 */
export interface BattleEnemyStats {
  id?: string;
  name?: string;
  currentHealth: number;  // Required property
  maxHealth: number;      // Required property
  attack?: number;
  defense?: number;
  level?: number;
}

/**
 * Interface for battle actions
 */
export interface BattleAction {
  type: CombatActionType;
  target?: string;
  skillId?: string;
  itemId?: string;
  timestamp: number;
}

/**
 * Interface for battle hooks props
 */
export interface UseBattleHookProps {
  player: any;
  dungeonId: string;
  dispatch: any;
  difficulty?: 'easy' | 'normal' | 'hard' | 'nightmare';
  calculatedStats?: any;
  modifiers?: any;
  onComplete: (result: BattleResult) => void;
  onVictory?: () => void;
  onDefeat?: () => void;
  showTraitEffect?: (traitId: string, x: number, y: number) => void;
}

/**
 * Extended battle result with more detailed information
 */
export interface DetailedBattleResult extends BattleResult {
  playerStats?: Record<string, number>;
  enemyStats?: Record<string, number>;
  turns: number;
  logEntries: CombatLogEntry[];
  damageDealt: number;
  damageTaken: number;
  healingDone: number;
  effectsApplied: number;
  criticalHits: number;
}
