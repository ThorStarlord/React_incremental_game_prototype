import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetaState } from './MetaTypes';
import { RootState } from '../../../app/store'; // Import RootState for selectors

// Define the initial state for the meta slice
const initialState: MetaState = {
  lastSavedTimestamp: null,
  lastLoadedTimestamp: null,
  currentSaveId: null,
  isImported: false,
  gameVersion: '0.1.0', // Default game version
  sessionStartTime: Date.now(),
};

// Create the meta slice
const metaSlice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    /**
     * Updates the timestamp of the last successful save.
     * @param state - The current meta state.
     * @param action - The action containing the timestamp payload.
     */
    updateLastSaved: (state, action: PayloadAction<number>) => {
      state.lastSavedTimestamp = action.payload;
    },
    /**
     * Updates multiple game metadata properties at once.
     * @param state - The current meta state.
     * @param action - The action containing the metadata update payload.
     */
    updateGameMetadata: (state, action: PayloadAction<Partial<MetaState>>) => {
      return { ...state, ...action.payload };
    },
    /**
     * Sets the game version.
     * @param state - The current meta state.
     * @param action - The action containing the version string payload.
     */
    setGameVersion: (state, action: PayloadAction<string>) => {
        state.gameVersion = action.payload;
    },
    /**
     * Resets the session start time. Typically called on new game or load.
     * @param state - The current meta state.
     */
    resetSessionStartTime: (state) => {
        state.sessionStartTime = Date.now();
    }
  },
});

// Export the actions generated by createSlice
export const { 
  updateLastSaved, 
  updateGameMetadata, 
  setGameVersion, 
  resetSessionStartTime 
} = metaSlice.actions;

// Export selectors
export const selectLastSavedTimestamp = (state: RootState) => state.meta.lastSavedTimestamp;
export const selectLastLoadedTimestamp = (state: RootState) => state.meta.lastLoadedTimestamp;
export const selectCurrentSaveId = (state: RootState) => state.meta.currentSaveId;
export const selectIsImported = (state: RootState) => state.meta.isImported;
export const selectGameVersion = (state: RootState) => state.meta.gameVersion;
export const selectSessionStartTime = (state: RootState) => state.meta.sessionStartTime;

// Export the reducer as the default export
export default metaSlice.reducer;
