import React from 'react';
import { GameProvider } from './context/GameStateContext';
import GameContainer from './components/GameContainer';
import './styles/App.css';

const App = () => {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
};

export default App;