import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
 * Main application router component.
 *
 * Campaign One exposes only implemented 1.0 player surfaces. Historical
 * placeholder routes for Skills, Inventory, Crafting, and duplicate save
 * management are intentionally absent; direct legacy URLs fail closed to the
 * game dashboard rather than advertising deferred/cut systems.
 */
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Main Menu Route - standalone and canonical save/load/import-export surface. */}
      <Route path="/" element={<MainMenu />} />
      <Route path="/menu" element={<MainMenu />} />

      {/* Game Routes - use GameLayout for all game-related paths. */}
      <Route path="/game" element={<GameLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="character" element={<CharacterPage />} />
        <Route path="traits" element={<TraitsPage />} />

        <Route path="npcs" element={<NPCsPage />}>
          <Route path=":npcId" element={<NPCPanelContainer />} />
        </Route>

        <Route path="quests" element={<QuestsPage />} />
        <Route path="copies" element={<CopiesPage />} />
        <Route path="essence" element={<EssencePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="debug" element={<DebugPage />} />

        {/* Cut/deferred or otherwise unknown legacy game URLs return safely to a real surface. */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
