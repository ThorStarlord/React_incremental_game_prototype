import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer } from '../../app/store';
import { processPassiveGenerationThunk, processResonanceLevelThunk } from '../Essence/state/EssenceThunks';
import { updateGenerationRate } from '../Essence/state/EssenceSlice';
import {
  processCopyGrowthThunk,
  processCopyLoyaltyDecayThunk,
  processCopyTasksThunk,
} from '../Copy/state/CopyThunks';
import { updateCopy } from '../Copy/state/CopySlice';
import {
  processStatusEffectsThunk,
  recalculateStatsThunk,
  regenerateVitalsThunk,
} from '../Player/state/PlayerThunks';
import { updateHealth, updateMana } from '../Player/state/PlayerSlice';
import { processQuestTimersThunk } from '../Quest/state/QuestThunks';
import { addQuest } from '../Quest/state/QuestSlice';
import type { Quest } from '../Quest/state/QuestTypes';
import { setTickRate, tick } from './state/GameLoopSlice';
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

const createDeferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>(resolver => {
    resolve = resolver;
  });
  return { promise, resolve };
};

const TIMED_QUEST_ID = 'backpressure_cadence_progression_stress_probe';

const seedProgressionState = (store: TestStore) => {
  store.dispatch(updateGenerationRate(10));
  store.dispatch(updateHealth(50));
  store.dispatch(updateMana(10));
  store.dispatch(updateCopy({
    copyId: 'copy-001',
    updates: {
      growthType: 'normal',
      maturity: 50,
      loyalty: 90,
      activeTask: {
        id: 'backpressure_cadence_stress_task',
        type: 'timed',
        productionTaskId: 'forge_assistance',
        durationSeconds: 60,
        progressSeconds: 0,
        status: 'running',
        startedAt: 1,
      },
    },
  }));

  const timedQuest: Quest = {
    id: TIMED_QUEST_ID,
    title: 'Backpressure cadence progression stress probe',
    description: 'Hermetic stress qualification probe only.',
    giver: 'npc-backpressure-cadence-stress',
    type: 'SIDE',
    objectives: [],
    prerequisites: [],
    rewards: [],
    status: 'IN_PROGRESS',
    isAutoComplete: false,
    timeLimitSeconds: 5000,
    elapsedSeconds: 0,
    startedAt: 1,
  };

  store.dispatch(addQuest(timedQuest));
};

const runOnlineProgressionTick = async (store: TestStore, tickData: TickData) => {
  await store.dispatch(processPassiveGenerationThunk(tickData.deltaTime));
  await store.dispatch(processCopyGrowthThunk(tickData.deltaTime));
  await store.dispatch(processCopyLoyaltyDecayThunk(tickData.deltaTime));
  await store.dispatch(processCopyTasksThunk(tickData.deltaTime));
  store.dispatch(processResonanceLevelThunk());
  await store.dispatch(processStatusEffectsThunk());
  await store.dispatch(regenerateVitalsThunk(tickData.deltaTime));
  store.dispatch(recalculateStatsThunk());
  await store.dispatch(processQuestTimersThunk(tickData.deltaTime));
};

const snapshotProgression = (store: TestStore) => {
  const state = store.getState();
  const copy = state.copy.copies['copy-001'];
  const quest = state.quest.quests[TIMED_QUEST_ID];

  return {
    currentTick: state.gameLoop.currentTick,
    totalGameTime: state.gameLoop.totalGameTime,
    essence: state.essence.currentEssence,
    totalEssenceCollected: state.essence.totalCollected,
    copyMaturity: copy.maturity,
    copyLoyalty: copy.loyalty,
    copyTaskProgressSeconds: copy.activeTask?.progressSeconds ?? null,
    playerHealth: state.player.stats.health,
    playerMana: state.player.stats.mana,
    questElapsedSeconds: quest.elapsedSeconds ?? 0,
    questStatus: quest.status,
  };
};

type ProgressionSnapshot = ReturnType<typeof snapshotProgression>;

const expectEquivalentElapsedProgression = (
  actual: ProgressionSnapshot,
  expected: ProgressionSnapshot
) => {
  expect(actual.totalGameTime).toBeCloseTo(expected.totalGameTime, 8);
  expect(actual.essence).toBeCloseTo(expected.essence, 8);
  expect(actual.totalEssenceCollected).toBeCloseTo(expected.totalEssenceCollected, 8);
  expect(actual.copyMaturity).toBeCloseTo(expected.copyMaturity, 8);
  expect(actual.copyLoyalty).toBeCloseTo(expected.copyLoyalty, 8);
  expect(actual.copyTaskProgressSeconds).toBeCloseTo(expected.copyTaskProgressSeconds as number, 8);
  expect(actual.playerHealth).toBeCloseTo(expected.playerHealth, 8);
  expect(actual.playerMana).toBeCloseTo(expected.playerMana, 8);
  expect(actual.questElapsedSeconds).toBeCloseTo(expected.questElapsedSeconds, 8);
  expect(actual.questStatus).toBe(expected.questStatus);
};

