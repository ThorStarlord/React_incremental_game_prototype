import React, { createContext, useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import gameReducer from './reducers/gameReducer';
import { ensureArray } from '../utils/safeArrayUtils';
import { ACTION_TYPES } from './actions/actionTypes';

// Initial state with safe defaults for arrays
const initialState = {
  player: {
    name: 'Hero',
    level: 1,
    experience: 0,
    attributes: {
      strength: 5,
      dexterity: 5,
      constitution: 5,
      intelligence: 5,
      wisdom: 5,
      charisma: 5
    },
    gold: 10,
    inventory: [],
    equippedItems: {},
    completedQuests: [],
    activeQuests: [],
    discoveredLocations: [],
    discoveredNPCs: [],
    acquiredTraits: [],
    equippedTraits: [],
    permanentTraits: [],
    seenTraits: [],
    controlledCharacters: []
  },
  npcs: [],
  locations: [],
  quests: [],
  essence: 0,
  dialogueHistory: [],
  traits: {
    copyableTraits: {}
  },
  minions: [],
  affinities: {},
  factions: [],
  game: {
    currentLocation: null,
    lastSaved: null,
    saveVersion: 1
  },
  settings: {
    soundEnabled: true,
    darkMode: false,
    language: 'en'
  }
};

export const GameStateContext = createContext(null);
export const GameDispatchContext = createContext(null);

// Custom hooks for accessing game state and dispatch
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Ensure critical arrays are always defined, even after state updates
  const safeState = {
    ...state,
    player: {
      ...state.player,
      inventory: ensureArray(state.player?.inventory),
      completedQuests: ensureArray(state.player?.completedQuests),
      activeQuests: ensureArray(state.player?.activeQuests),
      discoveredLocations: ensureArray(state.player?.discoveredLocations),
      discoveredNPCs: ensureArray(state.player?.discoveredNPCs),
      acquiredTraits: ensureArray(state.player?.acquiredTraits),
      equippedTraits: ensureArray(state.player?.equippedTraits),
      permanentTraits: ensureArray(state.player?.permanentTraits),
      seenTraits: ensureArray(state.player?.seenTraits),
      controlledCharacters: ensureArray(state.player?.controlledCharacters)
    },
    npcs: ensureArray(state.npcs),
    locations: ensureArray(state.locations),
    quests: ensureArray(state.quests),
    dialogueHistory: ensureArray(state.dialogueHistory),
    minions: ensureArray(state.minions),
    factions: ensureArray(state.factions),
    traits: {
      ...state.traits,
      copyableTraits: state.traits?.copyableTraits || {}
    }
  };
  
  return (
    <GameStateContext.Provider value={safeState}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

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
 */
function createEssenceAction(amount) {
  // Return the action object
  return {
    type: ACTION_TYPES.GAIN_ESSENCE,
    payload: { amount }
  };
}

// Add gain as a static method of the function itself
createEssenceAction.gain = function(amount) {
  return {
    type: ACTION_TYPES.GAIN_ESSENCE,
    payload: { amount }
  };
};

export { createEssenceAction };

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

export default GameProvider;