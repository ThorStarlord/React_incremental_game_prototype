import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Divider,
  Slider
} from '@mui/material';
import { SportsEsports, Save, School } from '@mui/icons-material';

/**
 * Props for GameplaySettingsPanel component
 */
interface GameplaySettingsPanelProps {
  settings: {
    difficulty: 'easy' | 'normal' | 'hard' | 'expert';
    autosaveInterval: number;
    autosaveEnabled: boolean;
    showTutorials: boolean;
  };
  onUpdate: (newSettings: Partial<GameplaySettingsPanelProps['settings']>) => void;
}

/**
 * GameplaySettingsPanel - Interface for managing gameplay preferences
 * 
 * Features:
 * - Difficulty level selection
 * - Autosave configuration
 * - Tutorial display toggle
 * - Accessible form controls with proper labeling
 */
export const GameplaySettingsPanel: React.FC<GameplaySettingsPanelProps> = ({
  settings,
  onUpdate
}) => {
  const handleSelectChange = (key: keyof typeof settings) => (
    event: any
  ) => {
    onUpdate({ [key]: event.target.value });
  };

  const handleSwitchChange = (key: keyof typeof settings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({ [key]: event.target.checked });
  };

  const handleSliderChange = (key: keyof typeof settings) => (
    _event: Event,
    newValue: number | number[]
  ) => {
    onUpdate({ [key]: newValue as number });
  };

  return (
    <Card>
      <CardHeader
        avatar={<SportsEsports color="primary" />}
        title="Gameplay Settings"
        subheader="Configure game difficulty and behavior"
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Difficulty */}
          <FormControl fullWidth>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              id="difficulty"
              value={settings.difficulty}
              label="Difficulty"
              onChange={handleSelectChange('difficulty')}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          {/* Autosave Settings */}
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autosaveEnabled}
                  onChange={handleSwitchChange('autosaveEnabled')}
                  name="autosaveEnabled"
                  icon={<Save />}
                  checkedIcon={<Save />}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Save fontSize="small" />
                  <Typography>Enable autosave</Typography>
                </Box>
              }
            />

            {settings.autosaveEnabled && (
              <Box sx={{ mt: 2, ml: 4 }}>
                <Typography gutterBottom variant="h6" component="label" htmlFor="autosave-interval">
                  Autosave Interval (minutes)
                </Typography>
                <Slider
                  id="autosave-interval"
                  value={settings.autosaveInterval}
                  onChange={handleSliderChange('autosaveInterval')}
                  min={1}
                  max={60}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} min`}
                  marks={[
                    { value: 1, label: '1m' },
                    { value: 15, label: '15m' },
                    { value: 30, label: '30m' },
                    { value: 60, label: '1h' }
                  ]}
                  aria-label="Autosave interval in minutes"
                />
              </Box>
            )}
          </Box>

          <Divider />

          {/* Tutorial Settings */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.showTutorials}
                onChange={handleSwitchChange('showTutorials')}
                name="showTutorials"
                icon={<School />}
                checkedIcon={<School />}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School fontSize="small" />
                <Typography>Show tutorial hints</Typography>
              </Box>
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameplaySettingsPanel;
