import React, { createContext, useReducer, useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import GameDispatchContext from './GameDispatchContext';
import { rootReducer } from './reducers/rootReducer';
import { initialState } from './initialState';
import { ACTION_TYPES } from './actions/actionTypes';

/**
 * @function loadState
 * @description Loads game state from localStorage, falling back to initialState if not found or on error.
 * Handles data migration and validation to ensure backward compatibility.
 * 
 * @returns {Object} The loaded state or initialState fallback
 */
function loadState() {
  try {
    const savedData = localStorage.getItem('gameState');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Ensure backward compatibility by merging with initialState
      return {
        ...initialState,
        ...parsed,
        // Ensure critical structures always exist
        player: {
          ...initialState.player,
          ...(parsed.player || {}),
          controlledCharacters: parsed.player?.controlledCharacters || [],
          acquiredTraits: parsed.player?.acquiredTraits || []
        },
        discoveryProgress: {
          ...initialState.discoveryProgress,
          ...(parsed.discoveryProgress || {}),
        },
        notifications: parsed.notifications || []
      };
    }
  } catch (error) {
    console.error('Error loading game state:', error);
    // On error, create a backup of the corrupted state for potential recovery
    try {
      if (localStorage.getItem('gameState')) {
        localStorage.setItem('gameState_backup_' + Date.now(), localStorage.getItem('gameState'));
      }
    } catch (backupError) {
      console.error('Failed to create backup of corrupted state:', backupError);
    }
  }
  
  // Fallback to initial state
  return initialState;
}

/**
 * @function saveState
 * @description Persists the current game state to localStorage with error handling.
 * 
 * @param {Object} state - Current game state to be saved
 * @returns {boolean} True if save was successful, false otherwise
 */
function saveState(state) {
  try {
    // Create a clean copy of the state to save
    const stateToSave = {
      ...state,
      // Remove any temporary or UI-only state properties
      _tempData: undefined,
      _uiState: undefined
    };
    
    localStorage.setItem('gameState', JSON.stringify(stateToSave));
    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
}

/**
 * GameStateContext
 * 
 * @context
 * @description Provides access to the global game state throughout the application.
 * This is the primary context for accessing read-only game state data.
 * 
 * The context stores:
 * - Player data (stats, inventory, equipped items, etc.)
 * - World state (discovered areas, quest progression, NPC relationships)
 * - Game time and events
 * - Resources and currencies
 * - Game settings and preferences
 * - Discovery progress tracking
 * 
 * @example
 * // Basic usage in a component
 * import React, { useContext } from 'react';
 * import { GameStateContext } from '../context/GameStateContext';
 * 
 * function PlayerInfo() {
 *   const { player } = useContext(GameStateContext);
 *   return <div>Player Level: {player.level}</div>;
 * }
 */
export const GameStateContext = createContext(null);

/**
 * @hook useGameState
 * @description A custom hook that provides access to the game state context.
 * Throws an error if used outside of a GameProvider.
 * 
 * @returns {Object} The current game state
 * @throws {Error} If used outside of a GameProvider
 * 
 * @example
 * // Using the custom hook in a component
 * import { useGameState } from '../context/GameStateContext';
 * 
 * function ResourceDisplay() {
 *   const { resources } = useGameState();
 *   return <div>Essence: {resources.essence}</div>;
 * }
 */
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined || context === null) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

/**
 * @hook useGameDispatch
 * @description A custom hook that provides access to the game dispatch function.
 * Throws an error if used outside of a GameProvider.
 * 
 * @returns {Function} The dispatch function to trigger state changes
 * @throws {Error} If used outside of a GameProvider
 * 
 * @example
 * // Using the dispatch hook in a component
 * import { useGameDispatch } from '../context/GameStateContext';
 * import { ACTION_TYPES } from '../context/actions/actionTypes';
 * 
 * function EssenceButton() {
 *   const dispatch = useGameDispatch();
 *   
 *   const handleClick = () => {
 *     dispatch({
 *       type: ACTION_TYPES.GAIN_ESSENCE,
 *       payload: { amount: 10 }
 *     });
 *   };
 *   
 *   return <button onClick={handleClick}>Gain 10 Essence</button>;
 * }
 */
export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return context;
};

