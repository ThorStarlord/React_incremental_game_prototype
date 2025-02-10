import React, { createContext, useReducer } from 'react';

const initialState = {
  player: {
    name: "Hero",
    hp: 100,
    attack: 10,
    defense: 5,
    statPoints: 0,
  },
  inventory: [],
  quests: [],
  enemies: [
    {
      id: 1,
      name: "Goblin",
      hp: 30,
      attack: 4,
      defense: 2,
    },
    {
      id: 2,
      name: "Orc",
      hp: 50,
      attack: 7,
      defense: 3,
    }
  ]
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYER':
      return { ...state, player: action.payload };
    case 'UPDATE_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'UPDATE_QUESTS':
      return { ...state, quests: action.payload };
    case 'UPDATE_ENEMIES':
      return { ...state, enemies: action.payload };
    default:
      return state;
  }
};

export const GameStateContext = createContext();
export const GameDispatchContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};