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
import { learnNpcFact } from '../Knowledge/state/KnowledgeSlice';
import { selectNpcKnowsFact } from '../Knowledge/state/KnowledgeSelectors';
import { adjustFactionReputation } from '../Factions/state/FactionSlice';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import { setWorldStateCondition } from '../WorldState/state/WorldStateSlice';
import {
  selectCampaignStatus,
  selectTelluricEchoOutcome,
} from '../WorldState/state/WorldStateSelectors';
import { updateCopy } from '../Copy/state/CopySlice';
import {
  processCopyTasksThunk,
  startCopyProductionTaskThunk,
} from '../Copy/state/CopyThunks';
import { selectChapterProgress } from './ChapterSelectors';
import { selectCampaignEpilogueProjection } from './CampaignEpilogueSelectors';
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
const gc10 = readJson('public/data/gc10-finale-content.json');
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
    if (url === '/data/gc10-finale-content.json') return { ok: true, json: async () => cloneJson(gc10) } as any;
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
  dialogueId: string,
  selectedResponse: string
) => store.dispatch(processNPCInteractionThunk({
  npcId: 'npc_lyra',
  interactionType: 'dialogue',
  context: {
    choiceId: dialogueId,
    selectedResponse,
    playerMessage: selectedResponse,
  },
})).unwrap();

const outcomeByRoute: Record<Route, string> = {
  distributed: 'distributed_dissipation',
  structural: 'structural_redirection',
  diagnostic: 'diagnostic_disruption',
  fortified: 'fortified_containment',
};

const resolutionByRoute: Record<Route, string> = {
  distributed: 'resolve_distributed_dissipation',
  structural: 'resolve_structural_redirection',
  diagnostic: 'resolve_diagnostic_disruption',
  fortified: 'resolve_fortified_containment',
};

const traitsByRoute: Record<Route, string[]> = {
  distributed: [],
  structural: ['WillowsWisdom', 'ConstraintSense'],
  diagnostic: ['ScholarlyInsight', 'AdversarialCalibration'],
  fortified: [],
};

const seedFinaleEntry = async (
  store: TestStore,
  route: Route,
  callbacks = true
) => {
  await record(store, `lyra_gc09_exp_commit_${route}`, 100);
  store.dispatch(learnNpcFact({
    npcId: 'npc_lyra',
    factId: 'fact_gc09_finale_commitment_made',
  }));
  store.dispatch(setWorldStateCondition({
    regionId: 'location_merchant_district',
    field: 'networkPosture',
    value: route,
  }));
  store.dispatch(setWorldStateCondition({
    regionId: 'location_merchant_district',
    field: 'counterphasePlan',
    value: route,
  }));
  store.dispatch(setWorldStateCondition({
    regionId: 'location_merchant_district',
    field: 'latticeIntegrity',
    value: 'stabilized',
  }));

  if (callbacks) {
    await record(store, 'elara_exp_independent_verification', 101);
    await record(store, 'elara_gc08_exp_network_diagnosis', 102);
    if (route === 'fortified') {
      await record(store, 'valerius_exp_aftermath_public_crackdown', 103);
      await record(store, 'valerius_gc08_exp_watch_mobilized', 104);
    } else {
      await record(store, 'gronk_exp_aftermath_quiet_reroute', 103);
    }
  }

  traitsByRoute[route].forEach(traitId => store.dispatch(addPermanentTrait(traitId)));
};

const enterFinale = async (store: TestStore, route: Route) => {
  const result = await interact(store, `lyra_gc10_enter_${route}_finale`, 'enter');
  expect(result.success).toBe(true);
  expect(store.getState().npcs.npcs.npc_lyra.availableQuests)
    .toContain(`quest_gc10_telluric_echo_${route}`);
};

