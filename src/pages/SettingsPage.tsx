import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Alert,
  AlertTitle,
  Slider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  VolumeUp as AudioIcon,
  Palette as GraphicsIcon,
  Gamepad2 as GameplayIcon,
  ViewQuilt as UIIcon,
  Save as SaveIcon,
  RestoreFromTrash as ResetIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectSettings } from '../features/Settings';
import { updateSetting, updateCategorySettings, resetSettings } from '../features/Settings/state/SettingsSlice';

/**
 * SettingsPage - Comprehensive game settings management interface
 * 
 * Provides organized settings management including:
 * - Audio settings (volumes, preferences)
 * - Graphics settings (quality, effects)
 * - Gameplay settings (difficulty, autosave)
 * - UI settings (theme, accessibility)
 */
export const SettingsPage: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    dispatch(updateSetting({ category, setting, value }));
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      dispatch(resetSettings());
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            fontWeight: 600
          }}
        >
          <SettingsIcon color="primary" sx={{ fontSize: 40 }} />
          Game Settings
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Configure your game experience with audio, graphics, gameplay, and interface preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Audio Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AudioIcon color="primary" />
                Audio Settings
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>
                  Master Volume: {settings.audio.masterVolume}%
                </Typography>
                <Slider
                  value={settings.audio.masterVolume}
                  onChange={(_, value) => handleSettingChange('audio', 'masterVolume', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>
                  Music Volume: {settings.audio.musicVolume}%
                </Typography>
                <Slider
                  value={settings.audio.musicVolume}
                  onChange={(_, value) => handleSettingChange('audio', 'musicVolume', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{ mb: 3 }}
                />
                
                <Typography gutterBottom>
                  Effects Volume: {settings.audio.effectsVolume}%
                </Typography>
                <Slider
                  value={settings.audio.effectsVolume}
                  onChange={(_, value) => handleSettingChange('audio', 'effectsVolume', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{ mb: 3 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.audio.muteWhenInactive}
                      onChange={(e) => handleSettingChange('audio', 'muteWhenInactive', e.target.checked)}
                    />
                  }
                  label="Mute when window inactive"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphics Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <GraphicsIcon color="primary" />
                Graphics Settings
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Graphics Quality</InputLabel>
                  <Select
                    value={settings.graphics.quality}
                    label="Graphics Quality"
                    onChange={(e) => handleSettingChange('graphics', 'quality', e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="ultra">Ultra</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.graphics.particleEffects}
                      onChange={(e) => handleSettingChange('graphics', 'particleEffects', e.target.checked)}
                    />
                  }
                  label="Enable particle effects"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.graphics.darkMode}
                      onChange={(e) => handleSettingChange('graphics', 'darkMode', e.target.checked)}
                    />
                  }
                  label="Dark mode theme"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gameplay Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <GameplayIcon color="primary" />
                Gameplay Settings
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    value={settings.gameplay.difficulty}
                    label="Difficulty Level"
                    onChange={(e) => handleSettingChange('gameplay', 'difficulty', e.target.value)}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.gameplay.autosaveEnabled}
                      onChange={(e) => handleSettingChange('gameplay', 'autosaveEnabled', e.target.checked)}
                    />
                  }
                  label="Enable autosave"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <Typography gutterBottom>
                  Autosave Interval: {settings.gameplay.autosaveInterval} minutes
                </Typography>
                <Slider
                  value={settings.gameplay.autosaveInterval}
                  onChange={(_, value) => handleSettingChange('gameplay', 'autosaveInterval', value)}
                  valueLabelDisplay="auto"
                  min={1}
                  max={60}
                  disabled={!settings.gameplay.autosaveEnabled}
                  sx={{ mb: 3 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.gameplay.showTutorials}
                      onChange={(e) => handleSettingChange('gameplay', 'showTutorials', e.target.checked)}
                    />
                  }
                  label="Show tutorial hints"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* UI Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <UIIcon color="primary" />
                Interface Settings
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Font Size</InputLabel>
                  <Select
                    value={settings.ui.fontSize}
                    label="Font Size"
                    onChange={(e) => handleSettingChange('ui', 'fontSize', e.target.value)}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Theme
                  </Typography>
                  <Chip 
                    label={settings.ui.theme || 'Default'} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.ui.showResourceNotifications}
                      onChange={(e) => handleSettingChange('ui', 'showResourceNotifications', e.target.checked)}
                    />
                  }
                  label="Show resource change notifications"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Settings Management
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="primary"
                >
                  Save Settings
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ResetIcon />}
                  color="warning"
                  onClick={handleResetSettings}
                >
                  Reset to Defaults
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Alert severity="info">
                <AlertTitle>Settings Information</AlertTitle>
                Settings are automatically saved to your browser's local storage. 
                Changes take effect immediately and persist between sessions.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings Preview */}
        <Grid item xs={12}>
          <Alert severity="info">
            <AlertTitle>Planned Features</AlertTitle>
            <Typography variant="body2">
              <strong>Additional settings coming soon:</strong>
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Advanced graphics options (shadows, anti-aliasing)</li>
              <li>Keybinding customization</li>
              <li>Advanced audio options (environmental sounds, voice)</li>
              <li>Accessibility enhancements (high contrast, motion reduction)</li>
              <li>Import/export settings profiles</li>
              <li>Cloud settings synchronization</li>
            </Box>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
});

SettingsPage.displayName = 'SettingsPage';
