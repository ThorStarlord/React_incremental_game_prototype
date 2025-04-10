import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Page Components
import MainMenu from '../pages/MainMenu';
import Settings from '../pages/MainMenu';



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

        <Route index element={<Navigate to="/" replace />} />
      </Route>
      
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
