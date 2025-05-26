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
export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({
  settings,
  onUpdate
}) => {
  const handleVolumeChange = (key: keyof typeof settings) => (
    _event: Event,
    newValue: number | number[]
  ) => {
    onUpdate({ [key]: newValue as number });
  };

  const handleSwitchChange = (key: keyof typeof settings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({ [key]: event.target.checked });
  };

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
            <Typography gutterBottom variant="h6" component="label" htmlFor="master-volume">
              Master Volume
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VolumeOff />
              <Slider
                id="master-volume"
                value={settings.masterVolume}
                onChange={handleVolumeChange('masterVolume')}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flexGrow: 1 }}
                aria-label="Master volume"
              />
              <VolumeUp />
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                {settings.masterVolume}%
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Music Volume */}
          <Box>
            <Typography gutterBottom variant="h6" component="label" htmlFor="music-volume">
              Music Volume
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MusicNote />
              <Slider
                id="music-volume"
                value={settings.musicVolume}
                onChange={handleVolumeChange('musicVolume')}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flexGrow: 1 }}
                aria-label="Music volume"
              />
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                {settings.musicVolume}%
              </Typography>
            </Box>
          </Box>

          {/* Effects Volume */}
          <Box>
            <Typography gutterBottom variant="h6" component="label" htmlFor="effects-volume">
              Sound Effects Volume
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GraphicEq />
              <Slider
                id="effects-volume"
                value={settings.effectsVolume}
                onChange={handleVolumeChange('effectsVolume')}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flexGrow: 1 }}
                aria-label="Sound effects volume"
              />
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                {settings.effectsVolume}%
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Mute When Inactive */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.muteWhenInactive}
                onChange={handleSwitchChange('muteWhenInactive')}
                name="muteWhenInactive"
              />
            }
            label="Mute audio when window is inactive"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AudioSettingsPanel;
