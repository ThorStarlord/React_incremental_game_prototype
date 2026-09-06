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
import {
  recordAuthoredRelationshipExperienceThunk,
} from './RelationshipThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';
import {
  createSave,
  loadSavedGameWithMigration,
} from '../../../shared/utils/saveUtils';

const SILAS_ID = 'npc_rogue_silas';
const VALERIUS_ID = 'npc_captain_valerius';
const TRACE_QUEST_ID = 'quest_m13_trace_merchant_leak';
const RESPONSE_QUEST_ID = 'quest_m13_break_merchant_leak';
const SILAS_M12_MEMORY = 'silas_memory_secret_neither_sold';
const VALERIUS_M12_MEMORY = 'valerius_memory_order_questioned';
const VALERIUS_M13_MEMORY = 'valerius_memory_merchant_leak_broken';

const SILAS_M12_HISTORY = [
  'silas_exp_price_of_truth',
  'silas_exp_package_unopened',
  'silas_exp_leverage_named',
  'silas_exp_secret_neither_sold',
];

const VALERIUS_M12_HISTORY = [
  'valerius_exp_objective_before_obedience',
  'valerius_exp_report_without_theatre',
  'valerius_exp_order_questioned',
];

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const silasBundle = readJson('public/data/relationships/silas.json');
const valeriusBundle = readJson('public/data/relationships/valerius.json');
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
  // M12 already independently qualifies the player-facing routes that create
  // these historical prerequisites. M13 seeds those known histories so its
  // principal proof stays focused on the new story -> Relationship -> story loop.
  for (const experienceId of experienceIds) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
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

