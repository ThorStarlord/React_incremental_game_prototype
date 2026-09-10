import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer } from '../../app/store';
import {
  processPassiveGenerationThunk,
  processResonanceLevelThunk,
} from '../Essence/state/EssenceThunks';
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

jest.setTimeout(120_000);

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

class RafHarness {
  private now: number;
  private nextId = 1;
  private callbacks = new Map<number, FrameRequestCallback>();
  private originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  private originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  private performanceNowSpy: jest.SpyInstance | null = null;

  constructor(initialNow = 0) {
    this.now = initialNow;
  }

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

const LONG_HORIZON_MS = 60_000;
const DRIFT_TOLERANCE = 1e-8;
const TIMED_QUEST_ID = 'package3_long_horizon_drift_probe';

const makeRegularFrames = (stepMs: number, totalMs: number) =>
  Array.from({ length: totalMs / stepMs }, (_, index) => (index + 1) * stepMs);

const makeIrregularFrames = (totalMs: number) => {
  const pattern = [37, 211, 89, 463, 128, 572, 301, 199];
  const frames: number[] = [];
  let elapsed = 0;
  let index = 0;

  while (elapsed < totalMs) {
    elapsed = Math.min(totalMs, elapsed + pattern[index % pattern.length]);
    frames.push(elapsed);
    index += 1;
  }

  return frames;
};

const seedProgressionState = (store: TestStore) => {
  store.dispatch(updateGenerationRate(10));
  store.dispatch(updateHealth(10));
  store.dispatch(updateMana(5));
  store.dispatch(updateCopy({
    copyId: 'copy-001',
    updates: {
      growthType: 'normal',
      maturity: 50,
      loyalty: 90,
      activeTask: {
        id: 'package3_long_horizon_task_probe',
        type: 'timed',
        durationSeconds: 600,
        progressSeconds: 0,
        status: 'running',
        startedAt: 1,
      },
    },
  }));

  const timedQuest: Quest = {
    id: TIMED_QUEST_ID,
    title: 'Package 3 long-horizon Quest probe',
    description: 'Hermetic long-horizon drift qualification only.',
    giver: 'npc-package3-long-horizon-probe',
    type: 'SIDE',
    objectives: [],
    prerequisites: [],
    rewards: [],
    status: 'IN_PROGRESS',
    isAutoComplete: false,
    timeLimitSeconds: 600,
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
    essenceResonanceLevel: state.essence.currentResonanceLevel,
    playerResonanceLevel: state.player.resonanceLevel,
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

const expectDriftWithin = (actual: number, expected: number, tolerance = DRIFT_TOLERANCE) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
};

const expectEquivalentProgression = (
  actual: ProgressionSnapshot,
  expected: ProgressionSnapshot
) => {
  expectDriftWithin(actual.totalGameTime, expected.totalGameTime);
  expectDriftWithin(actual.essence, expected.essence);
  expectDriftWithin(actual.totalEssenceCollected, expected.totalEssenceCollected);
  expect(actual.essenceResonanceLevel).toBe(expected.essenceResonanceLevel);
  expect(actual.playerResonanceLevel).toBe(expected.playerResonanceLevel);
  expectDriftWithin(actual.copyMaturity, expected.copyMaturity);
  expectDriftWithin(actual.copyLoyalty, expected.copyLoyalty);
  expect(actual.copyTaskProgressSeconds).not.toBeNull();
  expect(expected.copyTaskProgressSeconds).not.toBeNull();
  expectDriftWithin(
    actual.copyTaskProgressSeconds as number,
    expected.copyTaskProgressSeconds as number
  );
  expectDriftWithin(actual.playerHealth, expected.playerHealth);
  expectDriftWithin(actual.playerMana, expected.playerMana);
  expectDriftWithin(actual.questElapsedSeconds, expected.questElapsedSeconds);
  expect(actual.questStatus).toBe(expected.questStatus);
};

const expectSixtySecondAuthoredRates = (snapshot: ProgressionSnapshot) => {
  expectDriftWithin(snapshot.totalGameTime, LONG_HORIZON_MS);
  expectDriftWithin(snapshot.essence, 600);
  expectDriftWithin(snapshot.totalEssenceCollected, 600);
  expect(snapshot.essenceResonanceLevel).toBe(6);
  expect(snapshot.playerResonanceLevel).toBe(6);
  expectDriftWithin(snapshot.copyMaturity, 56);
  expectDriftWithin(snapshot.copyLoyalty, 87);
  expectDriftWithin(snapshot.copyTaskProgressSeconds as number, 60);
  expectDriftWithin(snapshot.playerHealth, 70);
  expectDriftWithin(snapshot.playerMana, 35);
  expectDriftWithin(snapshot.questElapsedSeconds, 60);
  expect(snapshot.questStatus).toBe('IN_PROGRESS');
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

    await waitFor(() => expect(completedTicks).toBe(expectedTicks), { timeout: 90_000 });
    return snapshotProgression(store);
  } finally {
    unmount();
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

describe('Package 3 long-horizon cross-progression drift qualification', () => {
  test('sixty seconds converges across regular, irregular, catch-up, and supported 10 Hz/20 Hz schedules', async () => {
    const regular10Hz = await runScenario(
      makeRegularFrames(100, LONG_HORIZON_MS),
      10,
      600
    );
    const irregular10Hz = await runScenario(
      makeIrregularFrames(LONG_HORIZON_MS),
      10,
      600
    );
    const catchUp10Hz = await runScenario([LONG_HORIZON_MS], 10, 600);
    const regular20Hz = await runScenario(
      makeRegularFrames(50, LONG_HORIZON_MS),
      20,
      1200
    );

    expect(regular10Hz.currentTick).toBe(600);
    expect(irregular10Hz.currentTick).toBe(600);
    expect(catchUp10Hz.currentTick).toBe(600);
    expect(regular20Hz.currentTick).toBe(1200);

    for (const snapshot of [regular10Hz, irregular10Hz, catchUp10Hz, regular20Hz]) {
      expectSixtySecondAuthoredRates(snapshot);
    }

    expectEquivalentProgression(irregular10Hz, regular10Hz);
    expectEquivalentProgression(catchUp10Hz, regular10Hz);
    expectEquivalentProgression(regular20Hz, regular10Hz);
  });

  test('sub-step-only RAF delivery is rejected from progression until a complete fixed step exists', async () => {
    const snapshot = await runScenario([10, 20, 35, 49], 20, 0);

    expect(snapshot.currentTick).toBe(0);
    expect(snapshot.totalGameTime).toBe(0);
    expect(snapshot.essence).toBe(0);
    expect(snapshot.totalEssenceCollected).toBe(0);
    expect(snapshot.essenceResonanceLevel).toBe(0);
    expect(snapshot.playerResonanceLevel).toBe(0);
    expect(snapshot.copyMaturity).toBe(50);
    expect(snapshot.copyLoyalty).toBe(90);
    expect(snapshot.copyTaskProgressSeconds).toBe(0);
    expect(snapshot.playerHealth).toBe(10);
    expect(snapshot.playerMana).toBe(5);
    expect(snapshot.questElapsedSeconds).toBe(0);
    expect(snapshot.questStatus).toBe('IN_PROGRESS');
  });

  test('sixty seconds of paused wall time cannot leak into resumed cross-progression', async () => {
    const baseline = await runScenario([50], 20, 1);

    const store = makeStore();
    store.dispatch(setTickRate(20));
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
        raf.frame(25);
        store.dispatch(pauseGame());
      });

      act(() => {
        raf.frame(60_025);
      });

      expect(completedTicks).toBe(0);
      expect(snapshotProgression(store)).toMatchObject({
        currentTick: 0,
        totalGameTime: 0,
        essence: 0,
        totalEssenceCollected: 0,
        copyMaturity: 50,
        copyLoyalty: 90,
        copyTaskProgressSeconds: 0,
        playerHealth: 10,
        playerMana: 5,
        questElapsedSeconds: 0,
        questStatus: 'IN_PROGRESS',
      });

      act(() => {
        store.dispatch(resumeGame());
      });
      act(() => {
        raf.frame(60_075);
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
});
