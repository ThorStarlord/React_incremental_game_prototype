import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer } from '../../app/store';
import { pauseGame, resumeGame } from './state/GameLoopSlice';
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

  setNow(timestamp: number) {
    this.now = timestamp;
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

describe('GameLoop large-frame/background-stall preflight', () => {
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

  test('characterizes an unpaused 5s RAF gap as 50 ordinary live fixed steps at 10 Hz for a synchronous consumer', () => {
    const store = makeStore();
    const deliveredTicks: TickData[] = [];
    mountGameLoop(store, tickData => {
      deliveredTicks.push(tickData);
    });

    act(() => {
      raf.frame(5000);
    });

    expect(store.getState().gameLoop.currentTick).toBe(50);
    expect(store.getState().gameLoop.totalGameTime).toBe(5000);
    expect(deliveredTicks.map(tick => tick.currentTick)).toEqual(expectedTickIds(50));
    expect(deliveredTicks.every(tick => tick.deltaTime === 100)).toBe(true);
    expect(deliveredTicks.every(tick => tick.gameSpeed === 1)).toBe(true);
  });

  test('one 5s synchronous catch-up frame and fifty regular 100ms frames converge to the same scheduler state', () => {
    const stalledStore = makeStore();
    const stalledTicks: TickData[] = [];
    const stalled = mountGameLoop(stalledStore, tickData => {
      stalledTicks.push(tickData);
    });

    act(() => {
      raf.frame(5000);
    });

    const stalledSnapshot = {
      currentTick: stalledStore.getState().gameLoop.currentTick,
      totalGameTime: stalledStore.getState().gameLoop.totalGameTime,
      deliveredTicks: stalledTicks.map(tick => tick.currentTick),
      deltas: stalledTicks.map(tick => tick.deltaTime),
    };

    stalled.unmount();
    raf.setNow(0);

    const regularStore = makeStore();
    const regularTicks: TickData[] = [];
    mountGameLoop(regularStore, tickData => {
      regularTicks.push(tickData);
    });

    act(() => {
      expectedTickIds(50).forEach(index => raf.frame(index * 100));
    });

    expect({
      currentTick: regularStore.getState().gameLoop.currentTick,
      totalGameTime: regularStore.getState().gameLoop.totalGameTime,
      deliveredTicks: regularTicks.map(tick => tick.currentTick),
      deltas: regularTicks.map(tick => tick.deltaTime),
    }).toEqual(stalledSnapshot);
  });

  test('preserves a large-frame fractional remainder instead of dropping it after synchronous catch-up', () => {
    const store = makeStore();
    const deliveredTicks: number[] = [];
    mountGameLoop(store, tickData => {
      deliveredTicks.push(tickData.currentTick);
    });

    act(() => {
      raf.frame(5250);
    });

    expect(store.getState().gameLoop.currentTick).toBe(52);
    expect(store.getState().gameLoop.totalGameTime).toBe(5200);
    expect(deliveredTicks).toEqual(expectedTickIds(52));

    act(() => {
      raf.frame(5300);
    });

    expect(store.getState().gameLoop.currentTick).toBe(53);
    expect(store.getState().gameLoop.totalGameTime).toBe(5300);
    expect(deliveredTicks).toEqual(expectedTickIds(53));
  });

  test('explicit pause rejects a 5s wall-clock gap and resume re-anchors to an ordinary fixed step', () => {
    const store = makeStore();
    const deliveredTicks: number[] = [];
    mountGameLoop(store, tickData => {
      deliveredTicks.push(tickData.currentTick);
    });

    act(() => {
      raf.frame(50);
      store.dispatch(pauseGame());
    });

    act(() => {
      raf.frame(5050);
    });

    expect(store.getState().gameLoop.currentTick).toBe(0);
    expect(store.getState().gameLoop.totalGameTime).toBe(0);
    expect(deliveredTicks).toEqual([]);

    act(() => {
      store.dispatch(resumeGame());
    });

    act(() => {
      raf.frame(5150);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(deliveredTicks).toEqual([1]);
  });

  test('unmount/remount re-anchors the live baseline instead of replaying absence as one giant frame', () => {
    const store = makeStore();
    const deliveredTicks: number[] = [];
    const firstMount = mountGameLoop(store, tickData => {
      deliveredTicks.push(tickData.currentTick);
    });

    act(() => {
      raf.frame(50);
    });

    expect(store.getState().gameLoop.currentTick).toBe(0);
    firstMount.unmount();

    raf.setNow(10050);
    mountGameLoop(store, tickData => {
      deliveredTicks.push(tickData.currentTick);
    });

    act(() => {
      raf.frame(10150);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(deliveredTicks).toEqual([1]);
  });

  test('a 5s async catch-up burst bounds scheduler lead while preserving all 50 eventual fixed steps', async () => {
    const store = makeStore();
    let activeHandlers = 0;
    let peakConcurrentHandlers = 0;
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const deliveredTicks: number[] = [];

    const onTick = jest.fn(async (tickData: TickData) => {
      deliveredTicks.push(tickData.currentTick);
      activeHandlers += 1;
      peakConcurrentHandlers = Math.max(peakConcurrentHandlers, activeHandlers);

      if (tickData.currentTick === 1) {
        await firstGate;
      }

      activeHandlers -= 1;
    });

    mountGameLoop(store, onTick);

    act(() => {
      raf.frame(5000);
    });

    expect(store.getState().gameLoop.currentTick).toBe(1);
    expect(store.getState().gameLoop.totalGameTime).toBe(100);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(deliveredTicks).toEqual([1]);
    expect(peakConcurrentHandlers).toBe(1);

    await act(async () => {
      releaseFirst?.();
      await Promise.resolve();
    });

    await waitFor(() => expect(onTick).toHaveBeenCalledTimes(50));

    expect(store.getState().gameLoop.currentTick).toBe(50);
    expect(store.getState().gameLoop.totalGameTime).toBe(5000);
    expect(deliveredTicks).toEqual(expectedTickIds(50));
    expect(peakConcurrentHandlers).toBe(1);
    expect(activeHandlers).toBe(0);
  });
});
