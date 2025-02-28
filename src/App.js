import React from 'react';
import { GameProvider } from './context/GameStateContext';
import GameContainer from './components/GameContainer';
import GameLoop from './components/GameLoop';

const App = () => {
  return (
    <GameProvider>
      <GameLoop>
        <GameContainer />
      </GameLoop>
    </GameProvider>
  );
};

export default App;