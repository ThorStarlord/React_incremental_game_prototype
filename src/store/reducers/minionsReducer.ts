/**
 * Minions Reducer
 * 
 * This module manages the state of minions in the incremental RPG.
 * Minions are characters that can be purchased and upgraded to help the player.
 */

// Type definitions
/**
 * Represents a single minion entity
 */
interface Minion {
  id: string;
  name: string;
  level: number;
  cost: number;
  baseDamage: number;
  count: number;
  unlocked: boolean;
}

/**
 * Represents the entire minions state structure
 */
interface MinionsState {
  list: Minion[];
  loading: boolean;
  error: string | null;
}

// Action types
const ADD_MINION = 'minions/ADD_MINION';
const UPGRADE_MINION = 'minions/UPGRADE_MINION';
const PURCHASE_MINION = 'minions/PURCHASE_MINION';
const UNLOCK_MINION = 'minions/UNLOCK_MINION';
const SET_MINIONS = 'minions/SET_MINIONS';
const FETCH_MINIONS_START = 'minions/FETCH_MINIONS_START';
const FETCH_MINIONS_SUCCESS = 'minions/FETCH_MINIONS_SUCCESS';
const FETCH_MINIONS_FAILURE = 'minions/FETCH_MINIONS_FAILURE';

// Action interfaces
interface AddMinionAction {
  type: typeof ADD_MINION;
  payload: Minion;
}

interface UpgradeMinionAction {
  type: typeof UPGRADE_MINION;
  payload: {
    id: string;
    level: number;
  };
}

interface PurchaseMinionAction {
  type: typeof PURCHASE_MINION;
  payload: {
    id: string;
    count: number;
  };
}

interface UnlockMinionAction {
  type: typeof UNLOCK_MINION;
  payload: {
    id: string;
  };
}

interface SetMinionsAction {
  type: typeof SET_MINIONS;
  payload: Minion[];
}

interface FetchMinionsStartAction {
  type: typeof FETCH_MINIONS_START;
}

interface FetchMinionsSuccessAction {
  type: typeof FETCH_MINIONS_SUCCESS;
  payload: Minion[];
}

interface FetchMinionsFailureAction {
  type: typeof FETCH_MINIONS_FAILURE;
  payload: string;
}

// Union type for all minion actions
type MinionActionTypes =
  | AddMinionAction
  | UpgradeMinionAction
  | PurchaseMinionAction
  | UnlockMinionAction
  | SetMinionsAction
  | FetchMinionsStartAction
  | FetchMinionsSuccessAction
  | FetchMinionsFailureAction;

/**
 * Initial state for the minions reducer
 */
const initialState: MinionsState = {
  list: [],
  loading: false,
  error: null
};

/**
 * Minions reducer function
 * Handles state updates for all minion-related actions
 * 
 * @param state - Current minions state
 * @param action - The dispatched action
 * @returns Updated minions state
 */
const minionsReducer = (
  state = initialState,
  action: MinionActionTypes
): MinionsState => {
  switch (action.type) {
    case ADD_MINION:
      return {
        ...state,
        list: [...state.list, action.payload]
      };
    
    case UPGRADE_MINION:
      return {
        ...state,
        list: state.list.map(minion =>
          minion.id === action.payload.id
            ? { ...minion, level: action.payload.level }
            : minion
        )
      };
    
    case PURCHASE_MINION:
      return {
        ...state,
        list: state.list.map(minion =>
          minion.id === action.payload.id
            ? { ...minion, count: minion.count + action.payload.count }
            : minion
        )
      };
    
    case UNLOCK_MINION:
      return {
        ...state,
        list: state.list.map(minion =>
          minion.id === action.payload.id
            ? { ...minion, unlocked: true }
            : minion
        )
      };
    
    case SET_MINIONS:
      return {
        ...state,
        list: action.payload
      };
    
    case FETCH_MINIONS_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_MINIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload
      };
    
    case FETCH_MINIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
};

// Action creators

/**
 * Creates an action to add a new minion to the state
 * @param minion - The minion to add
 */
export const addMinion = (minion: Minion): AddMinionAction => ({
  type: ADD_MINION,
  payload: minion
});

/**
 * Creates an action to upgrade a minion to a specific level
 * @param id - ID of the minion to upgrade
 * @param level - New level for the minion
 */
export const upgradeMinion = (id: string, level: number): UpgradeMinionAction => ({
  type: UPGRADE_MINION,
  payload: { id, level }
});

/**
 * Creates an action to purchase additional counts of a minion
 * @param id - ID of the minion to purchase
 * @param count - Number of minions to purchase
 */
export const purchaseMinion = (id: string, count: number): PurchaseMinionAction => ({
  type: PURCHASE_MINION,
  payload: { id, count }
});

/**
 * Creates an action to unlock a minion
 * @param id - ID of the minion to unlock
 */
export const unlockMinion = (id: string): UnlockMinionAction => ({
  type: UNLOCK_MINION,
  payload: { id }
});

/**
 * Creates an action to set the entire list of minions
 * @param minions - List of minions to set
 */
export const setMinions = (minions: Minion[]): SetMinionsAction => ({
  type: SET_MINIONS,
  payload: minions
});

/**
 * Creates an action to indicate minions fetch has started
 */
export const fetchMinionsStart = (): FetchMinionsStartAction => ({
  type: FETCH_MINIONS_START
});

/**
 * Creates an action for successful minions fetch
 * @param minions - The fetched minions
 */
export const fetchMinionsSuccess = (minions: Minion[]): FetchMinionsSuccessAction => ({
  type: FETCH_MINIONS_SUCCESS,
  payload: minions
});

/**
 * Creates an action for failed minions fetch
 * @param error - The error message
 */
export const fetchMinionsFailure = (error: string): FetchMinionsFailureAction => ({
  type: FETCH_MINIONS_FAILURE,
  payload: error
});

/**
 * Async thunk action creator for fetching minions
 */
export const fetchMinions = () => {
  return async (dispatch: any) => {
    dispatch(fetchMinionsStart());
    try {
      // Simulated API call - replace with actual API call
      const response = await fetch('/api/minions');
      const minions = await response.json();
      dispatch(fetchMinionsSuccess(minions));
    } catch (error: any) {
      dispatch(fetchMinionsFailure(error.message || 'Failed to fetch minions'));
    }
  };
};

// Selectors

/**
 * Selects all minions from the state
 */
export const selectAllMinions = (state: { minions: MinionsState }) => state.minions.list;

/**
 * Selects a specific minion by ID
 */
export const selectMinionById = (state: { minions: MinionsState }, id: string) => 
  state.minions.list.find(minion => minion.id === id);

/**
 * Selects only unlocked minions
 */
export const selectUnlockedMinions = (state: { minions: MinionsState }) => 
  state.minions.list.filter(minion => minion.unlocked);

/**
 * Selects the loading state for minions
 */
export const selectMinionsLoading = (state: { minions: MinionsState }) => state.minions.loading;

/**
 * Selects any error state for minions
 */
export const selectMinionsError = (state: { minions: MinionsState }) => state.minions.error;

export default minionsReducer;
