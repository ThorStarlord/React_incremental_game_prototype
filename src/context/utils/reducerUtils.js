/**
 * @function combineReducers
 * @description A simplified version of Redux's combineReducers that combines
 * multiple reducer functions into a single reducer.
 * 
 * @param {Object} reducers - An object whose values are reducer functions
 * @returns {Function} A reducer function that invokes every reducer inside the reducers object
 * 
 * @example
 * const rootReducer = combineReducers({
 *   counter: counterReducer,
 *   todos: todosReducer
 * });
 */
export function combineReducers(reducers) {
  return function combinedReducer(state = {}, action) {
    const nextState = {};
    let hasChanged = false;
    
    Object.entries(reducers).forEach(([key, reducer]) => {
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    });
    
    return hasChanged ? nextState : state;
  };
}

/**
 * @function createReducer
 * @description A utility to create reducers based on a lookup table of action types
 * rather than using switch statements.
 * 
 * @param {Object} initialState - The initial state for this reducer
 * @param {Object} handlers - Action type to handler function mapping
 * @returns {Function} A reducer function that uses the handler lookup table
 * 
 * @example
 * const counterReducer = createReducer(0, {
 *   INCREMENT: (state, action) => state + action.payload,
 *   DECREMENT: (state, action) => state - action.payload,
 * });
 */
export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

/**
 * @function createSlice
 * @description A simplified version of Redux Toolkit's createSlice.
 * Creates action creators and a reducer from a slice configuration.
 * 
 * @param {Object} options - The slice configuration
 * @param {string} options.name - The slice name
 * @param {Object} options.initialState - The initial state
 * @param {Object} options.reducers - Object mapping action names to reducer functions
 * @returns {Object} The created slice with reducer and actions
 * 
 * @example
 * const counterSlice = createSlice({
 *   name: 'counter',
 *   initialState: 0,
 *   reducers: {
 *     increment: (state, action) => state + action.payload,
 *     decrement: (state, action) => state - action.payload
 *   }
 * });
 * 
 * // Usage:
 * // dispatch(counterSlice.actions.increment(5))
 */
export function createSlice({ name, initialState, reducers }) {
  // Create action types and action creators
  const actions = {};
  const actionCreators = {};

  Object.keys(reducers).forEach(key => {
    const actionType = `${name}/${key}`;
    actions[key] = actionType;
    actionCreators[key] = (payload) => ({
      type: actionType,
      payload
    });
  });

  // Create the reducer
  const reducer = (state = initialState, action) => {
    if (action.type && action.type.startsWith(`${name}/`)) {
      const actionKey = action.type.replace(`${name}/`, '');
      if (reducers[actionKey]) {
        return reducers[actionKey](state, action);
      }
    }
    return state;
  };

  return {
    name,
    reducer,
    actions: actionCreators
  };
}