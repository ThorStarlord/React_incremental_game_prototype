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
import { activateDoctrineThunk } from '../Traits/state/DoctrineThunks';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { learnNpcFact } from '../Knowledge/state/KnowledgeSlice';
import { selectNpcKnowsFact } from '../Knowledge/state/KnowledgeSelectors';
import { adjustFactionReputation } from '../Factions/state/FactionSlice';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import { setWorldStateCondition } from '../WorldState/state/WorldStateSlice';
import { selectNetworkPosture } from '../WorldState/state/WorldStateSelectors';
import { updateCopy } from '../Copy/state/CopySlice';
import {
  processCopyTasksThunk,
  startCopyProductionTaskThunk,
} from '../Copy/state/CopyThunks';
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
const gc08 = readJson('public/data/gc08-network-content.json');
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
    if (url === '/data/gc08-network-content.json') return { ok: true, json: async () => cloneJson(gc08) } as any;
    if (url === '/data/quests.json') return { ok: true, json: async () => cloneJson(quests) } as any;
    if (url === '/data/relationships/index.json') return { ok: true, json: async () => cloneJson(manifest) } as any;
    if (bundleByUrl[url]) return { ok: true, json: async () => cloneJson(bundleByUrl[url]) } as any;
    return {
      ok: false,
      statusText: `Unexpected test URL: ${url}`,
      json: async () => ({}),
    } as any;
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

const record = async (
  store: TestStore,
  experienceId: string,
  timestamp = 100
) => {
  await store.dispatch(recordAuthoredRelationshipExperienceThunk({
    experienceId,
    timestamp,
  })).unwrap();
};

const seedCounterphaseEntry = async (
  store: TestStore,
  chapterOneExperienceId?: string
) => {
  await record(store, 'elara_exp_independent_verification', 100);
  await record(store, 'lyra_gc07_exp_counterphase_derived', 101);
  if (chapterOneExperienceId) {
    await record(store, chapterOneExperienceId, 102);
  }
  store.dispatch(learnNpcFact({
    npcId: 'npc_lyra',
    factId: 'fact_gc07_counterphase_principle',
  }));
  store.dispatch(setWorldStateCondition({
    regionId: 'location_merchant_district',
    field: 'latticeIntegrity',
    value: 'stabilized',
  }));
};

const diagnoseWithElara = async (store: TestStore) => {
  const result = await interact(
    store,
    'npc_scholar_elara',
    'elara_gc08_network_diagnosis',
    'brief'
  );
  expect(result.success).toBe(true);
  expect(selectNpcKnowsFact(
    store.getState(),
    'npc_scholar_elara',
    'fact_gc07_counterphase_principle'
  )).toBe(true);
};

const completePreparationQuest = async (
  store: TestStore,
  questId: string,
  destination: string,
  resolutionId: string
) => {
  await store.dispatch(startQuestThunk(questId)).unwrap();
  store.dispatch(setLocation(destination));
  expect(store.getState().quest.quests[questId].status).toBe('READY_TO_COMPLETE');
  const result = await store.dispatch(resolveQuestOutcomeThunk({
    questId,
    resolutionId,
  }));
  expect(resolveQuestOutcomeThunk.fulfilled.match(result)).toBe(true);
};

