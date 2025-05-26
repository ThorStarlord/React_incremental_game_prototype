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
  Divider
} from '@mui/material';
import { DisplaySettings, Brightness6, AutoAwesome } from '@mui/icons-material';

/**
 * Props for GraphicsSettingsPanel component
 */
interface GraphicsSettingsPanelProps {
  settings: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    particleEffects: boolean;
    darkMode: boolean;
  };
  onUpdate: (newSettings: Partial<GraphicsSettingsPanelProps['settings']>) => void;
}

/**
 * GraphicsSettingsPanel - Interface for managing visual and graphics settings
 * 
 * Features:
 * - Graphics quality selector
 * - Particle effects toggle
 * - Dark mode toggle
 * - Accessible form controls with proper labeling
 */
export const GraphicsSettingsPanel: React.FC<GraphicsSettingsPanelProps> = ({
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

  return (
    <Card>
      <CardHeader
        avatar={<DisplaySettings color="primary" />}
        title="Graphics Settings"
        subheader="Configure visual appearance and performance"
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Graphics Quality */}
          <FormControl fullWidth>
            <InputLabel id="graphics-quality-label">Graphics Quality</InputLabel>
            <Select
              labelId="graphics-quality-label"
              id="graphics-quality"
              value={settings.quality}
              label="Graphics Quality"
              onChange={handleSelectChange('quality')}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="ultra">Ultra</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          {/* Particle Effects */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.particleEffects}
                onChange={handleSwitchChange('particleEffects')}
                name="particleEffects"
                icon={<AutoAwesome />}
                checkedIcon={<AutoAwesome />}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome fontSize="small" />
                <Typography>Enable particle effects</Typography>
              </Box>
            }
          />

          {/* Dark Mode */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={handleSwitchChange('darkMode')}
                name="darkMode"
                icon={<Brightness6 />}
                checkedIcon={<Brightness6 />}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Brightness6 fontSize="small" />
                <Typography>Dark mode</Typography>
              </Box>
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default GraphicsSettingsPanel;
