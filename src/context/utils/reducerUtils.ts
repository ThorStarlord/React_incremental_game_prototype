/**
 * @file reducerUtils.ts
 * @description Provides utilities for managing and creating reducers in a Redux-style pattern.
 * 
 * This module includes functions to:
 * - Combine multiple reducers into one (similar to Redux's combineReducers)
 * - Create reducers from action type mapping objects
 * - Create reducer slices with built-in action creators
 * 
 * These utilities help organize complex state management logic and
 * reduce boilerplate code when working with reducers and actions.
 */

/**
 * Generic Action interface that follows Redux action pattern
 */
export interface Action<T = string, P = any> {
  type: T;
  payload?: P;
  [key: string]: any; // Allow for additional properties
}

/**
 * Type definition for a reducer function
 * @template S - The type of state managed by this reducer
 * @template A - The type of actions this reducer handles
 */
export type Reducer<S = any, A extends Action = Action> = (
  state: S | undefined, 
  action: A
) => S;

/**
 * Type definition for a mapping of action types to handler functions
 */
export type ReducerHandlers<S, A extends Action = Action> = {
  [key: string]: (state: S, action: A) => S;
};

/**
 * Type definition for a map of reducer functions
 */
export type ReducersMapObject<S = any> = {
  [K in keyof S]: Reducer<S[K]>;
};

/**
 * Interface for slice definition options
 */
export interface SliceOptions<S = any, A extends Action = Action> {
  name: string;
  initialState: S;
  reducers: {
    [key: string]: (state: S, action: A) => S;
  };
}

/**
 * Interface for a created slice object
 */
export interface Slice<S = any, A = any> {
  name: string;
  reducer: Reducer<S, Action<string, A>>;
  actions: {
    [key: string]: (payload?: any) => Action<string, any>;
  };
}

/**
 * A simplified version of Redux's combineReducers that combines
 * multiple reducer functions into a single reducer.
 * 
 * @param {ReducersMapObject<S>} reducers - An object whose values are reducer functions
 * @returns {Reducer<S>} A reducer function that invokes every reducer inside the reducers object
 * 
 * @template S - Type of the combined state
 * 
 * @example
 * interface RootState {
 *   counter: number;
 *   todos: Todo[];
 * }
 * 
 * const rootReducer = combineReducers<RootState>({
 *   counter: counterReducer,
 *   todos: todosReducer
 * });
 */
export function combineReducers<S extends Record<string, any>, A extends Action = Action>(
  reducers: Record<keyof S, Reducer<any, A>>
): Reducer<S, A> {
  return function combination(state: S = {} as S, action: A): S {
    const nextState: Partial<S> = {};
    let hasChanged = false;
    
    Object.entries(reducers).forEach(([key, reducer]) => {
      const previousStateForKey = state[key as keyof S];
      // Add explicit type for the reducer
      const typedReducer = reducer as Reducer<typeof previousStateForKey, A>;
      const nextStateForKey = typedReducer(previousStateForKey, action);
      
      nextState[key as keyof S] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    });
    
    return hasChanged ? nextState as S : state;
  };
}

/**
 * A utility to create reducers based on a lookup table of action types
 * rather than using switch statements.
 * 
 * @param {S} initialState - The initial state for this reducer
 * @param {ReducerHandlers<S, A>} handlers - Action type to handler function mapping
 * @returns {Reducer<S, A>} A reducer function that uses the handler lookup table
 * 
 * @template S - Type of state this reducer manages
 * @template A - Type of actions this reducer handles
 * 
 * @example
 * interface CounterState {
 *   value: number;
 * }
 * 
 * interface CounterAction extends Action {
 *   payload: number;
 * }
 * 
 * const counterReducer = createReducer<CounterState, CounterAction>(
 *   { value: 0 },
 *   {
 *     INCREMENT: (state, action) => ({ value: state.value + action.payload }),
 *     DECREMENT: (state, action) => ({ value: state.value - action.payload }),
 *   }
 * );
 */
