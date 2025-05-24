import React from 'react';
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { TraitSystemWrapper } from '../features/Traits';

/**
 * @fileoverview TraitsPage Component - Manages and displays character traits
 * @module TraitsPage
 */

/**
 * TraitsPage Component
 * 
 * @description Renders the trait management interface of the Incremental RPG game.
 * This component allows players to view available traits and assign them to trait slots.
 * Traits can modify various character attributes, abilities, or game mechanics.
 * 
 * The page is divided into two main sections:
 * 1. TraitSlots - Shows the active trait slots and currently equipped traits
 * 2. TraitListContainer - Displays all acquired traits that can be leveled up
 * 
 * @component
 * @example
 * return (
 *   <TraitsPage />
 * )
 * 
 * @returns {JSX.Element} A page displaying trait management interface using MUI
 */
const TraitsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 3,
        }}
      >
        Trait Management
      </Typography>

      {/* Trait System Integration */}
      <Box
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <TraitSystemWrapper />
      </Box>
    </Box>
  );
};

export default TraitsPage;
