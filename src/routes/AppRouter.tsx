import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GameLayout } from './components/GameLayout';
import { TraitSystemWrapper } from '../features/Traits/components/containers/TraitSystemWrapper';

/**
 * Application router configuration with route-based content loading
 * for the three-column game layout
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/game/traits" replace />
  },
  {
    path: '/game',
    element: <GameLayout />,
    children: [
      // Default route
      {
        index: true,
        element: <Navigate to="traits" replace />
      },
      // Primary feature routes (middle column)
      {
        path: 'traits',
        element: <TraitSystemWrapper />
      },
      {
        path: 'npcs',
        element: <div>NPC Interaction Panel (Placeholder)</div> // Replace with actual component
      },
      {
        path: 'quests',
        element: <div>Quest Log Panel (Placeholder)</div> // Replace with actual component
      },
      {
        path: 'copies',
        element: <div>Copy Management Panel (Placeholder)</div> // Replace with actual component
      },
      // Character management routes (can appear in left column outlet)
      {
        path: 'character',
        children: [
          {
            path: 'stats',
            element: <div>Player Stats Panel (Placeholder)</div> // Replace with actual component
          },
          {
            path: 'attributes',
            element: <div>Attribute Allocation Panel (Placeholder)</div> // Replace with actual component
          }
        ]
      }
    ]
  },
  // Other top-level routes
  {
    path: '/menu',
    element: <div>Main Menu (Placeholder)</div> // Replace with actual component
  },
  {
    path: '*',
    element: <Navigate to="/game/traits" replace />
  }
]);
