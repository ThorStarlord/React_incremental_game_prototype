import React from 'react';
import { Box, Card, CardContent, CardHeader, FormControlLabel, Slider, Switch, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';

interface GameplaySettingsPanelProps {
  settings: {
    autosaveInterval: number;
    autosaveEnabled: boolean;
  };
  onUpdate: (settings: Partial<GameplaySettingsPanelProps['settings']>) => void;
}

/** Offer only preferences consumed by the live gameplay runtime.
 * Difficulty and tutorial flags remain in old save payloads for compatibility,
 * but exposing switches without any effect misleads players.
 */
export const GameplaySettingsPanel: React.FC<GameplaySettingsPanelProps> = ({ settings, onUpdate }) => (
  <Card>
    <CardHeader avatar={<Save color="primary" />} title="Saving" subheader="Automatic progress preservation" />
    <CardContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.autosaveEnabled}
              onChange={event => onUpdate({ autosaveEnabled: event.target.checked })}
              name="autosaveEnabled"
            />
          }
          label="Enable autosave"
        />
        {settings.autosaveEnabled && (
          <Box sx={{ px: 1 }}>
            <Typography id="autosave-interval-label" gutterBottom variant="subtitle2">
              Autosave every {settings.autosaveInterval} minute{settings.autosaveInterval === 1 ? '' : 's'}
            </Typography>
            <Slider
              value={settings.autosaveInterval}
              onChange={(_event, value) => onUpdate({ autosaveInterval: value as number })}
              min={1}
              max={60}
              step={1}
              valueLabelDisplay="auto"
              marks={[{ value: 1, label: '1m' }, { value: 15, label: '15m' }, { value: 30, label: '30m' }, { value: 60, label: '1h' }]}
              aria-labelledby="autosave-interval-label"
            />
          </Box>
        )}
        <Typography variant="body2" color="text.secondary">
          Difficulty and tutorial-hint toggles are not offered because they do not change the current campaign.
          Existing saved preference fields are preserved for compatibility.
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
