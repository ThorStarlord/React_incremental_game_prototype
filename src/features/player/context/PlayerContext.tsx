import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PlayerStateContainer, playerInitialState } from '../playerInitialState';

/**
 * Type defining all available player action types
 */
export enum PLAYER_ACTIONS {
  UPDATE_HEALTH = 'UPDATE_HEALTH',
  UPDATE_ENERGY = 'UPDATE_ENERGY',
  LEVEL_UP = 'LEVEL_UP',
  UPDATE_NAME = 'UPDATE_NAME',
  RESET = 'RESET'
}

/**
 * Interface for player action objects
 */
interface PlayerAction {
  type: PLAYER_ACTIONS | string;
  payload?: any;
}

/**
 * Interface for PlayerContext value
 */
interface PlayerContextValue {
  state: PlayerStateContainer;
  dispatch: React.Dispatch<PlayerAction>;
}

/**
 * Player Context
 * 
 * @description
 * Context for managing global player state across the application
 */
const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

/**
 * Player state reducer function
 * 
 * @param state - Current player state
 * @param action - Action to perform on state
 * @returns Updated player state
 */
const playerReducer = (state: PlayerStateContainer, action: PlayerAction): PlayerStateContainer => {
  switch (action.type) {
    case PLAYER_ACTIONS.UPDATE_HEALTH:
      return {
        ...state,
        player: {
          ...state.player,
          health: Math.max(0, Math.min(action.payload, state.player.maxHealth))
        }
      };
    case PLAYER_ACTIONS.UPDATE_ENERGY:
      return {
        ...state,
        player: {
          ...state.player,
          energy: Math.max(0, Math.min(action.payload, state.player.maxEnergy))
        }
      };
    case PLAYER_ACTIONS.LEVEL_UP:
      return {
        ...state,
        player: {
          ...state.player,
          level: state.player.level + 1,
          maxHealth: state.player.maxHealth + 10,
          health: state.player.maxHealth + 10, // Full health on level up
          maxEnergy: state.player.maxEnergy + 5,
          energy: state.player.maxEnergy + 5 // Full energy on level up
        }
      };
    case PLAYER_ACTIONS.UPDATE_NAME:
      return {
        ...state,
        player: {
          ...state.player,
          name: action.payload
        }
      };
    case PLAYER_ACTIONS.RESET:
      return playerInitialState;
    default:
      return state;
  }
};

/**
 * Props for PlayerProvider component
 */
interface PlayerProviderProps {
  children: ReactNode;
}

/**
 * PlayerProvider Component
 * 
 * @description
 * Provider component that makes player state available to any nested components.
 * 
 * @param props - Component props
 * @param props.children - Child components
 * @returns Provider component
 */
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, playerInitialState);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};

/**
 * Custom hook to use player context
 * 
 * @returns Player context value containing state and dispatch
 * @throws Error if used outside a PlayerProvider
 */
export const usePlayerContext = (): PlayerContextValue => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};
