import React from 'react';
import { ThemeProviderWrapper } from './context/ThemeContext';
import GameProvider from './context/GameProvider';
import GameLayout from './layout/components/GameLayout';
import GameLoop from './context/gameLogic/GameLoop';

/**
 * Main App Component
 * 
 * Wraps the entire application with necessary providers and layouts:
 * 1. ThemeProvider for consistent styling and theme support
 * 2. GameProvider for global state management
 * 3. GameLoop for time-based game mechanics
 * 4. GameLayout for the three-column layout system
 */
const App: React.FC = () => {
  return (
    <ThemeProviderWrapper>
      <GameProvider>
        <GameLoop>
          <GameLayout />
        </GameLoop>
      </GameProvider>
    </ThemeProviderWrapper>
  );
};

export default App;
