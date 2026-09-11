import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { addQuest } from '../Quest/state/QuestSlice';
import { processQuestTimersThunk } from '../Quest/state/QuestThunks';
import type { Quest } from '../Quest/state/QuestTypes';
import { useGameLoop } from './hooks/useGameLoop';
import { pauseGame, resumeGame, setTickRate } from './state/GameLoopSlice';
import { settleOfflineProgressThunk } from './state/OfflineProgress';

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

const QUEST_ID = 'package3_quest_timing_integration_probe';
const QUEST_TITLE = 'Package 3 Quest timing integration probe';

const seedTimedQuest = (
  store: TestStore,
  overrides: Partial<Quest> = {}
) => {
  const quest: Quest = {
    id: QUEST_ID,
    title: QUEST_TITLE,
    description: 'Hermetic integrated Quest timing qualification only.',
    giver: 'npc-package3-quest-timing-probe',
    type: 'SIDE',
    objectives: [],
    prerequisites: [],
    rewards: [],
    status: 'IN_PROGRESS',
    isAutoComplete: false,
    timeLimitSeconds: 10,
    elapsedSeconds: 0,
    startedAt: 1,
    ...overrides,
  };

  store.dispatch(addQuest(quest));
};

const failureNotifications = (store: TestStore) =>
  store.getState().notifications.items.filter(
    notification => notification.message === `Quest Failed: ${QUEST_TITLE}`
  );

const snapshotQuestTiming = (store: TestStore) => {
  const state = store.getState();
  const quest = state.quest.quests[QUEST_ID];

  return {
    currentTick: state.gameLoop.currentTick,
    totalGameTime: state.gameLoop.totalGameTime,
    elapsedSeconds: quest.elapsedSeconds ?? 0,
    status: quest.status,
    active: state.quest.activeQuestIds.includes(QUEST_ID),
    failureNotifications: failureNotifications(store).length,
  };
};

