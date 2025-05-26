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
import { Palette, TextFields, Notifications } from '@mui/icons-material';

/**
 * Props for UISettingsPanel component
 */
interface UISettingsPanelProps {
  settings: {
    fontSize: 'small' | 'medium' | 'large';
    theme: string;
    showResourceNotifications: boolean;
  };
  onUpdate: (newSettings: Partial<UISettingsPanelProps['settings']>) => void;
}

/**
 * UISettingsPanel - Interface for managing user interface preferences
 * 
 * Features:
 * - Font size selection
 * - Theme selection
 * - Notification preferences
 * - Accessible form controls with proper labeling
 */
export const UISettingsPanel: React.FC<UISettingsPanelProps> = ({
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
        avatar={<Palette color="primary" />}
        title="Interface Settings"
        subheader="Configure user interface appearance and behavior"
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Font Size */}
          <FormControl fullWidth>
            <InputLabel id="font-size-label">Font Size</InputLabel>
            <Select
              labelId="font-size-label"
              id="font-size"
              value={settings.fontSize}
              label="Font Size"
              onChange={handleSelectChange('fontSize')}
              startAdornment={<TextFields sx={{ mr: 1 }} />}
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>

          {/* Theme */}
          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              id="theme"
              value={settings.theme}
              label="Theme"
              onChange={handleSelectChange('theme')}
              startAdornment={<Palette sx={{ mr: 1 }} />}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="auto">Auto (System)</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          {/* Notifications */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.showResourceNotifications}
                onChange={handleSwitchChange('showResourceNotifications')}
                name="showResourceNotifications"
                icon={<Notifications />}
                checkedIcon={<Notifications />}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications fontSize="small" />
                <Typography>Show resource notifications</Typography>
              </Box>
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UISettingsPanel;
