import React from 'react';
import GameLayout from './layout/components/GameLayout';

/**
 * Main App Component
 * 
 * The application providers (Redux, Router, Theme) are now in index.tsx
 * This component simply renders the main layout
 */
const App: React.FC = () => {
  return <GameLayout />;
};

export default App;
