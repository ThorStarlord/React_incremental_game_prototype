import React, { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Slider,
    Switch, // Use MUI Switch instead of custom Toggle
    Select,
    MenuItem, // Needed for MUI Select
    Tabs,
    Tab,
    Paper, // Use Paper or Card instead of custom Panel
    Container, // Use MUI Container for layout
    useTheme // Access theme for spacing/colors if needed
} from '@mui/material';
// Import specific MUI icons
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'; // Graphics icon
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; // Gameplay icon
import WindowIcon from '@mui/icons-material/Window'; // UI icon
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore'; // Reset icon

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    selectAudioSettings,
    selectGraphicsSettings,
    selectGameplaySettings,
    selectUISettings
} from '../features/Settings/state/SettingsSelectors';
import {
    updateSetting,
    resetSettings
} from '../features/Settings/state/SettingsSlice';
import { saveSettingsThunk } from '../features/Settings/state/SettingsThunks';
import { SettingsState } from '../features/Settings/state/SettingsTypes'; // Keep SettingsState type

// SelectOption remains the same
interface SelectOption {
    value: string;
    label: string;
}

// --- Settings Component ---
const Settings: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme(); // Get theme for spacing, etc.

    // Select settings state from Redux
    const audioSettings = useAppSelector(selectAudioSettings);
    const graphicsSettings = useAppSelector(selectGraphicsSettings);
    const gameplaySettings = useAppSelector(selectGameplaySettings);
    const uiSettings = useAppSelector(selectUISettings);

    const [activeTab, setActiveTab] = useState<string>('audio'); // Use string IDs for tabs

    // --- Options remain the same ---
    const qualityOptions: SelectOption[] = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'ultra', label: 'Ultra' }
    ];
    const difficultyOptions: SelectOption[] = [
        { value: 'easy', label: 'Easy' },
        { value: 'normal', label: 'Normal' },
        { value: 'hard', label: 'Hard' },
        { value: 'expert', label: 'Expert' }
    ];
    const fontSizeOptions: SelectOption[] = [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
    ];
    const themeOptions: SelectOption[] = [
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'purple', label: 'Purple' }
    ];


    // --- Handlers remain largely the same ---
    const handleSettingChange = useCallback((
        category: keyof Omit<SettingsState, 'isLoading' | 'lastSaved'>, // Type category correctly
        setting: string,
        value: string | number | boolean
    ): void => {
        dispatch(updateSetting({ category, setting, value }));
    }, [dispatch]);

    const handleSaveSettings = useCallback((): void => {
        dispatch(saveSettingsThunk());
        // Consider adding success feedback (e.g., Snackbar)
    }, [dispatch]);

    const handleResetSettings = useCallback((): void => {
        if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
            dispatch(resetSettings());
            // Dispatch save *after* reset is processed
            setTimeout(() => dispatch(saveSettingsThunk()), 0);
        }
    }, [dispatch]);

    // MUI Tabs onChange handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    // --- Reusable Setting Item Component using MUI ---
    const SettingItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1.5, // Use theme spacing
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': { borderBottom: 'none' },
                flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens
                alignItems: { xs: 'flex-start', sm: 'center' }, // Align start on small screens
                gap: { xs: 1, sm: 2 }
            }}
        >
            <Typography variant="body1" sx={{ flexShrink: 0, minWidth: '200px' }}>{label}</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                {children}
            </Box>
        </Box>
    );

    // --- Render functions using MUI components and sx prop ---
    const renderAudioSettings = (): React.ReactNode => (
        <Box>
            <SettingItem label="Master Volume">
                <Slider
                    aria-label="Master Volume"
                    valueLabelDisplay="auto"
                    value={audioSettings.masterVolume}
                    onChange={(e, value) => handleSettingChange('audio', 'masterVolume', value as number)}
                    min={0} max={100} step={1} sx={{ width: { xs: '100%', sm: 200 } }}
                />
            </SettingItem>
            <SettingItem label="Music Volume">
                <Slider valueLabelDisplay="auto" value={audioSettings.musicVolume} onChange={(e, value) => handleSettingChange('audio', 'musicVolume', value as number)} min={0} max={100} step={1} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
            <SettingItem label="Sound Effects">
                 <Slider valueLabelDisplay="auto" value={audioSettings.effectsVolume} onChange={(e, value) => handleSettingChange('audio', 'effectsVolume', value as number)} min={0} max={100} step={1} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
             <SettingItem label="Ambient Sounds">
                 <Slider valueLabelDisplay="auto" value={audioSettings.ambientVolume} onChange={(e, value) => handleSettingChange('audio', 'ambientVolume', value as number)} min={0} max={100} step={1} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
             <SettingItem label="Dialogue Volume">
                 <Slider valueLabelDisplay="auto" value={audioSettings.dialogueVolume} onChange={(e, value) => handleSettingChange('audio', 'dialogueVolume', value as number)} min={0} max={100} step={1} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
            <SettingItem label="Mute when tab is inactive">
                <Switch
                    checked={audioSettings.muteWhenInactive}
                    onChange={(e, checked) => handleSettingChange('audio', 'muteWhenInactive', checked)}
                />
            </SettingItem>
        </Box>
    );

    const renderGraphicsSettings = (): React.ReactNode => (
        <Box>
            <SettingItem label="Quality Preset">
                <Select
                    size="small"
                    value={graphicsSettings.quality}
                    onChange={(e) => handleSettingChange('graphics', 'quality', e.target.value)}
                    sx={{ minWidth: 120 }}
                >
                    {qualityOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
            </SettingItem>
             <SettingItem label="Particle Effects">
                <Switch checked={graphicsSettings.particleEffects} onChange={(e, checked) => handleSettingChange('graphics', 'particleEffects', checked)} />
            </SettingItem>
            <SettingItem label="Animations">
                <Switch checked={graphicsSettings.animations} onChange={(e, checked) => handleSettingChange('graphics', 'animations', checked)} />
            </SettingItem>
             <SettingItem label="Show FPS Counter">
                <Switch checked={graphicsSettings.showFPS} onChange={(e, checked) => handleSettingChange('graphics', 'showFPS', checked)} />
            </SettingItem>
            <SettingItem label="Dark Mode">
                {/* Note: Dark mode might also be controlled by ThemeContext */}
                <Switch checked={graphicsSettings.darkMode} onChange={(e, checked) => handleSettingChange('graphics', 'darkMode', checked)} />
            </SettingItem>
        </Box>
    );

    const renderGameplaySettings = (): React.ReactNode => (
       <Box>
            <SettingItem label="Game Difficulty">
                <Select size="small" value={gameplaySettings.difficulty} onChange={(e) => handleSettingChange('gameplay', 'difficulty', e.target.value)} sx={{ minWidth: 120 }}>
                    {difficultyOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
            </SettingItem>
            <SettingItem label="Autosave Interval (minutes)">
                 <Slider valueLabelDisplay="auto" value={gameplaySettings.autosaveInterval} onChange={(e, value) => handleSettingChange('gameplay', 'autosaveInterval', value as number)} min={1} max={15} step={1} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
            <SettingItem label="Show Tutorials">
                <Switch checked={gameplaySettings.showTutorials} onChange={(e, checked) => handleSettingChange('gameplay', 'showTutorials', checked)} />
            </SettingItem>
            <SettingItem label="Combat Animation Speed">
                <Slider valueLabelDisplay="auto" value={gameplaySettings.combatSpeed} onChange={(e, value) => handleSettingChange('gameplay', 'combatSpeed', value as number)} min={0.5} max={2} step={0.1} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
            <SettingItem label="Notification Duration (seconds)">
                <Slider valueLabelDisplay="auto" value={gameplaySettings.notificationDuration} onChange={(e, value) => handleSettingChange('gameplay', 'notificationDuration', value as number)} min={1} max={10} step={0.5} sx={{ width: { xs: '100%', sm: 200 } }}/>
            </SettingItem>
       </Box>
    );

    const renderUISettings = (): React.ReactNode => (
        <Box>
             <SettingItem label="Font Size">
                <Select size="small" value={uiSettings.fontSize} onChange={(e) => handleSettingChange('ui', 'fontSize', e.target.value)} sx={{ minWidth: 120 }}>
                    {fontSizeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
            </SettingItem>
            <SettingItem label="Theme">
                <Select size="small" value={uiSettings.theme} onChange={(e) => handleSettingChange('ui', 'theme', e.target.value)} sx={{ minWidth: 120 }}>
                    {themeOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
            </SettingItem>
             <SettingItem label="Show Resource Gain Notifications">
                <Switch checked={uiSettings.showResourceNotifications} onChange={(e, checked) => handleSettingChange('ui', 'showResourceNotifications', checked)} />
            </SettingItem>
            <SettingItem label="Show Level-Up Animations">
                 <Switch checked={uiSettings.showLevelUpAnimations} onChange={(e, checked) => handleSettingChange('ui', 'showLevelUpAnimations', checked)} />
            </SettingItem>
            <SettingItem label="Compact Inventory View">
                 <Switch checked={uiSettings.compactInventory} onChange={(e, checked) => handleSettingChange('ui', 'compactInventory', checked)} />
            </SettingItem>
        </Box>
    );

    return (
        // Use MUI Container for max-width and centering
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Header using Box with sx */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 2, sm: 0 }
                    }}
                >
                    <Typography variant="h4" component="h1">Settings</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button onClick={handleResetSettings} startIcon={<RestoreIcon />} variant="outlined">
                            Reset Defaults
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveSettings}
                            startIcon={<SaveIcon />}
                        >
                            Save Settings
                        </Button>
                    </Box>
                </Box>

                {/* Tabs using MUI Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="Settings categories"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<VolumeUpIcon />} iconPosition="start" label="Audio" value="audio" />
                        <Tab icon={<DisplaySettingsIcon />} iconPosition="start" label="Graphics" value="graphics" />
                        <Tab icon={<SportsEsportsIcon />} iconPosition="start" label="Gameplay" value="gameplay" />
                        <Tab icon={<WindowIcon />} iconPosition="start" label="UI" value="ui" />
                    </Tabs>
                </Box>

                {/* Use Box for content area */}
                <Box>
                    {activeTab === 'audio' && renderAudioSettings()}
                    {activeTab === 'graphics' && renderGraphicsSettings()}
                    {activeTab === 'gameplay' && renderGameplaySettings()}
                    {activeTab === 'ui' && renderUISettings()}
                </Box>
            </Paper>
        </Container>
    );
};

export default Settings;