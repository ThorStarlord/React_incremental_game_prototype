import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Fix the import to match the export type
import GameProvider from './context/GameProvider';  
import { ThemeProviderWrapper } from './context/ThemeContext';
import { CssBaseline } from '@mui/material';
import AppRouter from './routes/AppRouter';

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