import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CampaignCompletion, MetaState } from './MetaTypes';
import { RootState } from '../../../app/store';

// FIXED: This initialState now correctly implements the full MetaState interface.
const initialState: MetaState = {
  lastSavedTimestamp: null,
  lastLoadedTimestamp: null,
  currentSaveId: null,
  isImported: false,
  gameVersion: '1.0.0',
  sessionStartTime: Date.now(),
  isInProximityToNPC: true,
  // Added missing required properties
  autoSaveEnabled: true,
  saveInProgress: false,
  loadInProgress: false,
  error: null,
  // New intro flag
  hasSeenIntro: false,
  campaignCompletion: null,
};

const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    updateLastSaved: (state, action: PayloadAction<number>) => {
      state.lastSavedTimestamp = action.payload;
    },
    updateGameMetadata: (state, action: PayloadAction<Partial<MetaState>>) => {
      return { ...state, ...action.payload };
    },
    setGameVersion: (state, action: PayloadAction<string>) => {
        state.gameVersion = action.payload;
    },
    resetSessionStartTime: (state) => {
        state.sessionStartTime = Date.now();
    },
    setIsInProximityToNPC: (state, action: PayloadAction<boolean>) => {
      state.isInProximityToNPC = action.payload;
    },
    setHasSeenIntro: (state, action: PayloadAction<boolean>) => {
      state.hasSeenIntro = action.payload;
    },
    markCampaignComplete: (state, action: PayloadAction<CampaignCompletion>) => {
      state.campaignCompletion = action.payload;
    },
  },
});

export const {
  updateLastSaved,
  updateGameMetadata,
  setGameVersion,
  resetSessionStartTime,
  setIsInProximityToNPC,
  setHasSeenIntro,
  markCampaignComplete
} = metaSlice.actions;

// FIXED: Corrected and cleaned up selectors to match the final MetaState interface.
export const selectLastSavedTimestamp = (state: RootState) => state.meta.lastSavedTimestamp;
export const selectLastLoadedTimestamp = (state: RootState) => state.meta.lastLoadedTimestamp;
export const selectCurrentSaveId = (state: RootState) => state.meta.currentSaveId;
export const selectIsImported = (state: RootState) => state.meta.isImported;
export const selectGameVersion = (state: RootState) => state.meta.gameVersion;
export const selectSessionStartTime = (state: RootState) => state.meta.sessionStartTime;
export const selectIsInProximityToNPC = (state: RootState) => state.meta.isInProximityToNPC;
export const selectHasSeenIntro = (state: RootState) => state.meta.hasSeenIntro === true;
export const selectCampaignCompletion = (state: RootState) => state.meta.campaignCompletion;

export default metaSlice.reducer;
