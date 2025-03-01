import React, { useContext } from 'react';
import { GameProvider, GameStateContext, GameDispatchContext, createEssenceAction } from './context/GameStateContext';
import GameContainer from './components/GameContainer';
import GameLoop from './components/GameLoop';

const App = () => {
  const gameState = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);

  const handleGainEssence = () => {
    dispatch(createEssenceAction(10));
  };

  return (
    <GameProvider>
      <div className="App">
        <h1>Essence: {gameState.essence.essence}</h1>
        <button onClick={handleGainEssence}>Gain 10 Essence</button>
        <GameLoop>
          <GameContainer />
        </GameLoop>
      </div>
    </GameProvider>
  );
};

export default App;