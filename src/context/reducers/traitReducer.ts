import { createReducer } from '../utils/reducerUtils';
import { 
  TraitId, 
  TraitSystem, 
  ExtendedTrait, 
  BaseTrait,
  TieredTrait,
  TraitSlots,
  TraitHistoryEntry
} from '../types/TraitsGameStateTypes';

/**
 * Initial trait system state
 */
export const initialTraitState: TraitSystem = {
  copyableTraits: {},
  playerTraits: [],
  availableTraits: [],
  traitSlots: {
    maxTraits: 3,
    unlockedSlots: 1,
    lockedSlotRequirements: [
      {
        slotIndex: 1,
        requirement: {
          type: 'level',
          level: 5
        }
      },
      {
        slotIndex: 2,
        requirement: {
          type: 'level',
          level: 10
        }
      }
    ]
  },
  discoveredTraits: [],
  favoriteTraits: [],
  traitPoints: 0,
  traitHistory: [],
  lastUpdateTime: 0,
  pointAllocationHistory: []
};

/**
 * Trait action types
 */
export const TRAIT_ACTIONS = {
  ADD_TRAIT: 'traits/add',
  REMOVE_TRAIT: 'traits/remove',
  DISCOVER_TRAIT: 'traits/discover',
  EQUIP_TRAIT: 'traits/equip',
  UNEQUIP_TRAIT: 'traits/unequip',
  UNLOCK_TRAIT_SLOT: 'traits/unlockSlot',
  ADD_TRAIT_POINTS: 'traits/addPoints',
  SPEND_TRAIT_POINTS: 'traits/spendPoints',
  UPDATE_TRAIT: 'traits/update',
  UPGRADE_TRAIT: 'traits/upgrade',
  TOGGLE_FAVORITE_TRAIT: 'traits/toggleFavorite',
  IMPORT_TRAITS: 'traits/import',
  RESET_TRAITS: 'traits/reset'
} as const;

/**
 * Trait action types with improved typing
 */
export type TraitAction = 
  | { type: typeof TRAIT_ACTIONS.ADD_TRAIT; payload: { traitId: TraitId } }
  | { type: typeof TRAIT_ACTIONS.REMOVE_TRAIT; payload: { traitId: TraitId } }
  | { type: typeof TRAIT_ACTIONS.DISCOVER_TRAIT; payload: { traitId: TraitId } }
  | { type: typeof TRAIT_ACTIONS.EQUIP_TRAIT; payload: { traitId: TraitId; slotIndex?: number } }
  | { type: typeof TRAIT_ACTIONS.UNEQUIP_TRAIT; payload: { traitId: TraitId } }
  | { type: typeof TRAIT_ACTIONS.UNLOCK_TRAIT_SLOT; payload: { slotIndex: number } }
  | { type: typeof TRAIT_ACTIONS.ADD_TRAIT_POINTS; payload: { amount: number } }
  | { type: typeof TRAIT_ACTIONS.SPEND_TRAIT_POINTS; payload: { traitId: TraitId; points: number } }
  | { type: typeof TRAIT_ACTIONS.UPDATE_TRAIT; payload: { traitId: TraitId; updates: Partial<ExtendedTrait> } }
  | { type: typeof TRAIT_ACTIONS.UPGRADE_TRAIT; payload: { traitId: TraitId; newTier: number } }
  | { type: typeof TRAIT_ACTIONS.TOGGLE_FAVORITE_TRAIT; payload: { traitId: TraitId } }
  | { type: typeof TRAIT_ACTIONS.IMPORT_TRAITS; payload: { traits: Record<TraitId, ExtendedTrait> } }
  | { type: typeof TRAIT_ACTIONS.RESET_TRAITS; payload?: undefined }

/**
 * Helper function to narrow action types with improved type safety
 */
function isActionOfType<T extends typeof TRAIT_ACTIONS[keyof typeof TRAIT_ACTIONS]>(
  action: TraitAction,
  type: T
): action is Extract<TraitAction, { type: T }> {
  return action.type === type;
}

/**
 * Trait reducer implementation using the createReducer utility
 */
