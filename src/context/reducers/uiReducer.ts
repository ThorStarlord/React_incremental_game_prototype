import { UI_ACTION_TYPES } from '../actions/uiActions';

/**
 * UI state management for the game
 */
interface UIState {
  activeMenus: Record<string, boolean>;
  notifications: Notification[];
  modal: ModalState | null;
  theme: string;
  fullscreen: boolean;
  loading: {
    isLoading: boolean;
    message?: string;
  };
  gamePaused: boolean;
  settings: Record<string, any>;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  timestamp: number;
}

interface ModalState {
  type: string;
  title?: string;
  content?: Record<string, any>;
  options?: Record<string, any>;
}

// Initial state with default values
const InitialState: UIState = {
  activeMenus: {
    inventory: false,
    character: false,
    skills: false,
    map: false,
    quests: false,
    settings: false
  },
  notifications: [],
  modal: null,
  theme: 'dark',
  fullscreen: false,
  loading: {
    isLoading: false
  },
  gamePaused: false,
  settings: {
    soundEnabled: true,
    musicVolume: 0.7,
    effectsVolume: 0.8,
    notificationDuration: 3000,
    showTutorials: true
  }
};

// Helper function to update menu visibility
const updateMenu = (
  state: UIState, 
  menuId: string, 
  visibility?: boolean
): UIState => ({
  ...state,
  activeMenus: {
    ...state.activeMenus,
    [menuId]: visibility ?? !state.activeMenus[menuId]
  }
});

export const uiReducer = (
  state: UIState = InitialState,
  action: { type: string; payload: any }
): UIState => {
  switch (action.type) {
    case UI_ACTION_TYPES.TOGGLE_MENU:
      return updateMenu(state, action.payload.menuId);
      
    case UI_ACTION_TYPES.SET_MENU_VISIBILITY:
      return updateMenu(state, action.payload.menuId, action.payload.isVisible);
      
    case UI_ACTION_TYPES.SHOW_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: action.payload.id || `notification_${Date.now()}`,
            message: action.payload.message,
            type: action.payload.type || 'info',
            duration: action.payload.duration || 3000,
            timestamp: action.payload.timestamp || Date.now()
          }
        ]
      };
      
    case UI_ACTION_TYPES.HIDE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.id)
      };
      
    case UI_ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
      
    case UI_ACTION_TYPES.SHOW_MODAL:
      return {
        ...state,
        modal: {
          type: action.payload.type,
          title: action.payload.title,
          content: action.payload.content,
          options: action.payload.options
        }
      };
      
    case UI_ACTION_TYPES.HIDE_MODAL:
      return {
        ...state,
        modal: null
      };
      
    case UI_ACTION_TYPES.SET_UI_THEME:
      return {
        ...state,
        theme: action.payload.theme
      };
      
    case UI_ACTION_TYPES.TOGGLE_FULLSCREEN:
      return {
        ...state,
        fullscreen: !state.fullscreen
      };
      
    case UI_ACTION_TYPES.SET_UI_LOADING:
      return {
        ...state,
        loading: {
          isLoading: action.payload.isLoading,
          message: action.payload.loadingMessage
        }
      };
      
    case UI_ACTION_TYPES.SET_GAME_PAUSED:
      return {
        ...state,
        gamePaused: action.payload.isPaused
      };
      
    default:
      return state;
  }
};

export default uiReducer;
