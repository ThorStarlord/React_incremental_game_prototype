import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer } from '../../app/store';
import { pauseGame } from './state/GameLoopSlice';
import type { TickData } from './state/GameLoopTypes';
import { useGameLoop } from './hooks/useGameLoop';

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

const expectedTickIds = (count: number) =>
  Array.from({ length: count }, (_, index) => index + 1);

describe('GameLoop async catch-up backlog safety preflight', () => {
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

  test('regular RAF production can outrun one unresolved async onTick and grow a queued-work gap', () => {
    const store = makeStore();
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });

    const onTick = jest.fn((tickData: TickData) =>
      tickData.currentTick === 1 ? firstGate : undefined
    );

    const mounted = mountGameLoop(store, onTick);

    act(() => {
      expectedTickIds(10).forEach(index => raf.frame(index * 100));
    });

    expect(store.getState().gameLoop.currentTick).toBe(10);
    expect(store.getState().gameLoop.totalGameTime).toBe(1000);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(store.getState().gameLoop.currentTick - onTick.mock.calls.length).toBe(9);

    mounted.unmount();
    releaseFirst?.();
  });

  test('same-frame catch-up can amplify the unresolved async backlog without overlapping handler execution', async () => {
    const store = makeStore();
    let activeHandlers = 0;
    let peakConcurrentHandlers = 0;
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      activeHandlers += 1;
      peakConcurrentHandlers = Math.max(peakConcurrentHandlers, activeHandlers);

      if (tickData.currentTick === 1) {
        return firstGate.finally(() => {
          activeHandlers -= 1;
        });
      }

      activeHandlers -= 1;
      return undefined;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(5000);
      raf.frame(10000);
    });

    expect(store.getState().gameLoop.currentTick).toBe(100);
    expect(store.getState().gameLoop.totalGameTime).toBe(10000);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);
    expect(store.getState().gameLoop.currentTick - onTick.mock.calls.length).toBe(99);
    expect(peakConcurrentHandlers).toBe(1);

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(100));

    expect(deliveredTicks).toEqual(expectedTickIds(100));
    expect(peakConcurrentHandlers).toBe(1);
    expect(activeHandlers).toBe(0);
  });

  test('queued ticks drain in FIFO order after the blocking async handler resolves', async () => {
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
      raf.frame(1000);
    });

    expect(store.getState().gameLoop.currentTick).toBe(10);
    expect(deliveredTicks).toEqual([1]);

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(10));
    expect(deliveredTicks).toEqual(expectedTickIds(10));
  });

  test('a rejected queued async handler logs the rejection and does not deadlock later backlog', async () => {
    const store = makeStore();
    const expectedFailure = new Error('expected backlog rejection');
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn((tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      if (tickData.currentTick === 1) {
        return firstGate;
      }
      if (tickData.currentTick === 2) {
        return Promise.reject(expectedFailure);
      }
      return undefined;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(500);
    });

    expect(store.getState().gameLoop.currentTick).toBe(5);
    expect(deliveredTicks).toEqual([1]);

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(5));

    expect(deliveredTicks).toEqual(expectedTickIds(5));
    expect(consoleError).toHaveBeenCalledWith(
      'GameLoop onTick handler rejected',
      expectedFailure
    );
  });

  test('pause rejects new scheduler intake while already-produced queued ticks remain drainable', async () => {
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
      raf.frame(500);
      store.dispatch(pauseGame());
    });

    act(() => {
      raf.frame(5500);
    });

    expect(store.getState().gameLoop.currentTick).toBe(5);
    expect(store.getState().gameLoop.totalGameTime).toBe(500);
    expect(deliveredTicks).toEqual([1]);

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(5));
    expect(deliveredTicks).toEqual(expectedTickIds(5));
  });

  test('unmount discards queued backlog instead of invoking stale handlers after the active promise resolves', async () => {
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

    expect(store.getState().gameLoop.currentTick).toBe(5);
    expect(deliveredTicks).toEqual([1]);

    mounted.unmount();

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);
  });
});
