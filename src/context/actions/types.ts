import { GameState } from '../InitialState';

/**
 * Base action interface
 */
export interface GameAction {
  type: string;
  payload?: any;
}

/**
 * Typed action with specific payload
 */
export interface TypedGameAction<T> extends GameAction {
  payload: T;
}

/**
 * Player update action
 */
export interface UpdatePlayerAction extends GameAction {
  type: 'UPDATE_PLAYER';
  payload: Partial<GameState['player']>;
}

/**
 * Union type of all action types
 */
export type AllGameActions = UpdatePlayerAction | GameAction;
