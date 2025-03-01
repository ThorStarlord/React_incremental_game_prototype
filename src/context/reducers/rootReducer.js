import { combineReducers } from '../utils/reducerUtils';
import { playerReducer } from './playerReducer';
import { resourcesReducer } from './resourcesReducer';
import { discoveryReducer } from './discoveryReducer';
import { notificationsReducer } from './notificationsReducer';
import { ACTION_TYPES } from '../actions/actionTypes';

/**
 * @function metaReducer
 * @description Manages meta information about the game state like version and last saved time
 * 
 * @param {Object} state - Current meta state
 * @param {Object} action - Dispatched action
 * @returns {Object} Updated meta state
 */
const metaReducer = (state = { version: '1.0.0', lastSaved: null }, action) => {
  switch (action.type) {
    case ACTION_TYPES.SAVE_GAME:
      return {
        ...state,
        lastSaved: new Date().toISOString()
      };
    default:
      return state;
  }
};

/**
 * @function uiStateReducer
 * @description Manages UI-specific state that doesn't need persistence
 * 
 * @param {Object} state - Current UI state
 * @param {Object} action - Dispatched action
 * @returns {Object} Updated UI state
 */
const uiStateReducer = (state = { activeDialogs: [], tooltips: {} }, action) => {
  switch (action.type) {
    case ACTION_TYPES.OPEN_DIALOG:
      return {
        ...state,
        activeDialogs: [...state.activeDialogs, action.payload.dialogId]
      };
    case ACTION_TYPES.CLOSE_DIALOG:
      return {
        ...state,
        activeDialogs: state.activeDialogs.filter(id => id !== action.payload.dialogId)
      };
    case ACTION_TYPES.SET_TOOLTIP_SEEN:
      return {
        ...state,
        tooltips: {
          ...state.tooltips,
          [action.payload.tooltipId]: true
        }
      };
    default:
      return state;
  }
};

/**
 * @function characterManagementReducer
 * @description Handles state related to character management UI
 * 
 * @param {Object} state - Current character management state
 * @param {Object} action - Dispatched action
 * @returns {Object} Updated character management state
 */
const characterManagementReducer = (state = { lastOpenedTab: 'characters' }, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CHARACTER_TAB:
      return {
        ...state,
        lastOpenedTab: action.payload.tab
      };
    default:
      return state;
  }
};

/**
 * Combines all reducers into a single root reducer using a custom combineReducers utility
 * that preserves the state shape and ensures safe updates.
 * 
 * State shape:
 * {
 *   player: { ... },
 *   resources: { ... },
 *   discoveryProgress: { ... },
 *   notifications: [ ... ],
 *   _meta: { version, lastSaved },
 *   _uiState: { activeDialogs, tooltips },
 *   characterManagement: { lastOpenedTab }
 * }
 */
export const rootReducer = combineReducers({
  player: playerReducer,
  resources: resourcesReducer,
  discoveryProgress: discoveryReducer,
  notifications: notificationsReducer,
  _meta: metaReducer,
  _uiState: uiStateReducer,
  characterManagement: characterManagementReducer
});