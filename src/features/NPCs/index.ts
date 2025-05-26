/**
 * @file NPCs Feature Barrel Export
 * @description Public API for the NPCs feature following Feature-Sliced Design
 */

// Types - Using correct file name
export type {
  NPC,
  NPCState,
  NPCTraitInfo,
  NPCSharedTraitSlot,
  TradeItem,
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
  TradeWithNPCPayload,
  NPCFilterCriteria,
  NPCSortOptions,
  InteractionResult,
  DialogueResult,
  DialogueChoice
} from './state/NPCTypes';

// State management - Using correct file name
export { default as npcReducer } from './state/NPCSlice';
export {
  updateNpcRelationship,
  setNpcStatus,
  setNpcAvailability,
  startInteraction,
  endInteraction,
  addDialogueEntry,
  clearError,
  initializeNPCsThunk,
  updateNPCRelationshipThunk,
  processNPCInteractionThunk,
  discoverNPCThunk,
  processDialogueChoiceThunk
} from './state/NPCSlice';

// Selectors - Using correct file name
export * from './state/NPCSelectors';

// Components - Export the container component that exists
export { default as NPCListView } from './components/containers/NPCListView';

// Data
export { getMockNPCs, getMockTradeItems } from './data/mockNPCData';
