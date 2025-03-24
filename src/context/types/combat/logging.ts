/**
 * Combat logging system
 */

import { 
  CombatActionType, 
  CombatActionResult, 
  CombatSource, 
  CombatTarget,
  DamageType 
} from './basic';

/**
 * Combat log entry for damage events
 */
export interface CombatLogDamageEntry {
  type: 'damage';
  source: CombatSource;
  target: CombatTarget;
  amount: number;
  damageType: DamageType;
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
  source: CombatSource;
  target: CombatTarget;
  message: string;
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
  message: string;         // Human-readable description
}

/**
 * Simple log entry for hooks
 */
export interface SimpleLogEntry {
  timestamp: number;
  message: string;
  type: string;
  importance: "normal" | "high";
}

/**
 * Type guard to check if an object is a SimpleLogEntry
 */
export function isSimpleLogEntry(entry: any): entry is SimpleLogEntry {
  return entry && 
    typeof entry.timestamp === 'number' &&
    typeof entry.message === 'string' &&
    typeof entry.type === 'string' &&
    (entry.importance === 'normal' || entry.importance === 'high');
}

/**
 * Union type for all log entry types in the system
 */
export type AnyLogEntry = SimpleLogEntry | CombatLogEntry;

export { SimpleLogEntry };
