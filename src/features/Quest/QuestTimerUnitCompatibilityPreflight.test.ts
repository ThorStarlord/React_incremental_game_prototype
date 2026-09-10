import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../app/store';
import { addQuest, incrementQuestElapsed } from './state/QuestSlice';
import { processQuestTimersThunk } from './state/QuestThunks';
import type { Quest } from './state/QuestTypes';
import {
  createCurrentSaveEnvelope,
  migrateSavePayload,
} from '../../shared/utils/saveSchema';
import { getTimeRemaining } from '../../shared/utils/time';

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

const QUEST_ID = 'timed_quest_unit_preflight_probe';

const makeTimedQuest = (overrides: Partial<Quest> = {}): Quest => ({
  id: QUEST_ID,
  title: 'Timed Quest unit preflight probe',
  description: 'Hermetic characterization only.',
  giver: 'npc-preflight-probe',
  type: 'SIDE',
  objectives: [],
  prerequisites: [],
  rewards: [],
  status: 'IN_PROGRESS',
  isAutoComplete: false,
  timeLimitSeconds: 5000,
  elapsedSeconds: 0,
  startedAt: 1,
  ...overrides,
});

const seedTimedQuest = (store: TestStore, overrides: Partial<Quest> = {}) => {
  store.dispatch(addQuest(makeTimedQuest(overrides)));
};

const readQuest = (store: TestStore) => store.getState().quest.quests[QUEST_ID];

const failureNotifications = (store: TestStore) =>
  store.getState().notifications.items.filter(
    notification => notification.message === 'Quest Failed: Timed Quest unit preflight probe'
  );

describe('Timed Quest unit and save-compatibility preflight', () => {
  test.each([
    [100, 0.1],
    [250, 0.25],
  ])('live timer thunk converts %d milliseconds to %d seconds exactly once', async (deltaMs, expectedSeconds) => {
    const store = makeStore();
    seedTimedQuest(store);

    await store.dispatch(processQuestTimersThunk(deltaMs));

    expect(readQuest(store).elapsedSeconds).toBeCloseTo(expectedSeconds, 8);
    expect(readQuest(store).status).toBe('IN_PROGRESS');
  });

  test('Quest reducer and display helper remain seconds-based', () => {
    const store = makeStore();
    seedTimedQuest(store, { timeLimitSeconds: 5 });

    store.dispatch(incrementQuestElapsed({ questId: QUEST_ID, deltaSeconds: 1.25 }));

    const elapsedSeconds = readQuest(store).elapsedSeconds;
    expect(elapsedSeconds).toBeCloseTo(1.25, 8);
    expect(getTimeRemaining(undefined, 5, elapsedSeconds)).toBe(4);
  });

  test('current schema-v1 save/load preserves stored timer values and normalized live increments resume from that value', async () => {
    const store = makeStore();
    seedTimedQuest(store, { elapsedSeconds: 4.5, timeLimitSeconds: 10 });

    const envelope = createCurrentSaveEnvelope(store.getState(), 123456);
    const result = migrateSavePayload(envelope);

    expect(result.sourceVersion).toBe(1);
    expect(result.targetVersion).toBe(1);
    expect(result.appliedMigrations).toEqual([]);
    expect(result.envelope.state.quest.quests[QUEST_ID].elapsedSeconds).toBe(4.5);
    expect(result.envelope.state.quest.quests[QUEST_ID].timeLimitSeconds).toBe(10);

    const resumedStore = configureStore({
      reducer: rootReducer,
      preloadedState: result.envelope.state,
    });
    await resumedStore.dispatch(processQuestTimersThunk(500));

    expect(resumedStore.getState().quest.quests[QUEST_ID].elapsedSeconds).toBeCloseTo(5, 8);
    expect(resumedStore.getState().quest.quests[QUEST_ID].status).toBe('IN_PROGRESS');
  });

  test('legacy v0 wrapping migration preserves timed-Quest elapsedSeconds without unit conversion', () => {
    const store = makeStore();
    seedTimedQuest(store, { elapsedSeconds: 1250, timeLimitSeconds: 5000 });

    const legacyPayload = {
      version: '0.9.0',
      timestamp: 123456,
      state: store.getState(),
    };
    const result = migrateSavePayload(legacyPayload);

    expect(result.sourceVersion).toBe(0);
    expect(result.targetVersion).toBe(1);
    expect(result.appliedMigrations).toEqual(['save-schema-v0-to-v1']);
    expect(result.envelope.state.quest.quests[QUEST_ID].elapsedSeconds).toBe(1250);
    expect(result.envelope.state.quest.quests[QUEST_ID].timeLimitSeconds).toBe(5000);
  });

  test('zero, negative, NaN, and infinite live timer deltas are no-ops', async () => {
    const store = makeStore();
    seedTimedQuest(store);

    for (const invalidDelta of [0, -100, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      await store.dispatch(processQuestTimersThunk(invalidDelta));
    }

    expect(readQuest(store).elapsedSeconds).toBe(0);
    expect(readQuest(store).status).toBe('IN_PROGRESS');
    expect(failureNotifications(store)).toHaveLength(0);
  });

  test('one second of GameLoop logical time advances timed Quest elapsedSeconds by exactly one second', async () => {
    const store = makeStore();
    seedTimedQuest(store);

    for (let tick = 0; tick < 10; tick += 1) {
      await store.dispatch(processQuestTimersThunk(100));
    }

    expect(readQuest(store).elapsedSeconds).toBeCloseTo(1, 8);
    expect(readQuest(store).status).toBe('IN_PROGRESS');
  });

  test('exact timeout crossing fails once and emits one failure notification', async () => {
    const store = makeStore();
    seedTimedQuest(store, { elapsedSeconds: 0.9, timeLimitSeconds: 1 });

    await store.dispatch(processQuestTimersThunk(100));

    expect(readQuest(store).elapsedSeconds).toBeCloseTo(1, 8);
    expect(readQuest(store).status).toBe('FAILED');
    expect(failureNotifications(store)).toHaveLength(1);

    await store.dispatch(processQuestTimersThunk(100));

    expect(readQuest(store).elapsedSeconds).toBeCloseTo(1, 8);
    expect(readQuest(store).status).toBe('FAILED');
    expect(failureNotifications(store)).toHaveLength(1);
  });
});
