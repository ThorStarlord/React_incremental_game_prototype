import React, { useState } from 'react';
import { Container, Box, Typography, Switch, FormGroup, FormControlLabel, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Panel from './Panel';

const Settings = () => {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    notifications: true,
    darkMode: false,
  });

  const handleChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Panel title="Settings">
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={settings.soundEnabled} onChange={() => handleChange('soundEnabled')} />}
              label="Sound Effects"
            />
            <FormControlLabel
              control={<Switch checked={settings.notifications} onChange={() => handleChange('notifications')} />}
              label="Notifications"
            />
            <FormControlLabel
              control={<Switch checked={settings.darkMode} onChange={() => handleChange('darkMode')} />}
              label="Dark Mode"
            />
          </FormGroup>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} to="/" variant="outlined">
              Back to Menu
            </Button>
            <Button component={Link} to="/game" variant="contained">
              Start Game
            </Button>
          </Box>
        </Panel>
      </Box>
    </Container>
  );
};

export default Settings;