const runQuestWindow = async (
  store: TestStore,
  initialNow: number,
  frameTimestamps: number[],
  expectedTicks: number
) => {
  const raf = new RafHarness(initialNow);
  raf.install();
  let completedTicks = 0;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { unmount } = renderHook(
    () => useGameLoop({
      onTick: async tickData => {
        await store.dispatch(processQuestTimersThunk(tickData.deltaTime));
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
  } finally {
    unmount();
    raf.restore();
  }
};

const runScenario = async (
  frameTimestamps: number[],
  tickRate: number,
  expectedTicks: number,
  questOverrides: Partial<Quest> = {}
) => {
  const store = makeStore();
  store.dispatch(setTickRate(tickRate));
  seedTimedQuest(store, questOverrides);

  await runQuestWindow(store, 0, frameTimestamps, expectedTicks);
  return snapshotQuestTiming(store);
};

const saveAndRestore = async (store: TestStore, savedTimestamp: number) => {
  const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(savedTimestamp);
  const saveId = createSave(store.getState(), 'Package 3 Quest timing qualification save');
  nowSpy.mockRestore();

  expect(saveId).toBe(`save_${savedTimestamp}`);

  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();
  expect(loaded!.envelope.timestamp).toBe(savedTimestamp);

  const restoredStore = makeStore();
  restoredStore.dispatch(replaceState(loaded!.state));
  return restoredStore;
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('Package 3 Quest timing integration qualification', () => {
  test('one second of Quest logical time is invariant across supported scheduler layouts and tick rates', async () => {
    const regular10Hz = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      10,
      10
    );
    const irregular10Hz = await runScenario(
      [37, 94, 151, 263, 410, 487, 666, 731, 889, 1000],
      10,
      10
    );
    const catchUp10Hz = await runScenario([1000], 10, 10);
    const regular20Hz = await runScenario(
      Array.from({ length: 20 }, (_, index) => (index + 1) * 50),
      20,
      20
    );

    for (const snapshot of [regular10Hz, irregular10Hz, catchUp10Hz, regular20Hz]) {
      expect(snapshot.totalGameTime).toBeCloseTo(1000, 8);
      expect(snapshot.elapsedSeconds).toBeCloseTo(1, 8);
      expect(snapshot.status).toBe('IN_PROGRESS');
      expect(snapshot.active).toBe(true);
      expect(snapshot.failureNotifications).toBe(0);
    }

    expect(regular10Hz.currentTick).toBe(10);
    expect(irregular10Hz.currentTick).toBe(10);
    expect(catchUp10Hz.currentTick).toBe(10);
    expect(regular20Hz.currentTick).toBe(20);
  });

  test('same-frame catch-up fails on the first qualifying fixed step and later queued ticks do not duplicate failure', async () => {
    const snapshot = await runScenario(
      [1500],
      10,
      15,
      { timeLimitSeconds: 1 }
    );

    expect(snapshot.currentTick).toBe(15);
    expect(snapshot.totalGameTime).toBeCloseTo(1500, 8);
    // The comparison-time precision contract treats machine-noise undershoot
    // as the authored threshold while preserving the raw accumulated timer.
    expect(snapshot.elapsedSeconds).toBeLessThanOrEqual(1);
    expect(1 - snapshot.elapsedSeconds).toBeGreaterThanOrEqual(0);
    expect(1 - snapshot.elapsedSeconds).toBeLessThanOrEqual(Number.EPSILON);
    expect(snapshot.status).toBe('FAILED');
    expect(snapshot.active).toBe(false);
    expect(snapshot.failureNotifications).toBe(1);
  });

  test('pause and resume reject paused wall time and resume with one ordinary Quest tick', async () => {
    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedTimedQuest(store);

    const raf = new RafHarness(0);
    raf.install();
    let completedTicks = 0;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { unmount } = renderHook(
      () => useGameLoop({
        onTick: async tickData => {
          await store.dispatch(processQuestTimersThunk(tickData.deltaTime));
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
      expect(snapshotQuestTiming(store)).toMatchObject({
        currentTick: 0,
        totalGameTime: 0,
        elapsedSeconds: 0,
        status: 'IN_PROGRESS',
        failureNotifications: 0,
      });

      act(() => {
        store.dispatch(resumeGame());
      });
      act(() => {
        raf.frame(5150);
      });

      await waitFor(() => expect(completedTicks).toBe(1));
      expect(snapshotQuestTiming(store)).toMatchObject({
        currentTick: 1,
        totalGameTime: 100,
        status: 'IN_PROGRESS',
        active: true,
        failureNotifications: 0,
      });
      expect(snapshotQuestTiming(store).elapsedSeconds).toBeCloseTo(0.1, 8);
    } finally {
      unmount();
      raf.restore();
    }
  });

  test('canonical save/load plus M21 offline settlement freezes Quest time, then resumed live ticks cross the timeout exactly once', async () => {
    const store = makeStore();
    store.dispatch(setTickRate(10));
    seedTimedQuest(store, {
      timeLimitSeconds: 0.6,
      elapsedSeconds: 0.4,
    });

    const savedTimestamp = 100_000;
    const resumeTimestamp = 120_000;
    const restoredStore = await saveAndRestore(store, savedTimestamp);
    const restored = snapshotQuestTiming(restoredStore);

    expect(restored.elapsedSeconds).toBeCloseTo(0.4, 8);
    expect(restored.status).toBe('IN_PROGRESS');
    expect(restored.failureNotifications).toBe(0);

    const settlement = await restoredStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp, resumeTimestamp })
    ).unwrap();
    const afterOffline = snapshotQuestTiming(restoredStore);

    expect(settlement.skipReason).toBeUndefined();
    expect(settlement.elapsedMs).toBe(20_000);
    expect(afterOffline.currentTick).toBe(restored.currentTick);
    expect(afterOffline.totalGameTime).toBe(restored.totalGameTime);
    expect(afterOffline.elapsedSeconds).toBeCloseTo(0.4, 8);
    expect(afterOffline.status).toBe('IN_PROGRESS');
    expect(afterOffline.active).toBe(true);
    expect(afterOffline.failureNotifications).toBe(0);

    await runQuestWindow(
      restoredStore,
      resumeTimestamp,
      [resumeTimestamp + 100],
      1
    );
    const afterFirstLiveTick = snapshotQuestTiming(restoredStore);

    expect(afterFirstLiveTick.elapsedSeconds).toBeCloseTo(0.5, 8);
    expect(afterFirstLiveTick.status).toBe('IN_PROGRESS');
    expect(afterFirstLiveTick.active).toBe(true);
    expect(afterFirstLiveTick.failureNotifications).toBe(0);

    await runQuestWindow(
      restoredStore,
      resumeTimestamp + 100,
      [resumeTimestamp + 200],
      1
    );
    const afterTimeout = snapshotQuestTiming(restoredStore);

    expect(afterTimeout.elapsedSeconds).toBeCloseTo(0.6, 8);
    expect(afterTimeout.status).toBe('FAILED');
    expect(afterTimeout.active).toBe(false);
    expect(afterTimeout.failureNotifications).toBe(1);

    await runQuestWindow(
      restoredStore,
      resumeTimestamp + 200,
      [resumeTimestamp + 700],
      5
    );
    const afterLaterLiveTicks = snapshotQuestTiming(restoredStore);

    expect(afterLaterLiveTicks.elapsedSeconds).toBeCloseTo(0.6, 8);
    expect(afterLaterLiveTicks.status).toBe('FAILED');
    expect(afterLaterLiveTicks.active).toBe(false);
    expect(afterLaterLiveTicks.failureNotifications).toBe(1);
  });
});
