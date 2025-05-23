/**
 * @file index.ts
 * @description Barrel export file for the NPCs feature
 */

// Essential exports for NPCsPage functionality
export { default as NPCPanel } from './components/containers/NPCPanel';

// State exports
export * from './state/NPCTypes';
export { npcActions } from './state/NPCSlice';
export { default as npcReducer } from './state/NPCSlice';
