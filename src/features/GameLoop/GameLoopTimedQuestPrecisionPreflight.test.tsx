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
    description: 'Integrated regression of the precision-preflight cases.',
    giver: 'npc-precision-preflight-probe',
    type: 'SIDE',
    objectives: [],
    prerequisites: [],
    rewards: [],
    status: 'IN_PROGRESS',
    isAutoComplete: false,
    timeLimitSeconds: 1,
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

const expectFailedOnce = (value: ReturnType<typeof snapshot>) => {
  expect(value.status).toBe('FAILED');
  expect(value.active).toBe(false);
  expect(value.failureNotifications).toBe(1);
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
  const saveId = createSave(store.getState(), 'Integrated precision-preflight save');
  nowSpy.mockRestore();

  expect(saveId).toBe(`save_${savedTimestamp}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();

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

describe('Timed Quest precision preflight decision regression after resolution', () => {
  test('the preflight 1.0 second divergence is resolved across supported 10 Hz and 20 Hz schedules', async () => {
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

    expect(tenHz.totalGameTime).toBeCloseTo(1000, 8);
    expect(twentyHz.totalGameTime).toBeCloseTo(1000, 8);
    expect(tenHz.elapsedSeconds).toBeLessThan(1);
    expect(1 - tenHz.elapsedSeconds).toBeLessThanOrEqual(Number.EPSILON);
    expect(twentyHz.elapsedSeconds).toBeGreaterThanOrEqual(1);
    expectFailedOnce(tenHz);
    expectFailedOnce(twentyHz);
  });

  test('the preflight RAF-layout cases now resolve on the same nominal 10 Hz boundary', async () => {
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

    for (const value of [regular, irregular, catchUp]) {
      expect(value.currentTick).toBe(10);
      expect(value.totalGameTime).toBeCloseTo(1000, 8);
      expect(value.elapsedSeconds).toBeCloseTo(1, 12);
      expectFailedOnce(value);
    }
  });

  test('exact and accumulated persisted histories retain raw values but resolve on the same next nominal step', async () => {
    const exactStore = makeStore();
    seedTimedQuest(exactStore, { elapsedSeconds: 0.9 });
    const exactRestored = await saveAndRestore(exactStore, 201_000);
    await exactRestored.dispatch(processQuestTimersThunk(100));
    expect(snapshot(exactRestored).elapsedSeconds).toBe(1);
    expectFailedOnce(snapshot(exactRestored));

    localStorage.clear();
    const accumulatedStore = makeStore();
    seedTimedQuest(accumulatedStore);
    for (let tick = 0; tick < 9; tick += 1) {
      await accumulatedStore.dispatch(processQuestTimersThunk(100));
    }
    const accumulatedRaw = snapshot(accumulatedStore).elapsedSeconds;
    expect(accumulatedRaw).toBeLessThan(0.9);
    expect(accumulatedRaw).toBeCloseTo(0.9, 12);

    const accumulatedRestored = await saveAndRestore(accumulatedStore, 202_000);
    expect(snapshot(accumulatedRestored).elapsedSeconds).toBe(accumulatedRaw);
    await accumulatedRestored.dispatch(processQuestTimersThunk(100));

    const resolved = snapshot(accumulatedRestored);
    expect(resolved.elapsedSeconds).toBeLessThan(1);
    expect(1 - resolved.elapsedSeconds).toBeLessThanOrEqual(Number.EPSILON);
    expectFailedOnce(resolved);
  });

  test('invalid and non-positive deltas remain no-ops even for a stored value inside comparison tolerance', async () => {
    const store = makeStore();
    const startingElapsed = 1 - Number.EPSILON;
    seedTimedQuest(store, { elapsedSeconds: startingElapsed });

    for (const delta of [
      0,
      -100,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      await store.dispatch(processQuestTimersThunk(delta));
    }

    const value = snapshot(store);
    expect(value.elapsedSeconds).toBe(startingElapsed);
    expect(value.status).toBe('IN_PROGRESS');
    expect(value.active).toBe(true);
    expect(value.failureNotifications).toBe(0);
  });
});
