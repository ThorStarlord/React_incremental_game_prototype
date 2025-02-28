import React, { createContext, useReducer, useCallback, useContext, useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import rootReducer from './reducers/rootReducer';
import { initialState } from './initialState';
import { ACTION_TYPES } from './actions/actionTypes';
import * as actionCreators from './actions/actionCreators';

// Re-export action types and creators for backward compatibility
export { ACTION_TYPES } from './actions/actionTypes';
export const { createEssenceAction } = actionCreators;

// Re-export all action creators for backward compatibility
export const {
  spendEssence,
  updateRelationship,
  meetNpc,
  updateDialogueState,
  addDialogueToHistory,
  startQuest,
  updateQuestProgress,
  completeQuest,
  abandonQuest
} = actionCreators;

// Create contexts for state and dispatch
export const GameStateContext = createContext();
export const GameDispatchContext = createContext();

// Custom hooks for consuming the contexts
export const useGameState = () => useContext(GameStateContext);
export const useGameDispatch = () => useContext(GameDispatchContext);

// Helper function for persistent storage
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gameState', serializedState);
    return true;
  } catch (e) {
    console.error('Could not save state:', e);
    return false;
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('gameState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state:', e);
    return undefined;
  }
};

// Debounce utility to prevent excessive saves
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Main provider component
export const GameProvider = ({ children }) => {
  const [loadError, setLoadError] = useState(null);
  const [showLoadNotification, setShowLoadNotification] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Load saved game or use initial state
  const [state, dispatch] = useReducer(rootReducer, undefined, () => {
    try {
      const savedGame = loadFromLocalStorage();
      if (savedGame) {
        setShowLoadNotification(true);
        return savedGame;
      }
      return initialState;
    } catch (err) {
      setLoadError('Failed to load saved game. Starting new game...');
      return initialState;
    }
  });

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce((gameState) => {
      const saved = saveToLocalStorage(gameState);
      if (saved) {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
      }
    }, 1000),
    []
  );

  // Auto-save when state changes
  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  // Clear notifications after they're displayed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.notifications && state.notifications.length > 0) {
        dispatch({
          type: ACTION_TYPES.CLEAR_NOTIFICATION,
          payload: { id: state.notifications[0].id }
        });
      }
    }, state.notifications?.[0]?.duration || 3000);
    
    return () => clearTimeout(timer);
  }, [state.notifications]);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
        
        {/* Game notifications */}
        {state.notifications && state.notifications[0] && (
          <Snackbar
            open={true}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert 
              severity={state.notifications[0].type || 'info'} 
              onClose={() => dispatch({
                type: ACTION_TYPES.CLEAR_NOTIFICATION,
                payload: { id: state.notifications[0].id }
              })}
            >
              {state.notifications[0].message}
            </Alert>
          </Snackbar>
        )}
        
        {/* Save notification */}
        <Snackbar
          open={showSaveNotification}
          autoHideDuration={2000}
          onClose={() => setShowSaveNotification(false)}
          message="Game saved"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        
        {/* Load notification */}
        <Snackbar
          open={showLoadNotification}
          autoHideDuration={3000}
          onClose={() => setShowLoadNotification(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowLoadNotification(false)}>
            Game loaded successfully!
          </Alert>
        </Snackbar>
        
        {/* Load error notification */}
        {loadError && (
          <Snackbar
            open={!!loadError}
            autoHideDuration={5000}
            onClose={() => setLoadError(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="warning" onClose={() => setLoadError(null)}>
              {loadError}
            </Alert>
          </Snackbar>
        )}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};