import React, { Suspense, lazy } from 'react';
// Use HashRouter or BrowserRouter based on deployment needs
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material'; // Import for fallback UI

// Layout Component
import GameContainer from '../layout/components/GameContainer'; // Import the refactored GameContainer

// Lazily load Page Components
const MainMenu = lazy(() => import('../pages/MainMenu'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
// Other pages like Settings, TraitsPage etc. are now loaded *within* GameContainer/MainContentArea

/**
 * @component AppRouter
 * @description Main application router defining top-level routes.
 * The '/game' route renders the main GameContainer which handles internal tab navigation.
 *
 * @returns {JSX.Element} The router component tree wrapped in Suspense.
 */
export const AppRouter: React.FC = () => (
  <Router>
    <Suspense fallback={
      // Simple fallback UI while pages load
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <Routes>
        {/* Public route for the main menu */}
        <Route path="/" element={<MainMenu />} />

        {/* Single route for the entire game interface */}
        {/* GameContainer now handles the internal layout and content switching */}
        <Route path="/game" element={<GameContainer />} />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
        {/* Or redirect to main menu: <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Suspense>
  </Router>
);

// Default export if this is the main export of the file
// export default AppRouter;
