import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer } from '../../app/store';
import {
  createCurrentSaveEnvelope,
  migrateSavePayload,
} from '../../shared/utils/saveSchema';
import { addQuest } from '../Quest/state/QuestSlice';
import { processQuestTimersThunk } from '../Quest/state/QuestThunks';
import { hasReachedQuestTimeLimit } from '../Quest/state/QuestTimerPrecision';
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

const QUEST_ID = 'timed_quest_precision_resolution_probe';
const QUEST_TITLE = 'Timed Quest precision resolution probe';

const seedTimedQuest = (store: TestStore, overrides: Partial<Quest> = {}) => {
  const quest: Quest = {
    id: QUEST_ID,
    title: QUEST_TITLE,
    description: 'Hermetic timeout precision resolution probe.',
    giver: 'npc-precision-resolution-probe',
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

const runScenario = async (
  frameTimestamps: number[],
  tickRate: number,
  expectedTicks: number
) => {
  const store = makeStore();
  store.dispatch(setTickRate(tickRate));
  seedTimedQuest(store);

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

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('Package 2 timed Quest precision semantics resolution', () => {
  test('comparison tolerance accepts machine-noise undershoot but rejects materially early time', () => {
    expect(hasReachedQuestTimeLimit(1, 1)).toBe(true);
    expect(hasReachedQuestTimeLimit(1 - Number.EPSILON, 1)).toBe(true);
    expect(hasReachedQuestTimeLimit(1 - 1e-12, 1)).toBe(false);
    expect(hasReachedQuestTimeLimit(0.999, 1)).toBe(false);
  });

  test('equivalent one-second logical time fails consistently at supported 10 Hz and 20 Hz schedules', async () => {
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

    for (const result of [tenHz, twentyHz]) {
      expect(result.totalGameTime).toBeCloseTo(1000, 8);
      expect(result.status).toBe('FAILED');
      expect(result.active).toBe(false);
      expect(result.failureNotifications).toBe(1);
    }

    // The comparison repair must not clamp or rewrite the accumulated timer.
    expect(tenHz.elapsedSeconds).toBeLessThan(1);
    expect(1 - tenHz.elapsedSeconds).toBeLessThanOrEqual(Number.EPSILON);
    expect(twentyHz.elapsedSeconds).toBeGreaterThanOrEqual(1);
  });

  test('regular, irregular, and same-frame catch-up layouts agree on the nominal 1.0 second timeout', async () => {
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

    for (const result of [regular, irregular, catchUp]) {
      expect(result.currentTick).toBe(10);
      expect(result.totalGameTime).toBeCloseTo(1000, 8);
      expect(result.status).toBe('FAILED');
      expect(result.active).toBe(false);
      expect(result.failureNotifications).toBe(1);
      expect(1 - result.elapsedSeconds).toBeLessThanOrEqual(Number.EPSILON);
    }
  });

  test('exact and accumulated schema-v1 timer histories preserve raw values and resolve on the same next nominal step', async () => {
    const exactStore = makeStore();
    seedTimedQuest(exactStore, { elapsedSeconds: 0.9 });
    await exactStore.dispatch(processQuestTimersThunk(100));

    expect(snapshot(exactStore).status).toBe('FAILED');
    expect(snapshot(exactStore).failureNotifications).toBe(1);

    const accumulatedStore = makeStore();
    seedTimedQuest(accumulatedStore);
    for (let tick = 0; tick < 9; tick += 1) {
      await accumulatedStore.dispatch(processQuestTimersThunk(100));
    }

    const accumulatedBeforeSave = snapshot(accumulatedStore).elapsedSeconds;
    expect(accumulatedBeforeSave).toBeLessThan(0.9);

    const envelope = createCurrentSaveEnvelope(accumulatedStore.getState(), 123456);
    const migration = migrateSavePayload(envelope);
    const persistedElapsed = migration.envelope.state.quest.quests[QUEST_ID].elapsedSeconds;

    expect(migration.sourceVersion).toBe(1);
    expect(migration.targetVersion).toBe(1);
    expect(migration.appliedMigrations).toEqual([]);
    expect(persistedElapsed).toBe(accumulatedBeforeSave);

    const restoredStore = configureStore({
      reducer: rootReducer,
      preloadedState: migration.envelope.state,
    });
    await restoredStore.dispatch(processQuestTimersThunk(100));

    const restored = snapshot(restoredStore);
    expect(restored.status).toBe('FAILED');
    expect(restored.active).toBe(false);
    expect(restored.failureNotifications).toBe(1);
    expect(restored.elapsedSeconds).toBeLessThan(1);
    expect(1 - restored.elapsedSeconds).toBeLessThanOrEqual(Number.EPSILON);
  });

  test('invalid and non-positive live deltas remain no-ops even inside comparison tolerance', async () => {
    const store = makeStore();
    const startingElapsed = 1 - Number.EPSILON;
    seedTimedQuest(store, { elapsedSeconds: startingElapsed });

    for (const invalidDelta of [
      0,
      -100,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      await store.dispatch(processQuestTimersThunk(invalidDelta));
    }

    const result = snapshot(store);
    expect(result.elapsedSeconds).toBe(startingElapsed);
    expect(result.status).toBe('IN_PROGRESS');
    expect(result.active).toBe(true);
    expect(result.failureNotifications).toBe(0);
  });

  test('failed Quest remains frozen and cannot duplicate timeout notification', async () => {
    const store = makeStore();
    seedTimedQuest(store, { elapsedSeconds: 0.9 });

    await store.dispatch(processQuestTimersThunk(100));
    const failed = snapshot(store);

    await store.dispatch(processQuestTimersThunk(100));
    await store.dispatch(processQuestTimersThunk(500));
    const afterLaterTicks = snapshot(store);

    expect(failed.status).toBe('FAILED');
    expect(failed.failureNotifications).toBe(1);
    expect(afterLaterTicks.elapsedSeconds).toBe(failed.elapsedSeconds);
    expect(afterLaterTicks.status).toBe('FAILED');
    expect(afterLaterTicks.active).toBe(false);
    expect(afterLaterTicks.failureNotifications).toBe(1);
  });
});
