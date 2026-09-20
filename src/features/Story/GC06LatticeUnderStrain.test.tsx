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
import { initializeQuestsThunk, resolveQuestOutcomeThunk, startQuestThunk } from '../Quest/state/QuestThunks';
import { canUseQuestResolution } from '../Quest/state/QuestResolutionAvailability';
import { addPermanentTrait, setLocation } from '../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { selectNpcKnowsFact } from '../Knowledge/state/KnowledgeSelectors';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import { selectLatticeIntegrity } from '../WorldState/state/WorldStateSelectors';
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

const seedChapterFourEntry = async (store: TestStore) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();

  for (const experienceId of [
    'elara_exp_independent_verification',
    'lyra_exp_proto_bond',
    'gronk_exp_aftermath_quiet_reroute',
  ]) {
    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId,
      timestamp: 100,
    })).unwrap();
  }
};

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

const reachReadyQuest = async (store: TestStore) => {
  await store.dispatch(startQuestThunk('quest_gc06_lattice_under_strain')).unwrap();
  store.dispatch(setLocation('location_merchant_district'));
  expect(store.getState().quest.quests.quest_gc06_lattice_under_strain.status)
    .toBe('READY_TO_COMPLETE');
};

const diagnoseAndBrief = async (store: TestStore) => {
  const diagnosis = await interact(
    store,
    'npc_scholar_elara',
    'elara_gc06_lattice_diagnosis',
    'diagnose'
  );
  expect(diagnosis.success).toBe(true);

  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_scholar_elara',
    'fact_gc06_lattice_echo_pattern'
  )).toBe(true);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_captain_valerius',
    'fact_gc06_lattice_echo_pattern'
  )).toBe(false);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_blacksmith_gronk',
    'fact_gc06_lattice_echo_pattern'
  )).toBe(false);
  expect(selectLatticeIntegrity(store.getState(), 'location_merchant_district')).toBe('strained');

  const valerius = await interact(
    store,
    'npc_captain_valerius',
    'valerius_gc06_lattice_briefing',
    'brief'
  );
  expect(valerius.success).toBe(true);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_captain_valerius',
    'fact_gc06_lattice_echo_pattern'
  )).toBe(true);
  expect(selectFactionReputation(store.getState(), 'City Watch')).toBe(2);

  const gronk = await interact(
    store,
    'npc_blacksmith_gronk',
    'gronk_gc06_lattice_briefing',
    'brief'
  );
  expect(gronk.success).toBe(true);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_blacksmith_gronk',
    'fact_gc06_lattice_echo_pattern'
  )).toBe(true);
};

const stabilizeAndExit = async (store: TestStore) => {
  const stabilized = await interact(
    store,
    'npc_captain_valerius',
    'valerius_gc06_stabilize_lattice',
    'stabilize'
  );
  expect(stabilized.success).toBe(true);
  expect(selectLatticeIntegrity(store.getState(), 'location_merchant_district'))
    .toBe('stabilized');

  const exit = await interact(
    store,
    'npc_lyra',
    'lyra_gc06_chrono_crypt_route',
    'agree'
  );
  expect(exit.success).toBe(true);
  expect(store.getState().relationships.experiencesById.lyra_gc06_exp_chrono_crypt_route)
    .toBeDefined();
};

