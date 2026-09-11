import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
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
  startGame,
  stopGame,
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

const QUEST_ID = 'sub_step_restart_remainder_probe';

const seedProgressionState = (store: TestStore, tickRate: number) => {
  store.dispatch(setTickRate(tickRate));
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
        id: 'sub_step_restart_copy_probe',
        type: 'timed',
        productionTaskId: 'forge_assistance',
        durationSeconds: 60,
        progressSeconds: 0,
        status: 'running',
        startedAt: 1,
      },
    },
  }));

  const quest: Quest = {
    id: QUEST_ID,
    title: 'Sub-step restart remainder probe',
    description: 'Hermetic lifecycle-boundary timer probe only.',
    giver: 'npc-sub-step-probe',
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
  store.dispatch(addQuest(quest));
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
  const quest = state.quest.quests[QUEST_ID];

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
  expect(actual.currentTick).toBe(expected.currentTick);
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

const mountGameLoop = (
  store: TestStore,
  onTick: (tickData: TickData) => void | Promise<void>
) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return renderHook(() => useGameLoop({ onTick }), { wrapper });
};

const runContinuousScenario = async (
  frameTimestamps: number[],
  tickRate: number,
  expectedTicks: number
): Promise<ProgressionSnapshot> => {
  const store = makeStore();
  seedProgressionState(store, tickRate);
  const raf = new RafHarness();
  raf.install();
  let completedTicks = 0;

  const mounted = mountGameLoop(store, async tickData => {
    await runOnlineProgressionTick(store, tickData);
    completedTicks += 1;
  });

  try {
    act(() => {
      frameTimestamps.forEach(timestamp => raf.frame(timestamp));
    });
    await waitFor(() => expect(completedTicks).toBe(expectedTicks));
    return snapshotProgression(store);
  } finally {
    mounted.unmount();
    raf.restore();
  }
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('GameLoop sub-step restart and save/resume remainder preflight', () => {
  test('uninterrupted 75ms + 25ms at 10 Hz crosses one fixed step and advances all representative consumers once', async () => {
    const snapshot = await runContinuousScenario([75, 100], 10, 1);

    expect(snapshot.currentTick).toBe(1);
    expect(snapshot.totalGameTime).toBeCloseTo(100, 8);
    expect(snapshot.essence).toBeGreaterThan(0);
    expect(snapshot.copyTaskProgressSeconds).toBeCloseTo(0.1, 8);
    expect(snapshot.playerHealth).toBeGreaterThan(50);
    expect(snapshot.playerMana).toBeGreaterThan(10);
    expect(snapshot.questElapsedSeconds).toBeCloseTo(0.1, 8);
  });

  test('unmount/remount discards a 75ms remainder and delays the same 10 Hz progression until 100ms after remount', async () => {
    const baseline = await runContinuousScenario([75, 100], 10, 1);
    const store = makeStore();
    seedProgressionState(store, 10);
    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;

    const onTick = async (tickData: TickData) => {
      await runOnlineProgressionTick(store, tickData);
      completedTicks += 1;
    };

    const firstMount = mountGameLoop(store, onTick);

    try {
      act(() => {
        raf.frame(75);
      });
      expect(store.getState().gameLoop.currentTick).toBe(0);

      const beforeRestart = snapshotProgression(store);
      firstMount.unmount();
      const secondMount = mountGameLoop(store, onTick);

      act(() => {
        raf.frame(100);
      });

      expect(completedTicks).toBe(0);
      expect(snapshotProgression(store)).toEqual(beforeRestart);

      act(() => {
        raf.frame(175);
      });
      await waitFor(() => expect(completedTicks).toBe(1));

      expectEquivalentProgression(snapshotProgression(store), baseline);
      secondMount.unmount();
    } finally {
      raf.restore();
    }
  });

  test('stop/start discards a 25ms remainder at 20 Hz and requires a fresh 50ms after restart', async () => {
    const baseline = await runContinuousScenario([25, 50], 20, 1);
    const store = makeStore();
    seedProgressionState(store, 20);
    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;

    const mounted = mountGameLoop(store, async tickData => {
      await runOnlineProgressionTick(store, tickData);
      completedTicks += 1;
    });

    try {
      act(() => {
        raf.frame(25);
      });
      expect(store.getState().gameLoop.currentTick).toBe(0);

      act(() => {
        store.dispatch(stopGame());
      });
      act(() => {
        store.dispatch(startGame());
      });

      act(() => {
        raf.frame(50);
      });
      expect(completedTicks).toBe(0);
      expect(store.getState().gameLoop.currentTick).toBe(0);

      act(() => {
        raf.frame(75);
      });
      await waitFor(() => expect(completedTicks).toBe(1));

      expectEquivalentProgression(snapshotProgression(store), baseline);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('pause/resume rejects paused wall time but preserves the pre-pause 75ms remainder', async () => {
    const baseline = await runContinuousScenario([75, 100], 10, 1);
    const store = makeStore();
    seedProgressionState(store, 10);
    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;

    const mounted = mountGameLoop(store, async tickData => {
      await runOnlineProgressionTick(store, tickData);
      completedTicks += 1;
    });

    try {
      act(() => {
        raf.frame(75);
        store.dispatch(pauseGame());
      });

      act(() => {
        raf.frame(5075);
      });

      expect(completedTicks).toBe(0);
      expect(store.getState().gameLoop.currentTick).toBe(0);

      act(() => {
        store.dispatch(resumeGame());
      });
      act(() => {
        raf.frame(5100);
      });

      await waitFor(() => expect(completedTicks).toBe(1));
      expectEquivalentProgression(snapshotProgression(store), baseline);
    } finally {
      mounted.unmount();
      raf.restore();
    }
  });

  test('canonical save/load preserves Redux progression state but does not persist a 75ms hook-local accumulator remainder', async () => {
    const baseline = await runContinuousScenario([75, 100], 10, 1);
    const store = makeStore();
    seedProgressionState(store, 10);
    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;

    const firstMount = mountGameLoop(store, async tickData => {
      await runOnlineProgressionTick(store, tickData);
      completedTicks += 1;
    });

    try {
      act(() => {
        raf.frame(75);
      });
      expect(completedTicks).toBe(0);

      const beforeSave = snapshotProgression(store);
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(123456);
      const saveId = createSave(store.getState(), 'Sub-step remainder preflight save');
      nowSpy.mockRestore();

      expect(saveId).toBe('save_123456');
      const rawSave = localStorage.getItem(`game_save_${saveId}`);
      expect(rawSave).not.toBeNull();
      const persisted = JSON.parse(rawSave!) as {
        state: { gameLoop: Record<string, unknown> };
      };
      expect(persisted.state.gameLoop.accumulator).toBeUndefined();
      expect(persisted.state.gameLoop.accumulatorMs).toBeUndefined();

      firstMount.unmount();
      const loaded = await loadSavedGameWithMigration(saveId!);
      expect(loaded).not.toBeNull();

      const restoredStore = makeStore();
      restoredStore.dispatch(replaceState(loaded!.state));
      expect(snapshotProgression(restoredStore)).toEqual(beforeSave);

      raf.setNow(5000);
      let resumedTicks = 0;
      const resumedMount = mountGameLoop(restoredStore, async tickData => {
        await runOnlineProgressionTick(restoredStore, tickData);
        resumedTicks += 1;
      });

      act(() => {
        raf.frame(5025);
      });

      expect(resumedTicks).toBe(0);
      expect(snapshotProgression(restoredStore)).toEqual(beforeSave);

      act(() => {
        raf.frame(5100);
      });
      await waitFor(() => expect(resumedTicks).toBe(1));

      expectEquivalentProgression(snapshotProgression(restoredStore), baseline);
      resumedMount.unmount();
    } finally {
      raf.restore();
    }
  });

  test('repeated 75ms remount boundaries can accumulate discarded remainder beyond one fixed step', async () => {
    const continuous = await runContinuousScenario([75, 150, 225, 300], 10, 3);
    const store = makeStore();
    seedProgressionState(store, 10);
    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;

    const onTick = async (tickData: TickData) => {
      await runOnlineProgressionTick(store, tickData);
      completedTicks += 1;
    };

    try {
      for (const timestamp of [75, 150, 225, 300]) {
        const mounted = mountGameLoop(store, onTick);
        act(() => {
          raf.frame(timestamp);
        });
        mounted.unmount();
      }

      expect(completedTicks).toBe(0);
      const restarted = snapshotProgression(store);
      expect(restarted.currentTick).toBe(0);
      expect(restarted.totalGameTime).toBe(0);

      expect(continuous.currentTick).toBe(3);
      expect(continuous.totalGameTime).toBeCloseTo(300, 8);
      expect(restarted.essence).toBeLessThan(continuous.essence);
      expect(restarted.copyTaskProgressSeconds as number).toBeLessThan(
        continuous.copyTaskProgressSeconds as number
      );
      expect(restarted.playerHealth).toBeLessThan(continuous.playerHealth);
      expect(restarted.playerMana).toBeLessThan(continuous.playerMana);
      expect(restarted.questElapsedSeconds).toBeLessThan(continuous.questElapsedSeconds);
    } finally {
      raf.restore();
    }
  });
});
