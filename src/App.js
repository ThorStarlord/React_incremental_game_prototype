import React from 'react';
import { GameProvider } from './context/GameStateContext';
import AppRouter from './routes/AppRouter';
import './styles/App.css';

const App = () => {
    return (
        <GameProvider>
            <AppRouter />
        </GameProvider>
    );
}

export default App;