describe('GC-08 Network Under Pressure', () => {
  test('Elara diagnosis requires Chapter 5, her verified method, one Chapter 1 anchor, personal routine mastery, and stabilized lattice', async () => {
    const store = makeStore();
    await initialize(store);

    await record(store, 'elara_exp_independent_verification', 100);
    await record(store, 'lyra_gc07_exp_counterphase_derived', 101);
    store.dispatch(learnNpcFact({
      npcId: 'npc_lyra',
      factId: 'fact_gc07_counterphase_principle',
    }));
    store.dispatch(setWorldStateCondition({
      regionId: 'location_merchant_district',
      field: 'latticeIntegrity',
      value: 'stabilized',
    }));

    expect(store.getState().player.routineFamiliarity?.archive_verification).toEqual({
      source: 'elara_independent_verification',
      learnedAt: 100,
    });

    const missingAnchor = await interact(
      store,
      'npc_scholar_elara',
      'elara_gc08_network_diagnosis',
      'brief'
    );
    expect(missingAnchor.success).toBe(false);
    expect(missingAnchor.message).toContain('Missing alternative relationship evidence');

    await record(store, 'gronk_exp_aftermath_quiet_reroute', 102);
    const diagnosed = await interact(
      store,
      'npc_scholar_elara',
      'elara_gc08_network_diagnosis',
      'brief'
    );
    expect(diagnosed.success).toBe(true);
    expect(store.getState().relationships.experiencesById.elara_gc08_exp_network_diagnosis)
      .toBeDefined();
    expect(store.getState().npcs.npcs.npc_scholar_elara.availableQuests)
      .toEqual(expect.arrayContaining([
        'quest_gc08_distributed_preparation',
        'quest_gc08_diagnostic_preparation',
      ]));
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_blacksmith_gronk',
      'fact_gc07_counterphase_principle'
    )).toBe(false);
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_captain_valerius',
      'fact_gc07_counterphase_principle'
    )).toBe(false);
  });

  test('objective lattice state is an independent diagnosis gate', async () => {
    const store = makeStore();
    await initialize(store);

    await record(store, 'elara_exp_independent_verification', 100);
    await record(store, 'lyra_gc07_exp_counterphase_derived', 101);
    await record(store, 'gronk_exp_aftermath_quiet_reroute', 102);

    const blocked = await interact(
      store,
      'npc_scholar_elara',
      'elara_gc08_network_diagnosis',
      'brief'
    );
    expect(blocked.success).toBe(false);
    expect(blocked.message).toContain('World state gate not met');
  });

  test('Gronk receives the counterphase only through an explicit briefing and that briefing unlocks structural preparation', async () => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'gronk_exp_aftermath_quiet_reroute');
    await diagnoseWithElara(store);

    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_blacksmith_gronk',
      'fact_gc07_counterphase_principle'
    )).toBe(false);

    const briefed = await interact(
      store,
      'npc_blacksmith_gronk',
      'gronk_gc08_counterphase_briefing',
      'brief'
    );
    expect(briefed.success).toBe(true);
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_blacksmith_gronk',
      'fact_gc07_counterphase_principle'
    )).toBe(true);
    expect(store.getState().npcs.npcs.npc_blacksmith_gronk.availableQuests)
      .toContain('quest_gc08_structural_preparation');
  });

  test('Watch mobilization depends on Faction standing independently from personal Relationship history', async () => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'valerius_exp_aftermath_public_crackdown');
    await diagnoseWithElara(store);

    store.dispatch(adjustFactionReputation({ factionId: 'City Watch', amount: -5 }));
    expect(selectFactionReputation(store.getState(), 'City Watch')).toBe(-5);

    const blocked = await interact(
      store,
      'npc_captain_valerius',
      'valerius_gc08_counterphase_briefing',
      'brief'
    );
    expect(blocked.success).toBe(false);
    expect(blocked.message).toContain('Faction reputation gate not met: City Watch');
    expect(store.getState().relationships.experiencesById.valerius_exp_aftermath_public_crackdown)
      .toBeDefined();

    store.dispatch(adjustFactionReputation({ factionId: 'City Watch', amount: 5 }));
    const mobilized = await interact(
      store,
      'npc_captain_valerius',
      'valerius_gc08_counterphase_briefing',
      'brief'
    );
    expect(mobilized.success).toBe(true);
    expect(store.getState().relationships.experiencesById.valerius_gc08_exp_watch_mobilized)
      .toBeDefined();
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_captain_valerius',
      'fact_gc07_counterphase_principle'
    )).toBe(true);
  });

  test('baseline and independent source-Trait preparation remain viable while doctrine routes require current focus', () => {
    const distributedOptions = quests.quest_gc08_distributed_preparation.resolutionOptions;
    const baseline = distributedOptions.find((option: any) => option.id === 'prepare_distributed_baseline');
    const constraint = distributedOptions.find((option: any) => option.id === 'prepare_constraint_bottlenecks');
    const adversarial = distributedOptions.find((option: any) => option.id === 'prepare_adversarial_stress_test');
    const structural = quests.quest_gc08_structural_preparation.resolutionOptions[0];
    const diagnostic = quests.quest_gc08_diagnostic_preparation.resolutionOptions[0];

    expect(canUseQuestResolution(baseline, [])).toBe(true);

    expect(constraint.requiredPermanentTraitIds).toEqual(['ConstraintSense']);
    expect(canUseQuestResolution(constraint, [])).toBe(false);
    expect(canUseQuestResolution(constraint, ['ConstraintSense'])).toBe(true);

    expect(adversarial.requiredPermanentTraitIds).toEqual(['AdversarialCalibration']);
    expect(canUseQuestResolution(adversarial, [])).toBe(false);
    expect(canUseQuestResolution(adversarial, ['AdversarialCalibration'])).toBe(true);

    expect(structural.requiredPermanentTraitIds).toBeUndefined();
    expect(structural.requiredActiveDoctrineIds).toEqual(['structural_steward']);
    expect(canUseQuestResolution(
      structural,
      ['WillowsWisdom', 'ConstraintSense'],
      []
    )).toBe(false);
    expect(canUseQuestResolution(
      structural,
      ['WillowsWisdom', 'ConstraintSense'],
      ['structural_steward']
    )).toBe(true);

    expect(diagnostic.requiredPermanentTraitIds).toBeUndefined();
    expect(diagnostic.requiredActiveDoctrineIds).toEqual(['countermodeler']);
    expect(canUseQuestResolution(
      diagnostic,
      ['ScholarlyInsight', 'AdversarialCalibration'],
      []
    )).toBe(false);
    expect(canUseQuestResolution(
      diagnostic,
      ['ScholarlyInsight', 'AdversarialCalibration'],
      ['countermodeler']
    )).toBe(true);
  });

  test.each([
    {
      traitId: 'ConstraintSense',
      resolutionId: 'prepare_constraint_bottlenecks',
      experienceId: 'gronk_gc08_exp_constraint_bottleneck_preparation',
    },
    {
      traitId: 'AdversarialCalibration',
      resolutionId: 'prepare_adversarial_stress_test',
      experienceId: 'lyra_gc08_exp_adversarial_stress_test',
    },
  ])('$traitId independently refines distributed preparation without requiring a doctrine', async ({
    traitId,
    resolutionId,
    experienceId,
  }) => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'gronk_exp_aftermath_quiet_reroute');
    await diagnoseWithElara(store);
    store.dispatch(addPermanentTrait(traitId));

    await completePreparationQuest(
      store,
      'quest_gc08_distributed_preparation',
      'location_merchant_district',
      resolutionId
    );

    expect(store.getState().relationships.experiencesById[experienceId]).toBeDefined();

    const committed = await interact(
      store,
      'npc_lyra',
      'lyra_gc08_commit_distributed',
      'commit'
    );
    expect(committed.success).toBe(true);
    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBe('distributed');
  });

  test.each([
    {
      route: 'distributed',
      chapterOneExperienceId: 'gronk_exp_aftermath_quiet_reroute',
      briefing: null as null | { npcId: string; dialogueId: string },
      questId: 'quest_gc08_distributed_preparation',
      destination: 'location_merchant_district',
      resolutionId: 'prepare_distributed_baseline',
      traits: [] as string[],
      preparationExperienceId: 'elara_gc08_exp_distributed_preparation',
    },
    {
      route: 'structural',
      chapterOneExperienceId: 'gronk_exp_aftermath_quiet_reroute',
      briefing: {
        npcId: 'npc_blacksmith_gronk',
        dialogueId: 'gronk_gc08_counterphase_briefing',
      },
      questId: 'quest_gc08_structural_preparation',
      destination: 'location_city_center',
      resolutionId: 'prepare_structural_network',
      traits: ['WillowsWisdom', 'ConstraintSense'],
      preparationExperienceId: 'gronk_gc08_exp_structural_preparation',
    },
    {
      route: 'diagnostic',
      chapterOneExperienceId: 'gronk_exp_aftermath_quiet_reroute',
      briefing: null as null | { npcId: string; dialogueId: string },
      questId: 'quest_gc08_diagnostic_preparation',
      destination: 'location_city_gate',
      resolutionId: 'prepare_diagnostic_network',
      traits: ['ScholarlyInsight', 'AdversarialCalibration'],
      preparationExperienceId: 'elara_gc08_exp_diagnostic_preparation',
    },
  ])('$route preparation produces a legal manual network commitment', async ({
    route,
    chapterOneExperienceId,
    briefing,
    questId,
    destination,
    resolutionId,
    traits,
    preparationExperienceId,
  }) => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, chapterOneExperienceId);
    await diagnoseWithElara(store);

    if (briefing) {
      const briefed = await interact(store, briefing.npcId, briefing.dialogueId, 'brief');
      expect(briefed.success).toBe(true);
    }
    traits.forEach(traitId => store.dispatch(addPermanentTrait(traitId)));
    if (route === 'structural') {
      await store.dispatch(activateDoctrineThunk('structural_steward')).unwrap();
    } else if (route === 'diagnostic') {
      await store.dispatch(activateDoctrineThunk('countermodeler')).unwrap();
    }

    await completePreparationQuest(
      store,
      questId,
      destination,
      resolutionId
    );
    expect(store.getState().relationships.experiencesById[preparationExperienceId])
      .toBeDefined();
    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBeUndefined();

    const committed = await interact(
      store,
      'npc_lyra',
      `lyra_gc08_commit_${route}`,
      'commit'
    );
    expect(committed.success).toBe(true);
    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBe(route);
    expect(store.getState().relationships.experiencesById[
      `lyra_gc08_exp_commit_${route}`
    ]).toBeDefined();
    expect(store.getState().relationships.memoriesById[
      `lyra_memory_gc08_${route}_posture`
    ]).toEqual(expect.objectContaining({
      playerVisible: true,
    }));
    expect(selectChapterProgress(store.getState(), 'network_under_pressure'))
      .toMatchObject({
        status: 'complete',
        completedRouteId: route,
      });
  });

  test('fortified route requires both verified baseline preparation and institutional mobilization', async () => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'valerius_exp_aftermath_public_crackdown');
    await diagnoseWithElara(store);

    const mobilized = await interact(
      store,
      'npc_captain_valerius',
      'valerius_gc08_counterphase_briefing',
      'brief'
    );
    expect(mobilized.success).toBe(true);

    const tooEarly = await interact(
      store,
      'npc_lyra',
      'lyra_gc08_commit_fortified',
      'commit'
    );
    expect(tooEarly.success).toBe(false);
    expect(tooEarly.message).toContain('Missing relationship evidence');

    await completePreparationQuest(
      store,
      'quest_gc08_distributed_preparation',
      'location_merchant_district',
      'prepare_distributed_baseline'
    );

    const committed = await interact(
      store,
      'npc_lyra',
      'lyra_gc08_commit_fortified',
      'commit'
    );
    expect(committed.success).toBe(true);
    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBe('fortified');
    expect(selectChapterProgress(store.getState(), 'network_under_pressure'))
      .toMatchObject({
        status: 'complete',
        completedRouteId: 'fortified',
      });
  });

  test('first manual commitment closes competing commitments without a chapter reducer', async () => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'gronk_exp_aftermath_quiet_reroute');
    await diagnoseWithElara(store);

    await record(store, 'elara_gc08_exp_distributed_preparation', 200);
    await record(store, 'elara_gc08_exp_diagnostic_preparation', 201);

    const distributed = await interact(
      store,
      'npc_lyra',
      'lyra_gc08_commit_distributed',
      'commit'
    );
    expect(distributed.success).toBe(true);

    const competing = await interact(
      store,
      'npc_lyra',
      'lyra_gc08_commit_diagnostic',
      'commit'
    );
    expect(competing.success).toBe(false);
    expect(competing.message).toContain(
      'NPC already knows fact: fact_gc08_network_posture_committed'
    );
    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBe('distributed');
  });

  test('delegated Archive Verification performs only the mastered repetitive task and cannot make strategic network state', async () => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'gronk_exp_aftermath_quiet_reroute');
    await diagnoseWithElara(store);

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: {
        role: 'researcher',
        maturity: 90,
        loyalty: 90,
        activeTask: null,
      },
    }));

    const knowledgeBefore = cloneJson(store.getState().knowledge);
    const worldBefore = cloneJson(store.getState().worldState);
    const experienceIdsBefore = Object.keys(
      store.getState().relationships.experiencesById
    ).sort();

    jest.spyOn(Date, 'now').mockReturnValue(700_000);
    const started = await store.dispatch(startCopyProductionTaskThunk({
      copyId: 'copy-001',
      taskId: 'archive_verification',
    }));
    expect(startCopyProductionTaskThunk.fulfilled.match(started)).toBe(true);

    await store.dispatch(processCopyTasksThunk(100_000)).unwrap();

    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();
    expect(store.getState().knowledge).toEqual(knowledgeBefore);
    expect(store.getState().worldState).toEqual(worldBefore);
    expect(Object.keys(store.getState().relationships.experiencesById).sort())
      .toEqual(experienceIdsBefore);
    expect(selectNetworkPosture(
      store.getState(),
      'location_merchant_district'
    )).toBeUndefined();
    expect(store.getState().relationships.experiencesById.lyra_gc08_exp_commit_distributed)
      .toBeUndefined();
  });

  test('network commitment persists through save/load without a chapter-owned save root', async () => {
    const store = makeStore();
    await initialize(store);
    await seedCounterphaseEntry(store, 'gronk_exp_aftermath_quiet_reroute');
    await diagnoseWithElara(store);
    await completePreparationQuest(
      store,
      'quest_gc08_distributed_preparation',
      'location_merchant_district',
      'prepare_distributed_baseline'
    );
    await interact(
      store,
      'npc_lyra',
      'lyra_gc08_commit_distributed',
      'commit'
    );

    jest.spyOn(Date, 'now').mockReturnValue(800_000);
    const saveId = createSave(store.getState(), 'GC-08 committed');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));

    expect(selectNetworkPosture(
      resumed.getState(),
      'location_merchant_district'
    )).toBe('distributed');
    expect(resumed.getState().relationships.memoriesById.lyra_memory_gc08_distributed_posture)
      .toBeDefined();
    expect(selectNpcKnowsFact(
      resumed.getState(),
      'npc_lyra',
      'fact_gc08_network_posture_committed'
    )).toBe(true);
    expect(selectChapterProgress(resumed.getState(), 'network_under_pressure').status)
      .toBe('complete');
    expect(Object.keys(resumed.getState())).not.toContain('chapter');
    expect(Object.keys(resumed.getState())).not.toContain('story');
  });

  test('ordinary campaign UI hands Chapter 5 into Chapter 6 and then toward Counterphase', () => {
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
    ];

    const state: RootState = {
      ...base,
      relationships: {
        ...base.relationships,
        experiencesById: Object.fromEntries(
          experienceIds.map(id => [id, { id }])
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
    expect(screen.getByText('Chapter 6 — Network Under Pressure')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Copies' }))
      .toHaveAttribute('href', '/game/copies');

    cleanup();
    store.dispatch(replaceState({
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          elara_gc08_exp_network_diagnosis: { id: 'elara_gc08_exp_network_diagnosis' } as any,
          elara_gc08_exp_distributed_preparation: { id: 'elara_gc08_exp_distributed_preparation' } as any,
          lyra_gc08_exp_commit_distributed: { id: 'lyra_gc08_exp_commit_distributed' } as any,
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
    expect(screen.getByText('Chapter 7 — Counterphase')).toBeInTheDocument();
  });

  test('GC-08 introduces no universal readiness meter or autonomous strategic planner', () => {
    const preregistration = fs.readFileSync(
      path.join(process.cwd(), 'specification/Technical/GC08NetworkUnderPressurePreregistration.md'),
      'utf8'
    );
    const storeSource = fs.readFileSync(
      path.join(process.cwd(), 'src/app/store.ts'),
      'utf8'
    );

    expect(preregistration).toContain('no network-readiness meter');
    expect(storeSource).not.toMatch(/networkReadiness|finaleReadiness/);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/ChapterEngine.ts')))
      .toBe(false);
  });
});
