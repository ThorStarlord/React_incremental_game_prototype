import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import ActiveQuestCombatPanel from '../Combat/components/ActiveQuestCombatPanel';
import { TELLURIC_ECHO_ENCOUNTER } from '../Combat/CombatEncounterDefinitions';
import { getCombatEncounterLocationAvailability } from '../Combat/CombatEncounterAvailability';
import NPCPanelContainer from '../NPCs/components/containers/NPCPanelContainer';
import { initializeNPCsThunk } from '../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../NPCs/state/NPCSlice';
import {
  getNpcWorldLocationId,
  isPlayerAtNpcWorldLocation,
} from '../NPCs/state/NPCWorldLocationDefinitions';
import { initializeQuestsThunk, startQuestThunk } from '../Quest/state/QuestThunks';
import { setLocation } from '../Player/state/PlayerSlice';
import {
  deriveSpatialRelationshipTether,
  selectBondProfileByNpcId,
} from '../Relationships/state/RelationshipSelectors';
import TravelPanel from './components/TravelPanel';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
} from './LocationDefinitions';

const WILLOW_ID = 'npc_elder_willow';
const GRONK_ID = 'npc_blacksmith_gronk';
const ELARA_ID = 'npc_scholar_elara';
const M17_QUEST_ID = 'quest_m17_telluric_echo';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(gameEventListeners.middleware),
  });

const initializeProductionRuntime = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
};

const renderActiveCombat = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <ActiveQuestCombatPanel />
    </Provider>
  );

