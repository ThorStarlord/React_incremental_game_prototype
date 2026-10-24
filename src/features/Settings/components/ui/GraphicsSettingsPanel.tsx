import React from 'react';
import { Card, CardContent, CardHeader, FormControlLabel, Switch, Typography } from '@mui/material';
import { Brightness6 } from '@mui/icons-material';

interface AppearanceSettings {
  darkMode: boolean;
}
interface GraphicsSettingsPanelProps {
  settings: AppearanceSettings;
  onUpdate: (newSettings: Partial<AppearanceSettings>) => void;
}

/** Only show actual supported appearance changes, never inert quality sliders. */
export const GraphicsSettingsPanel: React.FC<GraphicsSettingsPanelProps> = ({ settings, onUpdate }) => (
  <Card>
    <CardHeader avatar={<Brightness6 color="primary" />} title="Appearance" subheader="Live visual preferences" />
    <CardContent>
      <FormControlLabel
        control={<Switch checked={settings.darkMode} onChange={event => onUpdate({ darkMode: event.target.checked })} />}
        label="Dark mode"
      />
      <Typography variant="body2" color="text.secondary">
        Updates the game interface immediately. The setting is saved for your next session.
      </Typography>
    </CardContent>
  </Card>
);
export default GraphicsSettingsPanel;
