import React, { createContext, useContext, useReducer } from 'react';
import { playerInitialState } from '../data/playerStats';

/**
 * Player Context
 * 
 * @description
 * Context for managing global player state across the application
 */
const PlayerContext = createContext();

/**
 * Player action types
 */
export const PLAYER_ACTIONS = {
  UPDATE_HEALTH: 'UPDATE_HEALTH',
  UPDATE_ENERGY: 'UPDATE_ENERGY',
  LEVEL_UP: 'LEVEL_UP',
  UPDATE_NAME: 'UPDATE_NAME',
  RESET: 'RESET'
};

/**
 * Player state reducer function
 * 
 * @param {Object} state - Current player state
 * @param {Object} action - Action to perform on state
 * @returns {Object} Updated player state
 */
const playerReducer = (state, action) => {
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
 * PlayerProvider Component
 * 
 * @description
 * Provider component that makes player state available to any nested components.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const PlayerProvider = ({ children }) => {
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
 * @returns {Object} Player context value containing state and dispatch
 * @throws {Error} If used outside a PlayerProvider
 */
export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};
