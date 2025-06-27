/**
 * @file NPCs Feature Barrel Export
 * @description Public API for the NPCs feature following Feature-Sliced Design
 */

// Types
export type {
  NPC,
  NPCState,
  NPCTraitInfo,
  NPCSharedTraitSlot,
  NPCService,
  NPCPersonality,
  NPCInteraction,
  DialogueEntry,
  RelationshipChangeEntry,
  NPCStatus,
  InteractionType,
  InteractionResult,
} from './state/NPCTypes';

// State management
export {
  default as npcReducer,
  npcActions,
  updateNpcRelationship,
  setRelationshipValue,
  increaseConnectionDepth,
  addRelationshipChangeEntry,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  setLoading,
  setError,
  setNPCs,
  setSelectedNPCId,
  debugUnlockAllSharedSlots,
  updateNpcConnectionDepth,
} from './state/NPCSlice';

// Async thunks
export {
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  updateNPCConnectionDepthThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  shareTraitWithNPCThunk,
} from './state/NPCThunks';

// Selectors
export * from './state/NPCSelectors';

// Components
export { NPCListView } from './components/containers/NPCListView';
export { NPCPanelContainer } from './components/containers/NPCPanelContainer';
export type { NPCPanelContainerProps } from './components/containers/NPCPanelContainer';
// Export the debug panel as well, so it can be used on the debug page
export { NPCDebugPanel } from './components/ui/NPCDebugPanel';

// Mock data (for development/testing)
export { mockNPCs } from './data/mockNPCData';