import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { tick } from '../state/GameLoopSlice';
import { TickData } from '../state/GameLoopTypes';

type TickHandler = (tickData: TickData) => void | Promise<void>;

interface UseGameLoopOptions {
  onTick?: TickHandler;
}

interface QueuedTick {
  tickData: TickData;
  handler: TickHandler;
}

const isPromiseLike = (value: unknown): value is PromiseLike<void> =>
  (typeof value === 'object' || typeof value === 'function') &&
  value !== null &&
  typeof (value as { then?: unknown }).then === 'function';

export const useGameLoop = (options: UseGameLoopOptions = {}) => {
  const dispatch = useAppDispatch();
  const gameLoop = useAppSelector((state) => state.gameLoop);
  const { onTick } = options;

  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const currentTickRef = useRef<number>(gameLoop.currentTick);
  const schedulingStateRef = useRef({
    isRunning: gameLoop.isRunning,
    isPaused: gameLoop.isPaused,
    gameSpeed: gameLoop.gameSpeed,
    tickRate: gameLoop.tickRate,
  });
  const onTickRef = useRef<TickHandler | undefined>(onTick);
  const tickQueueRef = useRef<QueuedTick[]>([]);
  const isProcessingTickQueueRef = useRef(false);

  currentTickRef.current = gameLoop.currentTick;
  schedulingStateRef.current = {
    isRunning: gameLoop.isRunning,
    isPaused: gameLoop.isPaused,
    gameSpeed: gameLoop.gameSpeed,
    tickRate: gameLoop.tickRate,
  };
  onTickRef.current = onTick;

  const drainTickQueue = useCallback(() => {
    if (isProcessingTickQueueRef.current) {
      return;
    }

    isProcessingTickQueueRef.current = true;

    const continueDraining = () => {
      while (tickQueueRef.current.length > 0) {
        const next = tickQueueRef.current.shift();
        if (!next) {
          continue;
        }

        try {
          const result = next.handler(next.tickData);
          if (isPromiseLike(result)) {
            void Promise.resolve(result).then(
              () => continueDraining(),
              (error) => {
                console.error('GameLoop onTick handler rejected', error);
                continueDraining();
              }
            );
            return;
          }
        } catch (error) {
          console.error('GameLoop onTick handler threw', error);
        }
      }

      isProcessingTickQueueRef.current = false;
    };

    continueDraining();
  }, []);

  const enqueueTick = useCallback((tickData: TickData) => {
    const handler = onTickRef.current;
    if (!handler) {
      return;
    }

    tickQueueRef.current.push({ tickData, handler });
    drainTickQueue();
  }, [drainTickQueue]);

  const gameLoopStep = useCallback((timestamp: number) => {
    const schedulingState = schedulingStateRef.current;

    if (!schedulingState.isRunning) {
      return;
    }

    if (schedulingState.isPaused) {
      lastFrameTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(gameLoopStep);
      return;
    }

    const deltaTime = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;

    const adjustedDeltaTime = deltaTime * schedulingState.gameSpeed;
    accumulatorRef.current += adjustedDeltaTime;

    const fixedTimeStep = 1000 / schedulingState.tickRate;

    while (accumulatorRef.current >= fixedTimeStep) {
      const nextTick = currentTickRef.current + 1;
      currentTickRef.current = nextTick;

      dispatch(tick({ deltaTime: fixedTimeStep, timestamp }));

      enqueueTick({
        deltaTime: fixedTimeStep,
        currentTick: nextTick,
        gameSpeed: schedulingState.gameSpeed,
      });

      // Autosave timing is handled by the settings-driven autosave system.
      accumulatorRef.current -= fixedTimeStep;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoopStep);
  }, [dispatch, enqueueTick]);

  useEffect(() => {
    if (!gameLoop.isRunning) {
      return undefined;
    }

    lastFrameTimeRef.current = performance.now();
    accumulatorRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(gameLoopStep);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [gameLoop.isRunning, gameLoopStep]);

  useEffect(() => {
    if (gameLoop.isRunning) {
      // Re-anchor the live wall-clock boundary on both pause and resume so
      // paused wall time is never replayed through the live fixed-step loop.
      lastFrameTimeRef.current = performance.now();
    }
  }, [gameLoop.isPaused, gameLoop.isRunning]);

  useEffect(() => {
    return () => {
      tickQueueRef.current = [];
      onTickRef.current = undefined;

      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
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