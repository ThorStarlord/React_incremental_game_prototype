import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, replaceState } from '../../app/store';
import { updateGenerationRate } from '../Essence/state/EssenceSlice';
import { updateCopy } from '../Copy/state/CopySlice';
import type { Copy } from '../Copy/state/CopyTypes';
import { startCopyProductionTaskThunk } from '../Copy/state/CopyThunks';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { pauseGame, stopGame } from './state/GameLoopSlice';
import {
  MAX_OFFLINE_PROGRESS_MS,
  calculateOfflineProgressWindow,
  settleOfflineProgressThunk,
} from './state/OfflineProgress';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

const prepareCopy = (store: TestStore, updates: Partial<Copy>) => {
  store.dispatch(updateCopy({ copyId: 'copy-001', updates }));
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('M21 bounded offline progress qualification', () => {
  test('elapsed-window authority rejects missing/future time and clamps at exactly eight hours', () => {
    expect(MAX_OFFLINE_PROGRESS_MS).toBe(28_800_000);

    expect(calculateOfflineProgressWindow(0, 10_000)).toEqual({
      rawElapsedMs: 0,
      elapsedMs: 0,
      capped: false,
      skipReason: 'invalid_timestamp',
    });

    expect(calculateOfflineProgressWindow(20_000, 10_000)).toEqual({
      rawElapsedMs: -10_000,
      elapsedMs: 0,
      capped: false,
      skipReason: 'non_positive_elapsed',
    });

    expect(calculateOfflineProgressWindow(10_000, 10_000)).toEqual({
      rawElapsedMs: 0,
      elapsedMs: 0,
      capped: false,
      skipReason: 'non_positive_elapsed',
    });

    expect(
      calculateOfflineProgressWindow(10_000, 10_000 + MAX_OFFLINE_PROGRESS_MS + 5_000)
    ).toEqual({
      rawElapsedMs: MAX_OFFLINE_PROGRESS_MS + 5_000,
      elapsedMs: MAX_OFFLINE_PROGRESS_MS,
      capped: true,
    });
  });

  test.each([
    ['paused', (store: TestStore) => store.dispatch(pauseGame()), 'game_paused'],
    ['stopped', (store: TestStore) => store.dispatch(stopGame()), 'game_not_running'],
  ] as const)('saved %s game receives no offline Essence or Copy progress', async (_label, changeLoopState, reason) => {
    const store = makeStore();
    store.dispatch(updateGenerationRate(2));
    prepareCopy(store, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });
    await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    ).unwrap();

    const essenceBefore = store.getState().essence.currentEssence;
    changeLoopState(store);

    const result = await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 100_000, resumeTimestamp: 120_000 })
    ).unwrap();

    expect(result.skipReason).toBe(reason);
    expect(result.elapsedMs).toBe(0);
    expect(store.getState().essence.currentEssence).toBe(essenceBefore);
    expect(store.getState().copy.copies['copy-001'].activeTask?.progressSeconds).toBe(0);
  });

  test('one positive interval settles passive Essence and partial M20 task progress while narrative/location authority stays frozen', async () => {
    const store = makeStore();
    store.dispatch(updateGenerationRate(2));
    prepareCopy(store, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });
    await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    ).unwrap();

    const essenceBefore = store.getState().essence.currentEssence;
    const relationshipsBefore = JSON.parse(JSON.stringify(store.getState().relationships));
    const questBefore = JSON.parse(JSON.stringify(store.getState().quest));
    const locationBefore = store.getState().player.location;

    const result = await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 100_000, resumeTimestamp: 120_000 })
    ).unwrap();

    expect(result.skipReason).toBeUndefined();
    expect(result.elapsedMs).toBe(20_000);
    expect(result.essenceGenerated).toBe(40);
    expect(store.getState().essence.currentEssence).toBe(essenceBefore + 40);
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'forge_assistance',
      durationSeconds: 60,
      progressSeconds: 20,
      status: 'running',
    });
    expect(result.tasks).toEqual([
      expect.objectContaining({
        productionTaskId: 'forge_assistance',
        taskName: 'Forge Assistance',
        completed: false,
        progressSeconds: 20,
        progressPercent: 33,
      }),
    ]);
    expect(store.getState().gameLoop.lastOfflineSettlementSourceTimestamp).toBe(100_000);
    expect(store.getState().relationships).toEqual(relationshipsBefore);
    expect(store.getState().quest).toEqual(questBefore);
    expect(store.getState().player.location).toBe(locationBefore);
    expect(store.getState().notifications.notifications.at(-1)?.message).toContain('While you were away: +40 Essence');

    const essenceAfterFirstSettlement = store.getState().essence.currentEssence;
    const progressAfterFirstSettlement = store.getState().copy.copies['copy-001'].activeTask?.progressSeconds;
    const replay = await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 100_000, resumeTimestamp: 130_000 })
    ).unwrap();

    expect(replay.skipReason).toBe('already_settled');
    expect(replay.elapsedMs).toBe(0);
    expect(store.getState().essence.currentEssence).toBe(essenceAfterFirstSettlement);
    expect(store.getState().copy.copies['copy-001'].activeTask?.progressSeconds).toBe(progressAfterFirstSettlement);
  });

  test('offline Copy completion applies the authored Forge reward exactly once and discards excess elapsed time', async () => {
    const store = makeStore();
    store.dispatch(updateGenerationRate(0));
    prepareCopy(store, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });
    await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    ).unwrap();

    const goldBefore = store.getState().player.gold;
    const result = await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 200_000, resumeTimestamp: 320_000 })
    ).unwrap();

    expect(result.elapsedMs).toBe(120_000);
    expect(result.tasks).toEqual([
      expect.objectContaining({
        productionTaskId: 'forge_assistance',
        completed: true,
        progressPercent: 100,
      }),
    ]);
    expect(store.getState().player.gold).toBe(goldBefore + 15);
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    const replay = await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 200_000, resumeTimestamp: 500_000 })
    ).unwrap();
    expect(replay.skipReason).toBe('already_settled');
    expect(store.getState().player.gold).toBe(goldBefore + 15);
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('a later ordinary save has a new envelope timestamp and can legitimately settle a new interval', async () => {
    const store = makeStore();
    store.dispatch(updateGenerationRate(1));

    await store.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 300_000, resumeTimestamp: 310_000 })
    ).unwrap();
    expect(store.getState().gameLoop.lastOfflineSettlementSourceTimestamp).toBe(300_000);

    jest.spyOn(Date, 'now').mockReturnValue(320_000);
    const saveId = createSave(store.getState(), 'M21 resumed save');
    expect(saveId).toBe('save_320000');

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded?.envelope.timestamp).toBe(320_000);

    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));
    expect(resumedStore.getState().gameLoop.lastOfflineSettlementSourceTimestamp).toBe(300_000);

    const essenceBeforeSecondInterval = resumedStore.getState().essence.currentEssence;
    const second = await resumedStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 320_000, resumeTimestamp: 330_000 })
    ).unwrap();

    expect(second.skipReason).toBeUndefined();
    expect(second.essenceGenerated).toBe(10);
    expect(resumedStore.getState().essence.currentEssence).toBe(essenceBeforeSecondInterval + 10);
    expect(resumedStore.getState().gameLoop.lastOfflineSettlementSourceTimestamp).toBe(320_000);
  });

  test('offline orchestration is an explicit two-consumer allowlist and does not replay unsafe GameLoop domains', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/features/GameLoop/state/OfflineProgress.ts'),
      'utf8'
    );

    expect(source).toContain('processPassiveGenerationThunk');
    expect(source).toContain('processCopyTasksThunk');

    for (const forbidden of [
      'processQuestTimersThunk',
      'processCopyGrowthThunk',
      'processCopyLoyaltyDecayThunk',
      'processStatusEffectsThunk',
      'regenerateVitalsThunk',
      'travelToLocationThunk',
      'setLocation(',
      'RelationshipThunks',
      'Combat',
      'dispatch(tick(',
      'lastSaveTime',
    ]) {
      expect(source).not.toContain(forbidden);
    }

    const saveSchemaSource = fs.readFileSync(
      path.join(process.cwd(), 'src/shared/utils/saveSchema.ts'),
      'utf8'
    );
    expect(saveSchemaSource).toContain('CURRENT_SAVE_SCHEMA_VERSION = 1');
  });
});
