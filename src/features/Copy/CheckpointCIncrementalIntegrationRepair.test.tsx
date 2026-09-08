import fs from 'fs';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import GlobalNotificationHost from '../../shared/components/ui/GlobalNotificationHost';
import { loadTraits } from '../Traits/state/TraitsSlice';
import { acquireTraitWithEssenceThunk } from '../Traits/state/TraitThunks';
import { setLocation } from '../Player/state/PlayerSlice';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
} from '../Exploration/LocationDefinitions';
import TravelPanel from '../Exploration/components/TravelPanel';
import { practiceForgeAssistanceThunk } from '../Exploration/TravelThunks';
import { updateCopy } from './state/CopySlice';
import type { Copy } from './state/CopyTypes';
import {
  startCopyProductionTaskThunk,
} from './state/CopyThunks';
import CopyDetailPanel from './components/ui/CopyDetailPanel';
import { settleOfflineProgressThunk } from '../GameLoop/state/OfflineProgress';

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

const prepareCopy = (store: TestStore, updates: Partial<Copy>) => {
  store.dispatch(updateCopy({ copyId: 'copy-001', updates }));
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('Checkpoint C incremental integration repair qualification', () => {
  test('Forge delegation is rejected before active familiarity and City Center practice teaches it exactly once', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'guardian',
      maturity: 75,
      loyalty: 85,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });

    const before = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    expect(startCopyProductionTaskThunk.rejected.match(before)).toBe(true);
    expect(before.payload).toContain('Practice Forge Assistance yourself in the City Center first.');
    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    store.dispatch(setLocation(CITY_GATE_LOCATION_ID));
    const goldBefore = store.getState().player.gold;
    const outside = await store.dispatch(practiceForgeAssistanceThunk());
    expect(practiceForgeAssistanceThunk.rejected.match(outside)).toBe(true);
    expect(store.getState().player.routineFamiliarity?.forge_assistance).toBeUndefined();
    expect(store.getState().player.gold).toBe(goldBefore);

    store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
    jest.spyOn(Date, 'now').mockReturnValue(10_000);
    const learned = await store.dispatch(practiceForgeAssistanceThunk());
    expect(practiceForgeAssistanceThunk.fulfilled.match(learned)).toBe(true);
    expect(store.getState().player.routineFamiliarity?.forge_assistance).toEqual({
      source: 'city_center_forge_assistance',
      learnedAt: 10_000,
    });
    expect(store.getState().player.gold).toBe(goldBefore + 5);

    const repeat = await store.dispatch(practiceForgeAssistanceThunk());
    expect(practiceForgeAssistanceThunk.rejected.match(repeat)).toBe(true);
    expect(store.getState().player.gold).toBe(goldBefore + 5);

    const after = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    );
    expect(startCopyProductionTaskThunk.fulfilled.match(after)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask?.productionTaskId).toBe('forge_assistance');
  });

  test('successful active Trait Resonance teaches calibration while failed Resonance does not', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'researcher',
      maturity: 80,
      loyalty: 90,
      activeTask: null,
    });

    const before = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'resonance_calibration' })
    );
    expect(startCopyProductionTaskThunk.rejected.match(before)).toBe(true);
    expect(before.payload).toContain('Successfully Resonate a Trait yourself before delegating calibration.');

    const failed = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: 'missing_repair_trait', essenceCost: 0 })
    );
    expect(acquireTraitWithEssenceThunk.rejected.match(failed)).toBe(true);
    expect(store.getState().player.routineFamiliarity?.resonance_calibration).toBeUndefined();

    store.dispatch(loadTraits({
      repair_resonance_trait: {
        id: 'repair_resonance_trait',
        name: 'Repair Resonance Trait',
        description: 'A source-free qualification Trait for the repair probe.',
        category: 'utility',
        rarity: 'common',
        effects: {},
        essenceCost: 0,
      },
    }));

    jest.spyOn(Date, 'now').mockReturnValue(20_000);
    const resonated = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: 'repair_resonance_trait', essenceCost: 0 })
    );
    expect(acquireTraitWithEssenceThunk.fulfilled.match(resonated)).toBe(true);
    expect(store.getState().player.permanentTraits).toContain('repair_resonance_trait');
    expect(store.getState().player.routineFamiliarity?.resonance_calibration).toEqual({
      source: 'trait_resonance',
      learnedAt: 20_000,
    });

    const after = await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'resonance_calibration' })
    );
    expect(startCopyProductionTaskThunk.fulfilled.match(after)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask?.productionTaskId).toBe('resonance_calibration');
  });

  test('player-facing surfaces explain active learning and distinguish familiarity from Copy requirements', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'guardian',
      maturity: 75,
      loyalty: 85,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });

    render(
      <Provider store={store}>
        <TravelPanel />
      </Provider>
    );

    const practiceButton = screen.getByRole('button', { name: 'Practice Forge Assistance (+5 Gold)' });
    expect(practiceButton).toBeEnabled();
    fireEvent.click(practiceButton);

    await waitFor(() => {
      expect(store.getState().player.routineFamiliarity?.forge_assistance).toBeDefined();
    });
    expect(screen.getByRole('button', { name: 'Forge Assistance Learned' })).toBeDisabled();

    cleanup();
    render(
      <Provider store={store}>
        <CopyDetailPanel copyId="copy-001" open onClose={() => undefined} />
      </Provider>
    );

    expect(screen.getByText('Routine understood.')).toBeInTheDocument();
    expect(screen.getByText(/Locked: Successfully Resonate a Trait yourself/)).toBeInTheDocument();
    const assignButtons = screen.getAllByRole('button', { name: 'Assign' });
    expect(assignButtons[0]).toBeEnabled();
    expect(assignButtons[1]).toBeDisabled();
  });

  test('familiarity persists across save/load while an absent legacy-like field stays unfamiliar through offline time', async () => {
    const learnedStore = makeStore();
    jest.spyOn(Date, 'now').mockReturnValue(30_000);
    await learnedStore.dispatch(practiceForgeAssistanceThunk()).unwrap();
    const saveId = createSave(learnedStore.getState(), 'repair familiarity save');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));
    expect(resumedStore.getState().player.routineFamiliarity?.forge_assistance?.source)
      .toBe('city_center_forge_assistance');

    const legacyLikeState = JSON.parse(JSON.stringify(makeStore().getState()));
    delete legacyLikeState.player.routineFamiliarity;
    const legacyLikeStore = makeStore();
    legacyLikeStore.dispatch(replaceState(legacyLikeState));

    const settlement = await legacyLikeStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 40_000, resumeTimestamp: 50_000 })
    ).unwrap();
    expect(settlement.skipReason).toBeUndefined();
    expect(legacyLikeStore.getState().player.routineFamiliarity).toBeUndefined();
  });

  test('shared notification host renders and dismisses the Redux queue, and is mounted in production GameLayout', async () => {
    const store = makeStore();
    store.dispatch({
      type: 'notifications/addNotification',
      payload: {
        id: 'repair-notification',
        message: 'Repair notification visible',
        type: 'info',
        timestamp: 1,
      },
    });

    render(
      <Provider store={store}>
        <GlobalNotificationHost />
      </Provider>
    );

    expect(screen.getByTestId('global-notification')).toHaveTextContent('Repair notification visible');
    const closeButton = screen.getByTestId('global-notification').querySelector('button');
    expect(closeButton).not.toBeNull();
    fireEvent.click(closeButton!);
    await waitFor(() => {
      expect(store.getState().notifications.items).toHaveLength(0);
    });

    const gameLayoutSource = fs.readFileSync(
      path.join(process.cwd(), 'src/layout/components/GameLayout.tsx'),
      'utf8'
    );
    expect(gameLayoutSource).toContain("GlobalNotificationHost from '../../shared/components/ui/GlobalNotificationHost'");
    expect(gameLayoutSource).toContain('<GlobalNotificationHost />');
  });

  test('active Forge familiarity -> Copy delegation -> save -> M21 completion -> visible return summary forms one bounded loop', async () => {
    const store = makeStore();
    prepareCopy(store, {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    });

    const startingGold = store.getState().player.gold;
    jest.spyOn(Date, 'now').mockReturnValue(100_000);
    await store.dispatch(practiceForgeAssistanceThunk()).unwrap();
    expect(store.getState().player.gold).toBe(startingGold + 5);

    await store.dispatch(
      startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
    ).unwrap();
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'forge_assistance',
      durationSeconds: 60,
      progressSeconds: 0,
      status: 'running',
    });

    const relationshipsBefore = JSON.parse(JSON.stringify(store.getState().relationships));
    const questBefore = JSON.parse(JSON.stringify(store.getState().quest));
    const locationBefore = store.getState().player.location;

    jest.spyOn(Date, 'now').mockReturnValue(200_000);
    const saveId = createSave(store.getState(), 'repair combined loop');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded?.envelope.timestamp).toBe(200_000);

    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));
    expect(resumedStore.getState().player.routineFamiliarity?.forge_assistance).toBeDefined();

    const settled = await resumedStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 200_000, resumeTimestamp: 260_000 })
    ).unwrap();
    expect(settled.skipReason).toBeUndefined();
    expect(settled.tasks).toEqual([
      expect.objectContaining({
        productionTaskId: 'forge_assistance',
        taskName: 'Forge Assistance',
        completed: true,
        progressPercent: 100,
      }),
    ]);
    expect(resumedStore.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(resumedStore.getState().player.gold).toBe(startingGold + 5 + 15);
    expect(resumedStore.getState().relationships).toEqual(relationshipsBefore);
    expect(resumedStore.getState().quest).toEqual(questBefore);
    expect(resumedStore.getState().player.location).toBe(locationBefore);

    render(
      <Provider store={resumedStore}>
        <GlobalNotificationHost />
      </Provider>
    );
    expect(screen.getByTestId('global-notification')).toHaveTextContent('While you were away:');
    expect(screen.getByTestId('global-notification')).toHaveTextContent('completed Forge Assistance');

    const goldAfterSettlement = resumedStore.getState().player.gold;
    const replay = await resumedStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 200_000, resumeTimestamp: 320_000 })
    ).unwrap();
    expect(replay.skipReason).toBe('already_settled');
    expect(resumedStore.getState().player.gold).toBe(goldAfterSettlement);
  });
});
