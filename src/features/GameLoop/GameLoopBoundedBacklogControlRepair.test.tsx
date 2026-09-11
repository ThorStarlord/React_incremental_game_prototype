import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer } from '../../app/store';
import { pauseGame, resumeGame, setTickRate } from './state/GameLoopSlice';
import type { TickData } from './state/GameLoopTypes';
import { useGameLoop } from './hooks/useGameLoop';

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

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
  store: TestStore,
  onTick?: (tickData: TickData) => void | Promise<void>
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(() => useGameLoop({ onTick }), { wrapper });
};

describe('GameLoop bounded backlog control repair qualification', () => {
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

  test('a blocked async consumer bounds scheduler lead to one admitted tick across repeated large frames', () => {
    const store = makeStore();
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      return tickData.currentTick === 1 ? firstGate : undefined;
    });

    const mounted = mountGameLoop(store, onTick);

    act(() => {
      raf.frame(5000);
      raf.frame(10000);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);

    mounted.unmount();
    releaseFirst?.();
  });

  test('deferred logical time drains one async admission at a time without overlap, drop, or coalescing', async () => {
    const store = makeStore();
    const releases = new Map<number, () => void>();
    const deliveredTicks: number[] = [];
    let activeConsumers = 0;
    let peakConcurrentConsumers = 0;
    let settledTicks = 0;

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      activeConsumers += 1;
      peakConcurrentConsumers = Math.max(peakConcurrentConsumers, activeConsumers);

      return new Promise<void>(resolve => {
        releases.set(tickData.currentTick, () => {
          activeConsumers -= 1;
          settledTicks += 1;
          resolve();
        });
      });
    });

    const mounted = mountGameLoop(store, onTick);

    act(() => {
      raf.frame(500);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(deliveredTicks).toEqual([1]);
    expect(store.getState().gameLoop.currentTick - settledTicks).toBe(1);

    await act(async () => {
      releases.get(1)?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(2));
    expect(store.getState().gameLoop.currentTick).toBe(2);
    expect(store.getState().gameLoop.totalGameTime).toBe(200);
    expect(deliveredTicks).toEqual([1, 2]);
    expect(store.getState().gameLoop.currentTick - settledTicks).toBe(1);

    await act(async () => {
      releases.get(2)?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(3));
    expect(store.getState().gameLoop.currentTick).toBe(3);
    expect(store.getState().gameLoop.totalGameTime).toBe(300);
    expect(deliveredTicks).toEqual([1, 2, 3]);
    expect(store.getState().gameLoop.currentTick - settledTicks).toBe(1);
    expect(peakConcurrentConsumers).toBe(1);

    mounted.unmount();
    releases.get(3)?.();
  });

  test('consumer rejection releases the admission slot and preserves monotonic deferred progression', async () => {
    const store = makeStore();
    const expectedFailure = new Error('expected bounded-backlog rejection');
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

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(deliveredTicks).toEqual([1]);

    await waitFor(() => expect(store.getState().gameLoop.currentTick).toBe(2));

    expect(store.getState().gameLoop.totalGameTime).toBe(200);
    expect(deliveredTicks).toEqual([1, 2]);
    expect(consoleError).toHaveBeenCalledWith(
      'GameLoop onTick handler rejected',
      expectedFailure
    );
  });

  test('pause blocks deferred admission, excludes paused wall time, and resume drains pre-pause remainder', async () => {
    const store = makeStore();
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      return tickData.currentTick === 1 ? firstGate : undefined;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(250);
      store.dispatch(pauseGame());
    });

    act(() => {
      raf.frame(5250);
    });

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(deliveredTicks).toEqual([1]);

    act(() => {
      store.dispatch(resumeGame());
    });

    await waitFor(() => expect(store.getState().gameLoop.currentTick).toBe(2));

    expect(store.getState().gameLoop.totalGameTime).toBe(200);
    expect(deliveredTicks).toEqual([1, 2]);
  });

  test('unmount prevents an active consumer settlement from admitting stale deferred work', async () => {
    const store = makeStore();
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      return tickData.currentTick === 1 ? firstGate : undefined;
    });

    const mounted = mountGameLoop(store, onTick);

    act(() => {
      raf.frame(500);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(deliveredTicks).toEqual([1]);

    mounted.unmount();

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);
  });

  test('synchronous consumers preserve exact fixed-step catch-up with no drop or coalescing', () => {
    const store = makeStore();
    const deliveredTicks: number[] = [];

    mountGameLoop(store, tickData => {
      deliveredTicks.push(tickData.currentTick);
    });

    act(() => {
      raf.frame(5000);
    });

    expect(store.getState().gameLoop.currentTick).toBe(50);
    expect(store.getState().gameLoop.totalGameTime).toBe(5000);
    expect(deliveredTicks).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
  });

  test('deferred accumulator time follows the existing mid-session tick-rate threshold semantics', async () => {
    const store = makeStore();
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const delivered: TickData[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      delivered.push(tickData);
      return tickData.currentTick === 1 ? firstGate : undefined;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(175);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);

    act(() => {
      store.dispatch(setTickRate(20));
    });

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(store.getState().gameLoop.currentTick).toBe(2));

    expect(store.getState().gameLoop.totalGameTime).toBe(150);
    expect(delivered.map(tickData => tickData.currentTick)).toEqual([1, 2]);
    expect(delivered.map(tickData => tickData.deltaTime)).toEqual([100, 50]);
  });
});