const renderNpcRoute = (store: ReturnType<typeof makeStore>, npcId: string) => {
  store.dispatch(setSelectedNPCId(npcId));
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/game/npcs/${npcId}`]}>
        <Routes>
          <Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

const renderTravel = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <TravelPanel />
    </Provider>
  );

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') {
      return { ok: true, json: async () => npcs } as any;
    }
    if (url === '/data/dialogues.json') {
      return { ok: true, json: async () => dialogues } as any;
    }
    if (url === '/data/quests.json') {
      return { ok: true, json: async () => quests } as any;
    }
    if (url === '/data/relationships/index.json') {
      return { ok: true, json: async () => manifest } as any;
    }
    if (bundleByUrl[url]) {
      return { ok: true, json: async () => bundleByUrl[url] } as any;
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

describe('Checkpoint B bounded active-loop integration repair', () => {
  test('the M17 encounter consumes canonical world presence before the production combat bridge is exposed', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await store.dispatch(startQuestThunk(M17_QUEST_ID)).unwrap();

    expect(store.getState().player.location).toBe(CITY_CENTER_LOCATION_ID);
    expect(TELLURIC_ECHO_ENCOUNTER.requiredLocationId).toBe(WHISPERING_WOODS_LOCATION_ID);
    expect(
      getCombatEncounterLocationAvailability(
        TELLURIC_ECHO_ENCOUNTER,
        store.getState().player.location
      ).available
    ).toBe(false);

    renderActiveCombat(store);
    expect(await screen.findByText('Encounter Location')).toBeInTheDocument();
    expect(screen.getByText(/Travel there before beginning this encounter/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Begin Encounter' })).not.toBeInTheDocument();
    expect(store.getState().quest.quests[M17_QUEST_ID].objectives[0].currentCount).toBe(0);

    store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));

    expect(
      await screen.findByRole('button', { name: 'Begin Encounter' })
    ).toBeInTheDocument();
    expect(
      getCombatEncounterLocationAvailability(
        TELLURIC_ECHO_ENCOUNTER,
        store.getState().player.location
      ).available
    ).toBe(true);
    expect(store.getState().quest.quests[M17_QUEST_ID].objectives[0].currentCount).toBe(0);
  });

  test('Willow and Gronk share one anchored-NPC presence rule while remote relationship inspection remains available', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);

    expect(getNpcWorldLocationId(WILLOW_ID)).toBe(WHISPERING_WOODS_LOCATION_ID);
    expect(getNpcWorldLocationId(GRONK_ID)).toBe(CITY_CENTER_LOCATION_ID);
    expect(isPlayerAtNpcWorldLocation(WILLOW_ID, CITY_CENTER_LOCATION_ID)).toBe(false);
    expect(isPlayerAtNpcWorldLocation(GRONK_ID, CITY_CENTER_LOCATION_ID)).toBe(true);
    expect(isPlayerAtNpcWorldLocation(ELARA_ID, CITY_CENTER_LOCATION_ID)).toBeUndefined();

    renderNpcRoute(store, WILLOW_ID);
    expect(await screen.findByText('Elder Willow')).toBeInTheDocument();
    expect(screen.getByText(/Current presence: remote from Elder Willow/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Copy' })).toBeDisabled();

    fireEvent.click(screen.getByRole('tab', { name: 'Relationship' }));
    expect(await screen.findByText('Connection with Elder Willow')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Dialogue' }));
    expect(await screen.findByTestId(`npc-presence-gate-${WILLOW_ID}`)).toBeInTheDocument();
    expect(screen.queryByText('Conversation with Elder Willow')).not.toBeInTheDocument();

    store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
    expect(await screen.findByText('Conversation with Elder Willow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Copy' })).toBeEnabled();

    cleanup();
    store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
    renderNpcRoute(store, GRONK_ID);
    fireEvent.click(screen.getByRole('tab', { name: 'Dialogue' }));
    expect(await screen.findByText('Conversation with Blacksmith Gronk')).toBeInTheDocument();

    const listSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/NPCs/components/containers/NPCListView.tsx'),
      'utf8'
    );
    expect(listSource).toContain('isPlayerAtNpcWorldLocation');
    expect(listSource).toContain('anchoredPresence ?? npc.location === playerLocation');
  });

  test('successful travel immediately explains Willow/Gronk Tether opportunity cost without mutating Bond history', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);

    const willowBefore = selectBondProfileByNpcId(store.getState(), WILLOW_ID);
    const gronkBefore = selectBondProfileByNpcId(store.getState(), GRONK_ID);

    expect(deriveSpatialRelationshipTether(WILLOW_ID, CITY_CENTER_LOCATION_ID)?.tetherState).toBe('remote');
    expect(deriveSpatialRelationshipTether(GRONK_ID, CITY_CENTER_LOCATION_ID)?.tetherState).toBe('present');
    expect(deriveSpatialRelationshipTether(WILLOW_ID, CITY_GATE_LOCATION_ID)?.tetherState).toBe('nearby');
    expect(deriveSpatialRelationshipTether(GRONK_ID, CITY_GATE_LOCATION_ID)?.tetherState).toBe('nearby');

    renderTravel(store);
    fireEvent.click(screen.getByRole('button', { name: 'Travel to City Gate' }));

    await waitFor(() => {
      expect(store.getState().player.location).toBe(CITY_GATE_LOCATION_ID);
    });

    const feedback = await screen.findByTestId('travel-spatial-feedback');
    expect(feedback).toHaveTextContent('Elder Willow — Tether: Remote → Nearby');
    expect(feedback).toHaveTextContent('Blacksmith Gronk — Tether: Present → Nearby');
    expect(feedback).toHaveTextContent(
      'Movement changed current presence/Tether, not Relationship history.'
    );

    expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID)).toEqual(willowBefore);
    expect(selectBondProfileByNpcId(store.getState(), GRONK_ID)).toEqual(gronkBefore);
  });

  test('the repair remains bounded and introduces no generalized world/presence condition engine', () => {
    for (const sourceFile of [
      'src/features/Combat/CombatEncounterAvailability.ts',
      'src/features/Combat/components/ActiveQuestCombatPanel.tsx',
      'src/features/NPCs/state/NPCWorldLocationDefinitions.ts',
      'src/features/NPCs/components/containers/NPCPanelContainer.tsx',
      'src/features/Exploration/components/TravelPanel.tsx',
      'src/features/Relationships/state/RelationshipSelectors.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain('conditionExpression');
      expect(source).not.toContain('pathfinding');
      expect(source).not.toContain('npcSchedule');
      expect(source).not.toContain('worldStateReducer');
      expect(source).not.toContain('nearWillow');
      expect(source).not.toContain('gronkPresent');
    }

    const relationshipSliceSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Relationships/state/RelationshipSlice.ts'),
      'utf8'
    );
    const saveSchemaSource = fs.readFileSync(
      path.join(process.cwd(), 'src/shared/utils/saveSchema.ts'),
      'utf8'
    );
    expect(relationshipSliceSource).not.toContain('worldLocation');
    expect(saveSchemaSource).not.toContain('requiredLocationId');
    expect(saveSchemaSource).not.toContain('worldDerivedTether');
  });
});
