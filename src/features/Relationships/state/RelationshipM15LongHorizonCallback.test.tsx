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
import { setLocation } from '../../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from './RelationshipThunks';
import { selectBondProfileByNpcId } from './RelationshipSelectors';
import { createSave, loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';

const WILLOW_ID = 'npc_elder_willow';
const GRONK_ID = 'npc_blacksmith_gronk';
const SILAS_ID = 'npc_rogue_silas';
const VALERIUS_ID = 'npc_captain_valerius';

const COUNCIL_ID = 'valerius_m14_aftermath_council';
const INQUIRY_ID = 'valerius_m15_forged_ledger_inquiry';
const FALLBACK_ID = 'silas_m15_brokers_price';
const REINFORCED_ID = 'silas_m15_debt_still_counts';
const CONTRADICTED_ID = 'silas_m15_debt_not_renewed';
const DEFAULT_QUEST_ID = 'quest_m15_verify_forged_ledger';
const HIDDEN_QUEST_ID = 'quest_m15_follow_hidden_chain';
const SILAS_MEMORY_ID = 'silas_memory_secret_neither_sold';

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
const silasBundle = readJson('public/data/relationships/silas.json');
const valeriusBundle = readJson('public/data/relationships/valerius.json');

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
  // M12-M14 independently qualified these routes. M15 uses them only as
  // historical setup; every new M15 Experience is produced through normal UI.
  for (const experienceId of experienceIds) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
};