describe('GC-06 Lattice Under Strain', () => {
  test('authors a baseline route and two differentiated two-Trait build profiles', () => {
    const quest = quests.quest_gc06_lattice_under_strain;
    const baseline = quest.resolutionOptions.find((option: any) =>
      option.id === 'contain_surface_failures'
    );
    const structural = quest.resolutionOptions.find((option: any) =>
      option.id === 'reroute_lattice_load'
    );
    const countermodeler = quest.resolutionOptions.find((option: any) =>
      option.id === 'phase_against_echo'
    );

    expect(baseline.requiredPermanentTraitIds).toBeUndefined();
    expect(canUseQuestResolution(baseline, [])).toBe(true);

    expect(structural.requiredPermanentTraitIds).toEqual([
      'WillowsWisdom',
      'ConstraintSense',
    ]);
    expect(canUseQuestResolution(structural, ['WillowsWisdom'])).toBe(false);
    expect(canUseQuestResolution(
      structural,
      ['WillowsWisdom', 'ConstraintSense']
    )).toBe(true);

    expect(countermodeler.requiredPermanentTraitIds).toEqual([
      'ScholarlyInsight',
      'AdversarialCalibration',
    ]);
    expect(canUseQuestResolution(countermodeler, ['ScholarlyInsight'])).toBe(false);
    expect(canUseQuestResolution(
      countermodeler,
      ['ScholarlyInsight', 'AdversarialCalibration']
    )).toBe(true);
  });

  test('diagnosis creates objective strain and per-NPC awareness; institutional response stays separate from Relationship history', async () => {
    const store = makeStore();
    await seedChapterFourEntry(store);

    const watchBefore = selectFactionReputation(store.getState(), 'City Watch');
    await diagnoseAndBrief(store);

    expect(watchBefore).toBe(0);
    expect(selectFactionReputation(store.getState(), 'City Watch')).toBe(2);
    expect(store.getState().relationships.experiencesById.elara_gc06_exp_lattice_diagnosed)
      .toBeDefined();
    expect(store.getState().relationships.experiencesById.valerius_gc06_exp_surface_containment)
      .toBeUndefined();
  });

  test('Chrono-Crypt exit rejects before stabilization and baseline play remains viable without optional Traits', async () => {
    const store = makeStore();
    await seedChapterFourEntry(store);
    await diagnoseAndBrief(store);

    const beforeResolution = await interact(
      store,
      'npc_lyra',
      'lyra_gc06_chrono_crypt_route',
      'agree'
    );
    expect(beforeResolution.success).toBe(false);
    expect(beforeResolution.message).toContain('Missing alternative relationship evidence');

    await reachReadyQuest(store);
    const resolved = await store.dispatch(resolveQuestOutcomeThunk({
      questId: 'quest_gc06_lattice_under_strain',
      resolutionId: 'contain_surface_failures',
    }));
    expect(resolveQuestOutcomeThunk.fulfilled.match(resolved)).toBe(true);
    expect(store.getState().relationships.experiencesById.valerius_gc06_exp_surface_containment)
      .toBeDefined();

    const beforeStabilization = await interact(
      store,
      'npc_lyra',
      'lyra_gc06_chrono_crypt_route',
      'agree'
    );
    expect(beforeStabilization.success).toBe(false);
    expect(beforeStabilization.message).toContain('World state gate not met');

    await stabilizeAndExit(store);
    expect(selectChapterProgress(store.getState(), 'lattice_under_strain')).toMatchObject({
      status: 'complete',
      completedRouteId: 'surface_containment',
    });
  });

  test.each([
    {
      resolutionId: 'reroute_lattice_load',
      traits: ['WillowsWisdom', 'ConstraintSense'],
      experienceId: 'gronk_gc06_exp_structural_steward',
      routeId: 'structural_steward',
    },
    {
      resolutionId: 'phase_against_echo',
      traits: ['ScholarlyInsight', 'AdversarialCalibration'],
      experienceId: 'lyra_gc06_exp_countermodeler',
      routeId: 'countermodeler',
    },
  ])('build profile $routeId is a real legal campaign route', async ({
    resolutionId,
    traits,
    experienceId,
    routeId,
  }) => {
    const store = makeStore();
    await seedChapterFourEntry(store);
    await diagnoseAndBrief(store);
    for (const traitId of traits) store.dispatch(addPermanentTrait(traitId));

    await reachReadyQuest(store);
    const resolved = await store.dispatch(resolveQuestOutcomeThunk({
      questId: 'quest_gc06_lattice_under_strain',
      resolutionId,
    }));
    expect(resolveQuestOutcomeThunk.fulfilled.match(resolved)).toBe(true);
    expect(store.getState().relationships.experiencesById[experienceId]).toBeDefined();

    await stabilizeAndExit(store);
    expect(selectChapterProgress(store.getState(), 'lattice_under_strain')).toMatchObject({
      status: 'complete',
      completedRouteId: routeId,
    });
  });

  test('Chapter 4 completion survives canonical save/load without a chapter-owned save root', async () => {
    const store = makeStore();
    await seedChapterFourEntry(store);
    await diagnoseAndBrief(store);
    await reachReadyQuest(store);
    await store.dispatch(resolveQuestOutcomeThunk({
      questId: 'quest_gc06_lattice_under_strain',
      resolutionId: 'contain_surface_failures',
    })).unwrap();
    await stabilizeAndExit(store);

    jest.spyOn(Date, 'now').mockReturnValue(900_000);
    const saveId = createSave(store.getState(), 'GC-06 complete');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(selectChapterProgress(resumed.getState(), 'lattice_under_strain').status)
      .toBe('complete');
    expect(selectLatticeIntegrity(resumed.getState(), 'location_merchant_district'))
      .toBe('stabilized');
    expect(Object.keys(resumed.getState())).not.toContain('chapter');
    expect(Object.keys(resumed.getState())).not.toContain('story');
  });

  test('ordinary campaign UI hands a completed opening spine into Chapter 4 and then points to the Chrono-Crypt', () => {
    const base = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
    const openingExperienceIds = [
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
    ];

    const state: RootState = {
      ...base,
      relationships: {
        ...base.relationships,
        experiencesById: Object.fromEntries(
          openingExperienceIds.map(id => [id, { id }])
        ) as RootState['relationships']['experiencesById'],
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

    expect(screen.getByText('Chapter 4 — Lattice Under Strain')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Scholar Elara' }))
      .toHaveAttribute('href', '/game/npcs/npc_scholar_elara');

    cleanup();
    store.dispatch(replaceState({
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          valerius_gc06_exp_surface_containment: { id: 'valerius_gc06_exp_surface_containment' } as any,
          lyra_gc06_exp_chrono_crypt_route: { id: 'lyra_gc06_exp_chrono_crypt_route' } as any,
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
    expect(screen.getByText('Chapter 4 complete — the Chrono-Crypt is next')).toBeInTheDocument();
  });
});
