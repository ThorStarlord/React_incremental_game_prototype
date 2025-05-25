/**
 * @file NPCSlice.ts
 * @description Redux Toolkit slice for managing NPC state with comprehensive relationship,
 * dialogue, trading, and quest systems
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  NPCState, 
  NPC,
  UpdateRelationshipPayload,
  StartDialoguePayload,
  CompleteDialoguePayload,
  DiscoverNPCPayload,
  TradeWithNPCPayload,
  ShareTraitPayload,
  NPCRelationshipChange
} from './NPCTypes';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Default auto-save key for NPC state in localStorage */
const NPC_STORAGE_KEY = 'gameData_npcs' as const;

/** Relationship thresholds for connection depth calculation */
const RELATIONSHIP_THRESHOLDS = {
  BELOVED: 90,
  TRUSTED: 75,
  ALLY: 50,
  FRIEND: 25,
  ACQUAINTANCE: 10,
  NEUTRAL: 0
} as const;

/** Default relationship boost values */
const RELATIONSHIP_BOOSTS = {
  TRADE: 1,
  QUEST_COMPLETION: 5
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates connection depth based on relationship value
 * @param relationshipValue - Current relationship value (0-100)
 * @returns Connection depth level (0-5)
 */
const calculateConnectionDepth = (relationshipValue: number): number => {
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.BELOVED) return 5;
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.TRUSTED) return 4;
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.ALLY) return 3;
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.FRIEND) return 2;
  if (relationshipValue >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return 1;
  return 0;
};

/**
 * Validates NPC ID exists in state
 * @param state - Current NPCState
 * @param npcId - NPC ID to validate
 * @returns Boolean indicating if NPC exists
 */
const validateNPCExists = (state: NPCState, npcId: string): boolean => {
  return Boolean(state.npcs[npcId]);
};

/**
 * Clamps relationship value to valid range (0-100)
 * @param value - Raw relationship value
 * @returns Clamped value between 0 and 100
 */
const clampRelationshipValue = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: NPCState = {
  npcs: {
    'npc-1': {
      id: 'npc-1',
      name: 'Elena',
      description: 'A friendly village healer known for her wisdom and compassion. She tends to the wounded and sick with unwavering dedication.',
      location: 'Village Square',
      relationshipValue: 25,
      connectionDepth: 1,
      loyalty: 30,
      status: 'idle',
      traits: {},
      sharedTraitSlots: [],
      isDiscovered: true,
      isAvailable: true,
      completedDialogues: [],
      completedQuests: [],
      availableQuests: ['quest-1', 'quest-2'],
      availableDialogues: ['intro', 'healing', 'village-news'],
      teachableTraits: ['healing-touch', 'compassionate-care'],
      personality: {
        traits: ['kind', 'patient', 'wise'],
        likes: ['helping others', 'herbal medicine', 'peaceful conversations'],
        dislikes: ['violence', 'selfishness', 'rushing'],
        motivations: ['heal the sick', 'protect the village', 'pass on knowledge'],
        conversationStyle: 'friendly' // Changed from 'gentle' to likely valid value
      }
    },
    'npc-2': {
      id: 'npc-2',
      name: 'Marcus',
      description: 'A gruff but skilled warrior who trains the village guard. Despite his stern exterior, he cares deeply about protecting his community.',
      location: 'Training Grounds',
      relationshipValue: 10,
      connectionDepth: 0,
      loyalty: 15,
      status: 'idle',
      traits: {},
      sharedTraitSlots: [],
      isDiscovered: true,
      isAvailable: true,
      completedDialogues: [],
      completedQuests: [],
      availableQuests: ['quest-3'],
      availableDialogues: ['intro', 'training', 'combat-tips'],
      teachableTraits: ['combat-expertise', 'defensive-stance'],
      personality: {
        traits: ['disciplined', 'protective', 'straightforward'],
        likes: ['training', 'discipline', 'honest combat'],
        dislikes: ['cowardice', 'dishonesty', 'weakness'],
        motivations: ['train strong defenders', 'protect the village', 'maintain order'],
        conversationStyle: 'formal' // Changed from 'direct' to likely valid value
      }
    }
  },
  discoveredNPCs: ['npc-1', 'npc-2'],
  currentInteraction: null,
  dialogueHistory: {},
  relationshipChanges: [],
  loading: false,
  error: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Initialize NPCs from provided data
 * @param npcData - Record of NPC data keyed by ID
 */
export const initializeNPCsThunk = createAsyncThunk(
  'npcs/initialize',
  async (npcData: Record<string, NPC>, { rejectWithValue }) => {
    try {
      if (!npcData || typeof npcData !== 'object') {
        throw new Error('Invalid NPC data provided');
      }
      
      return npcData;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize NPCs';
      return rejectWithValue(message);
    }
  }
);

/**
 * Save current NPC state to localStorage
 */
export const saveNPCStateThunk = createAsyncThunk(
  'npcs/saveState',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { npcs: NPCState };
      const npcState = state.npcs;
      
      const serializedState = JSON.stringify(npcState);
      localStorage.setItem(NPC_STORAGE_KEY, serializedState);
      
      return npcState;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save NPC state';
      return rejectWithValue(message);
    }
  }
);

