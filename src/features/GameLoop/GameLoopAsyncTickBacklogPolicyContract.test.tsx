import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook } from '@testing-library/react';
import { rootReducer } from '../../app/store';
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

const mountRealGameLoop = (
  store: ReturnType<typeof makeStore>,
  onTick: (tickData: TickData) => void | Promise<void>
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(() => useGameLoop({ onTick }), { wrapper });
};

type Settlement = 'resolved' | 'rejected';

interface PolicySnapshot {
  admittedTick: number;
  settledTick: number;
  producerLead: number;
  queuedTickObjects: number;
  inFlight: boolean;
  accumulatorMs: number;
  deferredWholeSteps: number;
  droppedTicks: number;
  coalescedTicks: number;
  rejectedTicks: number;
  peakProducerLead: number;
  peakConcurrentConsumers: number;
}

/**
 * Executable reference model for SERIAL_BACKPRESSURE_V1.
 *
 * This is deliberately test-only. Package 1 selects and qualifies semantics;
 * Package 2 is responsible for changing production useGameLoop behavior.
 */
class SerialBackpressureReferenceModel {
  private accumulatorMs = 0;
  private admittedTick = 0;
  private settledTick = 0;
  private inFlight: TickData | null = null;
  private isPaused = false;
  private isMounted = true;
  private rejectedTicks = 0;
  private peakProducerLead = 0;
  private activeConsumers = 0;
  private peakConcurrentConsumers = 0;
  readonly admissionHistory: number[] = [];
  readonly droppedTicks = 0;
  readonly coalescedTicks = 0;

  constructor(
    private readonly tickRate: number = 10,
    private readonly gameSpeed: number = 1
  ) {}

  private get fixedTimeStepMs() {
    return 1000 / this.tickRate;
  }

  advanceUnpausedElapsed(deltaMs: number): TickData | null {
    if (!this.isMounted || this.isPaused) {
      return null;
    }

    if (!Number.isFinite(deltaMs) || deltaMs <= 0) {
      return null;
    }

    this.accumulatorMs += deltaMs * this.gameSpeed;
    return this.admitOneIfPossible();
  }

  private admitOneIfPossible(): TickData | null {
    if (
      !this.isMounted ||
      this.isPaused ||
      this.inFlight !== null ||
      this.accumulatorMs < this.fixedTimeStepMs
    ) {
      return null;
    }

    this.accumulatorMs -= this.fixedTimeStepMs;
    if (Math.abs(this.accumulatorMs) < 1e-9) {
      this.accumulatorMs = 0;
    }

    const nextTick = this.admittedTick + 1;
    this.admittedTick = nextTick;
    this.inFlight = {
      deltaTime: this.fixedTimeStepMs,
      currentTick: nextTick,
      gameSpeed: this.gameSpeed,
    };
    this.admissionHistory.push(nextTick);

    this.activeConsumers = 1;
    this.peakConcurrentConsumers = Math.max(
      this.peakConcurrentConsumers,
      this.activeConsumers
    );
    this.peakProducerLead = Math.max(
      this.peakProducerLead,
      this.admittedTick - this.settledTick
    );

    return this.inFlight;
  }

  settleInFlight(outcome: Settlement): TickData | null {
    if (this.inFlight === null) {
      return null;
    }

    if (outcome === 'rejected') {
      this.rejectedTicks += 1;
    }

    this.settledTick = this.inFlight.currentTick;
    this.inFlight = null;
    this.activeConsumers = 0;

    return this.admitOneIfPossible();
  }

  pause() {
    this.isPaused = true;
  }

  resume(): TickData | null {
    this.isPaused = false;
    return this.admitOneIfPossible();
  }

  unmount() {
    this.isMounted = false;
  }

  snapshot(): PolicySnapshot {
    return {
      admittedTick: this.admittedTick,
      settledTick: this.settledTick,
      producerLead: this.admittedTick - this.settledTick,
      queuedTickObjects: 0,
      inFlight: this.inFlight !== null,
      accumulatorMs: this.accumulatorMs,
      deferredWholeSteps: Math.floor(
        (this.accumulatorMs + Number.EPSILON) / this.fixedTimeStepMs
      ),
      droppedTicks: this.droppedTicks,
      coalescedTicks: this.coalescedTicks,
      rejectedTicks: this.rejectedTicks,
      peakProducerLead: this.peakProducerLead,
      peakConcurrentConsumers: this.peakConcurrentConsumers,
    };
  }
}

