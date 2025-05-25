/**
 * @file index.ts
 * @description Barrel export file for the NPCs feature
 */

// Essential exports for NPCsPage functionality
export { default as NPCPanel } from './components/containers/NPCPanel';

// State exports
export * from './state/NpcSlice';
export * from './state/NpcSelectors';
export * from './state/NpcTypes';
export { default as npcReducer } from './state/NpcSlice';
