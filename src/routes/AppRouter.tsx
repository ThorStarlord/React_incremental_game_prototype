import React, { Suspense, lazy } from 'react'; // Import Suspense and lazy
import { Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'; // Import for fallback UI

// Layout Components - Update import path if needed
import { GameLayout } from './components/RoutesLayouts';

// Lazily load Page Components
const MainMenu = lazy(() => import('../pages/MainMenu'));
const GamePage = lazy(() => import('../pages/GamePage'));
const TraitsPage = lazy(() => import('../pages/TraitsPage'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

/**
 * @component AppRouter
 * @description Main application router defining all navigable routes.
 * Implements route-based code splitting using React.lazy and Suspense
 * for optimized initial loading. Routes within '/game' use the GameLayout.
 *
 * @returns {JSX.Element} The router component tree wrapped in Suspense.
 */
export const AppRouter: React.FC = () => (
  // Wrap Routes with Suspense to handle lazy loading
  <Suspense fallback={
    // Simple fallback UI while pages load
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  }>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainMenu />} />

      {/* Game routes with common layout */}
      <Route path="/game" element={<GameLayout />}>
        {/* Index route for the main game view */}
        <Route index element={<GamePage />} />
        <Route path="traits" element={<TraitsPage />} />
        <Route path="settings" element={<Settings />} />
        {/* Add other game sub-routes here */}
      </Route>

      {/* Fallback for undefined routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);
