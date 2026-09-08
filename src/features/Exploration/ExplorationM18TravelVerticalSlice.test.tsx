import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { initializeQuestsThunk, startQuestThunk } from '../Quest/state/QuestThunks';
import { setLocation } from '../Player/state/PlayerSlice';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import TravelPanel from './components/TravelPanel';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
  EXPLORATION_LOCATIONS,
  MERCHANT_DISTRICT_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
  areLocationsDirectlyConnected,
  getConnectedLocationDefinitions,
  resolveCanonicalLocationId,
} from './LocationDefinitions';
import { travelToLocationThunk } from './TravelThunks';

const ELARA_TRAVEL_QUEST_ID = 'quest_elara_chain_1';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const quests = readJson('public/data/quests.json');

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(gameEventListeners.middleware),
  });

const initializeQuestRuntime = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
};

const renderTravel = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <TravelPanel />
    </Provider>
  );

const saveAndRestore = async (
  store: ReturnType<typeof makeStore>,
  now: number
): Promise<ReturnType<typeof makeStore>> => {
  jest.spyOn(Date, 'now').mockReturnValue(now);
  const saveId = createSave(store.getState(), 'M18 route save');
  expect(saveId).toBe(`save_${now}`);

  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();

  const resumedStore = makeStore();
  resumedStore.dispatch(replaceState(loaded!.state));
  return resumedStore;
};

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/quests.json') {
      return { ok: true, json: async () => quests } as any;
    }
    return { ok: false, statusText: `Unexpected test URL: ${url}` } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('M18 narrow exploration / travel vertical slice', () => {
  test('authored topology is bounded, reciprocal, and preserves Player as current-location authority', () => {
    expect(EXPLORATION_LOCATIONS).toHaveLength(4);
    expect(resolveCanonicalLocationId('City Center')).toBe(CITY_CENTER_LOCATION_ID);

    expect(areLocationsDirectlyConnected(CITY_CENTER_LOCATION_ID, MERCHANT_DISTRICT_LOCATION_ID)).toBe(true);
    expect(areLocationsDirectlyConnected(CITY_CENTER_LOCATION_ID, CITY_GATE_LOCATION_ID)).toBe(true);
    expect(areLocationsDirectlyConnected(CITY_GATE_LOCATION_ID, WHISPERING_WOODS_LOCATION_ID)).toBe(true);
    expect(areLocationsDirectlyConnected(CITY_CENTER_LOCATION_ID, WHISPERING_WOODS_LOCATION_ID)).toBe(false);

    for (const location of EXPLORATION_LOCATIONS) {
      for (const connectionId of location.connections) {
        expect(areLocationsDirectlyConnected(connectionId, location.id)).toBe(true);
      }
    }

    const store = makeStore();
    expect(store.getState().player.location).toBe(CITY_CENTER_LOCATION_ID);

    const storeSource = fs.readFileSync(path.join(process.cwd(), 'src/app/store.ts'), 'utf8');
    expect(storeSource).not.toMatch(/exploration\s*:/);
    expect(storeSource).not.toMatch(/world\s*:/);

    const travelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Exploration/TravelThunks.ts'),
      'utf8'
    );
    expect(travelSource).toContain('setLocation');
    expect(travelSource).not.toContain('REACH_LOCATION');
    expect(travelSource).not.toContain('updateObjectiveProgress');
    expect(travelSource).not.toContain('connectionDepth');

    const saveSchemaSource = fs.readFileSync(
      path.join(process.cwd(), 'src/shared/utils/saveSchema.ts'),
      'utf8'
    );
    expect(saveSchemaSource).not.toContain('location_city_center');
    expect(saveSchemaSource).not.toContain('M18');
  });

  test('two independent authored edges use the same generic travel contract', async () => {
    const merchantStore = makeStore();
    const merchantResult = await merchantStore.dispatch(
      travelToLocationThunk(MERCHANT_DISTRICT_LOCATION_ID)
    );
    expect(travelToLocationThunk.fulfilled.match(merchantResult)).toBe(true);
    expect(merchantStore.getState().player.location).toBe(MERCHANT_DISTRICT_LOCATION_ID);

    const gateStore = makeStore();
    const gateResult = await gateStore.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID));
    expect(travelToLocationThunk.fulfilled.match(gateResult)).toBe(true);
    expect(gateStore.getState().player.location).toBe(CITY_GATE_LOCATION_ID);
  });

  test('illegal direct jump is rejected below UI before Player or Quest mutation', async () => {
    const store = makeStore();
    await initializeQuestRuntime(store);
    await store.dispatch(startQuestThunk(ELARA_TRAVEL_QUEST_ID)).unwrap();

    expect(store.getState().player.location).toBe(CITY_CENTER_LOCATION_ID);
    expect(store.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].objectives[0].currentCount).toBe(0);

    const result = await store.dispatch(
      travelToLocationThunk(WHISPERING_WOODS_LOCATION_ID)
    );

    expect(travelToLocationThunk.rejected.match(result)).toBe(true);
    expect(result.payload).toContain('No direct travel route');
    expect(store.getState().player.location).toBe(CITY_CENTER_LOCATION_ID);
    expect(store.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].status).toBe('IN_PROGRESS');
    expect(store.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].objectives[0].currentCount).toBe(0);
  });

  test('player-facing travel follows adjacency and completes the existing Elara REACH_LOCATION objective', async () => {
    const store = makeStore();
    await initializeQuestRuntime(store);
    await store.dispatch(startQuestThunk(ELARA_TRAVEL_QUEST_ID)).unwrap();

    renderTravel(store);

    expect(screen.getByText('Current location: City Center')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Travel to Merchant District' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Travel to City Gate' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Travel to Whispering Woods' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Travel to City Gate' }));
    await waitFor(() => {
      expect(store.getState().player.location).toBe(CITY_GATE_LOCATION_ID);
    });

    expect(await screen.findByText('Current location: City Gate')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Travel to Whispering Woods' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Travel to Whispering Woods' }));

    await waitFor(() => {
      expect(store.getState().player.location).toBe(WHISPERING_WOODS_LOCATION_ID);
      expect(store.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });
    expect(store.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].objectives[0].currentCount).toBe(1);
    expect(store.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].objectives[0].isComplete).toBe(true);
  });

  test('save/load preserves canonical intermediate location and legal travel continues afterward', async () => {
    const store = makeStore();
    await initializeQuestRuntime(store);
    await store.dispatch(startQuestThunk(ELARA_TRAVEL_QUEST_ID)).unwrap();
    await store.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID)).unwrap();

    expect(store.getState().player.location).toBe(CITY_GATE_LOCATION_ID);
    const resumedStore = await saveAndRestore(store, 71000);
    expect(resumedStore.getState().player.location).toBe(CITY_GATE_LOCATION_ID);
    expect(resumedStore.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].status).toBe('IN_PROGRESS');

    await resumedStore.dispatch(
      travelToLocationThunk(WHISPERING_WOODS_LOCATION_ID)
    ).unwrap();

    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[ELARA_TRAVEL_QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });
    expect(resumedStore.getState().player.location).toBe(WHISPERING_WOODS_LOCATION_ID);
  });

  test('legacy City Center saves resolve for routing and canonicalize on the next legal travel', async () => {
    const store = makeStore();
    store.dispatch(setLocation('City Center'));

    expect(resolveCanonicalLocationId(store.getState().player.location)).toBe(CITY_CENTER_LOCATION_ID);
    expect(
      getConnectedLocationDefinitions(store.getState().player.location).map(location => location.id)
    ).toEqual([MERCHANT_DISTRICT_LOCATION_ID, CITY_GATE_LOCATION_ID]);

    renderTravel(store);
    expect(screen.getByText('Current location: City Center')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Travel to City Gate' }));

    await waitFor(() => {
      expect(store.getState().player.location).toBe(CITY_GATE_LOCATION_ID);
    });
  });
});
