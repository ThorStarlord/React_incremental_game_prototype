import { playerReducer } from './playerReducer';
import { npcReducer } from './npcReducer';
import { essenceReducer } from './essenceReducer';
import { inventoryReducer } from './inventoryReducer';
import { traitsReducer } from './traitsReducer';
import { worldReducer } from './worldReducer';
import { gameTimeReducer } from './gameTimeReducer';
import { ACTION_TYPES } from '../actions/actionTypes';

// Main reducer that combines domain-specific reducers
const rootReducer = (state, action) => {
  // Handle special case for initializing game data
  if (action.type === ACTION_TYPES.INITIALIZE_GAME_DATA) {
    return {
      ...action.payload,
      notifications: action.payload.notifications || [] // Ensure notifications exists
    };
  }

  // Handle notifications
  if (action.type === ACTION_TYPES.SHOW_NOTIFICATION) {
    return {
      ...state,
      notifications: [
        ...(state.notifications || []),
        {
          id: Date.now(),
          message: action.payload.message,
          type: action.payload.type || 'info',
          duration: action.payload.duration || 3000
        }
      ]
    };
  }

  if (action.type === ACTION_TYPES.CLEAR_NOTIFICATION) {
    return {
      ...state,
      notifications: (state.notifications || []).filter(
        notification => notification.id !== action.payload.id
      )
    };
  }

  // Apply reducers in sequence - consider using a more elegant composition method
  let newState = playerReducer(state, action);
  newState = essenceReducer(newState, action);
  newState = npcReducer(newState, action);
  newState = inventoryReducer(newState, action); // handles items state
  newState = traitsReducer(newState, action);
  newState = worldReducer(newState, action);
  newState = gameTimeReducer(newState, action);

  return newState;
};

export default rootReducer;