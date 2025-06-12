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

    const adjustedDeltaTime = deltaTime * gameLoop.gameSpeed;
    accumulatorRef.current += adjustedDeltaTime;

    const fixedTimeStep = 1000 / gameLoop.tickRate;

    while (accumulatorRef.current >= fixedTimeStep) {
      dispatch(tick({ deltaTime: fixedTimeStep, timestamp }));

      if (onTick) {
        // FIXED: The object literal now perfectly matches the TickData interface.
        // Removed `totalGameTime` and added the required `gameSpeed`.
        const tickData: TickData = {
          deltaTime: fixedTimeStep,
          currentTick: gameLoop.currentTick + 1,
          gameSpeed: gameLoop.gameSpeed,
        };
        onTick(tickData);
      }

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