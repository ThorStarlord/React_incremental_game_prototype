import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { tick, updateAutoSave } from '../state/GameLoopSlice';
import { TickData } from '../state/GameLoopTypes';

interface UseGameLoopOptions {
  onTick?: (tickData: TickData) => void;
  onAutoSave?: () => void;
}

export const useGameLoop = (options: UseGameLoopOptions = {}) => {
  const dispatch = useAppDispatch();
  const gameLoop = useAppSelector((state) => state.gameLoop);
  const { onTick, onAutoSave } = options;
  
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const gameLoopStep = useCallback((timestamp: number) => {
    if (!gameLoop.isRunning || gameLoop.isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoopStep);
      return;
    }

    const deltaTime = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;

    // Apply game speed multiplier
    const adjustedDeltaTime = deltaTime * gameLoop.gameSpeed;
    accumulatorRef.current += adjustedDeltaTime;

    // Fixed timestep for game logic
    const fixedTimeStep = 1000 / gameLoop.tickRate;

    while (accumulatorRef.current >= fixedTimeStep) {
      // Dispatch tick action
      dispatch(tick({ deltaTime: fixedTimeStep, timestamp }));

      // Call custom tick handler
      if (onTick) {
        const tickData: TickData = {
          deltaTime: fixedTimeStep,
          currentTick: gameLoop.currentTick + 1,
          totalGameTime: gameLoop.totalGameTime + fixedTimeStep,
        };
        onTick(tickData);
      }

      // Check for auto-save
      if (gameLoop.totalGameTime - gameLoop.lastAutoSave >= gameLoop.autoSaveInterval) {
        dispatch(updateAutoSave(gameLoop.totalGameTime));
        if (onAutoSave) {
          onAutoSave();
        }
      }

      accumulatorRef.current -= fixedTimeStep;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoopStep);
  }, [dispatch, gameLoop, onTick, onAutoSave]);

  useEffect(() => {
    if (gameLoop.isRunning) {
      lastFrameTimeRef.current = performance.now();
      accumulatorRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(gameLoopStep);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop.isRunning, gameLoopStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    isRunning: gameLoop.isRunning,
    isPaused: gameLoop.isPaused,
    currentTick: gameLoop.currentTick,
    totalGameTime: gameLoop.totalGameTime,
    gameSpeed: gameLoop.gameSpeed,
  };
};

/**
 * Example usage in other components:
 * 
 * function GameComponent() {
 *   const { isRunning, currentTick } = useGameLoop({
 *     onTick: (tickData) => {
 *       // Generate essence every tick
 *       // Update trait cooldowns
 *       // Process time-based events
 *     },
 *     onAutoSave: () => {
 *       // Save game state to localStorage
 *     }
 *   });
 *   
 *   return <div>Game running: {isRunning}</div>;
 * }
 */
