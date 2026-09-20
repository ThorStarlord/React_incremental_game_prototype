import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer, type RootState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { knowledgeListeners } from '../Knowledge/state/KnowledgeListeners';
import { npcListeners } from '../NPCs/state/NPCListeners';
import { copyListeners } from '../Copy/state/CopyListeners';
import {
  initializeNPCsThunk,
  newGameSeedNPCsThunk,
  processNPCInteractionThunk,
} from '../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../NPCs/state/NPCSlice';
import {
  initializeQuestsThunk,
  resolveQuestOutcomeThunk,
  startQuestThunk,
  turnInQuestThunk,
} from '../Quest/state/QuestThunks';
import { resetQuestState } from '../Quest/state/QuestSlice';
import { fetchTraitsThunk } from '../Traits/state/TraitThunks';
import { resetTraitsState } from '../Traits/state/TraitsSlice';
import {
  resetPlayerState,
} from '../Player/state/PlayerSlice';
import { resetEssence } from '../Essence/state/EssenceSlice';
import { resetInventory } from '../Inventory/state/InventorySlice';
import { removeCopy } from '../Copy/state/CopySlice';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
  CHRONO_CRYPT_LOCATION_ID,
  MERCHANT_DISTRICT_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
} from '../Exploration/LocationDefinitions';
import {
  practiceForgeAssistanceThunk,
  travelToLocationThunk,
} from '../Exploration/TravelThunks';
import { selectOpeningCampaignStage } from './CampaignSpine';
import { selectChapterProgress } from './ChapterSelectors';
import { selectCampaignEpilogueProjection } from './CampaignEpilogueSelectors';
import {
  selectCampaignStatus,
  selectCounterphasePlan,
  selectNetworkPosture,
  selectTelluricEchoOutcome,
} from '../WorldState/state/WorldStateSelectors';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import {
  createSave,
  createSaveFromPayload,
  decodeSavePayloadFromBase64,
  encodeSavePayloadToBase64,
  loadSavedGameWithMigration,
} from '../../shared/utils/saveUtils';
import { CampaignSpinePanel } from './components/CampaignSpinePanel';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');
const traits = readJson('public/data/traits.json');
const contentByUrl: Record<string, any> = {
  '/data/m24-world-state-content.json': readJson('public/data/m24-world-state-content.json'),
  '/data/m25-chapter-content.json': readJson('public/data/m25-chapter-content.json'),
  '/data/gc06-lattice-content.json': readJson('public/data/gc06-lattice-content.json'),
  '/data/gc07-chrono-crypt-content.json': readJson('public/data/gc07-chrono-crypt-content.json'),
  '/data/gc08-network-content.json': readJson('public/data/gc08-network-content.json'),
  '/data/gc09-counterphase-content.json': readJson('public/data/gc09-counterphase-content.json'),
  '/data/gc10-finale-content.json': readJson('public/data/gc10-finale-content.json'),
};
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);
const cloneJson = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['meta/replaceState'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
      },
    }).prepend(
      knowledgeListeners.middleware,
      npcListeners.middleware,
      copyListeners.middleware,
      gameEventListeners.middleware
    ),
});
type TestStore = ReturnType<typeof makeStore>;

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') return { ok: true, json: async () => cloneJson(npcs) } as any;
    if (url === '/data/dialogues.json') return { ok: true, json: async () => cloneJson(dialogues) } as any;
    if (url === '/data/quests.json') return { ok: true, json: async () => cloneJson(quests) } as any;
    if (url === '/data/traits.json') return { ok: true, json: async () => cloneJson(traits) } as any;
    if (url === '/data/relationships/index.json') return { ok: true, json: async () => cloneJson(manifest) } as any;
    if (contentByUrl[url]) return { ok: true, json: async () => cloneJson(contentByUrl[url]) } as any;
    if (bundleByUrl[url]) return { ok: true, json: async () => cloneJson(bundleByUrl[url]) } as any;
    return {
      ok: false,
      statusText: `Unexpected Alpha test URL: ${url}`,
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

const startupAndNewGame = async (store: TestStore) => {
  // App startup: the real App loads these three production catalogs.
  await store.dispatch(fetchTraitsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
  await store.dispatch(initializeQuestsThunk()).unwrap();

  // Exact production New Game reset sequence from useGameActions.
  store.dispatch(resetPlayerState());
  store.dispatch(resetEssence());
  store.dispatch(resetInventory());
  store.dispatch(resetQuestState());
  store.dispatch(resetTraitsState());
  store.dispatch(setSelectedNPCId(null));
  for (const copyId of Object.keys(store.getState().copy.copies)) {
    store.dispatch(removeCopy({ copyId }));
  }
  store.dispatch(setHasSeenIntro(false));

  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(newGameSeedNPCsThunk()).unwrap();
};

const interact = async (
  store: TestStore,
  npcId: string,
  choiceId: string,
  selectedResponse: string
) => {
  const result = await store.dispatch(processNPCInteractionThunk({
    npcId,
    interactionType: 'dialogue',
    context: {
      choiceId,
      selectedResponse,
      playerMessage: selectedResponse,
    },
  })).unwrap();
  expect(result.success).toBe(true);
  return result;
};

const travel = async (store: TestStore, destination: string) => {
  const result = await store.dispatch(travelToLocationThunk(destination));
  expect(travelToLocationThunk.fulfilled.match(result)).toBe(true);
  expect(store.getState().player.location).toBe(destination);
};

const resolveAndTurnIn = async (
  store: TestStore,
  questId: string,
  resolutionId: string,
  giverId: string
) => {
  const result = await store.dispatch(resolveQuestOutcomeThunk({
    questId,
    resolutionId,
  }));
  expect(resolveQuestOutcomeThunk.fulfilled.match(result)).toBe(true);
  store.dispatch(setSelectedNPCId(giverId));
  await store.dispatch(turnInQuestThunk(questId)).unwrap();
  expect(store.getState().quest.quests[questId].status).toBe('COMPLETED');
};

const saveCheckpoint = async (
  store: TestStore,
  now: number,
  name: string,
  assertState: (state: RootState) => void
) => {
  const spy = jest.spyOn(Date, 'now').mockReturnValue(now);
  const saveId = createSave(store.getState(), name);
  spy.mockRestore();
  expect(saveId).toBe(`save_${now}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();
  assertState(loaded!.state);
  return loaded!;
};

const playOpening = async (store: TestStore) => {
  store.dispatch(setHasSeenIntro(true));
  await travel(store, CITY_GATE_LOCATION_ID);
  await travel(store, WHISPERING_WOODS_LOCATION_ID);

  await interact(
    store,
    'npc_elder_willow',
    'elder_willow_greeting',
    'respect'
  );

  await waitFor(() => {
    expect(store.getState().relationships.experiencesById.willow_exp_first_lesson)
      .toBeDefined();
    expect(store.getState().npcs.npcs.npc_blacksmith_gronk).toBeDefined();
    expect(store.getState().npcs.npcs.npc_rogue_silas).toBeDefined();
    expect(store.getState().npcs.npcs.npc_captain_valerius).toBeDefined();
  });
  expect(selectOpeningCampaignStage(store.getState())).toBe('CHAPTER_1');
};

const playChapterOnePublicOrder = async (store: TestStore) => {
  await travel(store, CITY_GATE_LOCATION_ID);
  await travel(store, CITY_CENTER_LOCATION_ID);

  for (const [dialogueId, responseId] of [
    ['gronk_greeting', 'inspect'],
    ['gronk_craft_request', 'specify'],
    ['gronk_rumors', 'back_quality'],
    ['gronk_blade_held', 'recognize'],
  ]) {
    await interact(store, 'npc_blacksmith_gronk', dialogueId, responseId);
  }

  await interact(store, 'npc_rogue_silas', 'silas_approach', 'dangerous_truth');
  await interact(store, 'npc_rogue_silas', 'silas_shady_deal', 'accept');
  await store.dispatch(startQuestThunk('quest_silas_retrieve_item')).unwrap();
  expect(store.getState().quest.quests.quest_silas_retrieve_item.status)
    .toBe('READY_TO_COMPLETE');
  await resolveAndTurnIn(
    store,
    'quest_silas_retrieve_item',
    'return_unopened',
    'npc_rogue_silas'
  );
  await interact(store, 'npc_rogue_silas', 'silas_trait_hint', 'name_it');
  await interact(
    store,
    'npc_rogue_silas',
    'silas_secret_neither_sold',
    'acknowledge'
  );
  await interact(store, 'npc_rogue_silas', 'silas_watch_leak_tip', 'take_tip');
  await store.dispatch(startQuestThunk('quest_m13_trace_merchant_leak')).unwrap();

  await interact(
    store,
    'npc_captain_valerius',
    'valerius_report',
    'state_objective'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_training_offer',
    'accept'
  );
  await store.dispatch(startQuestThunk('quest_valerius_patrol_duty')).unwrap();

  await travel(store, MERCHANT_DISTRICT_LOCATION_ID);
  expect(store.getState().quest.quests.quest_m13_trace_merchant_leak.status)
    .toBe('READY_TO_COMPLETE');
  expect(store.getState().quest.quests.quest_valerius_patrol_duty.status)
    .toBe('READY_TO_COMPLETE');

  await resolveAndTurnIn(
    store,
    'quest_m13_trace_merchant_leak',
    'confirm_pattern',
    'npc_rogue_silas'
  );
  await resolveAndTurnIn(
    store,
    'quest_valerius_patrol_duty',
    'report_plainly',
    'npc_captain_valerius'
  );

  await interact(
    store,
    'npc_captain_valerius',
    'valerius_city_issues',
    'question_order'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_delegated_leak_response',
    'accept'
  );
  await store.dispatch(startQuestThunk('quest_m13_break_merchant_leak')).unwrap();

  await travel(store, CITY_CENTER_LOCATION_ID);
  await travel(store, MERCHANT_DISTRICT_LOCATION_ID);
  expect(store.getState().quest.quests.quest_m13_break_merchant_leak.status)
    .toBe('READY_TO_COMPLETE');
  await resolveAndTurnIn(
    store,
    'quest_m13_break_merchant_leak',
    'adaptive_intercept',
    'npc_captain_valerius'
  );

  await interact(
    store,
    'npc_captain_valerius',
    'valerius_m14_aftermath_council',
    'public_crackdown'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_m15_forged_ledger_inquiry',
    'investigate'
  );
  await interact(
    store,
    'npc_rogue_silas',
    'silas_m15_debt_not_renewed',
    'confirm_limit'
  );

  await travel(store, CITY_CENTER_LOCATION_ID);
  await store.dispatch(practiceForgeAssistanceThunk()).unwrap();
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_m22_forge_report',
    'report'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_m23_public_override',
    'own_override'
  );
  expect(selectFactionReputation(store.getState(), 'City Watch')).toBe(-10);
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_m24_redeploy_patrols',
    'redeploy'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_m25_public_order_conclusion',
    'close'
  );

  await waitFor(() => {
    expect(store.getState().npcs.npcs.npc_scholar_elara).toBeDefined();
  });
  expect(selectOpeningCampaignStage(store.getState())).toBe('CHAPTER_2');
};

const playChapterTwo = async (store: TestStore) => {
  for (const [dialogueId, responseId] of [
    ['elara_greeting', 'challenge'],
    ['elara_contradictory_footnote', 'follow'],
    ['elara_offer_tome', 'accept'],
  ]) {
    await interact(store, 'npc_scholar_elara', dialogueId, responseId);
  }

  await store.dispatch(startQuestThunk('quest_elara_lost_tome')).unwrap();
  expect(store.getState().quest.quests.quest_elara_lost_tome.status)
    .toBe('READY_TO_COMPLETE');
  await resolveAndTurnIn(
    store,
    'quest_elara_lost_tome',
    'follow_evidence',
    'npc_scholar_elara'
  );

  for (const [dialogueId, responseId] of [
    ['elara_revision_mutual', 'revise'],
    ['elara_theory_neither_owned', 'build'],
    ['elara_independent_verification', 'report'],
  ]) {
    await interact(store, 'npc_scholar_elara', dialogueId, responseId);
  }

  await waitFor(() => {
    expect(store.getState().npcs.npcs.npc_lyra).toBeDefined();
  });
  expect(store.getState().player.routineFamiliarity?.archive_verification)
    .toBeDefined();
  expect(selectOpeningCampaignStage(store.getState())).toBe('CHAPTER_3');
};

const playChapterThree = async (store: TestStore) => {
  await interact(store, 'npc_lyra', 'lyra_strategic_defeat', 'hold_ground');
  await interact(store, 'npc_lyra', 'lyra_coercion_reflected', 'reflect');
  await interact(store, 'npc_lyra', 'lyra_offer_cotraining', 'accept');

  await store.dispatch(startQuestThunk('quest_lyra_chrono_crypt_calibration')).unwrap();
  expect(store.getState().quest.quests.quest_lyra_chrono_crypt_calibration.status)
    .toBe('READY_TO_COMPLETE');
  await resolveAndTurnIn(
    store,
    'quest_lyra_chrono_crypt_calibration',
    'coordinate_without_conceding',
    'npc_lyra'
  );

  await interact(store, 'npc_lyra', 'lyra_ideological_friction', 'argue');
  await interact(store, 'npc_lyra', 'lyra_mutual_calibration', 'calibrate');
  await interact(store, 'npc_lyra', 'lyra_enemies_in_phase', 'solve');

  expect(selectOpeningCampaignStage(store.getState())).toBe('GC03_COMPLETE');
};

const playChapterFour = async (store: TestStore) => {
  await interact(
    store,
    'npc_scholar_elara',
    'elara_gc06_lattice_diagnosis',
    'diagnose'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_gc06_lattice_briefing',
    'brief'
  );

  await store.dispatch(startQuestThunk('quest_gc06_lattice_under_strain')).unwrap();
  await travel(store, MERCHANT_DISTRICT_LOCATION_ID);
  await resolveAndTurnIn(
    store,
    'quest_gc06_lattice_under_strain',
    'contain_surface_failures',
    'npc_scholar_elara'
  );

  await interact(
    store,
    'npc_captain_valerius',
    'valerius_gc06_stabilize_lattice',
    'stabilize'
  );
  await interact(
    store,
    'npc_lyra',
    'lyra_gc06_chrono_crypt_route',
    'agree'
  );
  expect(selectChapterProgress(store.getState(), 'lattice_under_strain').status)
    .toBe('complete');
};

const playChapterFive = async (store: TestStore) => {
  await store.dispatch(startQuestThunk('quest_gc07_counterphase_principle')).unwrap();
  await travel(store, CITY_CENTER_LOCATION_ID);
  await travel(store, CITY_GATE_LOCATION_ID);
  await travel(store, WHISPERING_WOODS_LOCATION_ID);
  await travel(store, CHRONO_CRYPT_LOCATION_ID);
  await resolveAndTurnIn(
    store,
    'quest_gc07_counterphase_principle',
    'manual_harmonic_triangulation',
    'npc_lyra'
  );
  await interact(
    store,
    'npc_lyra',
    'lyra_gc07_counterphase_interpretation',
    'record'
  );
  expect(selectChapterProgress(store.getState(), 'chrono_crypt').status)
    .toBe('complete');
};

const playChapterSix = async (store: TestStore) => {
  await interact(
    store,
    'npc_scholar_elara',
    'elara_gc08_network_diagnosis',
    'brief'
  );
  await store.dispatch(startQuestThunk('quest_gc08_distributed_preparation')).unwrap();

  await travel(store, WHISPERING_WOODS_LOCATION_ID);
  await travel(store, CITY_GATE_LOCATION_ID);
  await travel(store, CITY_CENTER_LOCATION_ID);
  await travel(store, MERCHANT_DISTRICT_LOCATION_ID);

  await resolveAndTurnIn(
    store,
    'quest_gc08_distributed_preparation',
    'prepare_distributed_baseline',
    'npc_scholar_elara'
  );
  await interact(store, 'npc_lyra', 'lyra_gc08_commit_distributed', 'commit');

  expect(selectNetworkPosture(
    store.getState(),
    MERCHANT_DISTRICT_LOCATION_ID
  )).toBe('distributed');
  expect(selectChapterProgress(store.getState(), 'network_under_pressure').status)
    .toBe('complete');
};

const playChapterSeven = async (store: TestStore) => {
  await interact(store, 'npc_lyra', 'lyra_gc09_prepare_distributed', 'prepare');
  await store.dispatch(startQuestThunk('quest_gc09_distributed_counterphase')).unwrap();

  // The player is already in the Merchant District, so move away and return to
  // produce the same REACH_LOCATION event ordinary travel emits.
  await travel(store, CITY_CENTER_LOCATION_ID);
  await travel(store, MERCHANT_DISTRICT_LOCATION_ID);

  await resolveAndTurnIn(
    store,
    'quest_gc09_distributed_counterphase',
    'prepare_distributed_finale',
    'npc_lyra'
  );
  await interact(store, 'npc_lyra', 'lyra_gc09_commit_distributed', 'commit');

  expect(selectCounterphasePlan(
    store.getState(),
    MERCHANT_DISTRICT_LOCATION_ID
  )).toBe('distributed');
  expect(selectChapterProgress(store.getState(), 'counterphase').status)
    .toBe('complete');
};

const playFinale = async (store: TestStore) => {
  await interact(
    store,
    'npc_lyra',
    'lyra_gc10_enter_distributed_finale',
    'enter'
  );
  await store.dispatch(startQuestThunk('quest_gc10_telluric_echo_distributed')).unwrap();

  await travel(store, CITY_CENTER_LOCATION_ID);
  await travel(store, CITY_GATE_LOCATION_ID);
  await travel(store, WHISPERING_WOODS_LOCATION_ID);

  await resolveAndTurnIn(
    store,
    'quest_gc10_telluric_echo_distributed',
    'resolve_distributed_dissipation',
    'npc_lyra'
  );
  await interact(
    store,
    'npc_lyra',
    'lyra_gc10_aftermath_distributed',
    'record'
  );
};

describe('GC-11 whole-game Alpha qualification', () => {
  test('fresh production-action New Game legally reaches the state-responsive epilogue with representative persistence boundaries', async () => {
    const store = makeStore();
    await startupAndNewGame(store);

    expect(Object.keys(store.getState().npcs.npcs)).toEqual(['npc_elder_willow']);
    expect(store.getState().player.location).toBe(CITY_CENTER_LOCATION_ID);
    expect(selectOpeningCampaignStage(store.getState())).toBe('PROLOGUE');

    await playOpening(store);
    await saveCheckpoint(store, 2_100_000, 'Alpha early campaign', state => {
      expect(state.relationships.experiencesById.willow_exp_first_lesson)
        .toBeDefined();
      expect(state.player.location).toBe(WHISPERING_WOODS_LOCATION_ID);
    });

    await playChapterOnePublicOrder(store);
    await playChapterTwo(store);
    await playChapterThree(store);

    await saveCheckpoint(store, 2_200_000, 'Alpha mid campaign', state => {
      expect(selectOpeningCampaignStage(state)).toBe('GC03_COMPLETE');
      expect(state.relationships.experiencesById.lyra_exp_proto_bond)
        .toBeDefined();
    });

    await playChapterFour(store);
    await playChapterFive(store);
    await playChapterSix(store);
    await playChapterSeven(store);

    await saveCheckpoint(store, 2_300_000, 'Alpha pre-finale', state => {
      expect(selectCounterphasePlan(
        state,
        MERCHANT_DISTRICT_LOCATION_ID
      )).toBe('distributed');
      expect(selectChapterProgress(state, 'counterphase').status)
        .toBe('complete');
      expect(selectCampaignStatus(
        state,
        WHISPERING_WOODS_LOCATION_ID
      )).toBeUndefined();
    });

    await playFinale(store);

    expect(selectCampaignStatus(
      store.getState(),
      WHISPERING_WOODS_LOCATION_ID
    )).toBe('complete');
    expect(selectTelluricEchoOutcome(
      store.getState(),
      WHISPERING_WOODS_LOCATION_ID
    )).toBe('distributed_dissipation');
    expect(selectChapterProgress(
      store.getState(),
      'telluric_echo_finale'
    )).toMatchObject({
      status: 'complete',
      completedRouteId: 'distributed',
    });

    const epilogue = selectCampaignEpilogueProjection(store.getState());
    expect(epilogue).not.toBeNull();
    expect(epilogue?.title).toBe('Distributed Dissipation');
    expect(epilogue?.elara).not.toBeNull();
    expect(epilogue?.secondaryAnchor).not.toBeNull();

    const completed = await saveCheckpoint(
      store,
      2_400_000,
      'Alpha campaign complete',
      state => {
        expect(selectCampaignStatus(
          state,
          WHISPERING_WOODS_LOCATION_ID
        )).toBe('complete');
        expect(selectCampaignEpilogueProjection(state)).not.toBeNull();
      }
    );

    const encoded = encodeSavePayloadToBase64(completed.envelope);
    const decoded = decodeSavePayloadFromBase64(encoded);
    const importSpy = jest.spyOn(Date, 'now').mockReturnValue(2_500_000);
    const imported = createSaveFromPayload(decoded, 'Alpha imported whole campaign');
    importSpy.mockRestore();
    expect(imported).not.toBeNull();
    const importedLoaded = await loadSavedGameWithMigration(imported!.saveId);
    expect(importedLoaded).not.toBeNull();
    expect(selectCampaignStatus(
      importedLoaded!.state,
      WHISPERING_WOODS_LOCATION_ID
    )).toBe('complete');
    expect(selectCounterphasePlan(
      importedLoaded!.state,
      MERCHANT_DISTRICT_LOCATION_ID
    )).toBe('distributed');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CampaignSpinePanel />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Campaign One Complete — Distributed Dissipation'))
      .toBeInTheDocument();
    expect(screen.queryByText(/Debug/i)).not.toBeInTheDocument();
  });

  test('whole-game qualification contains no direct authored progression injection or debug dependency', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/GC11AlphaWholeGame.test.tsx'),
      'utf8'
    );
    const productionNewGame = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/MainMenu/hooks/useGameActions.ts'),
      'utf8'
    );

    const forbiddenWholeGameTokens = [
      ['recordAuthoredRelationship', 'ExperienceThunk'].join(''),
      ['recordRelationship', 'Experience('].join(''),
      ['learnNpc', 'Fact('].join(''),
      ['setWorldState', 'Condition('].join(''),
      ['addPermanent', 'Trait('].join(''),
      ['replace', 'State('].join(''),
      ['/game/', 'debug'].join(''),
    ];
    for (const token of forbiddenWholeGameTokens) {
      expect(source).not.toContain(token);
    }

    expect(productionNewGame).toContain('newGameSeedNPCsThunk');
    expect(productionNewGame).not.toContain(['navigate(\'/game/', 'debug\')'].join(''));
  });
});
