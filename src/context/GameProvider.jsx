import React, { createContext, useState, useEffect, useContext } from 'react';
// Check if any of these imports might be the problem
// Make sure the paths are correct and the components are properly exported
import GameScreen from '../components/GameScreen'; // Verify this path
import CharacterCreation from '../components/CharacterCreation'; // Verify this path
// ...existing code...

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // ...existing code...
  
  return (
    <GameContext.Provider value={/* your context value */}>
      {/* Check which component might be undefined here */}
      {children}
    </GameContext.Provider>
  );
};

// Make sure to export the GameProvider component
export default GameProvider;
