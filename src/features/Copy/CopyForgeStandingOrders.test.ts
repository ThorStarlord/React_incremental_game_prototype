import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { markRoutineFamiliarity } from '../Player/state/PlayerSlice';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { settleOfflineProgressThunk } from '../GameLoop/state/OfflineProgress';
import { copyListeners } from './state/CopyListeners';
import {
  acknowledgeCopyException,
  assignCopyRole,
  updateCopy,
  upsertForgeMaintenanceCase,
} from './state/CopySlice';
import {
  processCopyStandingOrdersThunk,
  setCopyStandingOrderThunk,
} from './state/CopyStrategyThunks';
import { processCopyTasksThunk } from './state/CopyThunks';
import { selectOpenCopyExceptions } from '../Story/PlayerInsightSelectors';

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(copyListeners.middleware),
});

type TestStore = ReturnType<typeof makeStore>;

const prepareForgeCopy = (store: TestStore, copyId = 'copy-001') => {
  store.dispatch(assignCopyRole({ copyId, role: 'guardian' }));
  store.dispatch(updateCopy({
    copyId,
    updates: {
      maturity: 55,
      loyalty: 60,
      activeTask: null,
      location: CITY_CENTER_LOCATION_ID,
    },
  }));
  store.dispatch(markRoutineFamiliarity({
    routineId: 'forge_assistance',
    source: 'city_center_forge_assistance',
    learnedAt: 100,
  }));
};

const enableForgeStandingOrder = async (store: TestStore, copyId = 'copy-001') => {
  const result = await store.dispatch(setCopyStandingOrderThunk({
    copyId,
    taskId: 'forge_assistance',
    enabled: true,
  }));
  expect(setCopyStandingOrderThunk.fulfilled.match(result)).toBe(true);
};

const experience = (id: string, primaryTargetId = 'npc_blacksmith_gronk', timestamp = 1000) => recordRelationshipExperience({
  id,
  title: id,
  timestamp,
  primaryTargetId,
  participantIds: ['player', primaryTargetId],
  sourceType: 'system',
  significance: 'major',
  relationshipEffects: {},
  resonanceTags: [],
  memoryCandidate: false,
});

const routineCase = (id: string, createdAtTick = 0) => upsertForgeMaintenanceCase({
  id,
  status: 'pending',
  classification: 'routine_upkeep',
  createdAtTick,
});

