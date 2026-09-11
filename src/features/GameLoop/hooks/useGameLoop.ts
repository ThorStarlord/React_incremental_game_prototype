import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { tick } from '../state/GameLoopSlice';
import { TickData } from '../state/GameLoopTypes';

type TickHandler = (tickData: TickData) => void | Promise<void>;

interface UseGameLoopOptions {
  onTick?: TickHandler;
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
  const isMountedRef = useRef(true);
  const isTickConsumerActiveRef = useRef(false);
  const drainDeferredTicksRef = useRef<() => void>(() => undefined);

  currentTickRef.current = gameLoop.currentTick;
  schedulingStateRef.current = {
    isRunning: gameLoop.isRunning,
    isPaused: gameLoop.isPaused,
    gameSpeed: gameLoop.gameSpeed,
    tickRate: gameLoop.tickRate,
  };
  onTickRef.current = onTick;

  const drainDeferredTicks = useCallback(() => {
    if (!isMountedRef.current || isTickConsumerActiveRef.current) {
      return;
    }

    while (isMountedRef.current) {
      const schedulingState = schedulingStateRef.current;

      if (
        !schedulingState.isRunning ||
        schedulingState.isPaused ||
        isTickConsumerActiveRef.current
      ) {
        return;
      }

      const fixedTimeStep = 1000 / schedulingState.tickRate;
      if (accumulatorRef.current < fixedTimeStep) {
        return;
      }

      // SERIAL_BACKPRESSURE_V1: logical time stays in the accumulator until a
      // consumer admission slot is available. Only the admitted fixed step is
      // removed; no TickData objects are queued ahead of an async consumer.
      accumulatorRef.current -= fixedTimeStep;

      const nextTick = currentTickRef.current + 1;
      currentTickRef.current = nextTick;

      dispatch(tick({
        deltaTime: fixedTimeStep,
        timestamp: lastFrameTimeRef.current,
      }));

      const handler = onTickRef.current;
      if (!handler) {
        continue;
      }

      const tickData: TickData = {
        deltaTime: fixedTimeStep,
        currentTick: nextTick,
        gameSpeed: schedulingState.gameSpeed,
      };

      // Mark the consumer active before invocation so re-entrant drain attempts
      // cannot admit a second logical tick during the handler call itself.
      isTickConsumerActiveRef.current = true;

      try {
        const result = handler(tickData);
        if (isPromiseLike(result)) {
          void Promise.resolve(result).then(
            () => {
              isTickConsumerActiveRef.current = false;
              drainDeferredTicksRef.current();
            },
            (error) => {
              console.error('GameLoop onTick handler rejected', error);
              isTickConsumerActiveRef.current = false;
              drainDeferredTicksRef.current();
            }
          );
          return;
        }
      } catch (error) {
        console.error('GameLoop onTick handler threw', error);
      }

      // Synchronous fulfillment/throw settles immediately and opens the next
      // admission slot in this same deterministic drain pass.
      isTickConsumerActiveRef.current = false;
    }
  }, [dispatch]);

  drainDeferredTicksRef.current = drainDeferredTicks;

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

    drainDeferredTicks();

    animationFrameRef.current = requestAnimationFrame(gameLoopStep);
  }, [drainDeferredTicks]);

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

      // A consumer that settled while paused deliberately leaves pre-pause
      // logical time deferred. Resume re-opens one admission slot without
      // waiting for another RAF callback.
      if (!gameLoop.isPaused) {
        drainDeferredTicks();
      }
    }
  }, [gameLoop.isPaused, gameLoop.isRunning, drainDeferredTicks]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
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
