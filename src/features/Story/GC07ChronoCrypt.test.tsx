import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer, replaceState, type RootState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { initializeNPCsThunk, processNPCInteractionThunk } from '../NPCs/state/NPCThunks';
import {
  initializeQuestsThunk,
  resolveQuestOutcomeThunk,
  startQuestThunk,
} from '../Quest/state/QuestThunks';
import { canUseQuestResolution } from '../Quest/state/QuestResolutionAvailability';
import { addPermanentTrait, setLocation } from '../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { selectNpcKnowsFact } from '../Knowledge/state/KnowledgeSelectors';
import { setWorldStateCondition } from '../WorldState/state/WorldStateSlice';
import { travelToLocationThunk } from '../Exploration/TravelThunks';
import { CHRONO_CRYPT_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { selectChapterProgress } from './ChapterSelectors';
import { CampaignSpinePanel } from './components/CampaignSpinePanel';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const m24 = readJson('public/data/m24-world-state-content.json');
const m25 = readJson('public/data/m25-chapter-content.json');
const gc06 = readJson('public/data/gc06-lattice-content.json');
const gc07 = readJson('public/data/gc07-chrono-crypt-content.json');
const quests = readJson('public/data/quests.json');

const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const cloneJson = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(gameEventListeners.middleware),
  });

type TestStore = ReturnType<typeof makeStore>;

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') return { ok: true, json: async () => cloneJson(npcs) } as any;
    if (url === '/data/dialogues.json') return { ok: true, json: async () => cloneJson(dialogues) } as any;
    if (url === '/data/m24-world-state-content.json') return { ok: true, json: async () => cloneJson(m24) } as any;
    if (url === '/data/m25-chapter-content.json') return { ok: true, json: async () => cloneJson(m25) } as any;
    if (url === '/data/gc06-lattice-content.json') return { ok: true, json: async () => cloneJson(gc06) } as any;
    if (url === '/data/gc07-chrono-crypt-content.json') return { ok: true, json: async () => cloneJson(gc07) } as any;
    if (url === '/data/quests.json') return { ok: true, json: async () => cloneJson(quests) } as any;
    if (url === '/data/relationships/index.json') return { ok: true, json: async () => cloneJson(manifest) } as any;
    if (bundleByUrl[url]) return { ok: true, json: async () => cloneJson(bundleByUrl[url]) } as any;
    return { ok: false, statusText: `Unexpected test URL: ${url}`, json: async () => ({}) } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

const interact = async (
  store: TestStore,
  npcId: string,
  choiceId: string,
  selectedResponse: string
) => store.dispatch(processNPCInteractionThunk({
  npcId,
  interactionType: 'dialogue',
  context: { choiceId, selectedResponse, playerMessage: selectedResponse },
})).unwrap();

const initialize = async (store: TestStore) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
};

const establishChapterFiveEntry = async (store: TestStore) => {
  await store.dispatch(recordAuthoredRelationshipExperienceThunk({
    experienceId: 'valerius_gc06_exp_surface_containment',
    timestamp: 100,
  })).unwrap();
  store.dispatch(setWorldStateCondition({
    regionId: 'location_merchant_district',
    field: 'latticeIntegrity',
    value: 'stabilized',
  }));

  const lyraBefore = store.getState().npcs.npcs.npc_lyra;
  expect(lyraBefore.availableQuests ?? []).not.toContain('quest_gc07_counterphase_principle');

  const exit = await interact(
    store,
    'npc_lyra',
    'lyra_gc06_chrono_crypt_route',
    'agree'
  );
  expect(exit.success).toBe(true);
  expect(store.getState().relationships.experiencesById.lyra_gc06_exp_chrono_crypt_route)
    .toBeDefined();
  expect(store.getState().npcs.npcs.npc_lyra.availableQuests)
    .toContain('quest_gc07_counterphase_principle');
};

const enterCryptWithActiveQuest = async (store: TestStore) => {
  await store.dispatch(startQuestThunk('quest_gc07_counterphase_principle')).unwrap();
  store.dispatch(setLocation('location_whispering_woods'));
  await store.dispatch(travelToLocationThunk(CHRONO_CRYPT_LOCATION_ID)).unwrap();
  expect(store.getState().player.location).toBe(CHRONO_CRYPT_LOCATION_ID);
  expect(store.getState().quest.quests.quest_gc07_counterphase_principle.status)
    .toBe('READY_TO_COMPLETE');
};

