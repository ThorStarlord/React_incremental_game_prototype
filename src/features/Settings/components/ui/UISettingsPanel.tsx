import React from 'react';
import { Card, CardContent, CardHeader, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { TextFields } from '@mui/icons-material';
import type { UISettings } from '../../state/SettingsTypes';

interface UISettingsPanelProps {
  settings: UISettings;
  onUpdate: (newSettings: Partial<UISettings>) => void;
}

/** UI text size is connected to the single live MUI theme provider. */
export const UISettingsPanel: React.FC<UISettingsPanelProps> = ({ settings, onUpdate }) => (
  <Card>
    <CardHeader avatar={<TextFields color="primary" />} title="Text & Readability" />
    <CardContent>
      <FormControl fullWidth>
        <InputLabel id="font-size-label">Text Size</InputLabel>
        <Select
          labelId="font-size-label"
          value={settings.fontSize}
          label="Text Size"
          onChange={event => onUpdate({ fontSize: event.target.value as UISettings['fontSize'] })}
        >
          <MenuItem value="small">Small</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="large">Large</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Applies to game text, controls, and menus immediately.
      </Typography>
    </CardContent>
  </Card>
);
export default UISettingsPanel;
