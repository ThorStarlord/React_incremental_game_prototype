import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  AlertTitle
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectSettings,
  selectAudioSettings,
  selectGraphicsSettings,
  selectGameplaySettings,
  selectUISettings,
  updateCategorySettings,
  resetSettings,
  loadSettingsThunk,
  saveSettingsThunk
} from '../features/Settings';

import { AudioSettingsPanel } from '../features/Settings/components/ui/AudioSettingsPanel';
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
  const settings = useAppSelector(selectSettings);
  const audioSettings = useAppSelector(selectAudioSettings);
  const graphicsSettings = useAppSelector(selectGraphicsSettings);
  const gameplaySettings = useAppSelector(selectGameplaySettings);
  const uiSettings = useAppSelector(selectUISettings);

  // Load settings on component mount
  useEffect(() => {
    dispatch(loadSettingsThunk());
  }, [dispatch]);

  // Category update handlers with proper type safety
  const handleAudioUpdate = (newSettings: Partial<typeof audioSettings>) => {
    dispatch(updateCategorySettings({ category: 'audio', settings: newSettings }));
    dispatch(saveSettingsThunk());
  };

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
        <AlertTitle>Settings Auto-Save</AlertTitle>
        Settings changes are automatically saved and will persist across game sessions.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Audio Settings */}
        <AudioSettingsPanel
          settings={audioSettings}
          onUpdate={handleAudioUpdate}
        />

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
        <SettingsActions
          onReset={handleReset}
          onExport={() => {
            // Future: Export settings functionality
            console.log('Export settings:', settings);
          }}
          onImport={() => {
            // Future: Import settings functionality
            console.log('Import settings functionality coming soon');
          }}
        />
      </Box>
    </Container>
  );
};

export default SettingsPage;
