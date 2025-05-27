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
  UpdateNPCRelationshipPayload,
  DiscoverNPCPayload,
  StartInteractionPayload,
  ProcessDialoguePayload,
  ShareTraitPayload,
  InteractionResult,
  DialogueResult
} from './state/NPCTypes';

// State management
export { default as npcReducer } from './state/NPCSlice';
export {
  // Regular action creators (if they exist)
  updateNpcRelationship,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  // Async thunks (only export if they exist)
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  processDialogueChoiceThunk,
  shareTraitWithNPCThunk
} from './state/NPCSlice';

// Selectors
export * from './state/NPCSelectors';

// Components - Only export components that actually exist
export { default as NPCListView } from './components/containers/NPCListView';

// Mock data - Export the actual mockNPCs export
export { mockNPCs } from './data/mockNPCData';
