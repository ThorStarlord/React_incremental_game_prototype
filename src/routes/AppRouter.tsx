import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed BrowserRouter as Router
import MainMenu from '../pages/MainMenu';
import { GameLayout } from '../layout/components/GameLayout';
import NPCsPage from '../pages/NPCsPage';
import { NPCPanelContainer } from '../features/NPCs';

/**
 * Main application router component
 * Handles routing between MainMenu and the game interface
 */
export const AppRouter: React.FC = () => {
  return (
    // <Router> removed
    <Routes>
      {/* Main Menu Route - Standalone */}
      <Route path="/" element={<MainMenu />} />
      <Route path="/menu" element={<MainMenu />} />
      
      {/* Game Routes - Use GameLayout for all game-related paths */}
      <Route path="/game" element={<GameLayout />}>
        {/* Nested route for NPCs to handle list and detail views */}
        <Route path="npcs" element={<NPCsPage />}>
          <Route path=":npcId" element={<NPCPanelContainer />} />
        </Route>
        {/* Other game routes can be nested here */}
      </Route>
      
      {/* Default redirect to main menu */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    // </Router> removed
  );
};
