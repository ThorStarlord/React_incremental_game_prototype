import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'character',
  modals: {
    inventory: false,
    settings: false,
    skillTree: false,
    shop: false,
    confirmation: {
      isOpen: false,
      message: '',
      onConfirm: null,
      onCancel: null
    }
  },
  notifications: [],
  settings: {
    soundEnabled: true,
    musicVolume: 0.5,
    effectsVolume: 0.7,
    darkMode: false,
    showTutorials: true
  },
  tutorialStep: 0,
  sidebarCollapsed: false,
  tooltipContent: null,
  tooltipPosition: { x: 0, y: 0 },
  isMobile: window.innerWidth < 768
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleModal: (state, action) => {
      const { modal, isOpen } = action.payload;
      state.modals[modal] = isOpen !== undefined ? isOpen : !state.modals[modal];
    },
    showConfirmation: (state, action) => {
      state.modals.confirmation = {
        isOpen: true,
        ...action.payload
      };
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        duration: 3000,
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    updateSetting: (state, action) => {
      const { setting, value } = action.payload;
      state.settings[setting] = value;
    },
    setTutorialStep: (state, action) => {
      state.tutorialStep = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    showTooltip: (state, action) => {
      state.tooltipContent = action.payload.content;
      state.tooltipPosition = action.payload.position;
    },
    hideTooltip: (state) => {
      state.tooltipContent = null;
    },
    setMobileState: (state, action) => {
      state.isMobile = action.payload;
    }
  }
});

export const {
  setActiveTab,
  toggleModal,
  showConfirmation,
  addNotification,
  removeNotification,
  updateSetting,
  setTutorialStep,
  toggleSidebar,
  showTooltip,
  hideTooltip,
  setMobileState
} = uiSlice.actions;

export default uiSlice.reducer;