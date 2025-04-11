import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; 

// Page Components
import MainMenu from '../pages/MainMenu';
import GamePage from '../pages/GamePage'; 
import TraitsPage from '../pages/TraitsPage';
import Settings from '../pages/Settings';
import NotFoundPage from '../pages/NotFoundPage'; 

// Layout Components
import { GameLayout } from './components/Layouts';

/**
 * Main application router that defines all routes in the application
 * @returns Router component tree
 */
// Change to named export
export const AppRouter: React.FC = () => ( 
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<MainMenu />} />
    
    {/* Game routes with common layout */}
    <Route path="/game" element={<GameLayout />}>
      <Route index element={<GamePage />} />
      <Route path="traits" element={<TraitsPage />} />
      <Route path="settings" element={<Settings />} /> 
    </Route>
    
    {/* Fallback for undefined routes */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
