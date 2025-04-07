import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/**
 * Basic game state structure
 */
interface GameState {
  player?: {
    name?: string;
    level?: number;
    health?: number;
    maxHealth?: number;
    equippedTraits?: string[];
    traitSlots?: number;
    [key: string]: any;
  };
  essence?: {
    amount?: number;
    maxAmount?: number;
  };
  world?: {
    currentArea?: any;
    [key: string]: any;
  };
  npcs?: any[];
  traits?: {
    copyableTraits?: Record<string, any>;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Initial game state with empty objects/arrays
 */
const initialGameState: GameState = {
  player: { 
    name: 'Hero',
    level: 1,
    health: 100,
    maxHealth: 100,
    equippedTraits: [],
    traitSlots: 3
  },
  essence: { amount: 0, maxAmount: 100 },
  world: { currentArea: null },
  npcs: [],
  traits: { copyableTraits: {} }
};

/**
 * Basic action structure
 */
interface GameAction {
  type: string;
  payload?: any;
}

/**
 * Simple reducer for the game state
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'UPDATE_PLAYER':
      return {
        ...state,
        player: {
          ...state.player,
          ...action.payload
        }
      };
    case 'UPDATE_ESSENCE':
      return {
        ...state,
        essence: {
          ...state.essence,
          ...action.payload
        }
      };
    case 'EQUIP_TRAIT':
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: [...(state.player?.equippedTraits || []), action.payload.traitId]
        }
      };
    case 'UNEQUIP_TRAIT':
      return {
        ...state,
        player: {
          ...state.player,
          equippedTraits: (state.player?.equippedTraits || [])
            .filter(id => id !== action.payload.traitId)
        }
      };
    default:
      return state;
  }
}

// Create the context for state
const GameStateContext = createContext<GameState>(initialGameState);

// Create the context for dispatch
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(() => null);

/**
 * Props for the GameProvider component
 */
interface GameProviderProps {
  children: ReactNode;
  initialState?: Partial<GameState>;
}

/**
 * GameProvider Component
 * 
 * Provides game state and dispatch function to child components
 */
export const GameProvider: React.FC<GameProviderProps> = ({ 
  children, 
  initialState = {} 
}) => {
  const [state, dispatch] = useReducer(
    gameReducer, 
    { ...initialGameState, ...initialState }
  );

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

/**
 * Hook to access the game state
 */
export const useGameState = (): GameState => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

/**
 * Hook to access the game dispatch function
 */
export const useGameDispatch = (): React.Dispatch<GameAction> => {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return context;
};
