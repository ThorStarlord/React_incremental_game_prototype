import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Fix the import to match the export type
import GameProvider from './context/GameProvider';  
import { ThemeProviderWrapper } from './context/ThemeContext';
import { CssBaseline } from '@mui/material';
import AppRouter from './routes/AppRouter';

// Add null check for root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
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
