import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Box,
  Divider
} from '@mui/material';
import { VolumeUp, VolumeOff, MusicNote, GraphicEq } from '@mui/icons-material';

/**
 * Props for AudioSettingsPanel component
 */
interface AudioSettingsPanelProps {
  settings: {
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
    muteWhenInactive: boolean;
  };
  onUpdate: (newSettings: Partial<AudioSettingsPanelProps['settings']>) => void;
}

/**
 * AudioSettingsPanel - Interface for managing audio and sound settings
 * 
 * Features:
 * - Master volume control with visual feedback
 * - Music and effects volume sliders
 * - Mute when inactive toggle
 * - Accessible slider controls with proper labeling
 */
export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = React.memo(({
  settings,
  onUpdate
}) => {
  const handleVolumeChange = React.useCallback((key: keyof typeof settings) => (
    _event: Event,
    newValue: number | number[]
  ) => {
    if (typeof newValue === 'number') {
      onUpdate({ [key]: newValue });
    }
  }, [onUpdate]);

  const handleSwitchChange = React.useCallback((key: keyof typeof settings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({ [key]: event.target.checked });
  }, [onUpdate]);

  return (
    <Card>
      <CardHeader
        avatar={<VolumeUp color="primary" />}
        title="Audio Settings"
        subheader="Configure sound and music preferences"
      />
      
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Master Volume */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VolumeUp sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h3">
                Master Volume
              </Typography>
            </Box>
            <Slider
              value={settings.masterVolume}
              onChange={handleVolumeChange('masterVolume')}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              aria-label="Master volume"
              aria-valuetext={`${settings.masterVolume}%`}
              sx={{ ml: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
              Controls overall audio volume for the entire game
            </Typography>
          </Box>

          <Divider />

          {/* Music Volume */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MusicNote sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6" component="h3">
                Music Volume
              </Typography>
            </Box>
            <Slider
              value={settings.musicVolume}
              onChange={handleVolumeChange('musicVolume')}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              aria-label="Music volume"
              aria-valuetext={`${settings.musicVolume}%`}
              sx={{ ml: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
              Background music and ambient soundtracks
            </Typography>
          </Box>

          <Divider />

          {/* Sound Effects Volume */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <GraphicEq sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" component="h3">
                Sound Effects Volume
              </Typography>
            </Box>
            <Slider
              value={settings.effectsVolume}
              onChange={handleVolumeChange('effectsVolume')}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              aria-label="Sound effects volume"
              aria-valuetext={`${settings.effectsVolume}%`}
              sx={{ ml: 1 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
              UI sounds, interaction feedback, and game sound effects
            </Typography>
          </Box>

          <Divider />

          {/* Additional Settings */}
          <Box>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Additional Options
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.muteWhenInactive}
                  onChange={handleSwitchChange('muteWhenInactive')}
                  color="primary"
                  inputProps={{ 'aria-describedby': 'mute-inactive-description' }}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">
                    Mute when game is inactive
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    id="mute-inactive-description"
                  >
                    Automatically mute audio when the game window loses focus
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', ml: 0 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

AudioSettingsPanel.displayName = 'AudioSettingsPanel';

export default AudioSettingsPanel;
