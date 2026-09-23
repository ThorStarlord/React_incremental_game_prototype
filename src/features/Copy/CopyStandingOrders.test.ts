import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { markRoutineFamiliarity } from '../Player/state/PlayerSlice';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { copyListeners } from './state/CopyListeners';
import {
  acknowledgeCopyException,
  assignCopyRole,
  updateCopy,
  upsertArchiveVerificationCase,
} from './state/CopySlice';
import {
  processCopyStandingOrdersThunk,
  setCopyStandingOrderThunk,
} from './state/CopyStrategyThunks';
import { processCopyTasksThunk } from './state/CopyThunks';

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(copyListeners.middleware),
});

type TestStore = ReturnType<typeof makeStore>;

const prepareArchiveCopy = (store: TestStore) => {
  store.dispatch(assignCopyRole({ copyId: 'copy-001', role: 'researcher' }));
  store.dispatch(updateCopy({
    copyId: 'copy-001',
    updates: {
      maturity: 95,
      loyalty: 90,
      activeTask: null,
    },
  }));
  store.dispatch(markRoutineFamiliarity({
    routineId: 'archive_verification',
    source: 'elara_independent_verification',
    learnedAt: 100,
  }));
};

const enableArchiveStandingOrder = async (store: TestStore) => {
  const result = await store.dispatch(setCopyStandingOrderThunk({
    copyId: 'copy-001',
    taskId: 'archive_verification',
    enabled: true,
  }));
  expect(setCopyStandingOrderThunk.fulfilled.match(result)).toBe(true);
};

