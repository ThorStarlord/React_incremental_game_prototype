import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Page Components
import MainMenu from '../pages/MainMenu';
import Settings from '../pages/MainMenu';
import WorldMap from '../features/World/components/containers/WorldMap';

// Route Wrappers
import { 
  TownAreaWrapper, 
  NPCEncounterWrapper, 
  NPCPanelWrapper 
} from './components/RouteWrappers';

// Layout Components
import { GameLayout } from './components/Layouts';

/**
 * Main application router that defines all routes in the application
 * @returns Router component tree
 */
const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainMenu />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Game routes with common layout */}
      <Route path="/game" element={<GameLayout />}>
        <Route index element={<WorldMap />} />
        <Route path="town/:townId" element={<TownAreaWrapper />} />
        <Route path="npc/:npcId" element={<NPCPanelWrapper />} />
        <Route path="encounter/:npcId" element={<NPCEncounterWrapper />} />
      </Route>
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
