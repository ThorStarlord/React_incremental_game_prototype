/**
 * Common action interfaces
 * 
 * These interfaces define the structure of actions throughout the application.
 */

/**
 * Basic Action interface
 */
export interface Action<T = string, P = any> {
  type: T;
  payload?: P;
}

/**
 * Action with required payload
 */
export interface ActionWithPayload<T = string, P = any> {
  type: T;
  payload: P;
}