/**
 * Load NPC state from localStorage
 */
export const loadNPCStateThunk = createAsyncThunk(
  'npcs/loadState',
  async (_, { rejectWithValue }) => {
    try {
      const savedState = localStorage.getItem(NPC_STORAGE_KEY);
      
      if (!savedState) {
        return null;
      }
      
      const parsedState = JSON.parse(savedState) as NPCState;
      
      // Basic validation of loaded state structure
      if (!parsedState.npcs || typeof parsedState.npcs !== 'object') {
        throw new Error('Invalid saved NPC state structure');
      }
      
      return parsedState;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load NPC state';
      return rejectWithValue(message);
    }
  }
);

// ============================================================================
// MAIN SLICE
// ============================================================================

export const npcSlice = createSlice({
  name: 'npcs',
  initialState,
  reducers: {
    // ========================================================================
    // NPC DISCOVERY REDUCERS
    // ========================================================================
    
    /**
     * Discover a new NPC and mark them as discovered
     * @param state - Current NPCState
     * @param action - Action with NPC ID and location
     */
    discoverNPC: (state, action: PayloadAction<DiscoverNPCPayload>) => {
      const { npcId, location } = action.payload;
      
      if (!npcId || !location) {
        state.error = 'Invalid discovery payload: missing NPC ID or location';
        return;
      }
      
      // Add to discovered list if not already present
      if (!state.discoveredNPCs.includes(npcId)) {
        state.discoveredNPCs.push(npcId);
      }
      
      // Update NPC state if it exists
      if (state.npcs[npcId]) {
        state.npcs[npcId].isDiscovered = true;
        state.npcs[npcId].location = location;
      }
      
      // Clear any previous errors
      state.error = null;
    },

    // ========================================================================
    // RELATIONSHIP MANAGEMENT REDUCERS
    // ========================================================================
    
    /**
     * Update NPC relationship value and track the change
     * @param state - Current NPCState
     * @param action - Action with relationship change data
     */
    updateRelationship: (state, action: PayloadAction<UpdateRelationshipPayload>) => {
      const { npcId, change, reason } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot update relationship: NPC '${npcId}' not found`;
        return;
      }
      
      if (typeof change !== 'number' || !reason) {
        state.error = 'Invalid relationship update payload';
        return;
      }
      
      const npc = state.npcs[npcId];
      const oldValue = npc.relationshipValue;
      const newValue = clampRelationshipValue(oldValue + change);
      
      npc.relationshipValue = newValue;
      npc.connectionDepth = calculateConnectionDepth(newValue);
      
      // Track relationship change for analytics/display
      const relationshipChange: NPCRelationshipChange = {
        npcId,
        oldValue,
        newValue,
        reason,
        timestamp: new Date(),
      };
      
      state.relationshipChanges.push(relationshipChange);
      
      // Keep only last 100 relationship changes to prevent memory bloat
      if (state.relationshipChanges.length > 100) {
        state.relationshipChanges = state.relationshipChanges.slice(-100);
      }
      
      state.error = null;
    },

    // ========================================================================
    // DIALOGUE SYSTEM REDUCERS
    // ========================================================================
    
    /**
     * Start a new dialogue interaction with an NPC
     * @param state - Current NPCState
     * @param action - Action with dialogue start data
     */
    startDialogue: (state, action: PayloadAction<StartDialoguePayload>) => {
      const { npcId, dialogueId } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot start dialogue: NPC '${npcId}' not found`;
        return;
      }
      
      if (!dialogueId) {
        state.error = 'Invalid dialogue ID provided';
        return;
      }
      
      state.currentInteraction = {
        npcId,
        type: 'dialogue',
        timestamp: new Date(),
        data: { dialogueId, currentNodeId: dialogueId },
      };
      
      state.error = null;
    },

    /**
     * Complete a dialogue interaction and apply effects
     * @param state - Current NPCState
     * @param action - Action with dialogue completion data
     */
    completeDialogue: (state, action: PayloadAction<CompleteDialoguePayload>) => {
      const { npcId, dialogueId, effects } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot complete dialogue: NPC '${npcId}' not found`;
        return;
      }
      
      const npc = state.npcs[npcId];
      
      // Mark dialogue as completed
      if (!npc.completedDialogues.includes(dialogueId)) {
        npc.completedDialogues.push(dialogueId);
      }
      
      // Add to dialogue history
      if (!state.dialogueHistory[npcId]) {
        state.dialogueHistory[npcId] = [];
      }
      if (!state.dialogueHistory[npcId].includes(dialogueId)) {
        state.dialogueHistory[npcId].push(dialogueId);
      }
      
      // Apply dialogue effects
      if (effects) {
        effects.forEach(effect => {
          if (effect.type === 'relationship' && typeof effect.value === 'number') {
            const oldValue = npc.relationshipValue;
            const newValue = clampRelationshipValue(oldValue + effect.value);
            npc.relationshipValue = newValue;
            npc.connectionDepth = calculateConnectionDepth(newValue);
          }
        });
      }
      
      // Update last interaction timestamp
      npc.lastInteraction = new Date();
      
      // Clear current interaction
      state.currentInteraction = null;
      state.error = null;
    },

    // ========================================================================
    // TRAIT SHARING REDUCERS
    // ========================================================================
    
    /**
     * Share a trait with an NPC in a specific slot
     * @param state - Current NPCState
     * @param action - Action with trait sharing data
     */
    shareTraitWithNPC: (state, action: PayloadAction<ShareTraitPayload>) => {
      const { npcId, traitId, slotIndex } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot share trait: NPC '${npcId}' not found`;
        return;
      }
      
      const npc = state.npcs[npcId];
      
      if (slotIndex < 0 || slotIndex >= npc.sharedTraitSlots.length) {
        state.error = `Invalid slot index: ${slotIndex}`;
        return;
      }
      
      if (!traitId) {
        state.error = 'Invalid trait ID provided';
        return;
      }
      
      // Add trait to NPC's trait collection
      npc.traits[traitId] = {
        id: traitId,
        name: `Shared: ${traitId}`,
        relationshipRequirement: 0,
        essenceCost: 0,
      };
      
      state.error = null;
    },

    // ========================================================================
    // TRADING REDUCERS
    // ========================================================================
    
    /**
     * Execute a trade with an NPC
     * @param state - Current NPCState
     * @param action - Action with trade data
     */
    tradeWithNPC: (state, action: PayloadAction<TradeWithNPCPayload>) => {
      const { npcId, items } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot trade: NPC '${npcId}' not found`;
        return;
      }
      
      const npc = state.npcs[npcId];
      
      if (!npc.inventory) {
        state.error = `NPC '${npcId}' has no inventory for trading`;
        return;
      }
      
      if (!Array.isArray(items) || items.length === 0) {
        state.error = 'Invalid trade items provided';
        return;
      }
      
      // Update NPC inventory based on trade
      items.forEach(tradeItem => {
        const inventoryItem = npc.inventory!.items.find(item => item.id === tradeItem.itemId);
        if (inventoryItem) {
          inventoryItem.quantity = Math.max(0, inventoryItem.quantity - tradeItem.quantity);
        }
      });
      
      // Apply relationship boost from trading
      const oldValue = npc.relationshipValue;
      const newValue = clampRelationshipValue(oldValue + RELATIONSHIP_BOOSTS.TRADE);
      npc.relationshipValue = newValue;
      npc.connectionDepth = calculateConnectionDepth(newValue);
      npc.lastInteraction = new Date();
      
      state.error = null;
    },

    // ========================================================================
    // QUEST MANAGEMENT REDUCERS
    // ========================================================================
    
    /**
     * Start a quest from an NPC
     * @param state - Current NPCState
     * @param action - Action with quest start data
     */
    startQuest: (state, action: PayloadAction<{ npcId: string; questId: string }>) => {
      const { npcId, questId } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot start quest: NPC '${npcId}' not found`;
        return;
      }
      
      const npc = state.npcs[npcId];
      
      if (!npc.availableQuests.includes(questId)) {
        state.error = `Quest '${questId}' not available from NPC '${npcId}'`;
        return;
      }
      
      // Remove from available quests (quest system handles in-progress tracking)
      npc.availableQuests = npc.availableQuests.filter(id => id !== questId);
      
      state.error = null;
    },

    /**
     * Complete a quest for an NPC
     * @param state - Current NPCState
     * @param action - Action with quest completion data
     */
    completeQuest: (state, action: PayloadAction<{ npcId: string; questId: string }>) => {
      const { npcId, questId } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot complete quest: NPC '${npcId}' not found`;
        return;
      }
      
      const npc = state.npcs[npcId];
      
      // Add to completed quests if not already present
      if (!npc.completedQuests.includes(questId)) {
        npc.completedQuests.push(questId);
      }
      
      // Apply relationship boost for quest completion
      const oldValue = npc.relationshipValue;
      const newValue = clampRelationshipValue(oldValue + RELATIONSHIP_BOOSTS.QUEST_COMPLETION);
      npc.relationshipValue = newValue;
      npc.connectionDepth = calculateConnectionDepth(newValue);
      npc.lastInteraction = new Date();
      
      state.error = null;
    },

    // ========================================================================
    // UTILITY REDUCERS
    // ========================================================================
    
    /**
     * Set NPC availability status
     * @param state - Current NPCState
     * @param action - Action with availability data
     */
    setNPCAvailability: (state, action: PayloadAction<{ npcId: string; isAvailable: boolean }>) => {
      const { npcId, isAvailable } = action.payload;
      
      if (!validateNPCExists(state, npcId)) {
        state.error = `Cannot set availability: NPC '${npcId}' not found`;
        return;
      }
      
      state.npcs[npcId].isAvailable = isAvailable;
      state.error = null;
    },

    /**
     * Clear the current interaction
     */
    clearCurrentInteraction: (state) => {
      state.currentInteraction = null;
      state.error = null;
    },

    /**
     * Set error message
     * @param state - Current NPCState
     * @param action - Action with error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Clear current error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  
  // ========================================================================
  // EXTRA REDUCERS FOR ASYNC THUNKS
  // ========================================================================
  
  extraReducers: (builder) => {
    // Initialize NPCs thunk
    builder
      .addCase(initializeNPCsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeNPCsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.npcs = action.payload;
        state.error = null;
      })
      .addCase(initializeNPCsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to initialize NPCs';
      });

    // Save state thunk
    builder
      .addCase(saveNPCStateThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveNPCStateThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveNPCStateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to save NPC state';
      });

    // Load state thunk
    builder
      .addCase(loadNPCStateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadNPCStateThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          return { ...state, ...action.payload, loading: false, error: null };
        }
      })
      .addCase(loadNPCStateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load NPC state';
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

/** NPC action creators */
export const npcActions = npcSlice.actions;

/** NPC reducer - default export */
export default npcSlice.reducer;

// Named exports for individual actions
export const {
  discoverNPC,
  updateRelationship,
  startDialogue,
  completeDialogue,
  shareTraitWithNPC,
  tradeWithNPC,
  startQuest,
  completeQuest,
  setNPCAvailability,
  clearCurrentInteraction,
  setError,
  clearError
} = npcSlice.actions;
