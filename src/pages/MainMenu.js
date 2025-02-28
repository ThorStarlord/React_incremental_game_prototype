import React from 'react';
import { Button, Box, Typography, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)'
        }}
      >
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
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            component={RouterLink} 
            to="/game" 
            variant="contained" 
            size="large"
            sx={{ py: 2 }}
          >
            Start Game
          </Button>
          
          <Button 
            component={RouterLink} 
            to="/settings" 
            variant="outlined"
            size="large"
            sx={{ py: 2 }}
          >
            Settings
          </Button>
        </Box>

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