const interpretCounterphase = async (store: TestStore) => {
  const interpreted = await interact(
    store,
    'npc_lyra',
    'lyra_gc07_counterphase_interpretation',
    'record'
  );
  expect(interpreted.success).toBe(true);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_lyra',
    'fact_gc07_counterphase_principle'
  )).toBe(true);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_scholar_elara',
    'fact_gc07_counterphase_principle'
  )).toBe(false);
  expect(store.getState().relationships.memoriesById.lyra_memory_gc07_counterphase_principle)
    .toEqual(expect.objectContaining({
      playerVisible: true,
      originExperienceId: 'lyra_gc07_exp_counterphase_derived',
    }));
};

describe('GC-07 The Chrono-Crypt', () => {
  test('Chrono-Crypt travel rejects before Chapter 4 exit evidence and succeeds through the same authored edge afterward', async () => {
    const store = makeStore();
    await initialize(store);
    store.dispatch(setLocation('location_whispering_woods'));

    const blocked = await store.dispatch(travelToLocationThunk(CHRONO_CRYPT_LOCATION_ID));
    expect(travelToLocationThunk.rejected.match(blocked)).toBe(true);
    expect(blocked.payload).toContain('lyra_gc06_exp_chrono_crypt_route');
    expect(store.getState().player.location).toBe('location_whispering_woods');

    await establishChapterFiveEntry(store);
    store.dispatch(setLocation('location_whispering_woods'));
    const allowed = await store.dispatch(travelToLocationThunk(CHRONO_CRYPT_LOCATION_ID));
    expect(travelToLocationThunk.fulfilled.match(allowed)).toBe(true);
    expect(store.getState().player.location).toBe(CHRONO_CRYPT_LOCATION_ID);
  });

  test('authors a baseline derivation and both established two-Trait build profiles', () => {
    const quest = quests.quest_gc07_counterphase_principle;
    const baseline = quest.resolutionOptions.find((option: any) =>
      option.id === 'manual_harmonic_triangulation'
    );
    const structural = quest.resolutionOptions.find((option: any) =>
      option.id === 'structural_counterphase'
    );
    const adversarial = quest.resolutionOptions.find((option: any) =>
      option.id === 'adversarial_countermodel'
    );

    expect(canUseQuestResolution(baseline, [])).toBe(true);
    expect(structural.requiredPermanentTraitIds).toEqual([
      'WillowsWisdom',
      'ConstraintSense',
    ]);
    expect(canUseQuestResolution(structural, ['WillowsWisdom'])).toBe(false);
    expect(canUseQuestResolution(structural, ['WillowsWisdom', 'ConstraintSense'])).toBe(true);
    expect(adversarial.requiredPermanentTraitIds).toEqual([
      'ScholarlyInsight',
      'AdversarialCalibration',
    ]);
    expect(canUseQuestResolution(adversarial, ['ScholarlyInsight'])).toBe(false);
    expect(canUseQuestResolution(
      adversarial,
      ['ScholarlyInsight', 'AdversarialCalibration']
    )).toBe(true);
  });

  test('counterphase interpretation rejects before a legal crypt derivation', async () => {
    const store = makeStore();
    await initialize(store);
    await establishChapterFiveEntry(store);
    await enterCryptWithActiveQuest(store);

    const premature = await interact(
      store,
      'npc_lyra',
      'lyra_gc07_counterphase_interpretation',
      'record'
    );
    expect(premature.success).toBe(false);
    expect(premature.message).toContain('Missing alternative relationship evidence');
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_lyra',
      'fact_gc07_counterphase_principle'
    )).toBe(false);
  });

  test.each([
    {
      resolutionId: 'manual_harmonic_triangulation',
      traits: [] as string[],
      experienceId: 'lyra_gc07_exp_manual_triangulation',
      routeId: 'manual_triangulation',
    },
    {
      resolutionId: 'structural_counterphase',
      traits: ['WillowsWisdom', 'ConstraintSense'],
      experienceId: 'lyra_gc07_exp_structural_counterphase',
      routeId: 'structural_counterphase',
    },
    {
      resolutionId: 'adversarial_countermodel',
      traits: ['ScholarlyInsight', 'AdversarialCalibration'],
      experienceId: 'lyra_gc07_exp_adversarial_countermodel',
      routeId: 'adversarial_countermodel',
    },
  ])('$routeId is a legal Chapter 5 route with durable counterphase consequence', async ({
    resolutionId,
    traits,
    experienceId,
    routeId,
  }) => {
    const store = makeStore();
    await initialize(store);
    await establishChapterFiveEntry(store);
    traits.forEach(traitId => store.dispatch(addPermanentTrait(traitId)));
    await enterCryptWithActiveQuest(store);

    const resolved = await store.dispatch(resolveQuestOutcomeThunk({
      questId: 'quest_gc07_counterphase_principle',
      resolutionId,
    }));
    expect(resolveQuestOutcomeThunk.fulfilled.match(resolved)).toBe(true);
    expect(store.getState().relationships.experiencesById[experienceId]).toBeDefined();

    await interpretCounterphase(store);
    expect(selectChapterProgress(store.getState(), 'chrono_crypt')).toMatchObject({
      status: 'complete',
      completedRouteId: routeId,
    });
  });

  test('Chapter 5 completion and counterphase asymmetry survive canonical save/load', async () => {
    const store = makeStore();
    await initialize(store);
    await establishChapterFiveEntry(store);
    await enterCryptWithActiveQuest(store);
    await store.dispatch(resolveQuestOutcomeThunk({
      questId: 'quest_gc07_counterphase_principle',
      resolutionId: 'manual_harmonic_triangulation',
    })).unwrap();
    await interpretCounterphase(store);

    jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
    const saveId = createSave(store.getState(), 'GC-07 complete');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(selectChapterProgress(resumed.getState(), 'chrono_crypt').status).toBe('complete');
    expect(resumed.getState().player.location).toBe(CHRONO_CRYPT_LOCATION_ID);
    expect(selectNpcKnowsFact(
      resumed.getState(),
      'npc_lyra',
      'fact_gc07_counterphase_principle'
    )).toBe(true);
    expect(selectNpcKnowsFact(
      resumed.getState(),
      'npc_scholar_elara',
      'fact_gc07_counterphase_principle'
    )).toBe(false);
    expect(Object.keys(resumed.getState())).not.toContain('chapter');
    expect(Object.keys(resumed.getState())).not.toContain('story');
  });

  test('ordinary campaign UI projects Chapter 5 and then the Network Under Pressure handoff', () => {
    const base = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
    const state: RootState = {
      ...base,
      relationships: {
        ...base.relationships,
        experiencesById: Object.fromEntries([
          'willow_exp_first_lesson',
          'elara_exp_model_challenged',
          'elara_exp_contradictory_footnote',
          'elara_exp_tome_committed',
          'elara_exp_follow_evidence',
          'elara_exp_revision_mutual',
          'elara_exp_theory_neither_owned',
          'elara_exp_independent_verification',
          'lyra_exp_strategic_defeat',
          'lyra_exp_coercion_reflected',
          'lyra_exp_reluctant_cotraining',
          'lyra_exp_ideological_friction',
          'lyra_exp_mutual_calibration',
          'lyra_exp_proto_bond',
          'valerius_gc06_exp_surface_containment',
          'lyra_gc06_exp_chrono_crypt_route',
        ].map(id => [id, { id }])) as RootState['relationships']['experiencesById'],
      },
      npcs: {
        ...base.npcs,
        npcs: {
          npc_captain_valerius: {
            ...npcs.npc_captain_valerius,
            completedDialogues: ['valerius_m25_public_order_conclusion'],
          },
        },
        discoveredNPCs: ['npc_captain_valerius'],
      },
    };

    const store = makeStore();
    store.dispatch(replaceState(state));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CampaignSpinePanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Chapter 5 — The Chrono-Crypt')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open travel controls' }))
      .toHaveAttribute('href', '/game/dashboard');

    cleanup();
    store.dispatch(replaceState({
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          lyra_gc07_exp_manual_triangulation: { id: 'lyra_gc07_exp_manual_triangulation' } as any,
          lyra_gc07_exp_counterphase_derived: { id: 'lyra_gc07_exp_counterphase_derived' } as any,
        },
      },
    }));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CampaignSpinePanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Chapter 6 — Network Under Pressure')).toBeInTheDocument();
  });

  test('GC-07 introduces no generalized time simulation or chapter-owned state authority', () => {
    const preregistration = fs.readFileSync(
      path.join(process.cwd(), 'specification/Technical/GC07ChronoCryptPreregistration.md'),
      'utf8'
    );
    const travelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Exploration/TravelThunks.ts'),
      'utf8'
    );

    expect(preregistration).toContain('no generalized time-dilation');
    expect(travelSource).not.toMatch(/timeDilation|ChronoEngine|setInterval/);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/ChapterEngine.ts'))).toBe(false);
  });
});
