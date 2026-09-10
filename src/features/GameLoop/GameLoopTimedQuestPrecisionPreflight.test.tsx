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
import { setTickRate } from './state/GameLoopSlice';

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

const QUEST_ID = 'timed_quest_precision_preflight_probe';
const QUEST_TITLE = 'Timed Quest precision preflight probe';

const seedTimedQuest = (store: TestStore, overrides: Partial<Quest> = {}) => {
  const quest: Quest = {
    id: QUEST_ID,
    title: QUEST_TITLE,
    description: 'Hermetic timeout precision characterization only.',
    giver: 'npc-precision-preflight-probe',
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

const snapshot = (store: TestStore) => {
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

const runScenario = async (
  frameTimestamps: number[],
  tickRate: number,
  expectedTicks: number,
  questOverrides: Partial<Quest>
) => {
  const store = makeStore();
  store.dispatch(setTickRate(tickRate));
  seedTimedQuest(store, questOverrides);

  const raf = new RafHarness();
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
    return snapshot(store);
  } finally {
    unmount();
    raf.restore();
  }
};

const saveAndRestore = async (store: TestStore, savedTimestamp: number) => {
  const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(savedTimestamp);
  const saveId = createSave(store.getState(), 'Timed Quest precision preflight save');
  nowSpy.mockRestore();

  expect(saveId).toBe(`save_${savedTimestamp}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();

  const restoredStore = makeStore();
  restoredStore.dispatch(replaceState(loaded!.state));
  return restoredStore;
};

const expectFailedOnce = (value: ReturnType<typeof snapshot>) => {
  expect(value.status).toBe('FAILED');
  expect(value.active).toBe(false);
  expect(value.failureNotifications).toBe(1);
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('Timed Quest precision contract preflight', () => {
  test('a threshold that lands on the accumulated value fails on the nominal step at both 10 Hz and 20 Hz', async () => {
    const tenHz = await runScenario(
      [100, 200, 300, 400, 500, 600],
      10,
      6,
      { timeLimitSeconds: 0.6 }
    );
    const twentyHz = await runScenario(
      Array.from({ length: 12 }, (_, index) => (index + 1) * 50),
      20,
      12,
      { timeLimitSeconds: 0.6 }
    );

    expect(tenHz.totalGameTime).toBeCloseTo(600, 8);
    expect(twentyHz.totalGameTime).toBeCloseTo(600, 8);
    expect(tenHz.elapsedSeconds).toBeCloseTo(0.6, 12);
    expect(twentyHz.elapsedSeconds).toBeCloseTo(0.6, 12);
    expectFailedOnce(tenHz);
    expectFailedOnce(twentyHz);
  });

  test('the same authored 1.0 second threshold currently diverges across supported 10 Hz and 20 Hz schedules', async () => {
    const tenHzAtOneSecond = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      10,
      10,
      { timeLimitSeconds: 1 }
    );
    const twentyHzAtOneSecond = await runScenario(
      Array.from({ length: 20 }, (_, index) => (index + 1) * 50),
      20,
      20,
      { timeLimitSeconds: 1 }
    );
    const tenHzNextStep = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
      10,
      11,
      { timeLimitSeconds: 1 }
    );

    expect(tenHzAtOneSecond.totalGameTime).toBeCloseTo(1000, 8);
    expect(twentyHzAtOneSecond.totalGameTime).toBeCloseTo(1000, 8);
    expect(tenHzAtOneSecond.elapsedSeconds).toBeLessThan(1);
    expect(tenHzAtOneSecond.elapsedSeconds).toBeCloseTo(1, 12);
    expect(tenHzAtOneSecond.status).toBe('IN_PROGRESS');
    expect(tenHzAtOneSecond.active).toBe(true);
    expect(tenHzAtOneSecond.failureNotifications).toBe(0);

    expect(twentyHzAtOneSecond.elapsedSeconds).toBeGreaterThanOrEqual(1);
    expect(twentyHzAtOneSecond.elapsedSeconds).toBeCloseTo(1, 12);
    expectFailedOnce(twentyHzAtOneSecond);

    expect(tenHzNextStep.totalGameTime).toBeCloseTo(1100, 8);
    expect(tenHzNextStep.elapsedSeconds).toBeGreaterThan(1);
    expect(tenHzNextStep.elapsedSeconds).toBeCloseTo(1.1, 12);
    expectFailedOnce(tenHzNextStep);
  });

  test('regular, irregular, and same-frame catch-up layouts preserve the current first-qualifying-step result at 10 Hz', async () => {
    const regular = await runScenario(
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100],
      10,
      11,
      { timeLimitSeconds: 1 }
    );
    const irregular = await runScenario(
      [37, 94, 151, 263, 410, 487, 666, 731, 889, 1000, 1100],
      10,
      11,
      { timeLimitSeconds: 1 }
    );
    const catchUp = await runScenario(
      [1100],
      10,
      11,
      { timeLimitSeconds: 1 }
    );

    for (const value of [regular, irregular, catchUp]) {
      expect(value.currentTick).toBe(11);
      expect(value.totalGameTime).toBeCloseTo(1100, 8);
      expect(value.elapsedSeconds).toBeCloseTo(1.1, 12);
      expectFailedOnce(value);
    }
  });

  test('save and resume preserves hidden floating history, so numerically similar pre-timeout states can resolve on different steps', async () => {
    const seededStore = makeStore();
    seedTimedQuest(seededStore, { elapsedSeconds: 0.9, timeLimitSeconds: 1 });
    const seededRestored = await saveAndRestore(seededStore, 101_000);

    await seededRestored.dispatch(processQuestTimersThunk(100));
    const seededAfterOneTick = snapshot(seededRestored);
    expect(seededAfterOneTick.elapsedSeconds).toBe(1);
    expectFailedOnce(seededAfterOneTick);

    localStorage.clear();
    const accumulatedStore = makeStore();
    seedTimedQuest(accumulatedStore, { timeLimitSeconds: 1 });
    for (let tick = 0; tick < 9; tick += 1) {
      await accumulatedStore.dispatch(processQuestTimersThunk(100));
    }
    expect(snapshot(accumulatedStore).elapsedSeconds).toBeLessThan(0.9);
    expect(snapshot(accumulatedStore).elapsedSeconds).toBeCloseTo(0.9, 12);

    const accumulatedRestored = await saveAndRestore(accumulatedStore, 102_000);
    await accumulatedRestored.dispatch(processQuestTimersThunk(100));
    const accumulatedAfterOneTick = snapshot(accumulatedRestored);

    expect(accumulatedAfterOneTick.elapsedSeconds).toBeLessThan(1);
    expect(accumulatedAfterOneTick.elapsedSeconds).toBeCloseTo(1, 12);
    expect(accumulatedAfterOneTick.status).toBe('IN_PROGRESS');
    expect(accumulatedAfterOneTick.failureNotifications).toBe(0);

    await accumulatedRestored.dispatch(processQuestTimersThunk(100));
    const accumulatedAfterTwoTicks = snapshot(accumulatedRestored);
    expect(accumulatedAfterTwoTicks.elapsedSeconds).toBeCloseTo(1.1, 12);
    expectFailedOnce(accumulatedAfterTwoTicks);
  });

  test('invalid or non-positive deltas cannot turn a near-threshold floating value into an early failure', async () => {
    const store = makeStore();
    seedTimedQuest(store, {
      elapsedSeconds: 0.9999999999999999,
      timeLimitSeconds: 1,
    });

    for (const delta of [0, -100, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      await store.dispatch(processQuestTimersThunk(delta));
    }

    const value = snapshot(store);
    expect(value.elapsedSeconds).toBe(0.9999999999999999);
    expect(value.status).toBe('IN_PROGRESS');
    expect(value.active).toBe(true);
    expect(value.failureNotifications).toBe(0);
  });
});
