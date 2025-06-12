import React, { useEffect, useCallback } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchTraitsThunk } from './features/Traits/state/TraitThunks';
// FIXED: Changed fetchNPCsThunk to initializeNPCsThunk
import { initializeNPCsThunk } from './features/NPCs/state/NPCThunks';
import { useGameLoop } from './features/GameLoop/hooks/useGameLoop';
import type { TickData } from './features/GameLoop/state/GameLoopTypes';
// FIXED: Corrected the import name to use the actual exported thunk name
import { processPassiveGenerationThunk, processResonanceLevelThunk } from './features/Essence/state/EssenceThunks';
import { processStatusEffectsThunk, regenerateVitalsThunk, recalculateStatsThunk } from './features/Player/state/PlayerThunks';
import { AppRouter } from './routes/AppRouter';
import { ThemeProviderWrapper as ThemeProvider } from './theme/provider';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // Initialize application data on startup
  useEffect(() => {
    dispatch(fetchTraitsThunk());
    dispatch(initializeNPCsThunk());
  }, [dispatch]);

  // Game loop for passive generation and time-based events
  const handleGameTick = useCallback(async (tickData: TickData) => {
    // FIXED: Use the correct thunk name that actually exists in EssenceThunks
    await dispatch(processPassiveGenerationThunk());
    dispatch(processResonanceLevelThunk());
    await dispatch(processStatusEffectsThunk());
    await dispatch(regenerateVitalsThunk());
    dispatch(recalculateStatsThunk());
  }, [dispatch]);

  // Use the game loop hook
  useGameLoop({
    onTick: handleGameTick,
  });

  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;