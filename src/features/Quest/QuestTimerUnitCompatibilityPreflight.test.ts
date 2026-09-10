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

describe('Timed Quest unit and save-compatibility preflight', () => {
  test('current live timer thunk writes raw millisecond GameLoop deltas into elapsedSeconds', async () => {
    const store = makeStore();
    seedTimedQuest(store);

    await store.dispatch(processQuestTimersThunk(100));

    expect(readQuest(store).elapsedSeconds).toBe(100);
    expect(readQuest(store).status).toBe('IN_PROGRESS');
  });

  test('Quest reducer and display helper interpret their public timer fields as seconds', () => {
    const store = makeStore();
    seedTimedQuest(store, { timeLimitSeconds: 5 });

    store.dispatch(incrementQuestElapsed({ questId: QUEST_ID, deltaSeconds: 1.25 }));

    const elapsedSeconds = readQuest(store).elapsedSeconds;
    expect(elapsedSeconds).toBeCloseTo(1.25, 8);
    expect(getTimeRemaining(undefined, 5, elapsedSeconds)).toBe(4);
  });

  test('current schema-v1 save/load preserves an already millisecond-scaled elapsedSeconds value without normalization', () => {
    const store = makeStore();
    seedTimedQuest(store, { elapsedSeconds: 1250, timeLimitSeconds: 5000 });

    const envelope = createCurrentSaveEnvelope(store.getState(), 123456);
    const result = migrateSavePayload(envelope);

    expect(result.sourceVersion).toBe(1);
    expect(result.targetVersion).toBe(1);
    expect(result.appliedMigrations).toEqual([]);
    expect(result.envelope.state.quest.quests[QUEST_ID].elapsedSeconds).toBe(1250);
    expect(result.envelope.state.quest.quests[QUEST_ID].timeLimitSeconds).toBe(5000);
  });

  test('legacy v0 wrapping migration also preserves timed-Quest elapsedSeconds without unit conversion', () => {
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

  test('zero and negative live timer deltas are currently bounded to no progress', async () => {
    const store = makeStore();
    seedTimedQuest(store);

    await store.dispatch(processQuestTimersThunk(0));
    await store.dispatch(processQuestTimersThunk(-100));

    expect(readQuest(store).elapsedSeconds).toBe(0);
    expect(readQuest(store).status).toBe('IN_PROGRESS');
  });

  test.todo('non-finite live timer deltas should be rejected rather than contaminating elapsedSeconds');
  test.todo('one second of GameLoop logical time should advance timed Quest elapsedSeconds by exactly one second');
});
