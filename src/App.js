import React from 'react';
import { GameProvider } from './context/GameStateContext';
import GameContainer from './components/GameContainer';

const App = () => {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
};

export default App;