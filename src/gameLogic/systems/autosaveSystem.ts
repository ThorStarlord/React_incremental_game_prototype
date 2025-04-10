import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { saveGameThunk } from '../../features/Meta/state/MetaThunks';
// Verify this path points to the newly created/updated SettingsSelectors file
import { selectAutosaveInterval, selectAutosaveEnabled } from '../../features/Settings/state/SettingsSelectors';
import { selectLastSavedTimestamp } from '../../features/Meta/state/MetaSelectors';

/**
 * Custom hook to manage the autosave system.
 * Reads the autosave interval and enabled status from settings and triggers saves periodically.
 */
export const useAutosaveSystem = () => {
  const dispatch = useAppDispatch();
  // Get autosave settings from the Redux store
  // Types should now be inferred correctly (number and boolean)
  const autosaveIntervalMinutes = useAppSelector(selectAutosaveInterval);
  const isAutosaveEnabled = useAppSelector(selectAutosaveEnabled);
  const lastSavedTimestamp = useAppSelector(selectLastSavedTimestamp);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Cleared previous autosave interval.');
    }

    // Check if autosave is enabled and interval is valid
    if (isAutosaveEnabled && autosaveIntervalMinutes > 0) {
      const intervalMilliseconds = autosaveIntervalMinutes * 60 * 1000;

      console.log(`Autosave enabled: Interval set to ${autosaveIntervalMinutes} minutes (${intervalMilliseconds}ms).`);

      intervalRef.current = setInterval(() => {
        // Double-check if still enabled inside the interval callback, in case settings changed
        // (though the effect should re-run if isAutosaveEnabled changes)
        if (!isAutosaveEnabled) {
            console.log('Autosave is currently disabled, skipping save.');
            // Optionally clear interval here too if settings changed without effect re-run
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        console.log('Autosave triggered...');
        // Consider adding checks based on lastSavedTimestamp if needed to prevent rapid saves

        // Dispatch the save thunk with a specific name format
        dispatch(saveGameThunk(`Autosave_${Date.now()}`))
          .unwrap() // Use unwrap to handle the promise result/error directly
          .then((result) => {
            if (result.success) {
              console.log(`Autosave successful. Save ID: ${result.saveId}`);
              // Optionally dispatch a success notification
              // dispatch(addNotification({ message: 'Game autosaved.', type: 'info', duration: 2000 }));
            } else {
              // The thunk's rejectWithValue should handle this, but log just in case
              console.warn('Autosave failed (rejected).');
              // Optionally dispatch a warning/error notification
              // dispatch(addNotification({ message: 'Autosave failed.', type: 'warning' }));
            }
          })
          .catch((error) => {
            console.error('Error during autosave thunk execution:', error);
            // Optionally dispatch an error notification
            // dispatch(addNotification({ message: `Autosave error: ${error}`, type: 'error' }));
          });
      }, intervalMilliseconds);

    } else {
      console.log(`Autosave disabled (Enabled: ${isAutosaveEnabled}, Interval: ${autosaveIntervalMinutes} mins).`);
    }

    // Cleanup function: Clear interval when the hook unmounts or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('Autosave interval cleared on cleanup.');
        intervalRef.current = null;
      }
    };
    // Dependencies: Rerun effect if enabled status, interval, or dispatch function changes
  }, [isAutosaveEnabled, autosaveIntervalMinutes, dispatch, lastSavedTimestamp]);

  // This hook manages the side effect and doesn't need to return anything for UI
};
