import React from 'react';
import { Button, Box, Typography, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * @fileoverview MainMenu Component - The entry point UI for the Incremental RPG game
 * @module MainMenu
 */

/**
 * MainMenu Component
 * 
 * @description Renders the main menu interface of the Incremental RPG game.
 * This component serves as the landing page and provides navigation options
 * to start the game or access settings.
 * 
 * @component
 * @example
 * return (
 *   <MainMenu />
 * )
 * 
 * @returns {JSX.Element} A container with game title and navigation buttons
 */
const MainMenu = () => (
  <Container maxWidth="sm">
    <Box sx={{ 
      p: 4, 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minHeight: '100vh',
      justifyContent: 'center'
    }}>
      {/* Main content card with elevated appearance */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        {/* Game title */}
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4
          }}
        >
          Incremental RPG
        </Typography>
        
        {/* Navigation buttons container */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Start Game button - Routes to the main game interface */}
          <Button 
            component={RouterLink} 
            to="/game" 
            variant="contained" 
            size="large"
            sx={{ py: 2 }}
            aria-label="Start game"
          >
            Start Game
          </Button>
          
          {/* Settings button - Routes to game configuration page */}
          <Button 
            component={RouterLink} 
            to="/settings" 
            variant="outlined"
            size="large"
            sx={{ py: 2 }}
            aria-label="Access settings"
          >
            Settings
          </Button>
        </Box>

        {/* Help text footer */}
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Use the navigation menu or back button to move between areas
          </Typography>
        </Box>
      </Paper>
    </Box>
  </Container>
);

export default MainMenu;