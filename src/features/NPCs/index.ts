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
export { default as npcReducer,
  // Regular action creators
  updateNpcRelationship,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  setLoading, // Added
  setError,   // Added
  setNPCs     // Added
} from './state/NPCSlice';

// Async thunks
export {
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  processDialogueChoiceThunk,
  shareTraitWithNPCThunk,
  fetchNPCsThunk // Added
} from './state/NPCThunks';

// Selectors
export * from './state/NPCSelectors';

// Components - Only export components that actually exist
export { default as NPCListView } from './components/containers/NPCListView';

// Mock data - Export the actual mockNPCs export
export { mockNPCs } from './data/mockNPCData';
