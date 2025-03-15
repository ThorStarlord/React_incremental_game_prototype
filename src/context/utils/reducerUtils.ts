/**
 * @file reducerUtils.ts
 * @description Provides utilities for managing and creating reducers in a Redux-style pattern.
 * 
 * This module includes functions to:
 * - Combine multiple reducers into one (similar to Redux's combineReducers)
 * - Create reducers from action type mapping objects
 * - Create reducer slices with built-in action creators
 * - Utility functions for common reducer operations
 */

import { addNotification, GameStateWithNotifications } from './notificationUtils';

/**
 * Base interface for objects with an id property
 */
export interface BaseState {
  id?: string;
  [key: string]: any;
}

/**
 * Simple GameState interface for notification functionality
 * Made compatible with GameStateWithNotifications
 */
export interface GameState extends GameStateWithNotifications {
  [key: string]: any;
}

/**
 * Creates a notification and adds it to state
 */
export const withNotification = (
  state: GameState, 
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info', 
  duration: number = 3000
): GameState => addNotification(state, { message, type, duration });

/**
 * Updates an object in an array by its id
 */
export const updateById = <T extends BaseState>(
  array: T[], 
  id: string, 
  updates: Partial<T>
): T[] => array.map(item => item.id === id ? { ...item, ...updates } : item);

/**
 * Update a nested property in state
 */
export const updateNested = (
  state: Record<string, any>,
  path: string[], 
  value: any
): Record<string, any> => {
  if (path.length === 1) {
    return { ...state, [path[0]]: value };
  }
  
  const [current, ...rest] = path;
  return {
    ...state,
    [current]: updateNested(state[current] || {}, rest, value)
  };
};

/**
 * Clamps a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, value));

/**
 * Safely updates a quantity in an inventory
 */
export const updateInventoryQuantity = (
  inventory: any[], 
  itemIndex: number, 
  change: number
): any[] => {
  if (itemIndex === -1) return inventory;
  
  if (inventory[itemIndex].quantity + change <= 0) {
    return inventory.filter((_, idx) => idx !== itemIndex);
  }
  
  return inventory.map((item, idx) => 
    idx === itemIndex 
      ? { ...item, quantity: item.quantity + change } 
      : item
  );
};

/**
 * Creates a reducer action handler function
 */
export const createReducerHandler = <S, P>(
  fn: (state: S, payload: P) => S
) => (state: S, action: { payload: P }) => fn(state, action.payload);

/**
 * Generic Action interface that follows Redux action pattern
 */
export interface Action<T = string, P = any> {
  type: T;
  payload?: P;
  [key: string]: any;
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
 * Creates a reducer from action type handlers
 * 
 * @template S - State type the reducer will manage
 * @template A - Action type the reducer will handle
 * @param {S} InitialState - The initial state
 * @param {ReducerHandlers<S, A>} handlers - Map of action types to handler functions
 * @returns {Reducer<S, A>} - A reducer function
 * 
 * @example
 * const counterReducer = createReducer(0, {
 *   'INCREMENT': (state) => state + 1,
 *   'DECREMENT': (state) => state - 1,
 *   'SET': (state, action) => action.payload
 * });
 */
export function createReducer<S = any, A extends Action = Action>(
  InitialState: S, 
  handlers: ReducerHandlers<S, A>
): Reducer<S, A> {
  return function reducer(state = InitialState, action: A): S {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
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
 * A simplified version of Redux Toolkit's createSlice.
 * Creates action creators and a reducer from a slice configuration.
 */
export interface SliceOptions<S> {
  name: string;
  InitialState: S;
  reducers: {
    [key: string]: (state: S, action: Action) => S;
  };
}

export interface Slice<S = any, P = any> {
  name: string;
  reducer: Reducer<S>;
  actions: {
    [key: string]: (payload?: P) => Action<string, P>;
  };
}

export function createSlice<S = any, P = any>(options: SliceOptions<S>): Slice<S, P> {
  const { name, InitialState, reducers } = options;
  
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
  const reducer: Reducer<S> = (state = InitialState, action: Action) => {
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
 *     return InitialState;
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
