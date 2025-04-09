import React, { useState, useEffect } from 'react';
import { useGameState } from '../context';
import { UI_ACTION_TYPES } from '../context/actions/uiActions';
import styled from 'styled-components';
import {
  Panel,
  Button,
  Slider,
  Toggle,
  Select,
  Tabs,
  Tab,
  Icon
} from '../components/ui';

// Define interfaces for various settings
interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  ambientVolume: number;
  dialogueVolume: number;
  muteWhenInactive: boolean;
}

interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particleEffects: boolean;
  animations: boolean;
  showFPS: boolean;
  darkMode: boolean;
}

interface GameplaySettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autosaveInterval: number;
  showTutorials: boolean;
  combatSpeed: number;
  notificationDuration: number;
}

interface UISettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: string;
  showResourceNotifications: boolean;
  showLevelUpAnimations: boolean;
  compactInventory: boolean;
}

interface SettingsState {
  audio: AudioSettings;
  graphics: GraphicsSettings;
  gameplay: GameplaySettings;
  ui: UISettings;
  [key: string]: any; // Allow indexing with category string
}

// Define interface for dropdown options
interface SelectOption {
  value: string;
  label: string;
}

const Settings: React.FC = () => {
  const { state, dispatch } = useGameState();
  const [activeTab, setActiveTab] = useState<string>('audio');
  const [settingsState, setSettingsState] = useState<SettingsState>({
    audio: {
      masterVolume: 80,
      musicVolume: 70,
      effectsVolume: 80,
      ambientVolume: 60,
      dialogueVolume: 100,
      muteWhenInactive: true
    },
    graphics: {
      quality: 'high',
      particleEffects: true,
      animations: true,
      showFPS: false,
      darkMode: true
    },
    gameplay: {
      difficulty: 'normal',
      autosaveInterval: 5,
      showTutorials: true,
      combatSpeed: 1,
      notificationDuration: 3
    },
    ui: {
      fontSize: 'medium',
      theme: 'dark',
      showResourceNotifications: true,
      showLevelUpAnimations: true,
      compactInventory: false
    }
  });
  
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  
  // Options for select dropdowns
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
  
  // Load settings from game state on component mount
  useEffect(() => {
    if (state.settings) {
      const newSettings = { ...settingsState };
      
      // Merge saved settings with default settings
      Object.keys(newSettings).forEach(category => {
        if (state.settings[category]) {
          newSettings[category] = {
            ...newSettings[category],
            ...state.settings[category]
          };
        }
      });
      
      setSettingsState(newSettings);
    }
  }, [state.settings]);
  
  // Handle setting changes
  const handleSettingChange = (
    category: string, 
    setting: string, 
    value: string | number | boolean
  ): void => {
    setSettingsState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    
    setHasChanges(true);
    setHasSaved(false);
    
    // Apply theme change immediately if changed
    if (category === 'ui' && setting === 'theme') {
      dispatch({
        type: UI_ACTION_TYPES.SET_UI_THEME,
        payload: { theme: value }
      });
    }
  };
  
  // Save settings
  const handleSaveSettings = (): void => {
    dispatch({
      type: UI_ACTION_TYPES.UPDATE_SETTINGS,
      payload: settingsState
    });
    
    // Update specific settings that need immediate effect
    dispatch({
      type: UI_ACTION_TYPES.SET_UI_THEME,
      payload: { theme: settingsState.ui.theme }
    });
    
    setHasChanges(false);
    setHasSaved(true);
    
    // Reset saved message after a delay
    setTimeout(() => {
      setHasSaved(false);
    }, 3000);
  };
  
  // Reset settings to defaults
  const handleResetSettings = (): void => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaultSettings: SettingsState = {
        audio: {
          masterVolume: 80,
          musicVolume: 70,
          effectsVolume: 80,
          ambientVolume: 60,
          dialogueVolume: 100,
          muteWhenInactive: true
        },
        graphics: {
          quality: 'high',
          particleEffects: true,
          animations: true,
          showFPS: false,
          darkMode: true
        },
        gameplay: {
          difficulty: 'normal',
          autosaveInterval: 5,
          showTutorials: true,
          combatSpeed: 1,
          notificationDuration: 3
        },
        ui: {
          fontSize: 'medium',
          theme: 'dark',
          showResourceNotifications: true,
          showLevelUpAnimations: true,
          compactInventory: false
        }
      };
      
      setSettingsState(defaultSettings);
      setHasChanges(true);
      setHasSaved(false);
    }
  };
  
  // Render audio settings tab
  const renderAudioSettings = (): JSX.Element => (
    <SettingsSection>
      <SettingItem>
        <SettingLabel>Master Volume</SettingLabel>
        <SettingControl>
          <Slider
            min={0}
            max={100}
            value={settingsState.audio.masterVolume}
            onChange={(value) => handleSettingChange('audio', 'masterVolume', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Music Volume</SettingLabel>
        <SettingControl>
          <Slider
            min={0}
            max={100}
            value={settingsState.audio.musicVolume}
            onChange={(value) => handleSettingChange('audio', 'musicVolume', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Sound Effects</SettingLabel>
        <SettingControl>
          <Slider
            min={0}
            max={100}
            value={settingsState.audio.effectsVolume}
            onChange={(value) => handleSettingChange('audio', 'effectsVolume', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Ambient Sounds</SettingLabel>
        <SettingControl>
          <Slider
            min={0}
            max={100}
            value={settingsState.audio.ambientVolume}
            onChange={(value) => handleSettingChange('audio', 'ambientVolume', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Dialogue Volume</SettingLabel>
        <SettingControl>
          <Slider
            min={0}
            max={100}
            value={settingsState.audio.dialogueVolume}
            onChange={(value) => handleSettingChange('audio', 'dialogueVolume', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Mute when tab is inactive</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.audio.muteWhenInactive}
            onChange={(checked) => handleSettingChange('audio', 'muteWhenInactive', checked)}
          />
        </SettingControl>
      </SettingItem>
    </SettingsSection>
  );
  
  // Render graphics settings tab
  const renderGraphicsSettings = (): JSX.Element => (
    <SettingsSection>
      <SettingItem>
        <SettingLabel>Quality Preset</SettingLabel>
        <SettingControl>
          <Select
            options={qualityOptions}
            value={settingsState.graphics.quality}
            onChange={(value) => handleSettingChange('graphics', 'quality', value)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Particle Effects</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.graphics.particleEffects}
            onChange={(checked) => handleSettingChange('graphics', 'particleEffects', checked)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Animations</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.graphics.animations}
            onChange={(checked) => handleSettingChange('graphics', 'animations', checked)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Show FPS Counter</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.graphics.showFPS}
            onChange={(checked) => handleSettingChange('graphics', 'showFPS', checked)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Dark Mode</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.graphics.darkMode}
            onChange={(checked) => handleSettingChange('graphics', 'darkMode', checked)}
          />
        </SettingControl>
      </SettingItem>
    </SettingsSection>
  );
  
  // Render gameplay settings tab
  const renderGameplaySettings = (): JSX.Element => (
    <SettingsSection>
      <SettingItem>
        <SettingLabel>Game Difficulty</SettingLabel>
        <SettingControl>
          <Select
            options={difficultyOptions}
            value={settingsState.gameplay.difficulty}
            onChange={(value) => handleSettingChange('gameplay', 'difficulty', value)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Autosave Interval (minutes)</SettingLabel>
        <SettingControl>
          <Slider
            min={1}
            max={15}
            step={1}
            value={settingsState.gameplay.autosaveInterval}
            onChange={(value) => handleSettingChange('gameplay', 'autosaveInterval', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Show Tutorials</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.gameplay.showTutorials}
            onChange={(checked) => handleSettingChange('gameplay', 'showTutorials', checked)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Combat Animation Speed</SettingLabel>
        <SettingControl>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={settingsState.gameplay.combatSpeed}
            onChange={(value) => handleSettingChange('gameplay', 'combatSpeed', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Notification Duration (seconds)</SettingLabel>
        <SettingControl>
          <Slider
            min={1}
            max={10}
            step={0.5}
            value={settingsState.gameplay.notificationDuration}
            onChange={(value) => handleSettingChange('gameplay', 'notificationDuration', value)}
            showValue
          />
        </SettingControl>
      </SettingItem>
    </SettingsSection>
  );
  
  // Render UI settings tab
  const renderUISettings = (): JSX.Element => (
    <SettingsSection>
      <SettingItem>
        <SettingLabel>Font Size</SettingLabel>
        <SettingControl>
          <Select
            options={fontSizeOptions}
            value={settingsState.ui.fontSize}
            onChange={(value) => handleSettingChange('ui', 'fontSize', value)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Theme</SettingLabel>
        <SettingControl>
          <Select
            options={themeOptions}
            value={settingsState.ui.theme}
            onChange={(value) => handleSettingChange('ui', 'theme', value)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Show Resource Gain Notifications</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.ui.showResourceNotifications}
            onChange={(checked) => handleSettingChange('ui', 'showResourceNotifications', checked)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Show Level-Up Animations</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.ui.showLevelUpAnimations}
            onChange={(checked) => handleSettingChange('ui', 'showLevelUpAnimations', checked)}
          />
        </SettingControl>
      </SettingItem>
      
      <SettingItem>
        <SettingLabel>Compact Inventory View</SettingLabel>
        <SettingControl>
          <Toggle
            checked={settingsState.ui.compactInventory}
            onChange={(checked) => handleSettingChange('ui', 'compactInventory', checked)}
          />
        </SettingControl>
      </SettingItem>
    </SettingsSection>
  );
  
  return (
    <Container>
      <SettingsHeader>
        <h1>Settings</h1>
        <HeaderButtons>
          <Button onClick={handleResetSettings}>
            <Icon name="arrow-counterclockwise" /> Reset to Default
          </Button>
          <Button 
            primary 
            disabled={!hasChanges}
            onClick={handleSaveSettings}
          >
            <Icon name="save" /> Save Settings
          </Button>
        </HeaderButtons>
      </SettingsHeader>
      
      {hasSaved && (
        <SavedMessage>
          <Icon name="check-circle-fill" /> Settings saved successfully!
        </SavedMessage>
      )}
      
      <TabsContainer>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <Tab id="audio">
            <Icon name="volume-up" /> Audio
          </Tab>
          <Tab id="graphics">
            <Icon name="display" /> Graphics
          </Tab>
          <Tab id="gameplay">
            <Icon name="controller" /> Gameplay
          </Tab>
          <Tab id="ui">
            <Icon name="window" /> UI
          </Tab>
        </Tabs>
      </TabsContainer>
      
      <SettingsPanel>
        {activeTab === 'audio' && renderAudioSettings()}
        {activeTab === 'graphics' && renderGraphicsSettings()}
        {activeTab === 'gameplay' && renderGameplaySettings()}
        {activeTab === 'ui' && renderUISettings()}
      </SettingsPanel>
      
      <ButtonBar>
        <Button onClick={() => window.history.back()}>
          <Icon name="arrow-left" /> Back
        </Button>
        <Button 
          primary 
          disabled={!hasChanges}
          onClick={handleSaveSettings}
        >
          <Icon name="save" /> Save Settings
        </Button>
      </ButtonBar>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const TabsContainer = styled.div`
  margin-bottom: 20px;
`;

const SettingsPanel = styled(Panel)`
  margin-bottom: 20px;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
  font-weight: 500;
`;

const SettingControl = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SavedMessage = styled.div`
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default Settings;
