export interface SettingsState {
  // Audio settings
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  
  // Visual settings
  showAnimations: boolean;
  showParticleEffects: boolean;
  uiScale: number;
  darkMode: boolean;
  
  // Gameplay settings
  autoSaveInterval: number; // in minutes
  difficultySetting: 'easy' | 'normal' | 'hard';
  autoAttack: boolean;
  
  // Accessibility
  highContrastMode: boolean;
  textSize: 'small' | 'medium' | 'large';
  
  // Performance
  lowPerformanceMode: boolean;
}

export const initialSettingsState: SettingsState = {
  // Audio defaults
  masterVolume: 0.8,
  musicVolume: 0.7,
  sfxVolume: 1.0,
  isMuted: false,
  
  // Visual defaults
  showAnimations: true,
  showParticleEffects: true,
  uiScale: 1.0,
  darkMode: false,
  
  // Gameplay defaults
  autoSaveInterval: 5,
  difficultySetting: 'normal',
  autoAttack: false,
  
  // Accessibility defaults
  highContrastMode: false,
  textSize: 'medium',
  
  // Performance defaults
  lowPerformanceMode: false,
};

export type SettingsAction =
  | { type: 'SET_MASTER_VOLUME'; payload: number }
  | { type: 'SET_MUSIC_VOLUME'; payload: number }
  | { type: 'SET_SFX_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_MUTE'; payload: boolean }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'TOGGLE_PARTICLE_EFFECTS' }
  | { type: 'SET_UI_SCALE'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_AUTO_SAVE_INTERVAL'; payload: number }
  | { type: 'SET_DIFFICULTY'; payload: 'easy' | 'normal' | 'hard' }
  | { type: 'TOGGLE_AUTO_ATTACK' }
  | { type: 'TOGGLE_HIGH_CONTRAST_MODE' }
  | { type: 'SET_TEXT_SIZE'; payload: 'small' | 'medium' | 'large' }
  | { type: 'TOGGLE_LOW_PERFORMANCE_MODE' }
  | { type: 'RESET_SETTINGS' };

export const settingsReducer = (
  state: SettingsState = initialSettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case 'SET_MASTER_VOLUME':
      return {
        ...state,
        masterVolume: Math.max(0, Math.min(1, action.payload)), // Clamp between 0 and 1
      };

    case 'SET_MUSIC_VOLUME':
      return {
        ...state,
        musicVolume: Math.max(0, Math.min(1, action.payload)),
      };

    case 'SET_SFX_VOLUME':
      return {
        ...state,
        sfxVolume: Math.max(0, Math.min(1, action.payload)),
      };

    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted,
      };

    case 'SET_MUTE':
      return {
        ...state,
        isMuted: action.payload,
      };

    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        showAnimations: !state.showAnimations,
      };

    case 'TOGGLE_PARTICLE_EFFECTS':
      return {
        ...state,
        showParticleEffects: !state.showParticleEffects,
      };

    case 'SET_UI_SCALE':
      return {
        ...state,
        uiScale: Math.max(0.5, Math.min(2.0, action.payload)), // Clamp between 0.5 and 2.0
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    case 'SET_AUTO_SAVE_INTERVAL':
      return {
        ...state,
        autoSaveInterval: Math.max(1, action.payload), // Minimum 1 minute
      };

    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficultySetting: action.payload,
      };

    case 'TOGGLE_AUTO_ATTACK':
      return {
        ...state,
        autoAttack: !state.autoAttack,
      };

    case 'TOGGLE_HIGH_CONTRAST_MODE':
      return {
        ...state,
        highContrastMode: !state.highContrastMode,
      };

    case 'SET_TEXT_SIZE':
      return {
        ...state,
        textSize: action.payload,
      };

    case 'TOGGLE_LOW_PERFORMANCE_MODE':
      return {
        ...state,
        lowPerformanceMode: !state.lowPerformanceMode,
      };

    case 'RESET_SETTINGS':
      return initialSettingsState;

    default:
      return state;
  }
};
