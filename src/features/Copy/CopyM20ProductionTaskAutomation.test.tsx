import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import CopyDetailPanel from './components/ui/CopyDetailPanel';
import {
  COPY_PRODUCTION_TASKS,
  evaluateCopyProductionTaskEligibility,
  getCopyProductionTaskDefinition,
} from './CopyTaskDefinitions';
import { updateCopy } from './state/CopySlice';
import {
  processCopyTasksThunk,
  startCopyProductionTaskThunk,
  startCopyTimedTaskThunk,
} from './state/CopyThunks';

const makeStore = () => configureStore({ reducer: rootReducer });

type TestStore = ReturnType<typeof makeStore>;

const prepareCopy = (
  store: TestStore,
  updates: Parameters<typeof updateCopy>[0]['payload']['updates']
) => {
  store.dispatch(updateCopy({ copyId: 'copy-001', updates }));
};

const saveAndRestore = async (
  store: TestStore,
  now: number
): Promise<TestStore> => {
  jest.spyOn(Date, 'now').mockReturnValue(now);
  const saveId = createSave(store.getState(), 'M20 Copy task save');
  expect(saveId).toBe(`save_${now}`);

  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();

  const resumedStore = makeStore();
  resumedStore.dispatch(replaceState(loaded!.state));
  return resumedStore;
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('M20 production Copy task automation qualification', () => {
  test('catalog contains exactly two bounded authored routine tasks with no arbitrary effect callback', () => {
    expect(COPY_PRODUCTION_TASKS.map(task => task.id)).toEqual([
      'forge_assistance',
      'resonance_calibration',
    ]);

    for (const task of COPY_PRODUCTION_TASKS) {
      expect(task.baseDurationSeconds).toBeGreaterThan(0);
      expect(Object.prototype.hasOwnProperty.call(task, 'effect')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(task, 'actions')).toBe(false);
    }
  });

  test('Forge Assistance accepts legacy City Center through canonical M18 location resolution and pays Gold exactly once', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'guardian',
      maturity: 75,
      loyalty: 85,
      location: 'City Center',
      activeTask: null,
    });

    const forge = getCopyProductionTaskDefinition('forge_assistance')!;
    expect(forge.requiredLocationId).toBe(CITY_CENTER_LOCATION_ID);
    expect(evaluateCopyProductionTaskEligibility(store.getState().copy.copies['copy-001'], forge)).toEqual({
      eligible: true,
      reasons: [],
    });

    const start = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    expect(startCopyProductionTaskThunk.fulfilled.match(start)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'forge_assistance',
      durationSeconds: 63,
      progressSeconds: 0,
      status: 'running',
    });

    const goldBefore = store.getState().player.gold;
    await store.dispatch(processCopyTasksThunk(63000));

    expect(store.getState().player.gold).toBe(goldBefore + 15);
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    await store.dispatch(processCopyTasksThunk(63000));
    expect(store.getState().player.gold).toBe(goldBefore + 15);
  });

  test('Resonance Calibration uses the same generic lifecycle, researcher duration modifier, and Essence authority', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'researcher',
      maturity: 75,
      loyalty: 85,
      activeTask: null,
    });

    const essenceBefore = store.getState().essence.currentEssence;
    const start = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'resonance_calibration' })
    );

    expect(startCopyProductionTaskThunk.fulfilled.match(start)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'resonance_calibration',
      durationSeconds: 86,
      status: 'running',
    });

    await store.dispatch(processCopyTasksThunk(86000));
    expect(store.getState().essence.currentEssence).toBe(essenceBefore + 8);
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('unmet role/location requirements and busy assignment reject before task mutation', async () => {
    const wrongRoleStore = makeStore();
    prepareCopy(wrongRoleStore, {
      role: 'none',
      maturity: 75,
      loyalty: 85,
      location: 'City Center',
      activeTask: null,
    });
    const wrongRole = await wrongRoleStore.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    expect(startCopyProductionTaskThunk.rejected.match(wrongRole)).toBe(true);
    expect(wrongRole.payload).toContain('Requires role');
    expect(wrongRoleStore.getState().copy.copies['copy-001'].activeTask).toBeNull();

    const wrongLocationStore = makeStore();
    prepareCopy(wrongLocationStore, {
      role: 'guardian',
      maturity: 75,
      loyalty: 85,
      location: 'Library Archives',
      activeTask: null,
    });
    const wrongLocation = await wrongLocationStore.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    expect(startCopyProductionTaskThunk.rejected.match(wrongLocation)).toBe(true);
    expect(wrongLocation.payload).toContain('Requires Copy presence at City Center');
    expect(wrongLocationStore.getState().copy.copies['copy-001'].activeTask).toBeNull();

    const busyStore = makeStore();
    prepareCopy(busyStore, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });
    await busyStore.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    const originalTaskId = busyStore.getState().copy.copies['copy-001'].activeTask?.id;

    const busy = await busyStore.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'resonance_calibration' })
    );
    expect(startCopyProductionTaskThunk.rejected.match(busy)).toBe(true);
    expect(busy.payload).toBe('Task already running');
    expect(busyStore.getState().copy.copies['copy-001'].activeTask?.id).toBe(originalTaskId);
    expect(busyStore.getState().copy.copies['copy-001'].activeTask?.productionTaskId).toBe('forge_assistance');
  });

  test('unknown production identity and legacy arbitrary timer cannot bypass the authored catalog', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });

    const unknown = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'choose_quest_ending' })
    );
    expect(startCopyProductionTaskThunk.rejected.match(unknown)).toBe(true);
    expect(unknown.payload).toBe('Unknown production task.');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    const legacy = await store.dispatch(
      startCopyTimedTaskThunk({ copyId: 'copy-001', durationSeconds: 1 })
    );
    expect(startCopyTimedTaskThunk.rejected.match(legacy)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('mid-task save/load preserves authored identity and progress; completion after restore pays once with no replay', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });

    jest.spyOn(Date, 'now').mockReturnValue(80000);
    await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    await store.dispatch(processCopyTasksThunk(20000));

    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'forge_assistance',
      durationSeconds: 60,
      progressSeconds: 20,
      status: 'running',
    });

    jest.restoreAllMocks();
    const resumedStore = await saveAndRestore(store, 81000);
    expect(resumedStore.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'forge_assistance',
      durationSeconds: 60,
      progressSeconds: 20,
      status: 'running',
    });

    const goldBeforeCompletion = resumedStore.getState().player.gold;
    await resumedStore.dispatch(processCopyTasksThunk(40000));
    expect(resumedStore.getState().player.gold).toBe(goldBeforeCompletion + 15);
    expect(resumedStore.getState().copy.copies['copy-001'].activeTask).toBeNull();

    jest.restoreAllMocks();
    const completedStore = await saveAndRestore(resumedStore, 82000);
    await completedStore.dispatch(processCopyTasksThunk(60000));
    expect(completedStore.getState().player.gold).toBe(goldBeforeCompletion + 15);
    expect(completedStore.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test('routine task completion leaves Relationship and Quest narrative authority unchanged', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'researcher',
      maturity: 80,
      loyalty: 90,
      activeTask: null,
    });

    const relationshipsBefore = JSON.parse(JSON.stringify(store.getState().relationships));
    const questBefore = JSON.parse(JSON.stringify(store.getState().quest));

    await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'resonance_calibration' })
    );
    await store.dispatch(processCopyTasksThunk(86000));

    expect(store.getState().relationships).toEqual(relationshipsBefore);
    expect(store.getState().quest).toEqual(questBefore);
  });

  test('player-facing Copy UI exposes authored routine jobs and removes arbitrary timer controls', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'guardian',
      maturity: 75,
      loyalty: 85,
      location: 'City Center',
      activeTask: null,
    });

    render(
      <Provider store={store}>
        <CopyDetailPanel copyId="copy-001" open onClose={() => undefined} />
      </Provider>
    );

    expect(screen.getByText('Production Delegation')).toBeInTheDocument();
    expect(screen.getByText('Forge Assistance')).toBeInTheDocument();
    expect(screen.getByText('Resonance Calibration')).toBeInTheDocument();
    expect(screen.getByText(/Narrative and irreversible decisions remain under player authority/)).toBeInTheDocument();
    expect(screen.queryByText('Start timed task:')).not.toBeInTheDocument();

    const assignButtons = screen.getAllByRole('button', { name: 'Assign' });
    expect(assignButtons).toHaveLength(2);
    expect(assignButtons[0]).toBeEnabled();
    expect(assignButtons[1]).toBeDisabled();

    fireEvent.click(assignButtons[0]);
    await waitFor(() => {
      expect(store.getState().copy.copies['copy-001'].activeTask?.productionTaskId).toBe('forge_assistance');
    });
    expect(await screen.findByText(/Forge Assistance.*0\/63s/)).toBeInTheDocument();
  });
});