const runReferenceProgression = async (deltas: number[]) => {
  const store = makeStore();
  seedProgressionState(store);
  let timestamp = 0;

  for (let index = 0; index < deltas.length; index += 1) {
    const deltaTime = deltas[index];
    timestamp += deltaTime;
    store.dispatch(tick({ deltaTime, timestamp }));
    await runOnlineProgressionTick(store, {
      deltaTime,
      currentTick: index + 1,
      gameSpeed: 1,
    });
  }

  return snapshotProgression(store);
};

describe('GameLoop backpressure x cadence progression stress qualification', () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test('two-second cadence flapping behind one blocked progression consumer stays one-admission bounded and elapsed-time equivalent', async () => {
    const reference = await runReferenceProgression(Array.from({ length: 20 }, () => 100));

    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedProgressionState(store);

    const raf = new RafHarness();
    raf.install();
    const firstGate = createDeferred();
    const delivered: TickData[] = [];
    let activeHandlers = 0;
    let peakConcurrentHandlers = 0;
    let completedTicks = 0;

    const mounted = mountGameLoop(store, async tickData => {
      delivered.push(tickData);
      activeHandlers += 1;
      peakConcurrentHandlers = Math.max(peakConcurrentHandlers, activeHandlers);

      try {
        if (tickData.currentTick === 1) {
          await firstGate.promise;
        }
        await runOnlineProgressionTick(store, tickData);
        completedTicks += 1;
      } finally {
        activeHandlers -= 1;
      }
    });

    const cadenceFlaps = [20, 5, 25, 10];

    try {
      act(() => {
        raf.frame(100);
      });

      for (let timestamp = 200, index = 0; timestamp <= 2000; timestamp += 100, index += 1) {
        act(() => {
          raf.frame(timestamp);
        });
        act(() => {
          store.dispatch(setTickRate(cadenceFlaps[index % cadenceFlaps.length]));
        });
      }

      act(() => {
        store.dispatch(setTickRate(20));
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(100);
      expect(delivered.map(item => item.currentTick)).toEqual([1]);
      expect(completedTicks).toBe(0);
      expect(activeHandlers).toBe(1);
      expect(peakConcurrentHandlers).toBe(1);

      await act(async () => {
        firstGate.resolve();
        await Promise.resolve();
      });

      await waitFor(() => expect(completedTicks).toBe(39));

      const stressed = snapshotProgression(store);
      expect(stressed.currentTick).toBe(39);
      expect(stressed.totalGameTime).toBeCloseTo(2000, 8);
      expect(delivered).toHaveLength(39);
      expect(delivered.map(item => item.currentTick)).toEqual(
        Array.from({ length: 39 }, (_, index) => index + 1)
      );
      expect(delivered[0].deltaTime).toBe(100);
      delivered.slice(1).forEach(item => {
        expect(item.deltaTime).toBe(50);
      });
      expect(delivered.reduce((sum, item) => sum + item.deltaTime, 0)).toBeCloseTo(2000, 8);
      expect(peakConcurrentHandlers).toBe(1);
      expect(activeHandlers).toBe(0);
      expectEquivalentElapsedProgression(stressed, reference);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('successive backlog windows re-evaluate deferred time at each authoritative cadence without losing cross-progression time', async () => {
    const expectedDeltas = [100, 50, 200, ...Array.from({ length: 13 }, () => 50)];
    const reference = await runReferenceProgression(expectedDeltas);

    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedProgressionState(store);

    const raf = new RafHarness();
    raf.install();
    const gates = new Map([
      [1, createDeferred()],
      [2, createDeferred()],
      [3, createDeferred()],
    ]);
    const delivered: TickData[] = [];
    let activeHandlers = 0;
    let peakConcurrentHandlers = 0;
    let completedTicks = 0;

    const mounted = mountGameLoop(store, async tickData => {
      delivered.push(tickData);
      activeHandlers += 1;
      peakConcurrentHandlers = Math.max(peakConcurrentHandlers, activeHandlers);

      try {
        const gate = gates.get(tickData.currentTick);
        if (gate) {
          await gate.promise;
        }
        await runOnlineProgressionTick(store, tickData);
        completedTicks += 1;
      } finally {
        activeHandlers -= 1;
      }
    });

    try {
      act(() => {
        raf.frame(100);
        raf.frame(200);
        raf.frame(300);
      });
      act(() => {
        store.dispatch(setTickRate(20));
      });
      act(() => {
        raf.frame(400);
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(100);
      expect(delivered.map(item => item.currentTick)).toEqual([1]);

      await act(async () => {
        gates.get(1)?.resolve();
        await Promise.resolve();
      });
      await waitFor(() => expect(delivered).toHaveLength(2));

      expect(store.getState().gameLoop.currentTick).toBe(2);
      expect(store.getState().gameLoop.totalGameTime).toBe(150);
      expect(delivered.map(item => item.deltaTime)).toEqual([100, 50]);

      act(() => {
        store.dispatch(setTickRate(5));
      });
      act(() => {
        raf.frame(600);
        raf.frame(800);
      });

      expect(store.getState().gameLoop.currentTick).toBe(2);

      await act(async () => {
        gates.get(2)?.resolve();
        await Promise.resolve();
      });
      await waitFor(() => expect(delivered).toHaveLength(3));

      expect(store.getState().gameLoop.currentTick).toBe(3);
      expect(store.getState().gameLoop.totalGameTime).toBe(350);
      expect(delivered.map(item => item.deltaTime)).toEqual([100, 50, 200]);

      act(() => {
        store.dispatch(setTickRate(20));
      });
      act(() => {
        raf.frame(900);
        raf.frame(1000);
      });

      expect(store.getState().gameLoop.currentTick).toBe(3);

      await act(async () => {
        gates.get(3)?.resolve();
        await Promise.resolve();
      });
      await waitFor(() => expect(completedTicks).toBe(16));

      const stressed = snapshotProgression(store);
      expect(stressed.currentTick).toBe(16);
      expect(stressed.totalGameTime).toBeCloseTo(1000, 8);
      expect(delivered.map(item => item.deltaTime)).toEqual(expectedDeltas);
      expect(delivered.map(item => item.currentTick)).toEqual(
        Array.from({ length: 16 }, (_, index) => index + 1)
      );
      expect(peakConcurrentHandlers).toBe(1);
      expect(activeHandlers).toBe(0);
      expectEquivalentElapsedProgression(stressed, reference);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('async rejection during a cadence switch releases the admission slot without retry, concurrency, or deadlock', async () => {
    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedProgressionState(store);

    const raf = new RafHarness();
    raf.install();
    const rejectionGate = createDeferred();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const delivered: TickData[] = [];
    const successfulTicks: number[] = [];
    let activeHandlers = 0;
    let peakConcurrentHandlers = 0;

    const mounted = mountGameLoop(store, async tickData => {
      delivered.push(tickData);
      activeHandlers += 1;
      peakConcurrentHandlers = Math.max(peakConcurrentHandlers, activeHandlers);

      try {
        if (tickData.currentTick === 1) {
          await rejectionGate.promise;
          throw new Error('backpressure cadence stress rejection');
        }

        await runOnlineProgressionTick(store, tickData);
        successfulTicks.push(tickData.currentTick);
      } finally {
        activeHandlers -= 1;
      }
    });

    try {
      act(() => {
        raf.frame(100);
      });
      act(() => {
        store.dispatch(setTickRate(20));
      });
      act(() => {
        raf.frame(300);
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(100);
      expect(delivered.map(item => item.currentTick)).toEqual([1]);
      expect(activeHandlers).toBe(1);

      await act(async () => {
        rejectionGate.resolve();
        await Promise.resolve();
      });

      await waitFor(() => expect(delivered).toHaveLength(5));
      await waitFor(() => expect(successfulTicks).toHaveLength(4));

      expect(store.getState().gameLoop.currentTick).toBe(5);
      expect(store.getState().gameLoop.totalGameTime).toBeCloseTo(300, 8);
      expect(delivered.map(item => item.currentTick)).toEqual([1, 2, 3, 4, 5]);
      expect(delivered.map(item => item.deltaTime)).toEqual([100, 50, 50, 50, 50]);
      expect(successfulTicks).toEqual([2, 3, 4, 5]);
      expect(peakConcurrentHandlers).toBe(1);
      expect(activeHandlers).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'GameLoop onTick handler rejected',
        expect.objectContaining({ message: 'backpressure cadence stress rejection' })
      );

      act(() => {
        raf.frame(350);
      });
      await waitFor(() => expect(successfulTicks).toHaveLength(5));

      expect(store.getState().gameLoop.currentTick).toBe(6);
      expect(store.getState().gameLoop.totalGameTime).toBeCloseTo(350, 8);
      expect(delivered.map(item => item.currentTick)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(delivered.map(item => item.deltaTime)).toEqual([100, 50, 50, 50, 50, 50]);
      expect(successfulTicks).toEqual([2, 3, 4, 5, 6]);
      expect(store.getState().quest.quests[TIMED_QUEST_ID].elapsedSeconds).toBeCloseTo(0.25, 8);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });
});
