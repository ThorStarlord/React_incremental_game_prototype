import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainMenu } from '../pages/MainMenu';
import { GameLayout } from '../layout/components/GameLayout';

/**
 * Main application router component
 * Handles routing between MainMenu and the game interface
 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main Menu Route - Standalone */}
        <Route path="/" element={<MainMenu />} />
        <Route path="/menu" element={<MainMenu />} />
        
        {/* Game Routes - Use GameLayout for all game-related paths */}
        <Route path="/game/*" element={<GameLayout />} />
        
        {/* Default redirect to main menu */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
