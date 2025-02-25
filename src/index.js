import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './routes/AppRouter';
import { GameProvider } from './context/GameStateContext';
import { ThemeProviderWrapper } from './context/ThemeContext';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameProvider>
      <ThemeProviderWrapper>
        <CssBaseline />
        <AppRouter />
      </ThemeProviderWrapper>
    </GameProvider>
  </React.StrictMode>
);