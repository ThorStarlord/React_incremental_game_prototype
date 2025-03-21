/**
 * @file CombatGameStateTypes.ts
 * @description Type definitions specifically related to the combat system
 * 
 * This file serves as a compatibility layer for the modularized combat types.
 * It re-exports all types from the combat directory for backward compatibility.
 * 
 * New code should import directly from the modular structure:
 * import { CombatActor, Enemy } from '../types/combat/actors';
 */

// Re-export everything from the modular structure
export * from './combat';
