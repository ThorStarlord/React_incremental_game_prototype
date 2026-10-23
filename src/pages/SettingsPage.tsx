import React from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  AlertTitle
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectGraphicsSettings,
  selectGameplaySettings,
  selectUISettings,
  updateCategorySettings,
  resetSettings,
  saveSettingsThunk
} from '../features/Settings';

import { GraphicsSettingsPanel } from '../features/Settings/components/ui/GraphicsSettingsPanel';
import { GameplaySettingsPanel } from '../features/Settings/components/ui/GameplaySettingsPanel';
import { UISettingsPanel } from '../features/Settings/components/ui/UISettingsPanel';
import { SettingsActions } from '../features/Settings/components/ui/SettingsActions';

/**
 * SettingsPage - Complete settings management interface
 *
 * Features:
 * - Audio, Graphics, Gameplay, and UI settings management
 * - Real-time settings persistence via Redux thunks
 * - Settings reset functionality with confirmation
 * - Organized category-based interface
 * - Material-UI integration with responsive design
 */
const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Settings selectors
  const graphicsSettings = useAppSelector(selectGraphicsSettings);
  const gameplaySettings = useAppSelector(selectGameplaySettings);
  const uiSettings = useAppSelector(selectUISettings);

  // Settings are loaded once at application startup, not per-page mount.

  const handleGraphicsUpdate = (newSettings: Partial<typeof graphicsSettings>) => {
    dispatch(updateCategorySettings({ category: 'graphics', settings: newSettings }));
    dispatch(saveSettingsThunk());
  };

  const handleGameplayUpdate = (newSettings: Partial<typeof gameplaySettings>) => {
    dispatch(updateCategorySettings({ category: 'gameplay', settings: newSettings }));
    dispatch(saveSettingsThunk());
  };

  const handleUIUpdate = (newSettings: Partial<typeof uiSettings>) => {
    dispatch(updateCategorySettings({ category: 'ui', settings: newSettings }));
    dispatch(saveSettingsThunk());
  };

  // Reset handler using the correct resetSettings action
  const handleReset = () => {
    dispatch(resetSettings());
    dispatch(saveSettingsThunk());
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your game preferences and experience
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Live Appearance Preferences</AlertTitle>
        Changes to dark mode and text size take effect immediately and persist between sessions.
        Audio playback and graphics quality controls are not offered because the
        current game does not have an engine implementing those settings.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Graphics Settings */}
        <GraphicsSettingsPanel
          settings={graphicsSettings}
          onUpdate={handleGraphicsUpdate}
        />

        {/* Gameplay Settings */}
        <GameplaySettingsPanel
          settings={gameplaySettings}
          onUpdate={handleGameplayUpdate}
        />

        {/* UI Settings */}
        <UISettingsPanel
          settings={uiSettings}
          onUpdate={handleUIUpdate}
        />

        {/* Settings Actions */}
        <SettingsActions onReset={handleReset} />
      </Box>
    </Container>
  );
};

export default SettingsPage;
