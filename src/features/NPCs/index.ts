/**
 * @file NPCs Feature Barrel Export
 * @description Public API for the NPCs feature following Feature-Sliced Design
 */

// Types
// FIXED: Removed non-existent payload and result types. Exporting only the core interfaces.
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
  InteractionResult, // This one exists, so we keep it.
} from './state/NPCTypes';

// State management
export {
  default as npcReducer,
  // Exporting all actions from the slice
  npcActions,
  updateNpcRelationship,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  setLoading,
  setError,
  setNPCs,
  selectNPC,
  debugUnlockAllSharedSlots,
  completeDialogueTopic,
  updateNpcConnectionDepth,
} from './state/NPCSlice';

// Async thunks
// FIXED: Removed non-existent thunks and added the correct ones.
export {
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  shareTraitWithNPCThunk,
} from './state/NPCThunks';

// Selectors
// Exporting all selectors is clean and efficient.
export * from './state/NPCSelectors';

// Components
export { default as NPCListView } from './components/containers/NPCListView';
export { default as NPCPanelContainer } from './components/containers/NPCPanelContainer';
export type { NPCPanelContainerProps } from './components/containers/NPCPanelContainer';

// Mock data (for development/testing)
export { mockNPCs } from './data/mockNPCData';