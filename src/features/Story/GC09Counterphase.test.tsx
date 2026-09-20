import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer, replaceState, type RootState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import {
  initializeNPCsThunk,
  processNPCInteractionThunk,
} from '../NPCs/state/NPCThunks';
import {
  initializeQuestsThunk,
  resolveQuestOutcomeThunk,
  startQuestThunk,
} from '../Quest/state/QuestThunks';
import { canUseQuestResolution } from '../Quest/state/QuestResolutionAvailability';
import { addPermanentTrait, setLocation } from '../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { learnNpcFact } from '../Knowledge/state/KnowledgeSlice';
import { adjustFactionReputation } from '../Factions/state/FactionSlice';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import { setWorldStateCondition } from '../WorldState/state/WorldStateSlice';
import {
  selectCounterphasePlan,
  selectNetworkPosture,
} from '../WorldState/state/WorldStateSelectors';
import { updateCopy } from '../Copy/state/CopySlice';
import {
  processCopyTasksThunk,
  startCopyProductionTaskThunk,
} from '../Copy/state/CopyThunks';
import { selectChapterProgress } from './ChapterSelectors';
import {
  selectCounterphasePreparationExplanation,
} from './PlayerInsightSelectors';
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
const gc08 = readJson('public/data/gc08-network-content.json');
const gc09 = readJson('public/data/gc09-counterphase-content.json');
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
type Route = 'distributed' | 'structural' | 'diagnostic' | 'fortified';

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
    if (url === '/data/gc08-network-content.json') return { ok: true, json: async () => cloneJson(gc08) } as any;
    if (url === '/data/gc09-counterphase-content.json') return { ok: true, json: async () => cloneJson(gc09) } as any;
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

const initialize = async (store: TestStore) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
};

const record = async (store: TestStore, experienceId: string, timestamp = 100) => {
  await store.dispatch(recordAuthoredRelationshipExperienceThunk({
    experienceId,
    timestamp,
  })).unwrap();
};

const interact = async (
  store: TestStore,
  choiceId: string,
  selectedResponse: string
) => store.dispatch(processNPCInteractionThunk({
  npcId: 'npc_lyra',
  interactionType: 'dialogue',
  context: { choiceId, selectedResponse, playerMessage: selectedResponse },
})).unwrap();

const seedNetworkPosture = async (
  store: TestStore,
  route: Route
) => {
  await record(store, `lyra_gc08_exp_commit_${route}`, 100);
  store.dispatch(setWorldStateCondition({
    regionId: 'location_merchant_district',
    field: 'networkPosture',
    value: route,
  }));
  store.dispatch(learnNpcFact({
    npcId: 'npc_lyra',
    factId: 'fact_gc08_network_posture_committed',
  }));

  if (route === 'structural') {
    store.dispatch(addPermanentTrait('WillowsWisdom'));
    store.dispatch(addPermanentTrait('ConstraintSense'));
  } else if (route === 'diagnostic') {
    store.dispatch(addPermanentTrait('ScholarlyInsight'));
    store.dispatch(addPermanentTrait('AdversarialCalibration'));
  }
};

const prepareRoute = async (
  store: TestStore,
  route: Route
) => {
  const prepDialogue = await interact(
    store,
    `lyra_gc09_prepare_${route}`,
    'prepare'
  );
  expect(prepDialogue.success).toBe(true);

  const questMap: Record<Route, {
    questId: string;
    destination: string;
    resolutionId: string;
  }> = {
    distributed: {
      questId: 'quest_gc09_distributed_counterphase',
      destination: 'location_merchant_district',
      resolutionId: 'prepare_distributed_finale',
    },
    structural: {
      questId: 'quest_gc09_structural_counterphase',
      destination: 'location_city_center',
      resolutionId: 'prepare_structural_finale',
    },
    diagnostic: {
      questId: 'quest_gc09_diagnostic_counterphase',
      destination: 'location_chrono_crypt',
      resolutionId: 'prepare_diagnostic_finale',
    },
    fortified: {
      questId: 'quest_gc09_fortified_counterphase',
      destination: 'location_city_gate',
      resolutionId: 'prepare_fortified_finale',
    },
  };
  const config = questMap[route];

  expect(store.getState().npcs.npcs.npc_lyra.availableQuests)
    .toContain(config.questId);
  await store.dispatch(startQuestThunk(config.questId)).unwrap();
  store.dispatch(setLocation(config.destination));
  expect(store.getState().quest.quests[config.questId].status)
    .toBe('READY_TO_COMPLETE');
  const resolved = await store.dispatch(resolveQuestOutcomeThunk({
    questId: config.questId,
    resolutionId: config.resolutionId,
  }));
  expect(resolveQuestOutcomeThunk.fulfilled.match(resolved)).toBe(true);
  expect(store.getState().relationships.experiencesById[
    `lyra_gc09_exp_prepare_${route}`
  ]).toBeDefined();
  expect(selectCounterphasePlan(
    store.getState(),
    'location_merchant_district'
  )).toBeUndefined();
};

