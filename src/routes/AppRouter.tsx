import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed BrowserRouter as Router
import MainMenu from '../pages/MainMenu';
import { GameLayout } from '../layout/components/GameLayout';
import NPCsPage from '../pages/NPCsPage';
import { NPCPanelContainer } from '../features/NPCs';
import { DashboardPage } from '../pages/DashboardPage';
import CharacterPage from '../pages/CharacterPage';
import TraitsPage from '../pages/TraitsPage';
import CopiesPage from '../pages/CopiesPage';
import EssencePage from '../pages/EssencePage';
import QuestsPage from '../pages/QuestsPage';
import SettingsPage from '../pages/SettingsPage';
import DebugPage from '../pages/DebugPage';

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
        {/* Default route for /game -> /game/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="character" element={<CharacterPage />} />
        <Route path="traits" element={<TraitsPage />} />
        
        {/* Nested route for NPCs to handle list and detail views */}
        <Route path="npcs" element={<NPCsPage />}>
          <Route path=":npcId" element={<NPCPanelContainer />} />
        </Route>

        <Route path="quests" element={<QuestsPage />} />
        <Route path="copies" element={<CopiesPage />} />
        <Route path="essence" element={<EssencePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="debug" element={<DebugPage />} />
      </Route>
      
      {/* Default redirect to main menu */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    // </Router> removed
  );
};