const drainReferenceModel = (model: SerialBackpressureReferenceModel) => {
  let guard = 0;
  while (model.snapshot().inFlight) {
    model.settleInFlight('resolved');
    guard += 1;
    if (guard > 10000) {
      throw new Error('Reference backlog model failed to drain');
    }
  }
};

const assertSerialBackpressureInvariant = (
  snapshot: Pick<
    PolicySnapshot,
    | 'producerLead'
    | 'queuedTickObjects'
    | 'droppedTicks'
    | 'coalescedTicks'
    | 'peakConcurrentConsumers'
  >
) => {
  if (snapshot.producerLead > 1) {
    throw new Error('producer lead exceeds one admitted tick');
  }
  if (snapshot.queuedTickObjects !== 0) {
    throw new Error('queued TickData backlog is forbidden');
  }
  if (snapshot.droppedTicks !== 0) {
    throw new Error('logical tick dropping is forbidden');
  }
  if (snapshot.coalescedTicks !== 0) {
    throw new Error('logical tick coalescing is forbidden');
  }
  if (snapshot.peakConcurrentConsumers > 1) {
    throw new Error('concurrent async tick consumers are forbidden');
  }
};

describe('GameLoop async tick backlog policy contract', () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test('current production queue exceeds the selected one-tick producer-lead bound while an async consumer is unresolved', () => {
    const raf = new RafHarness();
    raf.install();

    const store = makeStore();
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const onTick = jest.fn((tickData: TickData) =>
      tickData.currentTick === 1 ? firstGate : undefined
    );

    const mounted = mountRealGameLoop(store, onTick);

    try {
      act(() => {
        raf.frame(1000);
      });

      const producerLead =
        store.getState().gameLoop.currentTick - onTick.mock.calls.length;

      expect(store.getState().gameLoop.currentTick).toBe(10);
      expect(onTick).toHaveBeenCalledTimes(1);
      expect(producerLead).toBe(9);
      expect(producerLead).toBeGreaterThan(1);
    } finally {
      mounted.unmount();
      releaseFirst?.();
      raf.restore();
    }
  });

  test('large-frame intake admits one tick and defers the remaining logical time instead of allocating a tick-object backlog', () => {
    const model = new SerialBackpressureReferenceModel(10);

    model.advanceUnpausedElapsed(5000);
    let snapshot = model.snapshot();

    expect(snapshot.admittedTick).toBe(1);
    expect(snapshot.settledTick).toBe(0);
    expect(snapshot.producerLead).toBe(1);
    expect(snapshot.queuedTickObjects).toBe(0);
    expect(snapshot.accumulatorMs).toBe(4900);
    expect(snapshot.deferredWholeSteps).toBe(49);

    model.advanceUnpausedElapsed(5000);
    snapshot = model.snapshot();

    expect(snapshot.admittedTick).toBe(1);
    expect(snapshot.producerLead).toBe(1);
    expect(snapshot.queuedTickObjects).toBe(0);
    expect(snapshot.accumulatorMs).toBe(9900);
    expect(snapshot.deferredWholeSteps).toBe(99);
    assertSerialBackpressureInvariant(snapshot);

    drainReferenceModel(model);
    snapshot = model.snapshot();

    expect(snapshot.admittedTick).toBe(100);
    expect(snapshot.settledTick).toBe(100);
    expect(snapshot.producerLead).toBe(0);
    expect(snapshot.accumulatorMs).toBe(0);
    expect(snapshot.droppedTicks).toBe(0);
    expect(snapshot.coalescedTicks).toBe(0);
    expect(snapshot.peakProducerLead).toBe(1);
    expect(snapshot.peakConcurrentConsumers).toBe(1);
    expect(model.admissionHistory).toEqual(
      Array.from({ length: 100 }, (_, index) => index + 1)
    );
    assertSerialBackpressureInvariant(snapshot);
  });

  test('consumer rejection releases the admission slot without deadlocking, rewinding, dropping, or coalescing later logical ticks', () => {
    const model = new SerialBackpressureReferenceModel(10);

    model.advanceUnpausedElapsed(300);
    expect(model.admissionHistory).toEqual([1]);

    model.settleInFlight('rejected');
    expect(model.admissionHistory).toEqual([1, 2]);

    drainReferenceModel(model);
    const snapshot = model.snapshot();

    expect(model.admissionHistory).toEqual([1, 2, 3]);
    expect(snapshot.rejectedTicks).toBe(1);
    expect(snapshot.admittedTick).toBe(3);
    expect(snapshot.settledTick).toBe(3);
    expect(snapshot.droppedTicks).toBe(0);
    expect(snapshot.coalescedTicks).toBe(0);
    assertSerialBackpressureInvariant(snapshot);
  });

  test('pause rejects paused wall time and prevents deferred admission until resume while preserving pre-pause logical work', () => {
    const model = new SerialBackpressureReferenceModel(10);

    model.advanceUnpausedElapsed(500);
    expect(model.snapshot().accumulatorMs).toBe(400);

    model.pause();
    model.advanceUnpausedElapsed(5000);
    model.settleInFlight('resolved');

    let snapshot = model.snapshot();
    expect(snapshot.admittedTick).toBe(1);
    expect(snapshot.settledTick).toBe(1);
    expect(snapshot.inFlight).toBe(false);
    expect(snapshot.accumulatorMs).toBe(400);

    model.resume();
    snapshot = model.snapshot();
    expect(snapshot.admittedTick).toBe(2);
    expect(snapshot.inFlight).toBe(true);
    expect(snapshot.accumulatorMs).toBe(300);

    drainReferenceModel(model);
    snapshot = model.snapshot();
    expect(snapshot.admittedTick).toBe(5);
    expect(snapshot.settledTick).toBe(5);
    expect(snapshot.accumulatorMs).toBe(0);
    expect(model.admissionHistory).toEqual([1, 2, 3, 4, 5]);
    assertSerialBackpressureInvariant(snapshot);
  });

  test('unmount forbids any new callback admission after the already-active consumer settles', () => {
    const model = new SerialBackpressureReferenceModel(10);

    model.advanceUnpausedElapsed(500);
    expect(model.admissionHistory).toEqual([1]);
    expect(model.snapshot().accumulatorMs).toBe(400);

    model.unmount();
    const nextAdmission = model.settleInFlight('resolved');
    const snapshot = model.snapshot();

    expect(nextAdmission).toBeNull();
    expect(model.admissionHistory).toEqual([1]);
    expect(snapshot.admittedTick).toBe(1);
    expect(snapshot.settledTick).toBe(1);
    expect(snapshot.inFlight).toBe(false);
    expect(snapshot.accumulatorMs).toBe(400);
    assertSerialBackpressureInvariant(snapshot);
  });

  test('non-finite and non-positive elapsed inputs cannot manufacture policy-model backlog', () => {
    const model = new SerialBackpressureReferenceModel(10);

    model.advanceUnpausedElapsed(0);
    model.advanceUnpausedElapsed(-100);
    model.advanceUnpausedElapsed(Number.NaN);
    model.advanceUnpausedElapsed(Number.POSITIVE_INFINITY);

    const snapshot = model.snapshot();
    expect(snapshot.admittedTick).toBe(0);
    expect(snapshot.accumulatorMs).toBe(0);
    expect(snapshot.inFlight).toBe(false);
    assertSerialBackpressureInvariant(snapshot);
  });

  test.each([
    [
      'producer lead',
      {
        producerLead: 2,
        queuedTickObjects: 0,
        droppedTicks: 0,
        coalescedTicks: 0,
        peakConcurrentConsumers: 1,
      },
    ],
    [
      'queued TickData',
      {
        producerLead: 1,
        queuedTickObjects: 1,
        droppedTicks: 0,
        coalescedTicks: 0,
        peakConcurrentConsumers: 1,
      },
    ],
    [
      'dropping',
      {
        producerLead: 1,
        queuedTickObjects: 0,
        droppedTicks: 1,
        coalescedTicks: 0,
        peakConcurrentConsumers: 1,
      },
    ],
    [
      'coalescing',
      {
        producerLead: 1,
        queuedTickObjects: 0,
        droppedTicks: 0,
        coalescedTicks: 1,
        peakConcurrentConsumers: 1,
      },
    ],
    [
      'concurrent consumers',
      {
        producerLead: 1,
        queuedTickObjects: 0,
        droppedTicks: 0,
        coalescedTicks: 0,
        peakConcurrentConsumers: 2,
      },
    ],
  ])('rejects a candidate policy that violates the %s invariant', (_name, snapshot) => {
    expect(() => assertSerialBackpressureInvariant(snapshot)).toThrow();
  });
});
