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

const TIMED_QUEST_ID = 'package1_tick_determinism_probe';

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
        id: 'package1_forge_probe',
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
    title: 'Package 1 deterministic timer probe',
    description: 'Hermetic timer probe only.',
    giver: 'npc-package1-probe',
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

const runScenario = async (
  frameTimestamps: number[],
  tickRate: number,
  expectedTicks: number
): Promise<ProgressionSnapshot> => {
  const store = makeStore();
  store.dispatch(setTickRate(tickRate));
  seedProgressionState(store);

  const raf = new RafHarness();
  raf.install();
  let completedTicks = 0;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { unmount } = renderHook(
    () => useGameLoop({
      onTick: async tickData => {
        await runOnlineProgressionTick(store, tickData);
        completedTicks += 1;
      },
    }),
    { wrapper }
  );

  try {
    act(() => {
      frameTimestamps.forEach(timestamp => raf.frame(timestamp));
    });

    await waitFor(() => expect(completedTicks).toBe(expectedTicks));
    return snapshotProgression(store);
  } finally {
    unmount();
    raf.restore();
  }
};

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('Cross-progression tick determinism qualification', () => {
  test('equivalent 1s logical time at 10 Hz is invariant across regular, irregular, and same-frame RAF chunking', async () => {
    const regular = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      10,
      10
    );
    const irregular = await runScenario(
      [37, 94, 151, 263, 410, 487, 666, 731, 889, 1000],
      10,
      10
    );
    const catchUp = await runScenario([1000], 10, 10);

    expect(regular.currentTick).toBe(10);
    expect(irregular.currentTick).toBe(10);
    expect(catchUp.currentTick).toBe(10);
    expectEquivalentProgression(irregular, regular);
    expectEquivalentProgression(catchUp, regular);
  });

  test('supported 10 Hz and 20 Hz schedules preserve equivalent per-second vitality and Quest timing', async () => {
    const tenHz = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      10,
      10
    );
    const twentyHz = await runScenario(
      Array.from({ length: 20 }, (_, index) => (index + 1) * 50),
      20,
      20
    );

    expect(tenHz.currentTick).toBe(10);
    expect(twentyHz.currentTick).toBe(20);
    expectEquivalentProgression(twentyHz, tenHz);
    expect(tenHz.playerHealth).toBeCloseTo(51, 8);
    expect(twentyHz.playerHealth).toBeCloseTo(51, 8);
    expect(tenHz.playerMana).toBeCloseTo(10.5, 8);
    expect(twentyHz.playerMana).toBeCloseTo(10.5, 8);
    expect(tenHz.questElapsedSeconds).toBeCloseTo(1, 8);
    expect(twentyHz.questElapsedSeconds).toBeCloseTo(1, 8);
  });

  test('vital regeneration scales fractional elapsed time, clamps at maxima, and rejects invalid elapsed input as a no-op', async () => {
    const store = makeStore();
    store.dispatch(updateHealth(50));
    store.dispatch(updateMana(10));

    await store.dispatch(regenerateVitalsThunk(250));
    expect(store.getState().player.stats.health).toBeCloseTo(50.25, 8);
    expect(store.getState().player.stats.mana).toBeCloseTo(10.125, 8);

    const beforeInvalid = {
      health: store.getState().player.stats.health,
      mana: store.getState().player.stats.mana,
    };
    await store.dispatch(regenerateVitalsThunk(0));
    await store.dispatch(regenerateVitalsThunk(-100));
    await store.dispatch(regenerateVitalsThunk(Number.NaN));
    expect(store.getState().player.stats.health).toBeCloseTo(beforeInvalid.health, 8);
    expect(store.getState().player.stats.mana).toBeCloseTo(beforeInvalid.mana, 8);

    store.dispatch(updateHealth(99.5));
    store.dispatch(updateMana(49.75));
    await store.dispatch(regenerateVitalsThunk(1000));
    expect(store.getState().player.stats.health).toBe(100);
    expect(store.getState().player.stats.mana).toBe(50);
  });

  test('paused wall time is rejected from cross-progression and resume starts from an ordinary live tick', async () => {
    const baseline = await runScenario([100], 10, 1);

    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedProgressionState(store);

    const raf = new RafHarness();
    raf.install();
    let completedTicks = 0;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { unmount } = renderHook(
      () => useGameLoop({
        onTick: async tickData => {
          await runOnlineProgressionTick(store, tickData);
          completedTicks += 1;
        },
      }),
      { wrapper }
    );

    try {
      act(() => {
        raf.frame(50);
        store.dispatch(pauseGame());
      });

      act(() => {
        raf.frame(5050);
      });

      expect(completedTicks).toBe(0);
      expect(store.getState().gameLoop.currentTick).toBe(0);
      expect(store.getState().essence.currentEssence).toBe(0);
      expect(store.getState().copy.copies['copy-001'].activeTask?.progressSeconds).toBe(0);
      expect(store.getState().quest.quests[TIMED_QUEST_ID].elapsedSeconds).toBe(0);
      expect(store.getState().player.stats.health).toBe(50);
      expect(store.getState().player.stats.mana).toBe(10);

      act(() => {
        store.dispatch(resumeGame());
      });
      act(() => {
        raf.frame(5150);
      });

      await waitFor(() => expect(completedTicks).toBe(1));
      const resumed = snapshotProgression(store);
      expect(resumed.currentTick).toBe(1);
      expectEquivalentProgression(resumed, baseline);
    } finally {
      unmount();
      raf.restore();
    }
  });

  test('timed Quest progression is frame-layout deterministic and advances elapsedSeconds in seconds', async () => {
    const regular = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      10,
      10
    );
    const catchUp = await runScenario([1000], 10, 10);

    expect(regular.questElapsedSeconds).toBeCloseTo(1, 8);
    expect(catchUp.questElapsedSeconds).toBeCloseTo(1, 8);
    expect(regular.questStatus).toBe('IN_PROGRESS');
    expect(catchUp.questStatus).toBe('IN_PROGRESS');
  });
});