const deviationCase = (id: string, createdAtTick = 0) => upsertForgeMaintenanceCase({
  id,
  status: 'pending',
  classification: 'structural_deviation',
  createdAtTick,
});

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Candidate B Forge Assistance standing responsibility', () => {
  test('standing responsibility is personal-mastery gated with a forge backlog condition', async () => {
    const store = makeStore();

    const rejected = await store.dispatch(setCopyStandingOrderThunk({
      copyId: 'copy-001',
      taskId: 'forge_assistance',
      enabled: true,
    }));
    expect(setCopyStandingOrderThunk.rejected.match(rejected)).toBe(true);

    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);

    expect(store.getState().copy.copies['copy-001'].standingOrders?.forge_assistance)
      .toMatchObject({
        enabled: true,
        condition: {
          type: 'forge_maintenance_backlog',
          targetPending: 0,
        },
      });
    expect(store.getState().copy.copies['copy-001'].routinePriority)
      .toContain('forge_assistance');
  });

  test('existing maturity, role, and City Center eligibility gate the order', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(routineCase('forge_eligibility_probe'));

    store.dispatch(assignCopyRole({ copyId: 'copy-001', role: 'researcher' }));
    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    store.dispatch(assignCopyRole({ copyId: 'copy-001', role: 'guardian' }));
    store.dispatch(updateCopy({ copyId: 'copy-001', updates: { location: 'Library Archives' } }));
    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: { location: CITY_CENTER_LOCATION_ID, maturity: 40 },
    }));
    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    store.dispatch(updateCopy({ copyId: 'copy-001', updates: { maturity: 55 } }));
    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'forge_assistance',
      origin: { type: 'standing_order', routineId: 'forge_assistance', subjectId: 'forge_eligibility_probe' },
    });
  });

  test('starting standing work never moves the Copy or changes its role', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(routineCase('forge_no_autonomy_probe'));

    await store.dispatch(processCopyStandingOrdersThunk());

    const copy = store.getState().copy.copies['copy-001'];
    expect(copy.activeTask).toMatchObject({ productionTaskId: 'forge_assistance' });
    expect(copy.location).toBe(CITY_CENTER_LOCATION_ID);
    expect(copy.role).toBe('guardian');
  });

  test('oldest pending case wins with stable id tiebreak', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(routineCase('forge_case_b', 5));
    store.dispatch(routineCase('forge_case_a', 5));
    store.dispatch(routineCase('forge_case_older', 1));

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask?.origin)
      .toMatchObject({ subjectId: 'forge_case_older' });
  });

  test('routine upkeep completes quietly into maintained with the ordinary reward', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(routineCase('forge_routine_quiet'));

    const goldBefore = store.getState().player.gold;
    const completedBefore = store.getState().notifications.items
      .filter(item => /completed Forge Assistance/i.test(item.message)).length;

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_routine_quiet.status)
      .toBe('in_progress');

    await store.dispatch(processCopyTasksThunk(100_000));

    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_routine_quiet.status)
      .toBe('maintained');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(store.getState().player.gold).toBe(goldBefore + 15);

    const completedAfter = store.getState().notifications.items
      .filter(item => /completed Forge Assistance/i.test(item.message)).length;
    expect(completedAfter).toBe(completedBefore);
  });

  test('task completion never consumes leftover delta into another standing-order task', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(routineCase('forge_chain_a'));
    store.dispatch(routineCase('forge_chain_b'));

    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(500_000));

    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_chain_a.status)
      .toBe('maintained');
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_chain_b.status)
      .toBe('pending');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      origin: { subjectId: 'forge_chain_b' },
    });
  });

  test('two Copies cannot claim the same maintenance case', async () => {
    const store = makeStore();
    prepareForgeCopy(store, 'copy-001');
    prepareForgeCopy(store, 'copy-002');
    await enableForgeStandingOrder(store, 'copy-001');
    await enableForgeStandingOrder(store, 'copy-002');
    store.dispatch(routineCase('forge_single_claim'));

    await store.dispatch(processCopyStandingOrdersThunk());

    const first = store.getState().copy.copies['copy-001'].activeTask;
    const second = store.getState().copy.copies['copy-002'].activeTask;
    expect([first, second].filter(Boolean)).toHaveLength(1);
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_single_claim.status)
      .toBe('in_progress');
    const claimedBy = store.getState().copy.forgeMaintenanceCasesById?.forge_single_claim.assignedCopyId;
    expect(
      (first && claimedBy === 'copy-001') || (second && claimedBy === 'copy-002')
    ).toBe(true);
  });

  test('structural deviation becomes one durable blocking exception with no reward', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(deviationCase('forge_deviation_probe'));

    const goldBefore = store.getState().player.gold;
    const loyaltyBefore = store.getState().copy.copies['copy-001'].loyalty;

    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    const exceptions = Object.values(store.getState().copy.exceptionsById ?? {});
    expect(exceptions).toHaveLength(1);
    expect(exceptions[0]).toMatchObject({
      copyId: 'copy-001',
      routineId: 'forge_assistance',
      status: 'open',
      severity: 'blocking',
      context: {
        code: 'forge_structural_deviation',
        forgeCaseId: 'forge_deviation_probe',
      },
    });
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_deviation_probe.status)
      .toBe('escalated');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(store.getState().player.gold).toBe(goldBefore);
    expect(store.getState().copy.copies['copy-001'].loyalty).toBe(loyaltyBefore);

    expect(selectOpenCopyExceptions(store.getState())).toEqual([
      expect.objectContaining({
        copyId: 'copy-001',
        routineName: 'Forge Assistance',
        title: 'Forge structural deviation',
        status: 'open',
        severity: 'blocking',
      }),
    ]);

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('acknowledging a Forge exception is not resolution', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(deviationCase('forge_ack_probe'));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    const exception = Object.values(store.getState().copy.exceptionsById ?? {})[0];
    store.dispatch(acknowledgeCopyException({
      exceptionId: exception.id,
      tick: store.getState().gameLoop.currentTick,
    }));
    expect(store.getState().copy.exceptionsById?.[exception.id].status)
      .toBe('acknowledged');

    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('Gronk Inspect and Reframe resolves the deviation and later work resumes', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(deviationCase('forge_gronk_probe'));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    const exception = Object.values(store.getState().copy.exceptionsById ?? {})[0];
    expect(exception.status).toBe('open');

    store.dispatch(experience('gronk_exp_forge_inspect_reframe'));

    expect(store.getState().copy.exceptionsById?.[exception.id].status).toBe('resolved');
    expect(store.getState().copy.exceptionsById?.[exception.id].resolution?.action)
      .toBe('player_resolved');
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_gronk_probe.status)
      .toBe('maintained');

    store.dispatch(routineCase('forge_after_resolution'));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_after_resolution.status)
      .toBe('maintained');
  });

  test('GC09 preparation and commitment feed routine and deviation work', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);

    store.dispatch(experience('lyra_gc09_exp_prepare_structural', 'npc_lyra'));
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_case_gc09_structural_upkeep)
      .toMatchObject({ status: 'pending', classification: 'routine_upkeep' });

    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_case_gc09_structural_upkeep.status)
      .toBe('maintained');

    store.dispatch(experience('lyra_gc09_exp_commit_structural', 'npc_lyra'));
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_case_gc09_load_path_deviation)
      .toMatchObject({ status: 'pending', classification: 'structural_deviation' });
  });

  test('Archive and Forge responsibilities remain independent', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(deviationCase('forge_independent_probe'));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    expect(Object.values(store.getState().copy.exceptionsById ?? {})).toHaveLength(1);

    store.dispatch(routineCase('forge_independent_routine'));
    await store.dispatch(processCopyStandingOrdersThunk());
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    store.dispatch(experience('gronk_exp_forge_inspect_reframe'));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_independent_routine.status)
      .toBe('maintained');
  });

  test('Forge exceptions and cases survive save/load', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(deviationCase('forge_persisted'));
    await store.dispatch(processCopyStandingOrdersThunk());
    await store.dispatch(processCopyTasksThunk(100_000));

    jest.spyOn(Date, 'now').mockReturnValue(999_000);
    const saveId = createSave(store.getState(), 'Forge standing order exception');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const restored = makeStore();
    restored.dispatch(replaceState(loaded!.state));

    expect(Object.values(restored.getState().copy.exceptionsById ?? {}))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({
          status: 'open',
          context: expect.objectContaining({ forgeCaseId: 'forge_persisted' }),
        }),
      ]));
    expect(restored.getState().copy.forgeMaintenanceCasesById?.forge_persisted.status)
      .toBe('escalated');
  });

  test('offline settlement never selects the next standing case', async () => {
    const store = makeStore();
    prepareForgeCopy(store);
    await enableForgeStandingOrder(store);
    store.dispatch(routineCase('forge_offline_probe'));

    const result = await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 100_000, resumeTimestamp: 120_000 })
    ).unwrap();

    expect(result.skipReason).toBeUndefined();
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(store.getState().copy.forgeMaintenanceCasesById?.forge_offline_probe.status)
      .toBe('pending');
  });
});