describe('GC-09 Counterphase', () => {
  test('network posture alone never auto-selects a finale plan', async () => {
    const store = makeStore();
    await initialize(store);
    await seedNetworkPosture(store, 'distributed');

    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBe('distributed');
    expect(selectCounterphasePlan(
      store.getState(),
      'location_merchant_district'
    )).toBeUndefined();
    expect(store.getState().relationships.experiencesById.lyra_gc09_exp_prepare_distributed)
      .toBeUndefined();
    expect(store.getState().relationships.experiencesById.lyra_gc09_exp_commit_distributed)
      .toBeUndefined();
  });

  test('specialized finale preparation re-checks capability pairs while distributed and fortified remain non-golden-trait routes', () => {
    const distributed = quests.quest_gc09_distributed_counterphase.resolutionOptions[0];
    const structural = quests.quest_gc09_structural_counterphase.resolutionOptions[0];
    const diagnostic = quests.quest_gc09_diagnostic_counterphase.resolutionOptions[0];
    const fortified = quests.quest_gc09_fortified_counterphase.resolutionOptions[0];

    expect(canUseQuestResolution(distributed, [])).toBe(true);
    expect(canUseQuestResolution(fortified, [])).toBe(true);

    expect(structural.requiredPermanentTraitIds).toEqual([
      'WillowsWisdom',
      'ConstraintSense',
    ]);
    expect(canUseQuestResolution(structural, ['WillowsWisdom'])).toBe(false);
    expect(canUseQuestResolution(structural, ['WillowsWisdom', 'ConstraintSense']))
      .toBe(true);

    expect(diagnostic.requiredPermanentTraitIds).toEqual([
      'ScholarlyInsight',
      'AdversarialCalibration',
    ]);
    expect(canUseQuestResolution(diagnostic, ['ScholarlyInsight'])).toBe(false);
    expect(canUseQuestResolution(
      diagnostic,
      ['ScholarlyInsight', 'AdversarialCalibration']
    )).toBe(true);
  });

  test('fortified preparation remains independently gated by City Watch standing', async () => {
    const store = makeStore();
    await initialize(store);
    await seedNetworkPosture(store, 'fortified');

    store.dispatch(adjustFactionReputation({ factionId: 'City Watch', amount: -3 }));
    expect(selectFactionReputation(store.getState(), 'City Watch')).toBe(-3);

    const blocked = await interact(
      store,
      'lyra_gc09_prepare_fortified',
      'prepare'
    );
    expect(blocked.success).toBe(false);
    expect(blocked.message).toContain('Faction reputation gate not met: City Watch');

    store.dispatch(adjustFactionReputation({ factionId: 'City Watch', amount: 3 }));
    const allowed = await interact(
      store,
      'lyra_gc09_prepare_fortified',
      'prepare'
    );
    expect(allowed.success).toBe(true);
  });

  test.each([
    'distributed',
    'structural',
    'diagnostic',
    'fortified',
  ] as Route[])('$route profile requires authored preparation and then one manual finale commitment', async route => {
    const store = makeStore();
    await initialize(store);
    await seedNetworkPosture(store, route);

    await prepareRoute(store, route);

    expect(selectChapterProgress(store.getState(), 'counterphase').status)
      .toBe('in_progress');

    const committed = await interact(
      store,
      `lyra_gc09_commit_${route}`,
      'commit'
    );
    expect(committed.success).toBe(true);

    expect(selectCounterphasePlan(
      store.getState(),
      'location_merchant_district'
    )).toBe(route);
    expect(store.getState().relationships.experiencesById[
      `lyra_gc09_exp_commit_${route}`
    ]).toBeDefined();
    expect(store.getState().relationships.memoriesById[
      `lyra_memory_gc09_${route}_plan`
    ]).toEqual(expect.objectContaining({
      playerVisible: true,
    }));
    expect(selectChapterProgress(store.getState(), 'counterphase')).toMatchObject({
      status: 'complete',
      completedRouteId: route,
    });
  });

  test('shared commitment fact closes another plan even if state is synthetically changed afterward', async () => {
    const store = makeStore();
    await initialize(store);
    await seedNetworkPosture(store, 'distributed');

    await record(store, 'lyra_gc09_exp_prepare_distributed', 200);
    await record(store, 'lyra_gc09_exp_prepare_diagnostic', 201);

    const first = await interact(
      store,
      'lyra_gc09_commit_distributed',
      'commit'
    );
    expect(first.success).toBe(true);

    store.dispatch(setWorldStateCondition({
      regionId: 'location_merchant_district',
      field: 'networkPosture',
      value: 'diagnostic',
    }));

    const competing = await interact(
      store,
      'lyra_gc09_commit_diagnostic',
      'commit'
    );
    expect(competing.success).toBe(false);
    expect(competing.message).toContain(
      'NPC already knows fact: fact_gc09_finale_commitment_made'
    );
    expect(selectCounterphasePlan(
      store.getState(),
      'location_merchant_district'
    )).toBe('distributed');
  });

  test('causal explanation names the canonical route evidence instead of calculating readiness', async () => {
    const store = makeStore();
    await initialize(store);
    await record(store, 'elara_exp_independent_verification', 50);
    await seedNetworkPosture(store, 'structural');

    const explanation = selectCounterphasePreparationExplanation(store.getState());
    expect(explanation).toEqual(expect.objectContaining({
      profile: 'structural',
      title: 'Structural Counterphase',
    }));
    expect(explanation?.reasons).toEqual(expect.arrayContaining([
      'Chapter 6 committed the network to a structural posture.',
      'Willow\'s Wisdom and Constraint Sense are both permanent capabilities.',
      'Archive Verification is personally mastered, so safe repetitive verification can be delegated without delegating the finale decision.',
    ]));
    expect(explanation?.reasons.join(' ')).not.toMatch(/readiness|score/i);
  });

  test('Copy routine execution cannot create finale preparation or commitment authority', async () => {
    const store = makeStore();
    await initialize(store);
    await record(store, 'elara_exp_independent_verification', 50);
    await seedNetworkPosture(store, 'distributed');

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: {
        role: 'researcher',
        maturity: 90,
        loyalty: 90,
        activeTask: null,
      },
    }));

    const experiencesBefore = Object.keys(
      store.getState().relationships.experiencesById
    ).sort();
    const planBefore = selectCounterphasePlan(
      store.getState(),
      'location_merchant_district'
    );

    jest.spyOn(Date, 'now').mockReturnValue(900_000);
    await store.dispatch(startCopyProductionTaskThunk({
      copyId: 'copy-001',
      taskId: 'archive_verification',
    })).unwrap();
    await store.dispatch(processCopyTasksThunk(100_000)).unwrap();

    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(Object.keys(store.getState().relationships.experiencesById).sort())
      .toEqual(experiencesBefore);
    expect(selectCounterphasePlan(
      store.getState(),
      'location_merchant_district'
    )).toBe(planBefore);
    expect(store.getState().relationships.experiencesById.lyra_gc09_exp_commit_distributed)
      .toBeUndefined();
  });

  test('committed finale plan survives save/load and remains chapter-state-free', async () => {
    const store = makeStore();
    await initialize(store);
    await seedNetworkPosture(store, 'distributed');
    await prepareRoute(store, 'distributed');
    await interact(store, 'lyra_gc09_commit_distributed', 'commit');

    jest.spyOn(Date, 'now').mockReturnValue(1_100_000);
    const saveId = createSave(store.getState(), 'GC-09 committed');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));

    expect(selectCounterphasePlan(
      resumed.getState(),
      'location_merchant_district'
    )).toBe('distributed');
    expect(resumed.getState().relationships.memoriesById.lyra_memory_gc09_distributed_plan)
      .toBeDefined();
    expect(selectChapterProgress(resumed.getState(), 'counterphase').status)
      .toBe('complete');
    expect(Object.keys(resumed.getState())).not.toContain('chapter');
    expect(Object.keys(resumed.getState())).not.toContain('story');
  });

  test('ordinary UI explains Chapter 7 and then exposes the finale handoff', () => {
    const base = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
    const experienceIds = [
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
      'lyra_gc07_exp_manual_triangulation',
      'lyra_gc07_exp_counterphase_derived',
      'elara_gc08_exp_network_diagnosis',
      'elara_gc08_exp_distributed_preparation',
      'lyra_gc08_exp_commit_distributed',
    ];

    const state: RootState = {
      ...base,
      relationships: {
        ...base.relationships,
        experiencesById: Object.fromEntries(
          experienceIds.map(id => [id, { id }])
        ) as RootState['relationships']['experiencesById'],
      },
      worldState: {
        ...base.worldState,
        regions: {
          location_merchant_district: {
            networkPosture: 'distributed',
          },
        },
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

    expect(screen.getByText('Chapter 7 — Counterphase')).toBeInTheDocument();
    expect(screen.getByText('Why Distributed Counterphase is available'))
      .toBeInTheDocument();
    expect(screen.getByText(/distributed plan remains legal without an optional two-Trait capability pair/i))
      .toBeInTheDocument();

    cleanup();
    store.dispatch(replaceState({
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          lyra_gc09_exp_prepare_distributed: { id: 'lyra_gc09_exp_prepare_distributed' } as any,
          lyra_gc09_exp_commit_distributed: { id: 'lyra_gc09_exp_commit_distributed' } as any,
        },
      },
      worldState: {
        ...state.worldState,
        regions: {
          location_merchant_district: {
            networkPosture: 'distributed',
            counterphasePlan: 'distributed',
          },
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

    expect(screen.getByText('Counterphase plan committed — Telluric Echo finale next'))
      .toBeInTheDocument();
  });

  test('GC-09 adds no readiness currency, planner, or ChapterEngine', () => {
    const preregistration = fs.readFileSync(
      path.join(process.cwd(), 'specification/Technical/GC09CounterphasePreregistration.md'),
      'utf8'
    );
    const worldTypes = fs.readFileSync(
      path.join(process.cwd(), 'src/features/WorldState/state/WorldStateTypes.ts'),
      'utf8'
    );

    expect(preregistration).toContain('no `finaleReadiness` number');
    expect(worldTypes).not.toMatch(/finaleReadiness|readinessScore/);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/ChapterEngine.ts')))
      .toBe(false);
  });
});