export function createReducer<S = any, A extends Action = Action>(
  initialState: S, 
  handlers: ReducerHandlers<S, A>
): Reducer<S, A> {
  return function reducer(state = initialState, action: A): S {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

/**
 * A simplified version of Redux Toolkit's createSlice.
 * Creates action creators and a reducer from a slice configuration.
 * 
 * @param {SliceOptions<S, A>} options - The slice configuration
 * @returns {Slice<S, P>} The created slice with reducer and actions
 * 
 * @template S - Type of state this slice manages
 * @template A - Type of actions this slice handles
 * 
 * @example
 * interface CounterState {
 *   value: number;
 * }
 * 
 * const counterSlice = createSlice<CounterState>({
 *   name: 'counter',
 *   initialState: { value: 0 },
 *   reducers: {
 *     increment: (state, action: Action<string, number>) => ({ 
 *       value: state.value + action.payload 
 *     }),
 *     decrement: (state, action: Action<string, number>) => ({ 
 *       value: state.value - action.payload 
 *     })
 *   }
 * });
 * 
 * // Usage:
 * // dispatch(counterSlice.actions.increment(5))
 */
export function createSlice<S = any, P = any>(options: SliceOptions<S>): Slice<S, P> {
  const { name, initialState, reducers } = options;
  
  // Create action types and action creators
  const actionCreators: { [key: string]: (payload?: P) => Action<string, P> } = {};

  Object.keys(reducers).forEach(key => {
    const actionType = `${name}/${key}`;
    
    actionCreators[key] = (payload?: P) => ({
      type: actionType,
      payload
    });
  });

  // Create the reducer
  const reducer: Reducer<S> = (state = initialState, action: Action) => {
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

/**
 * Creates a higher-order reducer that transforms another reducer
 * 
 * @param {Reducer<S, A>} reducer - The original reducer to enhance
 * @param {Function} enhancer - Function that takes and returns a reducer
 * @returns {Reducer<S, A>} An enhanced reducer
 * 
 * @template S - Type of state the reducer manages
 * @template A - Type of actions the reducer handles
 * 
 * @example
 * // Create a logging reducer wrapper
 * const loggingEnhancer = (reducer: Reducer<any>) => 
 *   (state: any, action: Action) => {
 *     console.log('Before', state);
 *     const result = reducer(state, action);
 *     console.log('After', result);
 *     return result;
 *   };
 * 
 * const enhancedReducer = enhanceReducer(rootReducer, loggingEnhancer);
 */
export function enhanceReducer<S = any, A extends Action = Action>(
  reducer: Reducer<S, A>,
  enhancer: (reducer: Reducer<S, A>) => Reducer<S, A>
): Reducer<S, A> {
  return enhancer(reducer);
}

/**
 * Creates a reducer that applies multiple reducers in sequence to produce a state
 * 
 * @param {Reducer<S, A>[]} reducers - Array of reducers to apply in sequence
 * @returns {Reducer<S, A>} A composite reducer
 * 
 * @template S - Type of state the reducers manage
 * @template A - Type of actions the reducers handle
 * 
 * @example
 * const resetOnLogout = (state: AppState, action: Action) => {
 *   if (action.type === 'LOGOUT') {
 *     return initialState;
 *   }
 *   return state;
 * };
 * 
 * // First process normal reducers, then handle logout special case
 * const rootReducer = composeReducers(
 *   combineReducers({ counter, todos }),
 *   resetOnLogout
 * );
 */
export function composeReducers<S, A extends Action = Action>(
  ...reducers: Reducer<S, A>[]
): Reducer<S, A> {
  return function compositeReducer(state: S | undefined, action: A): S {
    // Handle undefined state by ensuring at least one reducer exists
    if (state === undefined && reducers.length > 0) {
      return reducers[0](undefined, action);
    }
    
    // Now we can safely cast state to S since we've handled the undefined case
    return reducers.reduce((currentState, reducer) => {
      return reducer(currentState, action);
    }, state as S);
  };
}