const seedM14CouncilPrerequisites = async (store: ReturnType<typeof makeStore>) => {
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

const performUnrelatedWillowBeat = async (store: ReturnType<typeof makeStore>) => {
  cleanup();
  renderNpcRoute(store, WILLOW_ID);
  clickTab('Dialogue');
  await clickButton('Knowledge that cannot alter action is decoration.');
  await waitFor(() => {
    expect(
      store.getState().relationships.experiencesById.willow_exp_first_question_admit
    ).toBeDefined();
  });
};

const performValeriusInquiry = async (store: ReturnType<typeof makeStore>) => {
  cleanup();
  renderNpcRoute(store, VALERIUS_ID);
  clickTab('Dialogue');
  expect(await screen.findByText('The Ledger That Should Not Exist')).toBeInTheDocument();
  await clickButton(
    'Treat the ledger as evidence, not verdict. Give me the chain and I will test where the true facts become a false transaction.'
  );
  await waitFor(() => {
    expect(
      store.getState().relationships.experiencesById.valerius_exp_forged_ledger_inquiry
    ).toBeDefined();
    expect(store.getState().npcs.npcs[VALERIUS_ID].availableQuests).toContain(
      DEFAULT_QUEST_ID
    );
  });
};

const saveAndRestore = async (
  store: ReturnType<typeof makeStore>,
  now: number,
  name: string
) => {
  jest.spyOn(Date, 'now').mockReturnValue(now);
  const saveId = createSave(store.getState(), name);
  expect(saveId).toBe(`save_${now}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();
  cleanup();
  const resumedStore = makeStore();
  resumedStore.dispatch(replaceState(loaded!.state));
  return resumedStore;
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

describe('M15 long-horizon Relationship callbacks', () => {
  test('production authoring composes positive evidence and the repaired M14 decision remains exclusive', async () => {
    expect(dialogues[COUNCIL_ID].repeatable).toBe(false);

    const inquiry = dialogues[INQUIRY_ID];
    expect(npcs[VALERIUS_ID].availableDialogues).toContain(INQUIRY_ID);
    expect(inquiry.repeatable).toBe(false);
    expect(inquiry.requiredExperienceIds).toEqual(['valerius_exp_merchant_leak_broken']);

    const reinforced = dialogues[REINFORCED_ID];
    expect(npcs[SILAS_ID].availableDialogues).toContain(REINFORCED_ID);
    expect(reinforced.requiredExperienceIds).toEqual([
      'valerius_exp_forged_ledger_inquiry',
      'silas_exp_secret_neither_sold',
    ]);
    expect(reinforced.anyOfExperienceIds).toEqual([
      'silas_exp_aftermath_protect_source',
      'silas_exp_aftermath_quiet_reroute',
    ]);

    const contradicted = dialogues[CONTRADICTED_ID];
    expect(contradicted.requiredExperienceIds).toEqual([
      'valerius_exp_forged_ledger_inquiry',
      'silas_exp_secret_neither_sold',
      'silas_exp_aftermath_public_crackdown',
    ]);

    expect(dialogues[FALLBACK_ID].requiredExperienceIds).toEqual([
      'valerius_exp_forged_ledger_inquiry',
    ]);

    const hiddenQuest = quests[HIDDEN_QUEST_ID];
    expect(hiddenQuest.giver).toBe(SILAS_ID);
    expect(hiddenQuest.objectives[0].type).toBe('REACH_LOCATION');
    expect(hiddenQuest.objectives[0].target).toBe('location_merchant_district');
    expect(hiddenQuest.resolutionOptions).toHaveLength(1);
    expect(hiddenQuest.resolutionOptions[0].relationshipExperienceId).toBe(
      'silas_exp_hidden_chain_verified'
    );

    expect(silasBundle.memories[SILAS_MEMORY_ID].originExperienceId).toBe(
      'silas_exp_secret_neither_sold'
    );
    expect(Object.keys(silasBundle.memories)).toEqual([SILAS_MEMORY_ID]);
    expect(valeriusBundle.experiences.valerius_exp_forged_ledger_inquiry).toBeDefined();

    const dialogueJson = JSON.stringify(dialogues);
    expect(dialogueJson).not.toContain('excludedExperienceIds');
    expect(dialogueJson).not.toContain('forbiddenMemoryIds');
    expect(dialogueJson).not.toContain('conditionExpression');

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/NPCs/state/NPCThunks.ts',
      'src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx',
      'src/features/Quest/state/QuestThunks.ts',
      'src/app/listeners/GameEventListeners.ts',
      'src/shared/utils/saveSchema.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain('m15');
      expect(source).not.toContain(INQUIRY_ID);
      expect(source).not.toContain(REINFORCED_ID);
      expect(source).not.toContain(CONTRADICTED_ID);
      expect(source).not.toContain(HIDDEN_QUEST_ID);
    }

    const prerequisiteStore = makeStore();
    await initializeProductionRuntime(prerequisiteStore);
    await seedM14CouncilPrerequisites(prerequisiteStore);
    const first = await prerequisiteStore.dispatch(
      processNPCInteractionThunk({
        npcId: VALERIUS_ID,
        interactionType: 'dialogue',
        context: { choiceId: COUNCIL_ID, selectedResponse: 'public_crackdown' },
      })
    ).unwrap();
    expect(first.success).toBe(true);
    const second = await prerequisiteStore.dispatch(
      processNPCInteractionThunk({
        npcId: VALERIUS_ID,
        interactionType: 'dialogue',
        context: { choiceId: COUNCIL_ID, selectedResponse: 'quiet_reroute' },
      })
    ).unwrap();
    expect(second.success).toBe(false);
    expect(second.message).toBe('Dialogue already completed.');
    expect(
      prerequisiteStore.getState().relationships.experiencesById
        .silas_exp_aftermath_quiet_reroute
    ).toBeUndefined();
  });

  test('control history reaches the crisis but cannot invoke a privileged Silas callback', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedKnownHistory(store, VALERIUS_HISTORY);

    await performUnrelatedWillowBeat(store);
    await performValeriusInquiry(store);

    const resumedStore = await saveAndRestore(store, 41000, 'M15 Control Before Callback');
    expect(
      resumedStore.getState().relationships.experiencesById.willow_exp_first_question_admit
    ).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.valerius_exp_forged_ledger_inquiry
    ).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.silas_exp_secret_neither_sold
    ).toBeUndefined();

    renderNpcRoute(resumedStore, SILAS_ID);
    clickTab('Dialogue');
    expect(await screen.findByText("A Broker's Price")).toBeInTheDocument();
    expect(screen.queryByText('A Debt He Still Counts')).not.toBeInTheDocument();
    expect(screen.queryByText('A Debt Remembered, Not Renewed')).not.toBeInTheDocument();

    const bypass = await resumedStore.dispatch(
      processNPCInteractionThunk({
        npcId: SILAS_ID,
        interactionType: 'dialogue',
        context: { choiceId: REINFORCED_ID, selectedResponse: 'risk_chain' },
      })
    ).unwrap();
    expect(bypass.success).toBe(false);
    expect(bypass.message).toContain('Missing relationship evidence');
    expect(resumedStore.getState().npcs.npcs[SILAS_ID].availableQuests).not.toContain(
      HIDDEN_QUEST_ID
    );
    expect(resumedStore.getState().npcs.npcs[VALERIUS_ID].availableQuests).toContain(
      DEFAULT_QUEST_ID
    );
  });

  test('reinforced old history survives unrelated content and save/load, then unlocks a privileged gameplay route', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedKnownHistory(store, SILAS_HISTORY);
    await seedKnownHistory(store, VALERIUS_HISTORY);
    await seedKnownHistory(store, ['silas_exp_aftermath_quiet_reroute']);

    expect(store.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();
    await performUnrelatedWillowBeat(store);
    await performValeriusInquiry(store);

    const resumedStore = await saveAndRestore(store, 42000, 'M15 Reinforced Before Callback');
    expect(resumedStore.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.silas_exp_aftermath_quiet_reroute
    ).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.willow_exp_first_question_admit
    ).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.valerius_exp_forged_ledger_inquiry
    ).toBeDefined();

    renderNpcRoute(resumedStore, SILAS_ID);
    clickTab('Dialogue');
    expect(await screen.findByText("A Broker's Price")).toBeInTheDocument();
    expect(await screen.findByText('A Debt He Still Counts')).toBeInTheDocument();
    expect(screen.queryByText('A Debt Remembered, Not Renewed')).not.toBeInTheDocument();

    await clickButton(
      'You are risking a live chain. I will verify it without spending it carelessly.'
    );
    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById.silas_exp_old_silence_repaid
      ).toBeDefined();
      expect(resumedStore.getState().npcs.npcs[SILAS_ID].availableQuests).toContain(
        HIDDEN_QUEST_ID
      );
    });
    expect(resumedStore.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();

    clickTab('Quests');
    fireEvent.click(await screen.findByText('Follow the Hidden Chain'));
    await clickButton('Accept Quest');
    expect(resumedStore.getState().quest.quests[HIDDEN_QUEST_ID].status).toBe('IN_PROGRESS');

    resumedStore.dispatch(setLocation('location_whispering_woods'));
    resumedStore.dispatch(setLocation('location_merchant_district'));
    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[HIDDEN_QUEST_ID].status).toBe(
        'READY_TO_COMPLETE'
      );
    });

    await clickButton('Choose Verify the Hidden Chain Without Burning It');
    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById.silas_exp_hidden_chain_verified
      ).toBeDefined();
    });
    expect(resumedStore.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();
  });

  test('contradictory later history preserves the old Memory but limits trust and future access', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedKnownHistory(store, SILAS_HISTORY);
    await seedKnownHistory(store, VALERIUS_HISTORY);
    await seedKnownHistory(store, ['silas_exp_aftermath_public_crackdown']);

    expect(store.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();
    await performUnrelatedWillowBeat(store);
    await performValeriusInquiry(store);

    const resumedStore = await saveAndRestore(store, 43000, 'M15 Contradicted Before Callback');
    expect(resumedStore.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.silas_exp_aftermath_public_crackdown
    ).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.willow_exp_first_question_admit
    ).toBeDefined();

    const before = selectBondProfileByNpcId(resumedStore.getState(), SILAS_ID);

    renderNpcRoute(resumedStore, SILAS_ID);
    clickTab('Dialogue');
    expect(await screen.findByText("A Broker's Price")).toBeInTheDocument();
    expect(await screen.findByText('A Debt Remembered, Not Renewed')).toBeInTheDocument();
    expect(screen.queryByText('A Debt He Still Counts')).not.toBeInTheDocument();

    await clickButton('Fair. Confirm what is true. Keep the live names.');
    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById
          .silas_exp_old_silence_reinterpreted
      ).toBeDefined();
    });

    const after = selectBondProfileByNpcId(resumedStore.getState(), SILAS_ID);
    expect(after.dimensions.trust).toBe(before.dimensions.trust - 1);
    expect(after.dimensions.understanding).toBe(before.dimensions.understanding + 6);
    expect(after.dimensions.sharedMeaning).toBe(before.dimensions.sharedMeaning + 4);
    expect(after.dimensions.reliance).toBe(before.dimensions.reliance - 2);
    expect(resumedStore.getState().npcs.npcs[SILAS_ID].availableQuests).not.toContain(
      HIDDEN_QUEST_ID
    );
    expect(resumedStore.getState().npcs.npcs[VALERIUS_ID].availableQuests).toContain(
      DEFAULT_QUEST_ID
    );
    expect(resumedStore.getState().relationships.memoriesById[SILAS_MEMORY_ID]).toBeDefined();
    expect(
      resumedStore.getState().relationships.experiencesById.silas_exp_aftermath_public_crackdown
    ).toBeDefined();
  });
});