const playSilasLeakRoute = async (store: ReturnType<typeof makeStore>) => {
  renderNpcRoute(store, SILAS_ID);
  expect(screen.getByText('Rogue Silas')).toBeInTheDocument();
  clickTab('Dialogue');

  await clickButton(
    "You could have sold this. Instead you're giving me the route. I'll find out whether the pattern is real."
  );

  await waitFor(() => {
    expect(
      store.getState().relationships.experiencesById.silas_exp_watch_leak_shared
    ).toBeDefined();
    expect(store.getState().npcs.npcs[SILAS_ID].availableQuests).toContain(
      TRACE_QUEST_ID
    );
  });

  clickTab('Quests');
  fireEvent.click(await screen.findByText('The Merchant District Leak'));
  await clickButton('Accept Quest');

  expect(store.getState().quest.quests[TRACE_QUEST_ID].status).toBe('IN_PROGRESS');
  store.dispatch(setLocation('location_merchant_district'));

  await waitFor(() => {
    expect(store.getState().quest.quests[TRACE_QUEST_ID].status).toBe(
      'READY_TO_COMPLETE'
    );
  });

  await clickButton('Choose Confirm the Pattern');
  await waitFor(() => {
    expect(
      store.getState().relationships.experiencesById.silas_exp_watch_leak_traced
    ).toBeDefined();
  });

  await clickButton('Turn In Quest');
  await waitFor(() => {
    expect(store.getState().quest.quests[TRACE_QUEST_ID].status).toBe('COMPLETED');
  });

  cleanup();
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

describe('M13 narrative relationship integration', () => {
  test('production authoring forms a two-NPC story loop without generic runtime special cases', () => {
    const silasTopic = dialogues.silas_watch_leak_tip;
    expect(npcs[SILAS_ID].availableDialogues).toContain(silasTopic.id);
    expect(silasTopic.requiredExperienceIds).toEqual([
      'silas_exp_secret_neither_sold',
    ]);
    expect(
      silasTopic.effects.find((effect: any) => effect.type === 'RELATIONSHIP_EXPERIENCE')
        .experienceId
    ).toBe('silas_exp_watch_leak_shared');
    expect(
      silasTopic.effects.find((effect: any) => effect.type === 'UNLOCK_QUEST').questId
    ).toBe(TRACE_QUEST_ID);

    const fallback = dialogues.valerius_leak_rumor;
    const delegated = dialogues.valerius_delegated_leak_response;
    expect(npcs[VALERIUS_ID].availableDialogues).toEqual(
      expect.arrayContaining([fallback.id, delegated.id])
    );
    expect(fallback.requiredExperienceIds).toEqual(['silas_exp_watch_leak_traced']);
    expect(delegated.requiredExperienceIds).toEqual([
      'silas_exp_watch_leak_traced',
      'valerius_exp_order_questioned',
    ]);
    expect(
      delegated.effects.find((effect: any) => effect.type === 'UNLOCK_QUEST').questId
    ).toBe(RESPONSE_QUEST_ID);

    expect(quests[TRACE_QUEST_ID].giver).toBe(SILAS_ID);
    expect(quests[TRACE_QUEST_ID].objectives[0].type).toBe('REACH_LOCATION');
    expect(quests[TRACE_QUEST_ID].resolutionOptions[0].relationshipExperienceId).toBe(
      'silas_exp_watch_leak_traced'
    );
    expect(quests[RESPONSE_QUEST_ID].giver).toBe(VALERIUS_ID);
    expect(quests[RESPONSE_QUEST_ID].objectives[0].type).toBe('REACH_LOCATION');
    expect(quests[RESPONSE_QUEST_ID].resolutionOptions[0].relationshipExperienceId).toBe(
      'valerius_exp_merchant_leak_broken'
    );

    expect(silasBundle.experiences.silas_exp_watch_leak_shared.sourceId).toBe(
      'silas_watch_leak_tip'
    );
    expect(silasBundle.experiences.silas_exp_watch_leak_traced.sourceId).toBe(
      TRACE_QUEST_ID
    );
    expect(
      valeriusBundle.experiences.valerius_exp_merchant_leak_delegated.sourceId
    ).toBe('valerius_delegated_leak_response');
    expect(
      valeriusBundle.experiences.valerius_exp_merchant_leak_broken.sourceId
    ).toBe(RESPONSE_QUEST_ID);
    expect(valeriusBundle.memories[VALERIUS_M13_MEMORY].originExperienceId).toBe(
      'valerius_exp_merchant_leak_broken'
    );

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/NPCs/state/NPCThunks.ts',
      'src/features/Quest/state/QuestThunks.ts',
      'src/app/listeners/GameEventListeners.ts',
      'src/shared/utils/saveSchema.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain('quest_m13_');
      expect(source).not.toContain('silas_watch_leak_tip');
      expect(source).not.toContain('valerius_delegated_leak_response');
      expect(source).not.toContain('silas_exp_watch_leak_traced');
      expect(source).not.toContain('valerius_exp_merchant_leak_broken');
    }
  });

  test('without Valerius disciplined-dissent history the traced leak remains a report, not delegated command', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedKnownHistory(store, SILAS_M12_HISTORY);

    expect(
      selectRelationshipMemoriesByNpcId(store.getState(), SILAS_ID).map(memory => memory.id)
    ).toContain(SILAS_M12_MEMORY);
    expect(
      selectRelationshipMemoriesByNpcId(store.getState(), VALERIUS_ID)
    ).toHaveLength(0);

    await playSilasLeakRoute(store);

    renderNpcRoute(store, VALERIUS_ID);
    clickTab('Dialogue');

    expect(
      await screen.findByRole('button', {
        name: 'Here is the pattern. Verify it through your own chain.',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: "Give me the objective and the constraint. I'll choose the path.",
      })
    ).not.toBeInTheDocument();

    const bypassAttempt = await store.dispatch(
      processNPCInteractionThunk({
        npcId: VALERIUS_ID,
        interactionType: 'dialogue',
        context: {
          choiceId: 'valerius_delegated_leak_response',
          selectedResponse: 'accept',
          timestamp: Date.now(),
        },
      })
    ).unwrap();

    expect(bypassAttempt.success).toBe(false);
    expect(bypassAttempt.message).toContain('valerius_exp_order_questioned');
    expect(store.getState().npcs.npcs[VALERIUS_ID].availableQuests).not.toContain(
      RESPONSE_QUEST_ID
    );
    expect(
      store.getState().relationships.experiencesById
        .valerius_exp_merchant_leak_delegated
    ).toBeUndefined();
  });

  test('qualified histories survive save/load, unlock delegated action, and produce a new Valerius Memory', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedKnownHistory(store, SILAS_M12_HISTORY);
    await seedKnownHistory(store, VALERIUS_M12_HISTORY);

    expect(selectBondProfileByNpcId(store.getState(), SILAS_ID).connectionLevel).toBe(2);
    expect(selectBondProfileByNpcId(store.getState(), VALERIUS_ID).connectionLevel).toBe(2);
    expect(
      selectRelationshipMemoriesByNpcId(store.getState(), VALERIUS_ID).map(memory => memory.id)
    ).toContain(VALERIUS_M12_MEMORY);

    await playSilasLeakRoute(store);

    expect(selectBondProfileByNpcId(store.getState(), SILAS_ID).connectionProgress).toBe(75);

    jest.spyOn(Date, 'now').mockReturnValue(15000);
    const saveId = createSave(store.getState(), 'M13 After Silas Leak');
    expect(saveId).toBe('save_15000');

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();
    expect(
      loaded!.state.relationships.experiencesById.silas_exp_watch_leak_traced
    ).toBeDefined();
    expect(
      selectRelationshipMemoriesByNpcId(loaded!.state, SILAS_ID).map(memory => memory.id)
    ).toContain(SILAS_M12_MEMORY);
    expect(
      selectRelationshipMemoriesByNpcId(loaded!.state, VALERIUS_ID).map(memory => memory.id)
    ).toContain(VALERIUS_M12_MEMORY);

    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));

    renderNpcRoute(resumedStore, VALERIUS_ID);
    clickTab('Dialogue');

    expect(
      await screen.findByRole('button', {
        name: 'Here is the pattern. Verify it through your own chain.',
      })
    ).toBeInTheDocument();
    await clickButton("Give me the objective and the constraint. I'll choose the path.");

    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById
          .valerius_exp_merchant_leak_delegated
      ).toBeDefined();
      expect(resumedStore.getState().npcs.npcs[VALERIUS_ID].availableQuests).toContain(
        RESPONSE_QUEST_ID
      );
    });

    clickTab('Quests');
    fireEvent.click(await screen.findByText('Break the Pattern'));
    await clickButton('Accept Quest');

    expect(resumedStore.getState().quest.quests[RESPONSE_QUEST_ID].status).toBe(
      'IN_PROGRESS'
    );

    // The Silas trace ended in the merchant district. Move away and return so
    // the ordinary REACH_LOCATION listener observes a fresh gameplay event.
    resumedStore.dispatch(setLocation('location_whispering_woods'));
    resumedStore.dispatch(setLocation('location_merchant_district'));

    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[RESPONSE_QUEST_ID].status).toBe(
        'READY_TO_COMPLETE'
      );
    });

    await clickButton('Choose Use the Adaptive Intercept');
    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById
          .valerius_exp_merchant_leak_broken
      ).toBeDefined();
    });

    await clickButton('Turn In Quest');
    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[RESPONSE_QUEST_ID].status).toBe(
        'COMPLETED'
      );
    });

    const valerius = selectBondProfileByNpcId(resumedStore.getState(), VALERIUS_ID);
    expect(valerius.connectionLevel).toBe(2);
    expect(valerius.connectionProgress).toBe(75);
    expect(valerius.dimensions.affinity).toBe(1);
    expect(valerius.dimensions.trust).toBe(38);
    expect(valerius.dimensions.understanding).toBe(31);
    expect(valerius.dimensions.sharedMeaning).toBe(31);
    expect(valerius.dimensions.reliance).toBe(33);
    expect(valerius.dimensions.vulnerability).toBe(8);
    expect(valerius.dimensions.reciprocity).toBe(23);

    const memories = selectRelationshipMemoriesByNpcId(
      resumedStore.getState(),
      VALERIUS_ID
    );
    expect(memories.map(memory => memory.id)).toEqual([
      VALERIUS_M12_MEMORY,
      VALERIUS_M13_MEMORY,
    ]);
    expect(memories[1].title).toBe('The Patrol He Let You Rewrite');
    expect(memories[1].persistence).toBe('stable');
  });
});
