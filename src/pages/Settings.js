import React, { useContext } from 'react';
import { Container, Box, Typography, Switch, FormGroup, FormControlLabel, Button, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import Panel from '../shared/components/layout/Panel';
import BreadcrumbNav from '../shared/components/ui/BreadcrumbNav';

const Settings = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <BreadcrumbNav />
        <Panel title="Game Settings">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Visual Settings
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch 
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
            </FormGroup>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Game Settings
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Sound Effects"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Background Music"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Combat Animations"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Show Damage Numbers"
              />
            </FormGroup>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              color="primary"
            >
              Back to Menu
            </Button>
            <Button
              component={RouterLink}
              to="/game"
              variant="contained"
              color="primary"
            >
              Start Game
            </Button>
          </Box>
        </Panel>
      </Box>
    </Container>
  );
};

export default Settings;