import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer, replaceState } from '../../../app/store';
import { gameEventListeners } from '../../../app/listeners/GameEventListeners';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import {
  initializeNPCsThunk,
  processNPCInteractionThunk,
} from '../../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import { initializeQuestsThunk } from '../../Quest/state/QuestThunks';
import { recordAuthoredRelationshipExperienceThunk } from './RelationshipThunks';
import { createSave, loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';

const GRONK_ID = 'npc_blacksmith_gronk';
const SILAS_ID = 'npc_rogue_silas';
const VALERIUS_ID = 'npc_captain_valerius';
const COUNCIL_ID = 'valerius_m14_aftermath_council';
const REPAIR_ID = 'gronk_m14_repair_ledger';
const REROUTE_QUEST_ID = 'quest_m14_quiet_reroute';

const GRONK_HISTORY = [
  'gronk_exp_steel_not_flattery',
  'gronk_exp_measure_twice',
  'gronk_exp_quality_over_finish',
  'gronk_exp_blade_that_held',
];

const SILAS_HISTORY = [
  'silas_exp_price_of_truth',
  'silas_exp_package_unopened',
  'silas_exp_leverage_named',
  'silas_exp_secret_neither_sold',
  'silas_exp_watch_leak_shared',
  'silas_exp_watch_leak_traced',
];

const VALERIUS_HISTORY = [
  'valerius_exp_objective_before_obedience',
  'valerius_exp_report_without_theatre',
  'valerius_exp_order_questioned',
  'valerius_exp_merchant_leak_delegated',
  'valerius_exp_merchant_leak_broken',
];

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

const seedKnownHistory = async (
  store: ReturnType<typeof makeStore>,
  experienceIds: string[]
) => {
  for (const experienceId of experienceIds) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
};

const seedM14Prerequisites = async (store: ReturnType<typeof makeStore>) => {
  await seedKnownHistory(store, GRONK_HISTORY);
  await seedKnownHistory(store, SILAS_HISTORY);
  await seedKnownHistory(store, VALERIUS_HISTORY);
};

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

const clickTab = (name: string) => {
  fireEvent.click(screen.getByRole('tab', { name }));
};

const clickButton = async (name: string) => {
  fireEvent.click(await screen.findByRole('button', { name }));
};

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

describe('M14 one-shot dialogue decision repair', () => {
  test('authoring opts only the two M14 policy decisions into non-repeatable semantics', () => {
    expect(dialogues[COUNCIL_ID].repeatable).toBe(false);
    expect(dialogues[REPAIR_ID].repeatable).toBe(false);
    expect(dialogues.valerius_greeting.repeatable).toBeUndefined();

    const typeSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/NPCs/state/NPCTypes.ts'),
      'utf8'
    );
    expect(typeSource).toContain('repeatable?: boolean');

    for (const sourceFile of [
      'src/features/NPCs/state/NPCSlice.ts',
      'src/features/NPCs/state/NPCThunks.ts',
      'src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain(COUNCIL_ID);
      expect(source).not.toContain(REPAIR_ID);
      expect(source).not.toContain('npc_captain_valerius');
      expect(source).not.toContain('npc_blacksmith_gronk');
    }
  });

  test('council records one policy, disappears, persists, and rejects a different policy after load', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedM14Prerequisites(store);

    renderNpcRoute(store, VALERIUS_ID);
    clickTab('Dialogue');

    expect(await screen.findByText('The Cost of Closing the Leak')).toBeInTheDocument();
    await clickButton(
      'Close the compromised routes publicly. Arrest what we can see and accept the trade shock. The district needs visible control more than an elegant intelligence channel.'
    );

    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById
          .valerius_exp_aftermath_public_crackdown
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById
          .silas_exp_aftermath_public_crackdown
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById
          .gronk_exp_aftermath_public_crackdown
      ).toBeDefined();
      expect(store.getState().npcs.npcs[VALERIUS_ID].completedDialogues).toContain(
        COUNCIL_ID
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('The Cost of Closing the Leak')).not.toBeInTheDocument();
    });
    expect(store.getState().npcs.npcs[VALERIUS_ID].availableQuests).not.toContain(
      REROUTE_QUEST_ID
    );

    jest.spyOn(Date, 'now').mockReturnValue(31000);
    const saveId = createSave(store.getState(), 'M14 Council Decision Locked');
    expect(saveId).toBe('save_31000');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();
    expect(loaded!.state.npcs.npcs[VALERIUS_ID].completedDialogues).toContain(COUNCIL_ID);

    cleanup();
    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));
    renderNpcRoute(resumedStore, VALERIUS_ID);
    clickTab('Dialogue');
    expect(screen.queryByText('The Cost of Closing the Leak')).not.toBeInTheDocument();

    const bypass = await resumedStore.dispatch(
      processNPCInteractionThunk({
        npcId: VALERIUS_ID,
        interactionType: 'dialogue',
        context: { choiceId: COUNCIL_ID, selectedResponse: 'quiet_reroute' },
      })
    ).unwrap();
    expect(bypass.success).toBe(false);
    expect(bypass.message).toBe('Dialogue already completed.');

    expect(
      resumedStore.getState().relationships.experiencesById
        .valerius_exp_aftermath_quiet_reroute
    ).toBeUndefined();
    expect(
      resumedStore.getState().relationships.experiencesById
        .silas_exp_aftermath_quiet_reroute
    ).toBeUndefined();
    expect(
      resumedStore.getState().relationships.experiencesById
        .gronk_exp_aftermath_quiet_reroute
    ).toBeUndefined();
    expect(resumedStore.getState().npcs.npcs[VALERIUS_ID].availableQuests).not.toContain(
      REROUTE_QUEST_ID
    );
  });

  test('repair ledger records one outcome and rejects the mutually exclusive later response', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedKnownHistory(store, GRONK_HISTORY);
    await seedKnownHistory(store, VALERIUS_HISTORY);
    await seedKnownHistory(store, ['gronk_exp_quiet_reroute_proven']);

    renderNpcRoute(store, GRONK_ID);
    clickTab('Dialogue');
    expect(await screen.findByText('The Repair Ledger')).toBeInTheDocument();

    await clickButton(
      'Repair the load path first. If reopening takes longer, the Watch can explain why. I will not turn a known structural failure into a public-relations schedule.'
    );

    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.gronk_exp_repair_for_load
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById.valerius_exp_repair_for_load
      ).toBeDefined();
      expect(store.getState().npcs.npcs[GRONK_ID].completedDialogues).toContain(REPAIR_ID);
    });
    await waitFor(() => {
      expect(screen.queryByText('The Repair Ledger')).not.toBeInTheDocument();
    });

    const bypass = await store.dispatch(
      processNPCInteractionThunk({
        npcId: GRONK_ID,
        interactionType: 'dialogue',
        context: { choiceId: REPAIR_ID, selectedResponse: 'restore_visible_order' },
      })
    ).unwrap();
    expect(bypass.success).toBe(false);
    expect(bypass.message).toBe('Dialogue already completed.');
    expect(
      store.getState().relationships.experiencesById.gronk_exp_repair_for_show
    ).toBeUndefined();
    expect(
      store.getState().relationships.experiencesById.valerius_exp_repair_for_show
    ).toBeUndefined();
  });

  test('invalid one-shot responses do not consume the decision, while unannotated dialogue remains repeatable', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedM14Prerequisites(store);

    const invalid = await store.dispatch(
      processNPCInteractionThunk({
        npcId: VALERIUS_ID,
        interactionType: 'dialogue',
        context: { choiceId: COUNCIL_ID, selectedResponse: 'not_authored' },
      })
    ).unwrap();
    expect(invalid.success).toBe(false);
    expect(invalid.message).toBe('A valid response is required for this one-time decision.');
    expect(store.getState().npcs.npcs[VALERIUS_ID].completedDialogues).not.toContain(
      COUNCIL_ID
    );
    expect(
      store.getState().relationships.experiencesById
        .valerius_exp_aftermath_public_crackdown
    ).toBeUndefined();
    expect(
      store.getState().relationships.experiencesById
        .valerius_exp_aftermath_quiet_reroute
    ).toBeUndefined();

    for (let i = 0; i < 2; i += 1) {
      const result = await store.dispatch(
        processNPCInteractionThunk({
          npcId: VALERIUS_ID,
          interactionType: 'dialogue',
          context: { choiceId: 'valerius_greeting', selectedResponse: 'offer' },
        })
      ).unwrap();
      expect(result.success).toBe(true);
    }
    expect(store.getState().npcs.npcs[VALERIUS_ID].completedDialogues).not.toContain(
      'valerius_greeting'
    );
  });
});