const experience = (id: string, timestamp = 1000) => recordRelationshipExperience({
  id,
  title: id,
  timestamp,
  primaryTargetId: 'npc_scholar_elara',
  participantIds: ['player', 'npc_scholar_elara'],
  sourceType: 'system',
  significance: 'major',
  relationshipEffects: {},
  resonanceTags: [],
  memoryCandidate: false,
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Copy Standing Orders and Exception Escalation', () => {
  test('standing responsibility is mastery-gated and reuses routinePriority instead of creating a second priority authority', async () => {
    const store = makeStore();

    const rejected = await store.dispatch(setCopyStandingOrderThunk({
      copyId: 'copy-001',
      taskId: 'archive_verification',
      enabled: true,
    }));
    expect(setCopyStandingOrderThunk.rejected.match(rejected)).toBe(true);

    prepareArchiveCopy(store);
    await enableArchiveStandingOrder(store);

    expect(store.getState().copy.copies['copy-001'].standingOrders?.archive_verification)
      .toMatchObject({
        enabled: true,
        condition: {
          type: 'archive_verification_backlog',
          targetPending: 0,
        },
      });
    expect(store.getState().copy.copies['copy-001'].routinePriority)
      .toContain('archive_verification');
  });

  test('a live standing order starts one bounded Archive case and normal completion remains silent', async () => {
    const store = makeStore();
    prepareArchiveCopy(store);
    await enableArchiveStandingOrder(store);
    store.dispatch(upsertArchiveVerificationCase({
      id: 'case_routine',
      status: 'pending',
      classification: 'routine',
      sourceIds: ['source_a'],
      createdAtTick: 0,
    }));

    const essenceBefore = store.getState().essence.currentEssence;
    const completedBefore = store.getState().notifications.items
      .filter(item => /completed Archive Verification/i.test(item.message)).length;

    await store.dispatch(processCopyStandingOrdersThunk());

    expect(store.getState().copy.archiveVerificationCasesById?.case_routine.status)
      .toBe('in_progress');
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'archive_verification',
      progressSeconds: 0,
      origin: {
        type: 'standing_order',
        routineId: 'archive_verification',
        subjectId: 'case_routine',
      },
    });

    await store.dispatch(processCopyTasksThunk(100_000));

    expect(store.getState().copy.archiveVerificationCasesById?.case_routine.status)
      .toBe('verified');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(store.getState().essence.currentEssence).toBe(essenceBefore + 5);

    const completedAfter = store.getState().notifications.items
      .filter(item => /completed Archive Verification/i.test(item.message)).length;
    expect(completedAfter).toBe(completedBefore);
  });

  test('task completion never consumes leftover delta into another standing-order task', async () => {
    const store = makeStore();
    prepareArchiveCopy(store);
    await enableArchiveStandingOrder(store);

    for (const id of ['case_a', 'case_b']) {
      store.dispatch(upsertArchiveVerificationCase({
        id,
        status: 'pending',
        classification: 'routine',
        sourceIds: [id],
        createdAtTick: 0,
      }));
    }

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask?.origin)
      .toMatchObject({ subjectId: 'case_a' });

    await store.dispatch(processCopyTasksThunk(500_000));

    expect(store.getState().copy.archiveVerificationCasesById?.case_a.status)
      .toBe('verified');
    expect(store.getState().copy.archiveVerificationCasesById?.case_b.status)
      .toBe('pending');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      progressSeconds: 0,
      origin: { subjectId: 'case_b' },
    });
  });

  test('source contradiction becomes one durable blocking exception with no ordinary reward', async () => {
    const store = makeStore();
    prepareArchiveCopy(store);
    await enableArchiveStandingOrder(store);
    store.dispatch(upsertArchiveVerificationCase({
      id: 'case_contradiction',
      status: 'pending',
      classification: 'source_contradiction',
      sourceIds: ['source_alpha', 'source_beta'],
      createdAtTick: 0,
    }));

    const essenceBefore = store.getState().essence.currentEssence;

    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    const exceptions = Object.values(store.getState().copy.exceptionsById ?? {});
    expect(exceptions).toHaveLength(1);
    expect(exceptions[0]).toMatchObject({
      copyId: 'copy-001',
      routineId: 'archive_verification',
      status: 'open',
      severity: 'blocking',
      context: {
        code: 'archive_source_contradiction',
        archiveCaseId: 'case_contradiction',
        conflictingSourceIds: ['source_alpha', 'source_beta'],
      },
    });
    expect(store.getState().copy.archiveVerificationCasesById?.case_contradiction.status)
      .toBe('escalated');
    expect(store.getState().essence.currentEssence).toBe(essenceBefore);
    expect(store.getState().notifications.items.some(item =>
      /contradictory sources require your judgment/i.test(item.message)
    )).toBe(true);

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    store.dispatch(acknowledgeCopyException({
      exceptionId: exceptions[0].id,
      tick: store.getState().gameLoop.currentTick,
    }));
    expect(store.getState().copy.exceptionsById?.[exceptions[0].id].status)
      .toBe('acknowledged');

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('authored campaign events feed routine/anomaly work and the later player-owned diagnostic commitment resolves the exception', async () => {
    const store = makeStore();
    prepareArchiveCopy(store);
    await enableArchiveStandingOrder(store);

    store.dispatch(experience('elara_gc08_exp_network_diagnosis', 1000));
    expect(store.getState().copy.archiveVerificationCasesById?.archive_case_gc08_network_diagnosis)
      .toMatchObject({ status: 'pending', classification: 'routine' });

    store.dispatch(experience('elara_gc08_exp_diagnostic_preparation', 1100));
    expect(store.getState().copy.archiveVerificationCasesById?.archive_case_gc08_diagnostic_anomaly)
      .toMatchObject({ status: 'pending', classification: 'source_contradiction' });

    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    const exception = Object.values(store.getState().copy.exceptionsById ?? {})[0];
    expect(exception?.status).toBe('open');

    store.dispatch(experience('lyra_gc08_exp_commit_diagnostic', 1200));

    expect(store.getState().copy.exceptionsById?.[exception.id].status).toBe('resolved');
    expect(store.getState().copy.exceptionsById?.[exception.id].resolution?.action)
      .toBe('player_resolved');
    expect(store.getState().copy.archiveVerificationCasesById?.archive_case_gc08_diagnostic_anomaly.status)
      .toBe('verified');
  });

  test('unresolved exceptions survive save/load while transient notification state does not become authority', async () => {
    const store = makeStore();
    prepareArchiveCopy(store);
    await enableArchiveStandingOrder(store);
    store.dispatch(upsertArchiveVerificationCase({
      id: 'case_persisted',
      status: 'pending',
      classification: 'source_contradiction',
      sourceIds: ['source_a', 'source_b'],
      createdAtTick: 0,
    }));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    jest.spyOn(Date, 'now').mockReturnValue(999_000);
    const saveId = createSave(store.getState(), 'Standing order exception');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const restored = makeStore();
    restored.dispatch(replaceState(loaded!.state));

    expect(Object.values(restored.getState().copy.exceptionsById ?? {}))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({
          status: 'open',
          context: expect.objectContaining({ archiveCaseId: 'case_persisted' }),
        }),
      ]));
    expect(restored.getState().notifications.items).toEqual([]);
  });
});
