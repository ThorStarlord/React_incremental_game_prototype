/**
 * @file UI Components Barrel Export
 * @description Exports for NPC UI components
 */

// Core UI Components
export { default as NPCPanelUI } from './NPCPanelUI';
export { default as NPCHeader } from './NPCHeader';
export { default as RelationshipProgress } from './RelationshipProgress';

// Tab Components
export { default as NPCOverviewTab } from './tabs/NPCOverviewTab';
export { default as NPCDialogueTab } from './tabs/NPCDialogueTab';
export { default as NPCTraitsTab } from './tabs/NPCTraitsTab';
export { default as NPCQuestsTab } from './tabs/NPCQuestsTab';
export { default as NPCTradeTab } from './tabs/NPCTradeTab';
export { default as NPCRelationshipTab } from './tabs/NPCRelationshipTab';

// Re-export types
export type { NPCPanelUIProps } from './NPCPanelUI';
