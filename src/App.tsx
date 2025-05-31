import React, { useEffect, useCallback } from 'react'; // Added useCallback
import { useAppDispatch } from './app/hooks';
import { fetchTraitsThunk } from './features/Traits/state/TraitThunks';
import { fetchNPCsThunk } from './features/NPCs/state/NPCThunks';
import { useGameLoop } from './features/GameLoop/hooks/useGameLoop';
import { TickData } from './features/GameLoop/state/GameLoopTypes'; // Import TickData
import { passiveGenerateEssenceThunk, checkAndProcessResonanceLevelUpThunk } from './features/Essence/state/EssenceThunks';
import { processStatusEffectsThunk, regenerateVitalsThunk, recalculateStatsThunk } from './features/Player/state/PlayerThunks'; // Import player thunks
import { AppRouter } from './routes/AppRouter'; 
import { ThemeProviderWrapper as ThemeProvider } from './theme/provider'; 

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // Initialize core game data on app start
  useEffect(() => {
    dispatch(fetchTraitsThunk());
    dispatch(fetchNPCsThunk()); // Fetch NPCs on app start
  }, [dispatch]);

  // Game loop for passive generation and time-based events
  const handleGameTick = useCallback(async (tickData: TickData) => { // Accept tickData
    // Dispatch passive essence generation
    await dispatch(passiveGenerateEssenceThunk());
    // After passive essence is generated and state updated, check for resonance level up
    dispatch(checkAndProcessResonanceLevelUpThunk());

    // Process status effects (e.g., expire effects)
    await dispatch(processStatusEffectsThunk());

    // Regenerate health and mana
    await dispatch(regenerateVitalsThunk(tickData.deltaTime)); // Pass deltaTime

    // Recalculate all player stats after all time-based effects
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

  // Use the game loop hook
  useGameLoop({
    onTick: handleGameTick,
    // onAutoSave: () => dispatch(saveGameThunk()), // Example for future auto-save integration
  });

  return (
    <ThemeProvider>
      <AppRouter /> 
    </ThemeProvider>
  );
};

export default App;
