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
import { initializeNPCsThunk } from '../../NPCs/state/NPCThunks';
import { addAvailableQuestToNPC, setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import {
  initializeQuestsThunk,
  resolveQuestOutcomeThunk,
  startQuestThunk,
} from './QuestThunks';
import { canUseQuestResolution } from './QuestResolutionAvailability';
import { addPermanentTrait, setLocation } from '../../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../../Relationships/state/RelationshipThunks';
import { createSave, loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';

const WILLOW_ID = 'npc_elder_willow';
const ELARA_ID = 'npc_scholar_elara';
const WISDOM_ID = 'WillowsWisdom';
const INSIGHT_ID = 'ScholarlyInsight';
const GROVE_QUEST_ID = 'quest_m16_withering_grove';
const INVENTORY_QUEST_ID = 'quest_m16_impossible_inventory';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');
const m16Bundle = readJson('public/data/relationships/m16-gameplay.json');

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

const makeQuestReady = async (
  store: ReturnType<typeof makeStore>,
  npcId: string,
  questId: string,
  destination: string
) => {
  store.dispatch(addAvailableQuestToNPC({ npcId, questId }));
  await store.dispatch(startQuestThunk(questId)).unwrap();
  store.dispatch(setLocation(destination));
  await waitFor(() => {
    expect(store.getState().quest.quests[questId].status).toBe('READY_TO_COMPLETE');
  });
};

const seedHistoricalRelationshipEvidence = async (
  store: ReturnType<typeof makeStore>,
  experienceIds: string[]
) => {
  // These Experiences were independently qualified before M16. They are historical
  // setup only; every new M16 consequence is produced through ordinary quest UI.
  for (const experienceId of experienceIds) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
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

describe('M16 Trait-driven gameplay', () => {
  test('production authoring proves the Rule of Two and keeps the generic gate capability-only', () => {
    const grove = quests[GROVE_QUEST_ID];
    const inventory = quests[INVENTORY_QUEST_ID];

    expect(grove.prerequisites).toEqual([
      { type: 'QUEST_COMPLETED', value: 'quest_willow_ancient_seed' },
    ]);
    expect(inventory.prerequisites).toEqual([
      { type: 'QUEST_COMPLETED', value: 'quest_elara_lost_tome' },
    ]);

    const groveOrdinary = grove.resolutionOptions.find((option: any) => option.id === 'remove_corrupted_roots');
    const groveWisdom = grove.resolutionOptions.find((option: any) => option.id === 'restore_underlying_flow');
    const inventoryOrdinary = inventory.resolutionOptions.find((option: any) => option.id === 'accept_plausible_inventory');
    const inventoryInsight = inventory.resolutionOptions.find((option: any) => option.id === 'reopen_inventory_model');

    expect(groveOrdinary.requiredPermanentTraitIds).toBeUndefined();
    expect(groveWisdom.requiredPermanentTraitIds).toEqual([WISDOM_ID]);
    expect(inventoryOrdinary.requiredPermanentTraitIds).toBeUndefined();
    expect(inventoryInsight.requiredPermanentTraitIds).toEqual([INSIGHT_ID]);

    expect(canUseQuestResolution(groveWisdom, [])).toBe(false);
    expect(canUseQuestResolution(groveWisdom, [WISDOM_ID])).toBe(true);
    expect(
      canUseQuestResolution(
        { ...groveWisdom, requiredPermanentTraitIds: [WISDOM_ID, INSIGHT_ID] },
        [WISDOM_ID]
      )
    ).toBe(false);

    expect(manifest.bundles).toContain('/data/relationships/m16-gameplay.json');
    expect(m16Bundle.experiences.willow_exp_grove_saved_by_cutting).toBeDefined();
    expect(m16Bundle.experiences.willow_exp_wisdom_used_in_world).toBeDefined();
    expect(m16Bundle.experiences.elara_exp_inventory_plausible_model).toBeDefined();
    expect(m16Bundle.experiences.elara_exp_insight_reopens_inventory).toBeDefined();
    expect(Object.keys(m16Bundle.memories)).toHaveLength(0);

    const questJson = JSON.stringify(quests);
    expect(questJson).not.toContain('forbiddenTraitIds');
    expect(questJson).not.toContain('anyOfTraitIds');
    expect(questJson).not.toContain('conditionExpression');

    for (const sourceFile of [
      'src/features/Quest/state/QuestResolutionAvailability.ts',
      'src/features/Quest/state/QuestThunks.ts',
      'src/features/NPCs/components/ui/tabs/NPCQuestsTab.tsx',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/shared/utils/saveSchema.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain(GROVE_QUEST_ID);
      expect(source).not.toContain(INVENTORY_QUEST_ID);
      expect(source).not.toContain(WILLOW_ID);
      expect(source).not.toContain(ELARA_ID);
      expect(source).not.toContain(WISDOM_ID);
      expect(source).not.toContain(INSIGHT_ID);
    }
  });

  test('no-Trait control can solve the grove normally but cannot see or invoke the Wisdom route', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await makeQuestReady(store, WILLOW_ID, GROVE_QUEST_ID, 'location_whispering_woods');

    renderNpcRoute(store, WILLOW_ID);
    clickTab('Quests');
    fireEvent.click(await screen.findByText('The Withering Grove'));

    expect(await screen.findByRole('button', { name: 'Choose Remove the Corrupted Roots' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Choose Restore the Underlying Flow' })).not.toBeInTheDocument();

    const bypass = await store.dispatch(
      resolveQuestOutcomeThunk({
        questId: GROVE_QUEST_ID,
        resolutionId: 'restore_underlying_flow',
      })
    );
    expect(resolveQuestOutcomeThunk.rejected.match(bypass)).toBe(true);
    expect(String(bypass.payload)).toContain(WISDOM_ID);
    expect(store.getState().quest.quests[GROVE_QUEST_ID].selectedResolutionId).toBeUndefined();
    expect(
      store.getState().relationships.experiencesById.willow_exp_wisdom_used_in_world
    ).toBeUndefined();

    await clickButton('Choose Remove the Corrupted Roots');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.willow_exp_grove_saved_by_cutting
      ).toBeDefined();
    });
    expect(store.getState().quest.quests[GROVE_QUEST_ID].selectedResolutionId).toBe(
      'remove_corrupted_roots'
    );
    expect(
      store.getState().relationships.experiencesById.willow_exp_wisdom_used_in_world
    ).toBeUndefined();
  });

  test('permanent Willow Wisdom survives save/load and exposes a distinct production resolution', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);

    // Permanent Trait acquisition itself was independently qualified before M16.
    store.dispatch(addPermanentTrait(WISDOM_ID));
    await makeQuestReady(store, WILLOW_ID, GROVE_QUEST_ID, 'location_whispering_woods');

    const resumedStore = await saveAndRestore(store, 51000, 'M16 Wisdom Before Grove Resolution');
    expect(resumedStore.getState().player.permanentTraits).toContain(WISDOM_ID);
    expect(resumedStore.getState().quest.quests[GROVE_QUEST_ID].status).toBe('READY_TO_COMPLETE');

    renderNpcRoute(resumedStore, WILLOW_ID);
    clickTab('Quests');
    fireEvent.click(await screen.findByText('The Withering Grove'));

    expect(await screen.findByRole('button', { name: 'Choose Remove the Corrupted Roots' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Choose Restore the Underlying Flow' })).toBeInTheDocument();

    await clickButton('Choose Restore the Underlying Flow');
    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById.willow_exp_wisdom_used_in_world
      ).toBeDefined();
    });
    expect(resumedStore.getState().quest.quests[GROVE_QUEST_ID].selectedResolutionId).toBe(
      'restore_underlying_flow'
    );
    expect(
      resumedStore.getState().relationships.experiencesById.willow_exp_grove_saved_by_cutting
    ).toBeUndefined();
    expect(resumedStore.getState().player.permanentTraits).toContain(WISDOM_ID);
  });

  test('strong Willow relationship evidence without permanent Trait does not become gameplay capability', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);

    await seedHistoricalRelationshipEvidence(store, [
      'willow_exp_first_question_admit',
      'willow_exp_first_lesson',
      'willow_exp_seed_offered',
      'willow_exp_sunstone_decision_preserve',
      'willow_exp_willow_disagrees',
      'willow_exp_three_nights_teaching',
      'willow_exp_independent_application',
    ]);

    expect(store.getState().relationships.memoriesById.willow_memory_lesson_made_yours).toBeDefined();
    expect(store.getState().player.permanentTraits).not.toContain(WISDOM_ID);

    await makeQuestReady(store, WILLOW_ID, GROVE_QUEST_ID, 'location_whispering_woods');
    renderNpcRoute(store, WILLOW_ID);
    clickTab('Quests');
    fireEvent.click(await screen.findByText('The Withering Grove'));

    expect(await screen.findByRole('button', { name: 'Choose Remove the Corrupted Roots' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Choose Restore the Underlying Flow' })).not.toBeInTheDocument();

    const bypass = await store.dispatch(
      resolveQuestOutcomeThunk({
        questId: GROVE_QUEST_ID,
        resolutionId: 'restore_underlying_flow',
      })
    );
    expect(resolveQuestOutcomeThunk.rejected.match(bypass)).toBe(true);
    expect(String(bypass.payload)).toContain(WISDOM_ID);
  });

  test('independent Scholarly Insight probe exercises the same generic permanent-Trait gate', async () => {
    const controlStore = makeStore();
    await initializeProductionRuntime(controlStore);
    await makeQuestReady(controlStore, ELARA_ID, INVENTORY_QUEST_ID, 'location_merchant_district');

    renderNpcRoute(controlStore, ELARA_ID);
    clickTab('Quests');
    fireEvent.click(await screen.findByText('The Impossible Inventory'));
    expect(await screen.findByRole('button', { name: 'Choose Accept the Most Plausible Inventory' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Choose Reopen the Model Around the Contradiction' })).not.toBeInTheDocument();

    const bypass = await controlStore.dispatch(
      resolveQuestOutcomeThunk({
        questId: INVENTORY_QUEST_ID,
        resolutionId: 'reopen_inventory_model',
      })
    );
    expect(resolveQuestOutcomeThunk.rejected.match(bypass)).toBe(true);
    expect(String(bypass.payload)).toContain(INSIGHT_ID);

    cleanup();
    const qualifiedStore = makeStore();
    await initializeProductionRuntime(qualifiedStore);
    qualifiedStore.dispatch(addPermanentTrait(INSIGHT_ID));
    await makeQuestReady(qualifiedStore, ELARA_ID, INVENTORY_QUEST_ID, 'location_merchant_district');

    renderNpcRoute(qualifiedStore, ELARA_ID);
    clickTab('Quests');
    fireEvent.click(await screen.findByText('The Impossible Inventory'));
    expect(await screen.findByRole('button', { name: 'Choose Reopen the Model Around the Contradiction' })).toBeInTheDocument();

    await clickButton('Choose Reopen the Model Around the Contradiction');
    await waitFor(() => {
      expect(
        qualifiedStore.getState().relationships.experiencesById.elara_exp_insight_reopens_inventory
      ).toBeDefined();
    });
    expect(
      qualifiedStore.getState().relationships.experiencesById.elara_exp_inventory_plausible_model
    ).toBeUndefined();
  });
});
