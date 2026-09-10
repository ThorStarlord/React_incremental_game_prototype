import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook } from '@testing-library/react';
import { rootReducer } from '../../../app/store';
import {
  pauseGame,
  resumeGame,
  setGameSpeed,
  setTickRate,
} from '../state/GameLoopSlice';
import type { TickData } from '../state/GameLoopTypes';
import { useGameLoop } from './useGameLoop';

const makeStore = () => configureStore({ reducer: rootReducer });

class RafHarness {
  private now = 0;
  private nextId = 1;
  private callbacks = new Map<number, FrameRequestCallback>();
  private originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  private originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  private performanceNowSpy: jest.SpyInstance | null = null;

  install() {
    this.performanceNowSpy = jest
      .spyOn(globalThis.performance, 'now')
      .mockImplementation(() => this.now);

    globalThis.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      const id = this.nextId++;
      this.callbacks.set(id, callback);
      return id;
    });

    globalThis.cancelAnimationFrame = jest.fn((id: number) => {
      this.callbacks.delete(id);
    });
  }

  frame(timestamp: number) {
    this.now = timestamp;
    const next = Array.from(this.callbacks.entries()).sort(([a], [b]) => a - b)[0];
    if (!next) {
      throw new Error(`No requestAnimationFrame callback scheduled at t=${timestamp}`);
    }

    const [id, callback] = next;
    this.callbacks.delete(id);
    callback(timestamp);
  }

  restore() {
    this.performanceNowSpy?.mockRestore();
    globalThis.requestAnimationFrame = this.originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = this.originalCancelAnimationFrame;
    this.callbacks.clear();
  }
}

const mountGameLoop = (
  store: ReturnType<typeof makeStore>,
  onTick?: (tickData: TickData) => void | Promise<void>
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(() => useGameLoop({ onTick }), { wrapper });
};

describe('useGameLoop deterministic timing', () => {
  let raf: RafHarness;

  beforeEach(() => {
    raf = new RafHarness();
    raf.install();
  });

  afterEach(() => {
    cleanup();
    raf.restore();
    jest.restoreAllMocks();
  });

  test('default 10 Hz cadence emits one fixed 100 ms tick for a 100 ms frame', () => {
    const store = makeStore();
    const onTick = jest.fn();
    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(100);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick).toHaveBeenLastCalledWith({
      deltaTime: 100,
      currentTick: 1,
      gameSpeed: 1,
    });
  });

  test('60 Hz-ish frames accumulate until the fixed timestep is reached', () => {
    const store = makeStore();
    const onTick = jest.fn();
    mountGameLoop(store, onTick);

    act(() => {
      [16.7, 33.4, 50.1, 66.8, 83.5, 100.2].forEach(timestamp => raf.frame(timestamp));
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick.mock.calls[0][0].deltaTime).toBeCloseTo(100, 6);
  });

  test('irregular sub-step frames accumulate deterministically before a tick', () => {
    const store = makeStore();
    const onTick = jest.fn();
    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(40);
      raf.frame(100);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(onTick).toHaveBeenCalledTimes(1);
  });

  test('preserves the fractional accumulator remainder across tick-driven rerenders', () => {
    const store = makeStore();
    const deliveredTicks: number[] = [];
    mountGameLoop(store, tickData => deliveredTicks.push(tickData.currentTick));

    act(() => {
      raf.frame(150);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);

    act(() => {
      raf.frame(200);
    });

    expect(store.getState().gameLoop.currentTick).toBe(2);
    expect(store.getState().gameLoop.totalGameTime).toBe(200);
    expect(deliveredTicks).toEqual([1, 2]);
  });

  test('multi-step catch-up delivers monotonic callback tick identities', () => {
    const store = makeStore();
    const deliveredTicks: number[] = [];
    mountGameLoop(store, tickData => deliveredTicks.push(tickData.currentTick));

    act(() => {
      raf.frame(250);
    });

    expect(store.getState().gameLoop.currentTick).toBe(2);
    expect(store.getState().gameLoop.totalGameTime).toBe(200);
    expect(deliveredTicks).toEqual([1, 2]);
  });

  test('serializes async onTick work without overlapping logical ticks', async () => {
    const store = makeStore();
    let active = 0;
    let peakConcurrent = 0;
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn(async (tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      active += 1;
      peakConcurrent = Math.max(peakConcurrent, active);

      if (tickData.currentTick === 1) {
        await firstGate;
      }

      active -= 1;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(250);
    });

    expect(store.getState().gameLoop.currentTick).toBe(2);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);
    expect(peakConcurrent).toBe(1);

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onTick).toHaveBeenCalledTimes(2);
    expect(deliveredTicks).toEqual([1, 2]);
    expect(peakConcurrent).toBe(1);
    expect(active).toBe(0);
  });

  test('rejected async onTick work cannot deadlock the serialized queue', async () => {
    const store = makeStore();
    const expectedFailure = new Error('expected hermetic rejection');
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const deliveredTicks: number[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      if (tickData.currentTick === 1) {
        return Promise.reject(expectedFailure);
      }
      return undefined;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(250);
    });

    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onTick).toHaveBeenCalledTimes(2);
    expect(deliveredTicks).toEqual([1, 2]);
    expect(consoleError).toHaveBeenCalledWith(
      'GameLoop onTick handler rejected',
      expectedFailure
    );
  });

  test('pause rejects live progress and resume does not replay paused wall-clock time', () => {
    const store = makeStore();
    const onTick = jest.fn();
    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(50);
      store.dispatch(pauseGame());
    });

    act(() => {
      raf.frame(500);
    });

    expect(store.getState().gameLoop.currentTick).toBe(0);
    expect(onTick).not.toHaveBeenCalled();

    act(() => {
      store.dispatch(resumeGame());
    });

    act(() => {
      raf.frame(600);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(onTick).toHaveBeenCalledTimes(1);
  });

  test('game-speed changes are reflected in fixed-step accumulation', () => {
    const store = makeStore();
    store.dispatch(setGameSpeed(2));
    const onTick = jest.fn();
    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(50);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick.mock.calls[0][0]).toMatchObject({ deltaTime: 100, gameSpeed: 2 });
  });

  test('tick-rate changes are reflected in the fixed timestep', () => {
    const store = makeStore();
    store.dispatch(setTickRate(20));
    const onTick = jest.fn();
    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(50);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(50);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick.mock.calls[0][0]).toMatchObject({ deltaTime: 50 });
  });
});