const resolveFinale = async (store: TestStore, route: Route) => {
  const questId = `quest_gc10_telluric_echo_${route}`;
  await store.dispatch(startQuestThunk(questId)).unwrap();
  store.dispatch(setLocation('location_whispering_woods'));
  expect(store.getState().quest.quests[questId].status).toBe('READY_TO_COMPLETE');

  const result = await store.dispatch(resolveQuestOutcomeThunk({
    questId,
    resolutionId: resolutionByRoute[route],
  }));
  expect(resolveQuestOutcomeThunk.fulfilled.match(result)).toBe(true);
  expect(store.getState().relationships.experiencesById[
    `lyra_gc10_exp_finale_${route}`
  ]).toBeDefined();
};

const closeCampaign = async (store: TestStore, route: Route) => {
  const result = await interact(store, `lyra_gc10_aftermath_${route}`, 'record');
  expect(result.success).toBe(true);
};

describe('GC-10 Telluric Echo finale and epilogue', () => {
  test('four finale quests preserve baseline viability and the two established build profiles', () => {
    const distributed = quests.quest_gc10_telluric_echo_distributed.resolutionOptions[0];
    const structural = quests.quest_gc10_telluric_echo_structural.resolutionOptions[0];
    const diagnostic = quests.quest_gc10_telluric_echo_diagnostic.resolutionOptions[0];
    const fortified = quests.quest_gc10_telluric_echo_fortified.resolutionOptions[0];

    expect(canUseQuestResolution(distributed, [])).toBe(true);
    expect(canUseQuestResolution(fortified, [])).toBe(true);

    expect(structural.requiredPermanentTraitIds).toEqual([
      'WillowsWisdom',
      'ConstraintSense',
    ]);
    expect(canUseQuestResolution(structural, ['WillowsWisdom'])).toBe(false);
    expect(canUseQuestResolution(
      structural,
      ['WillowsWisdom', 'ConstraintSense']
    )).toBe(true);

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

  test('finale entry rejects a mismatched committed World State plan', async () => {
    const store = makeStore();
    await initialize(store);
    await record(store, 'lyra_gc09_exp_commit_structural', 100);
    store.dispatch(learnNpcFact({
      npcId: 'npc_lyra',
      factId: 'fact_gc09_finale_commitment_made',
    }));
    store.dispatch(setWorldStateCondition({
      regionId: 'location_merchant_district',
      field: 'counterphasePlan',
      value: 'distributed',
    }));

    const blocked = await interact(
      store,
      'lyra_gc10_enter_structural_finale',
      'enter'
    );
    expect(blocked.success).toBe(false);
    expect(blocked.message).toContain('World state gate not met');
  });

  test('fortified finale entry re-checks institutional standing independently', async () => {
    const store = makeStore();
    await initialize(store);
    await seedFinaleEntry(store, 'fortified');

    store.dispatch(adjustFactionReputation({ factionId: 'City Watch', amount: -1 }));
    expect(selectFactionReputation(store.getState(), 'City Watch')).toBe(-1);

    const blocked = await interact(
      store,
      'lyra_gc10_enter_fortified_finale',
      'enter'
    );
    expect(blocked.success).toBe(false);
    expect(blocked.message).toContain('Faction reputation gate not met: City Watch');

    store.dispatch(adjustFactionReputation({ factionId: 'City Watch', amount: 1 }));
    await enterFinale(store, 'fortified');
  });

  test.each([
    'distributed',
    'structural',
    'diagnostic',
    'fortified',
  ] as Route[])('%s route can legally complete Campaign One', async route => {
    const store = makeStore();
    await initialize(store);
    await seedFinaleEntry(store, route);
    await enterFinale(store, route);
    await resolveFinale(store, route);

    expect(selectCampaignStatus(
      store.getState(),
      'location_whispering_woods'
    )).toBeUndefined();

    await closeCampaign(store, route);

    expect(selectCampaignStatus(
      store.getState(),
      'location_whispering_woods'
    )).toBe('complete');
    expect(selectTelluricEchoOutcome(
      store.getState(),
      'location_whispering_woods'
    )).toBe(outcomeByRoute[route]);
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_lyra',
      'fact_gc10_campaign_complete'
    )).toBe(true);
    expect(store.getState().relationships.experiencesById[
      `lyra_gc10_exp_epilogue_${route}`
    ]).toBeDefined();
    expect(store.getState().relationships.memoriesById[
      `lyra_memory_gc10_${route}_aftermath`
    ]).toEqual(expect.objectContaining({ playerVisible: true }));
    expect(selectChapterProgress(
      store.getState(),
      'telluric_echo_finale'
    )).toMatchObject({
      status: 'complete',
      completedRouteId: route,
    });
  });

  test('Copy routine completion cannot create finale or campaign-completion authority', async () => {
    const store = makeStore();
    await initialize(store);
    await seedFinaleEntry(store, 'distributed');

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

    jest.spyOn(Date, 'now').mockReturnValue(1_200_000);
    await store.dispatch(startCopyProductionTaskThunk({
      copyId: 'copy-001',
      taskId: 'archive_verification',
    })).unwrap();
    await store.dispatch(processCopyTasksThunk(100_000)).unwrap();

    expect(Object.keys(store.getState().relationships.experiencesById).sort())
      .toEqual(experiencesBefore);
    expect(selectCampaignStatus(
      store.getState(),
      'location_whispering_woods'
    )).toBeUndefined();
    expect(selectTelluricEchoOutcome(
      store.getState(),
      'location_whispering_woods'
    )).toBeUndefined();
    expect(selectNpcKnowsFact(
      store.getState(),
      'npc_lyra',
      'fact_gc10_campaign_complete'
    )).toBe(false);
  });

  test('epilogue projects only recorded callbacks plus institution, world, build, and delegation state', async () => {
    const store = makeStore();
    await initialize(store);
    await seedFinaleEntry(store, 'structural');
    await enterFinale(store, 'structural');
    await resolveFinale(store, 'structural');
    await closeCampaign(store, 'structural');

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: { role: 'researcher' },
    }));

    const epilogue = selectCampaignEpilogueProjection(store.getState());
    expect(epilogue).toEqual(expect.objectContaining({
      plan: 'structural',
      title: 'Structural Redirection',
    }));
    expect(epilogue?.lyra).toMatch(/load paths|load-bearing|counterphase/i);
    expect(epilogue?.elara).toMatch(/Elara/i);
    expect(epilogue?.secondaryAnchor).toMatch(/Gronk/i);
    expect(epilogue?.institution).toMatch(/City Watch standing/i);
    expect(epilogue?.world).toMatch(/Structural Redirection/i);
    expect(epilogue?.build).toMatch(/Willow.*Constraint Sense/i);
    expect(epilogue?.delegation).toMatch(/Archive Verification/i);

    const stateWithoutOptionalNetworkAnchor: RootState = {
      ...store.getState(),
      relationships: {
        ...store.getState().relationships,
        experiencesById: Object.fromEntries(
          Object.entries(store.getState().relationships.experiencesById)
            .filter(([id]) => !id.startsWith('gronk_') && !id.startsWith('valerius_'))
        ) as RootState['relationships']['experiencesById'],
      },
    };
    expect(selectCampaignEpilogueProjection(
      stateWithoutOptionalNetworkAnchor
    )?.secondaryAnchor).toBeNull();
  });

  test('campaign completion survives save/load with no campaign-owned save root', async () => {
    const store = makeStore();
    await initialize(store);
    await seedFinaleEntry(store, 'distributed');
    await enterFinale(store, 'distributed');
    await resolveFinale(store, 'distributed');
    await closeCampaign(store, 'distributed');

    jest.spyOn(Date, 'now').mockReturnValue(1_300_000);
    const saveId = createSave(store.getState(), 'Campaign One complete');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));

    expect(selectCampaignStatus(
      resumed.getState(),
      'location_whispering_woods'
    )).toBe('complete');
    expect(selectTelluricEchoOutcome(
      resumed.getState(),
      'location_whispering_woods'
    )).toBe('distributed_dissipation');
    expect(selectChapterProgress(
      resumed.getState(),
      'telluric_echo_finale'
    ).status).toBe('complete');
    expect(selectCampaignEpilogueProjection(resumed.getState())).not.toBeNull();
    expect(Object.keys(resumed.getState())).not.toContain('campaign');
    expect(Object.keys(resumed.getState())).not.toContain('finale');
  });

  test('ordinary UI hands Counterphase into the finale and then renders the state-responsive epilogue', () => {
    const base = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
    const priorExperienceIds = [
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
      'lyra_gc09_exp_prepare_distributed',
      'lyra_gc09_exp_commit_distributed',
    ];

    const state: RootState = {
      ...base,
      relationships: {
        ...base.relationships,
        experiencesById: Object.fromEntries(
          priorExperienceIds.map(id => [id, { id }])
        ) as RootState['relationships']['experiencesById'],
      },
      worldState: {
        ...base.worldState,
        regions: {
          location_merchant_district: {
            latticeIntegrity: 'stabilized',
            networkPosture: 'distributed',
            counterphasePlan: 'distributed',
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
    expect(screen.getByText('Finale — The Telluric Echo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open finale quest' }))
      .toHaveAttribute('href', '/game/quests');

    cleanup();

    store.dispatch(replaceState({
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          lyra_gc10_exp_finale_distributed: { id: 'lyra_gc10_exp_finale_distributed' } as any,
          lyra_gc10_exp_epilogue_distributed: { id: 'lyra_gc10_exp_epilogue_distributed' } as any,
        },
        memoriesById: {
          ...state.relationships.memoriesById,
          lyra_memory_gc10_distributed_aftermath: {
            id: 'lyra_memory_gc10_distributed_aftermath',
            originExperienceId: 'lyra_gc10_exp_epilogue_distributed',
            title: 'After the Distributed Dissipation',
            primaryTargetId: 'npc_lyra',
            participantIds: ['player', 'npc_lyra'],
            memoryType: 'shared',
            significance: 'defining',
            playerVisible: true,
            summary: 'The Telluric Echo is dispersed through the prepared network.',
            protagonistView: 'The network remembered how I prepared it.',
            targetView: 'The player made the final choice personally.',
            resonanceTags: ['TelluricEcho', 'CampaignOneComplete'],
            bondContribution: 'Dialectic Counterparts — campaign aftermath',
            persistence: 'stable',
            timestamp: 1,
            currentInterpretation: 'The Telluric Echo is dispersed through the prepared network.',
          } as any,
        },
      },
      worldState: {
        ...state.worldState,
        regions: {
          ...state.worldState.regions,
          location_whispering_woods: {
            campaignStatus: 'complete',
            telluricEchoOutcome: 'distributed_dissipation',
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
    expect(screen.getByText('Campaign One Complete — Distributed Dissipation'))
      .toBeInTheDocument();
    expect(screen.getByText(/Telluric Echo outcome: Distributed Dissipation/i))
      .toBeInTheDocument();
  });

  test('GC-10 adds no FinaleEngine, readiness currency, or autonomous completion path', () => {
    const preregistration = fs.readFileSync(
      path.join(process.cwd(), 'specification/Technical/GC10FinaleEpiloguePreregistration.md'),
      'utf8'
    );
    const worldTypes = fs.readFileSync(
      path.join(process.cwd(), 'src/features/WorldState/state/WorldStateTypes.ts'),
      'utf8'
    );

    expect(preregistration).toContain('no generic FinaleEngine');
    expect(worldTypes).not.toMatch(/finaleReadiness|readinessScore/);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/FinaleEngine.ts')))
      .toBe(false);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/ChapterEngine.ts')))
      .toBe(false);
  });
});
