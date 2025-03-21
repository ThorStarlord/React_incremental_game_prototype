/**
 * Root export file for combat types
 */

// Import needed for the CombatEnemy type alias
import { Enemy } from './actors';

// Re-export all types from their respective modules
export * from './basic';
export * from './actors';
export * from './effects';
export * from './skills';
export * from './logging';
export * from './rewards';
export * from './state';
export * from './hooks';

// Add this type alias so Enemy can be imported as CombatEnemy
export type CombatEnemy = Enemy;
