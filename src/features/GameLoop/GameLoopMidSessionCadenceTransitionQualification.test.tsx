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
import {
  pauseGame,
  resumeGame,
  setTickRate,
} from './state/GameLoopSlice';
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

const TIMED_QUEST_ID = 'cadence_transition_probe';

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
        id: 'cadence_transition_task_probe',
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
    title: 'Cadence transition qualification probe',
    description: 'Hermetic timing probe only.',
    giver: 'npc-cadence-probe',
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

const expectEquivalentProgression = (
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

const runStaticTenHzBaseline = async () => {
  const store = makeStore();
  store.dispatch(setTickRate(10));
  seedProgressionState(store);

  const raf = new RafHarness();
  raf.install();
  let completedTicks = 0;
  const delivered: TickData[] = [];
  const mounted = mountGameLoop(store, async tickData => {
    delivered.push(tickData);
    await runOnlineProgressionTick(store, tickData);
    completedTicks += 1;
  });

  try {
    act(() => {
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
        .forEach(timestamp => raf.frame(timestamp));
    });

    await waitFor(() => expect(completedTicks).toBe(10));
    return {
      snapshot: snapshotProgression(store),
      delivered,
    };
  } finally {
    mounted.unmount();
    raf.restore();
  }
};

describe('GameLoop mid-session cadence transition qualification', () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  test('10 -> 20 -> 10 Hz within one live second preserves elapsed-time progression while changing tick count', async () => {
    const baseline = await runStaticTenHzBaseline();

    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedProgressionState(store);

    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;
    const delivered: TickData[] = [];
    const mounted = mountGameLoop(store, async tickData => {
      delivered.push(tickData);
      await runOnlineProgressionTick(store, tickData);
      completedTicks += 1;
    });

    try {
      act(() => {
        [100, 200, 300, 400].forEach(timestamp => raf.frame(timestamp));
      });
      await waitFor(() => expect(completedTicks).toBe(4));

      act(() => {
        store.dispatch(setTickRate(20));
      });
      act(() => {
        [450, 500, 550, 600, 650, 700, 750, 800]
          .forEach(timestamp => raf.frame(timestamp));
      });
      await waitFor(() => expect(completedTicks).toBe(12));

      act(() => {
        store.dispatch(setTickRate(10));
      });
      act(() => {
        [900, 1000].forEach(timestamp => raf.frame(timestamp));
      });
      await waitFor(() => expect(completedTicks).toBe(14));

      const transitioned = snapshotProgression(store);
      expect(transitioned.currentTick).toBe(14);
      expect(transitioned.totalGameTime).toBeCloseTo(1000, 8);
      expect(delivered.map(tick => tick.currentTick)).toEqual(
        Array.from({ length: 14 }, (_, index) => index + 1)
      );
      expect(delivered.map(tick => tick.deltaTime)).toEqual([
        100, 100, 100, 100,
        50, 50, 50, 50, 50, 50, 50, 50,
        100, 100,
      ]);
      expectEquivalentProgression(transitioned, baseline.snapshot);
      expect(transitioned.questElapsedSeconds).toBeCloseTo(1, 8);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('10 -> 20 Hz re-evaluates an existing 75 ms accumulator remainder against the new 50 ms fixed step', () => {
    const store = makeStore();
    const raf = new RafHarness();
    raf.install();
    const delivered: TickData[] = [];
    const mounted = mountGameLoop(store, tickData => {
      delivered.push(tickData);
    });

    try {
      act(() => {
        raf.frame(75);
      });

      expect(store.getState().gameLoop.currentTick).toBe(0);
      expect(store.getState().gameLoop.totalGameTime).toBe(0);

      act(() => {
        store.dispatch(setTickRate(20));
      });
      act(() => {
        raf.frame(100);
      });

      expect(store.getState().gameLoop.currentTick).toBe(2);
      expect(store.getState().gameLoop.totalGameTime).toBe(100);
      expect(delivered.map(tick => tick.currentTick)).toEqual([1, 2]);
      expect(delivered.map(tick => tick.deltaTime)).toEqual([50, 50]);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('20 -> 10 Hz retains a 25 ms remainder until the new 100 ms fixed-step threshold is reached', () => {
    const store = makeStore();
    store.dispatch(setTickRate(20));
    const raf = new RafHarness();
    raf.install();
    const delivered: TickData[] = [];
    const mounted = mountGameLoop(store, tickData => {
      delivered.push(tickData);
    });

    try {
      act(() => {
        raf.frame(75);
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(50);

      act(() => {
        store.dispatch(setTickRate(10));
      });
      act(() => {
        raf.frame(100);
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(50);

      act(() => {
        raf.frame(150);
      });

      expect(store.getState().gameLoop.currentTick).toBe(2);
      expect(store.getState().gameLoop.totalGameTime).toBe(150);
      expect(delivered.map(tick => tick.currentTick)).toEqual([1, 2]);
      expect(delivered.map(tick => tick.deltaTime)).toEqual([50, 100]);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('cadence changes while paused do not replay paused wall time and apply on the first resumed live step', () => {
    const store = makeStore();
    const raf = new RafHarness();
    raf.install();
    const delivered: TickData[] = [];
    const mounted = mountGameLoop(store, tickData => {
      delivered.push(tickData);
    });

    try {
      act(() => {
        raf.frame(100);
      });
      act(() => {
        store.dispatch(pauseGame());
        store.dispatch(setTickRate(20));
      });
      act(() => {
        raf.frame(5100);
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(100);

      act(() => {
        store.dispatch(resumeGame());
      });
      act(() => {
        raf.frame(5150);
      });

      expect(store.getState().gameLoop.currentTick).toBe(2);
      expect(store.getState().gameLoop.totalGameTime).toBe(150);
      expect(delivered.map(tick => tick.deltaTime)).toEqual([100, 50]);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('finite out-of-range cadence requests remain clamped to the existing 1..60 Hz reducer contract mid-session', () => {
    const store = makeStore();
    const raf = new RafHarness();
    raf.install();
    const delivered: TickData[] = [];
    const mounted = mountGameLoop(store, tickData => {
      delivered.push(tickData);
    });

    try {
      act(() => {
        raf.frame(100);
      });
      act(() => {
        store.dispatch(setTickRate(0));
      });
      expect(store.getState().gameLoop.tickRate).toBe(1);

      act(() => {
        raf.frame(1100);
      });
      act(() => {
        store.dispatch(setTickRate(100));
      });
      expect(store.getState().gameLoop.tickRate).toBe(60);

      act(() => {
        raf.frame(1117);
      });

      expect(store.getState().gameLoop.currentTick).toBe(3);
      expect(store.getState().gameLoop.totalGameTime).toBeCloseTo(1116.6666666667, 8);
      expect(delivered[0].deltaTime).toBe(100);
      expect(delivered[1].deltaTime).toBe(1000);
      expect(delivered[2].deltaTime).toBeCloseTo(1000 / 60, 8);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('blocked async cadence transition keeps one admitted tick while deferred milliseconds adopt the current threshold on settlement', async () => {
    const store = makeStore();
    const raf = new RafHarness();
    raf.install();
    let activeHandlers = 0;
    let peakConcurrentHandlers = 0;
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>(resolve => {
      releaseFirst = resolve;
    });
    const delivered: TickData[] = [];

    const onTick = jest.fn(async (tickData: TickData) => {
      delivered.push(tickData);
      activeHandlers += 1;
      peakConcurrentHandlers = Math.max(peakConcurrentHandlers, activeHandlers);

      if (tickData.currentTick === 1) {
        await firstGate;
      }

      activeHandlers -= 1;
    });

    const mounted = mountGameLoop(store, onTick);

    try {
      act(() => {
        raf.frame(100);
      });
      act(() => {
        store.dispatch(setTickRate(20));
      });
      act(() => {
        raf.frame(200);
      });

      expect(store.getState().gameLoop.currentTick).toBe(1);
      expect(store.getState().gameLoop.totalGameTime).toBe(100);
      expect(onTick).toHaveBeenCalledTimes(1);
      expect(delivered.map(tick => tick.currentTick)).toEqual([1]);
      expect(peakConcurrentHandlers).toBe(1);

      await act(async () => {
        releaseFirst?.();
        await Promise.resolve();
      });

      await waitFor(() => expect(onTick).toHaveBeenCalledTimes(3));

      expect(store.getState().gameLoop.currentTick).toBe(3);
      expect(store.getState().gameLoop.totalGameTime).toBe(200);
      expect(delivered.map(tick => tick.currentTick)).toEqual([1, 2, 3]);
      expect(delivered.map(tick => tick.deltaTime)).toEqual([100, 50, 50]);
      expect(peakConcurrentHandlers).toBe(1);
      expect(activeHandlers).toBe(0);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });
});