export const traitReducer = createReducer<TraitSystem, TraitAction>(
  initialTraitState,
  {
    [TRAIT_ACTIONS.ADD_TRAIT]: (state, action) => {
      // Type guard for ADD_TRAIT action
      if (!isActionOfType(action, TRAIT_ACTIONS.ADD_TRAIT)) {
        return state;
      }
      
      const { traitId } = action.payload;
      
      // Don't add if already owned
      if (state.playerTraits.includes(traitId)) {
        return state;
      }
      
      // Create history entry
      const historyEntry: TraitHistoryEntry = {
        traitId,
        action: 'added',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        playerTraits: [...state.playerTraits, traitId],
        traitHistory: [...state.traitHistory, historyEntry],
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.REMOVE_TRAIT]: (state, action) => {
      // Type guard for REMOVE_TRAIT action
      if (!isActionOfType(action, TRAIT_ACTIONS.REMOVE_TRAIT)) {
        return state;
      }
      
      const { traitId } = action.payload;
      
      // Create history entry
      const historyEntry: TraitHistoryEntry = {
        traitId,
        action: 'removed',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        playerTraits: state.playerTraits.filter(id => id !== traitId),
        traitHistory: [...state.traitHistory, historyEntry],
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.DISCOVER_TRAIT]: (state, action) => {
      // Type guard for DISCOVER_TRAIT action
      if (!isActionOfType(action, TRAIT_ACTIONS.DISCOVER_TRAIT)) {
        return state;
      }
      
      const { traitId } = action.payload;
      
      // Don't add if already discovered
      if (state.discoveredTraits.includes(traitId)) {
        return state;
      }
      
      return {
        ...state,
        discoveredTraits: [...state.discoveredTraits, traitId],
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.EQUIP_TRAIT]: (state, action) => {
      // Implementation for equipping traits would go here
      // For now, this would integrate with the equipTrait function from traitUtils.ts
      return state;
    },
    
    [TRAIT_ACTIONS.UNEQUIP_TRAIT]: (state, action) => {
      // Implementation for unequipping traits would go here
      // For now, this would integrate with the unequipTrait function from traitUtils.ts
      return state;
    },
    
    [TRAIT_ACTIONS.UNLOCK_TRAIT_SLOT]: (state, action) => {
      // Type guard for UNLOCK_TRAIT_SLOT action
      if (!isActionOfType(action, TRAIT_ACTIONS.UNLOCK_TRAIT_SLOT)) {
        return state;
      }
      
      const { slotIndex } = action.payload;
      
      // Check if the slot is locked and within range
      if (slotIndex >= state.traitSlots.maxTraits || slotIndex < state.traitSlots.unlockedSlots) {
        return state;
      }
      
      return {
        ...state,
        traitSlots: {
          ...state.traitSlots,
          unlockedSlots: Math.max(state.traitSlots.unlockedSlots, slotIndex + 1)
        },
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.ADD_TRAIT_POINTS]: (state, action) => {
      // Type guard for ADD_TRAIT_POINTS action
      if (!isActionOfType(action, TRAIT_ACTIONS.ADD_TRAIT_POINTS)) {
        return state;
      }
      
      const { amount } = action.payload;
      
      if (amount <= 0) {
        return state;
      }
      
      return {
        ...state,
        traitPoints: state.traitPoints + amount,
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.SPEND_TRAIT_POINTS]: (state, action) => {
      // Type guard for SPEND_TRAIT_POINTS action
      if (!isActionOfType(action, TRAIT_ACTIONS.SPEND_TRAIT_POINTS)) {
        return state;
      }
      
      const { traitId, points } = action.payload;
      
      // Check if we have enough trait points
      if (state.traitPoints < points || points <= 0) {
        return state;
      }
      
      // Record the point allocation
      const pointAllocation = {
        timestamp: Date.now(),
        traitId,
        pointsAllocated: points,
        remainingPoints: state.traitPoints - points
      };
      
      return {
        ...state,
        traitPoints: state.traitPoints - points,
        pointAllocationHistory: [...state.pointAllocationHistory, pointAllocation],
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.UPDATE_TRAIT]: (state, action) => {
      // Type guard for UPDATE_TRAIT action
      if (!isActionOfType(action, TRAIT_ACTIONS.UPDATE_TRAIT)) {
        return state;
      }
      
      const { traitId, updates } = action.payload;
      
      // Check if the trait exists
      if (!state.copyableTraits[traitId]) {
        return state;
      }
      
      return {
        ...state,
        copyableTraits: {
          ...state.copyableTraits,
          [traitId]: {
            ...state.copyableTraits[traitId],
            ...updates
          }
        },
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.UPGRADE_TRAIT]: (state, action) => {
      // Type guard for UPGRADE_TRAIT action
      if (!isActionOfType(action, TRAIT_ACTIONS.UPGRADE_TRAIT)) {
        return state;
      }
      
      const { traitId, newTier } = action.payload;
      
      // Check if the trait exists and is tiered
      const trait = state.copyableTraits[traitId] as TieredTrait | undefined;
      if (!trait || !('currentTier' in trait) || !('maxTier' in trait)) {
        return state;
      }
      
      // Ensure new tier is valid
      if (newTier <= trait.currentTier || newTier > trait.maxTier) {
        return state;
      }
      
      // Create history entry
      const historyEntry: TraitHistoryEntry = {
        traitId,
        action: 'upgraded',
        timestamp: new Date().toISOString()
      };
      
      return {
        ...state,
        copyableTraits: {
          ...state.copyableTraits,
          [traitId]: {
            ...trait,
            currentTier: newTier
          }
        },
        traitHistory: [...state.traitHistory, historyEntry],
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.TOGGLE_FAVORITE_TRAIT]: (state, action) => {
      // Type guard for TOGGLE_FAVORITE_TRAIT action
      if (!isActionOfType(action, TRAIT_ACTIONS.TOGGLE_FAVORITE_TRAIT)) {
        return state;
      }
      
      const { traitId } = action.payload;
      
      const isFavorite = state.favoriteTraits.includes(traitId);
      
      return {
        ...state,
        favoriteTraits: isFavorite
          ? state.favoriteTraits.filter(id => id !== traitId)
          : [...state.favoriteTraits, traitId],
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.IMPORT_TRAITS]: (state, action) => {
      // Type guard for IMPORT_TRAITS action
      if (!isActionOfType(action, TRAIT_ACTIONS.IMPORT_TRAITS)) {
        return state;
      }
      
      const { traits } = action.payload;
      
      return {
        ...state,
        copyableTraits: {
          ...state.copyableTraits,
          ...traits
        },
        lastUpdateTime: Date.now()
      };
    },
    
    [TRAIT_ACTIONS.RESET_TRAITS]: (state, action) => {
      // Reset to initial state but optionally preserve discovered traits
      return {
        ...initialTraitState,
        // Keep discovered traits as they represent player knowledge
        discoveredTraits: state.discoveredTraits,
        lastUpdateTime: Date.now()
      };
    }
  }
);

/**
 * Action creators for trait actions
 */
export const traitActions = {
  addTrait: (traitId: TraitId) => ({
    type: TRAIT_ACTIONS.ADD_TRAIT,
    payload: { traitId }
  }),
  
  removeTrait: (traitId: TraitId) => ({
    type: TRAIT_ACTIONS.REMOVE_TRAIT,
    payload: { traitId }
  }),
  
  discoverTrait: (traitId: TraitId) => ({
    type: TRAIT_ACTIONS.DISCOVER_TRAIT,
    payload: { traitId }
  }),
  
  equipTrait: (traitId: TraitId, slotIndex?: number) => ({
    type: TRAIT_ACTIONS.EQUIP_TRAIT,
    payload: { traitId, slotIndex }
  }),
  
  unequipTrait: (traitId: TraitId) => ({
    type: TRAIT_ACTIONS.UNEQUIP_TRAIT,
    payload: { traitId }
  }),
  
  unlockTraitSlot: (slotIndex: number) => ({
    type: TRAIT_ACTIONS.UNLOCK_TRAIT_SLOT,
    payload: { slotIndex }
  }),
  
  addTraitPoints: (amount: number) => ({
    type: TRAIT_ACTIONS.ADD_TRAIT_POINTS,
    payload: { amount }
  }),
  
  spendTraitPoints: (traitId: TraitId, points: number) => ({
    type: TRAIT_ACTIONS.SPEND_TRAIT_POINTS,
    payload: { traitId, points }
  }),
  
  updateTrait: (traitId: TraitId, updates: Partial<ExtendedTrait>) => ({
    type: TRAIT_ACTIONS.UPDATE_TRAIT,
    payload: { traitId, updates }
  }),
  
  upgradeTrait: (traitId: TraitId, newTier: number) => ({
    type: TRAIT_ACTIONS.UPGRADE_TRAIT,
    payload: { traitId, newTier }
  }),
  
  toggleFavoriteTrait: (traitId: TraitId) => ({
    type: TRAIT_ACTIONS.TOGGLE_FAVORITE_TRAIT,
    payload: { traitId }
  }),
  
  importTraits: (traits: Record<TraitId, ExtendedTrait>) => ({
    type: TRAIT_ACTIONS.IMPORT_TRAITS,
    payload: { traits }
  }),
  
  resetTraits: () => ({
    type: TRAIT_ACTIONS.RESET_TRAITS
  })
};

export default traitReducer;