/**
 * @component GameProvider
 * @description Provider component that manages game state and makes it available 
 * throughout the application using React Context.
 * 
 * Features:
 * - Initializes game state from localStorage or falls back to default
 * - Automatically persists state changes to localStorage
 * - Provides both state and dispatch contexts to children
 * - Handles loading states and errors gracefully
 * - Supports auto-save functionality with configurable intervals
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.disableAutoSave=false] - Disable auto-saving (for testing)
 * @param {number} [props.autoSaveInterval=60000] - Auto-save interval in milliseconds
 * @returns {JSX.Element} The provider component
 */
export function GameProvider({ 
  children, 
  disableAutoSave = false, 
  autoSaveInterval = 60000 // Default: save every minute 
}) {
  // Initialize state with data from localStorage or default
  const [state, dispatch] = useReducer(rootReducer, null, loadState);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState(null);
  
  // Wrapped dispatch function that can be intercepted for logging or other purposes
  const wrappedDispatch = useCallback((action) => {
    // Could add action logging here
    // console.log('Action dispatched:', action);
    dispatch(action);
  }, []);
  
  // Handle initial loading
  useEffect(() => {
    // Simulate a short loading time to avoid UI flicker on fast loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Auto-save effect
  useEffect(() => {
    if (disableAutoSave || !state) return;
    
    // Save immediately on state change for critical updates
    const success = saveState(state);
    if (!success) {
      setSaveError('Failed to auto-save game state');
    } else {
      setSaveError(null);
    }
    
    // Set up interval for regular saves
    const intervalId = setInterval(() => {
      saveState(state);
    }, autoSaveInterval);
    
    return () => clearInterval(intervalId);
  }, [state, disableAutoSave, autoSaveInterval]);
  
  // Manual save method that can be exposed if needed
  const saveGame = useCallback(() => {
    if (!state) return false;
    return saveState(state);
  }, [state]);
  
  // Enhanced state with additional utility functions
  const enhancedState = {
    ...state,
    saveGame, // Expose manual save function
    isSaving: false, // Could implement a saving indicator
    lastSaved: state._meta?.lastSaved || null
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>Loading game state...</div>
      </div>
    );
  }
  
  if (!state) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        color: 'red'
      }}>
        <div>Failed to load game state. Please refresh or reset your game.</div>
        <button 
          onClick={() => {
            localStorage.removeItem('gameState');
            window.location.reload();
          }}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Reset Game
        </button>
      </div>
    );
  }
  
  // Conditionally show save error
  const contextUI = (
    <>
      {saveError && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          color: 'red',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          zIndex: 9999
        }}>
          {saveError}
        </div>
      )}
      <GameStateContext.Provider value={enhancedState}>
        <GameDispatchContext.Provider value={wrappedDispatch}>
          {children}
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
    </>
  );
  
  return contextUI;
}

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
  disableAutoSave: PropTypes.bool,
  autoSaveInterval: PropTypes.number
};

/**
 * @function createEssenceAction
 * @description Action creator for adding essence to the player's reserves
 * 
 * @param {number} amount - Amount of essence to add
 * @returns {Object} The formatted action object
 * 
 * @example
 * import { createEssenceAction } from '../context/GameStateContext';
 * import { useGameDispatch } from '../context/GameStateContext';
 * 
 * function EssenceRewardButton() {
 *   const dispatch = useGameDispatch();
 *   
 *   return (
 *     <button onClick={() => dispatch(createEssenceAction(100))}>
 *       Claim 100 Essence
 *     </button>
 *   );
 * }
 */
export const createEssenceAction = (amount) => ({
  type: ACTION_TYPES.GAIN_ESSENCE,
  payload: { amount }
});

/**
 * @function createCharacterAction
 * @description Action creator for adding a new character to the player's roster
 * 
 * @param {Object} character - Character data object
 * @returns {Object} The formatted action object
 */
export const createCharacterAction = (character) => ({
  type: ACTION_TYPES.ADD_CHARACTER,
  payload: { character }
});

/**
 * @function createTraitAction
 * @description Action creator for adding a new trait to the player's collection
 * 
 * @param {Object} trait - Trait data object
 * @returns {Object} The formatted action object
 */
export const createTraitAction = (trait) => ({
  type: ACTION_TYPES.ACQUIRE_TRAIT,
  payload: { trait }
});

export default GameStateContext;