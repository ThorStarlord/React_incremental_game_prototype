import React, { useEffect, useCallback } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchTraitsThunk } from './features/Traits/state/TraitThunks';
// FIXED: Import from the feature's barrel file, not deep inside.
import { initializeNPCsThunk } from './features/NPCs';
import { useGameLoop } from './features/GameLoop/hooks/useGameLoop';
import type { TickData } from './features/GameLoop/state/GameLoopTypes';
import { processPassiveGenerationThunk, processResonanceLevelThunk } from './features/Essence/state/EssenceThunks';
import { processCopyGrowthThunk, processCopyLoyaltyDecayThunk, processCopyTasksThunk } from './features/Copy/state/CopyThunks';
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
    await dispatch(processPassiveGenerationThunk(tickData.deltaTime));
  await dispatch(processCopyGrowthThunk(tickData.deltaTime));
  await dispatch(processCopyLoyaltyDecayThunk(tickData.deltaTime));
  await dispatch(processCopyTasksThunk(tickData.deltaTime));
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