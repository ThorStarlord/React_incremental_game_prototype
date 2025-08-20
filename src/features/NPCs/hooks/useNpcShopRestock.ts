import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { processNpcShopRestockThunk } from '../state/NPCThunks';

/**
 * Periodically dispatches NPC shop restock processing while the game loop runs.
 * Uses totalGameTime from gameLoop to throttle dispatches roughly once per minute.
 */
export const useNpcShopRestock = () => {
  const dispatch = useAppDispatch();
  const { totalGameTime, isRunning, isPaused } = useAppSelector((s) => s.gameLoop);
  const lastRunRef = useRef(0);

  useEffect(() => {
    if (!isRunning || isPaused) return;
    // Trigger about every 60 seconds of game time to keep costs low; internal logic enforces per-NPC interval
    const now = Math.floor(totalGameTime);
    if (now - lastRunRef.current >= 60 * 1000) {
      lastRunRef.current = now;
      dispatch(processNpcShopRestockThunk());
    }
  }, [dispatch, totalGameTime, isRunning, isPaused]);
};

export default useNpcShopRestock;
