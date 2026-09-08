import fs from 'fs';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { knowledgeListeners } from '../Knowledge/state/KnowledgeListeners';
import { FORGE_ASSISTANCE_PRACTICED_FACT_ID } from '../Knowledge/KnowledgeDefinitions';
import { selectNpcKnowsFact } from '../Knowledge/state/KnowledgeSelectors';
import {
  initializeNPCsThunk,
  processNPCInteractionThunk,
} from './state/NPCThunks';
import { setSelectedNPCId } from './state/NPCSlice';
import {
  initializeQuestsThunk,
  resolveQuestOutcomeThunk,
  startQuestThunk,
  turnInQuestThunk,
} from '../Quest/state/QuestThunks';
import { addPermanentTrait } from '../Player/state/PlayerSlice';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
  MERCHANT_DISTRICT_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
} from '../Exploration/LocationDefinitions';
import {
  practiceForgeAssistanceThunk,
  travelToLocationThunk,
} from '../Exploration/TravelThunks';
import {
  recordAuthoredRelationshipExperienceThunk,
} from '../Relationships/state/RelationshipThunks';
import { selectBondProfileByNpcId } from '../Relationships/state/RelationshipSelectors';
import ActiveQuestCombatPanel from '../Combat/components/ActiveQuestCombatPanel';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import {
  selectTradeFlow,
  selectWatchPresence,
} from '../WorldState/state/WorldStateSelectors';
import { updateCopy } from '../Copy/state/CopySlice';
import type { Copy } from '../Copy/state/CopyTypes';
import { startCopyProductionTaskThunk } from '../Copy/state/CopyThunks';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { settleOfflineProgressThunk } from '../GameLoop/state/OfflineProgress';

const GRONK_ID = 'npc_blacksmith_gronk';
const SILAS_ID = 'npc_rogue_silas';
const VALERIUS_ID = 'npc_captain_valerius';
const WILLOW_ID = 'npc_elder_willow';
const CITY_WATCH = 'City Watch';
const MERCHANTS_GUILD = 'Merchants Guild';
const WISDOM_ID = 'WillowsWisdom';

const COUNCIL_ID = 'valerius_m14_aftermath_council';
const QUIET_QUEST_ID = 'quest_m14_quiet_reroute';
const INQUIRY_ID = 'valerius_m15_forged_ledger_inquiry';
const REINFORCED_CALLBACK_ID = 'silas_m15_debt_still_counts';
const CONTRADICTED_CALLBACK_ID = 'silas_m15_debt_not_renewed';
const COMBAT_QUEST_ID = 'quest_m17_telluric_echo';
const FORGE_REPORT_ID = 'valerius_m22_forge_report';
const FORGE_CONSUMER_ID = 'valerius_m22_forge_logistics';
const PUBLIC_OVERRIDE_ID = 'valerius_m23_public_override';
const GUILD_AUDIT_ID = 'gronk_m23_guild_audit';
const PATROL_MUTATION_ID = 'valerius_m24_redeploy_patrols';
const PATROL_CONSUMER_ID = 'silas_m24_patrol_pressure';
const FREIGHT_MUTATION_ID = 'gronk_m24_release_verified_freight';
const FREIGHT_CONSUMER_ID = 'valerius_m24_freight_corridor';
const PUBLIC_CONCLUSION_ID = 'valerius_m25_public_order_conclusion';
const QUIET_CONCLUSION_ID = 'gronk_m25_quiet_network_conclusion';

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
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const manifest = readJson('public/data/relationships/index.json');
const baseNpcs = readJson('public/data/npcs.json');
const baseDialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');
const traits = readJson('public/data/traits.json');
const m24Content = readJson('public/data/m24-world-state-content.json');
const m25Content = readJson('public/data/m25-chapter-content.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(
    gameEventListeners.middleware,
    knowledgeListeners.middleware
  ),
});
type TestStore = ReturnType<typeof makeStore>;

const originalFetch = global.fetch;
let fetchedUrls: string[] = [];

beforeEach(() => {
  localStorage.clear();
  fetchedUrls = [];
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    fetchedUrls.push(url);
    if (url === '/data/npcs.json') return { ok: true, json: async () => clone(baseNpcs) } as any;
    if (url === '/data/dialogues.json') return { ok: true, json: async () => clone(baseDialogues) } as any;
    if (url === '/data/quests.json') return { ok: true, json: async () => clone(quests) } as any;
    if (url === '/data/traits.json') return { ok: true, json: async () => clone(traits) } as any;
    if (url === '/data/m24-world-state-content.json') {
      return { ok: true, json: async () => clone(m24Content) } as any;
    }
    if (url === '/data/m25-chapter-content.json') {
      return { ok: true, json: async () => clone(m25Content) } as any;
    }
    if (url === '/data/relationships/index.json') {
      return { ok: true, json: async () => clone(manifest) } as any;
    }
    if (bundleByUrl[url]) return { ok: true, json: async () => clone(bundleByUrl[url]) } as any;
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

const initializeProductionRuntime = async (store: TestStore) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
};

const seedChapterEntry = async (store: TestStore) => {
  await initializeProductionRuntime(store);
  for (const experienceId of [...GRONK_HISTORY, ...SILAS_HISTORY, ...VALERIUS_HISTORY]) {
    await store.dispatch(recordAuthoredRelationshipExperienceThunk({ experienceId })).unwrap();
  }
  store.dispatch(addPermanentTrait(WISDOM_ID));
  store.dispatch(updateCopy({
    copyId: 'copy-001',
    updates: {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    } as Partial<Copy>,
  }));
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
    context: { choiceId, selectedResponse },
  })).unwrap();
  expect(result.success).toBe(true);
  return result;
};

const travel = async (store: TestStore, destination: string) => {
  const result = await store.dispatch(travelToLocationThunk(destination));
  expect(travelToLocationThunk.fulfilled.match(result)).toBe(true);
};

const runCombat = async (store: TestStore, useWisdomTactic: boolean) => {
  await store.dispatch(startQuestThunk(COMBAT_QUEST_ID)).unwrap();
  expect(store.getState().quest.quests[COMBAT_QUEST_ID].status).toBe('IN_PROGRESS');
  expect(store.getState().player.location).toBe(WHISPERING_WOODS_LOCATION_ID);

  render(
    <Provider store={store}>
      <ActiveQuestCombatPanel />
    </Provider>
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Begin Encounter' }));

  if (useWisdomTactic) {
    fireEvent.click(screen.getByRole('button', { name: 'Strike' }));
    expect(screen.getByRole('button', { name: 'Trace the Cycle' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trace the Cycle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Disrupt the Feedback' }));
    fireEvent.click(screen.getByRole('button', { name: 'Strike' }));
    fireEvent.click(screen.getByRole('button', { name: 'Strike' }));
  } else {
    for (const action of ['Strike', 'Guard', 'Strike', 'Strike', 'Guard', 'Strike']) {
      fireEvent.click(screen.getByRole('button', { name: action }));
    }
  }

  await waitFor(() => {
    expect(store.getState().quest.quests[COMBAT_QUEST_ID].status).toBe('READY_TO_COMPLETE');
  });
  expect(store.getState().quest.quests[COMBAT_QUEST_ID].objectives[0].currentCount).toBe(1);
  cleanup();

  store.dispatch(setSelectedNPCId(WILLOW_ID));
  await store.dispatch(turnInQuestThunk(COMBAT_QUEST_ID)).unwrap();
  expect(store.getState().quest.quests[COMBAT_QUEST_ID].status).toBe('COMPLETED');
};

const performForgeKnowledgeAndDelegation = async (store: TestStore) => {
  const practiced = await store.dispatch(practiceForgeAssistanceThunk());
  expect(practiceForgeAssistanceThunk.fulfilled.match(practiced)).toBe(true);
  expect(selectNpcKnowsFact(store.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
  expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);

  const relationshipsBeforeReport = clone(store.getState().relationships);
  await interact(store, VALERIUS_ID, FORGE_REPORT_ID, 'report');
  expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
  expect(store.getState().relationships).toEqual(relationshipsBeforeReport);
  await interact(store, VALERIUS_ID, FORGE_CONSUMER_ID, 'answer');

  const copyStart = await store.dispatch(startCopyProductionTaskThunk({
    copyId: 'copy-001',
    taskId: 'forge_assistance',
  }));
  expect(startCopyProductionTaskThunk.fulfilled.match(copyStart)).toBe(true);
  expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
    productionTaskId: 'forge_assistance',
    status: 'running',
  });
};

const saveRestoreAndSettleRoutine = async (
  store: TestStore,
  saveTimestamp: number
): Promise<TestStore> => {
  jest.spyOn(Date, 'now').mockReturnValue(saveTimestamp);
  const saveId = createSave(store.getState(), `M25 route ${saveTimestamp}`);
  expect(saveId).toBe(`save_${saveTimestamp}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();
  jest.restoreAllMocks();

  const resumed = makeStore();
  resumed.dispatch(replaceState(loaded!.state));
  const storyBeforeOffline = {
    relationships: clone(resumed.getState().relationships),
    quest: clone(resumed.getState().quest),
    knowledge: clone(resumed.getState().knowledge),
    factions: clone(resumed.getState().factions),
    worldState: clone(resumed.getState().worldState),
    location: resumed.getState().player.location,
  };
  const goldBefore = resumed.getState().player.gold;

  const settled = await resumed.dispatch(settleOfflineProgressThunk({
    savedTimestamp: saveTimestamp,
    resumeTimestamp: saveTimestamp + 120_000,
  })).unwrap();
  expect(settled.skipReason).toBeUndefined();
  expect(settled.tasks).toEqual([
    expect.objectContaining({ productionTaskId: 'forge_assistance', completed: true }),
  ]);
  expect(resumed.getState().copy.copies['copy-001'].activeTask).toBeNull();
  expect(resumed.getState().player.gold).toBe(goldBefore + 15);
  expect(resumed.getState().relationships).toEqual(storyBeforeOffline.relationships);
  expect(resumed.getState().quest).toEqual(storyBeforeOffline.quest);
  expect(resumed.getState().knowledge).toEqual(storyBeforeOffline.knowledge);
  expect(resumed.getState().factions).toEqual(storyBeforeOffline.factions);
  expect(resumed.getState().worldState).toEqual(storyBeforeOffline.worldState);
  expect(resumed.getState().player.location).toBe(storyBeforeOffline.location);
  return resumed;
};

describe('M25 complete chapter vertical slice qualification', () => {
  test('M25 adds only two conclusion consumers and production initialization merges both bounded extensions', async () => {
    expect(Object.keys(m25Content.dialogues).sort()).toEqual([
      QUIET_CONCLUSION_ID,
      PUBLIC_CONCLUSION_ID,
    ].sort());
    for (const node of Object.values(m25Content.dialogues) as any[]) {
      expect(node.repeatable).toBe(false);
      expect(node.effects).toEqual([]);
      expect(JSON.stringify(node)).not.toContain('chapterComplete');
      expect(JSON.stringify(node)).not.toContain('m25Route');
    }

    const store = makeStore();
    await initializeProductionRuntime(store);
    expect(fetchedUrls).toContain('/data/m24-world-state-content.json');
    expect(fetchedUrls).toContain('/data/m25-chapter-content.json');
    expect(store.getState().npcs.dialogueNodes[PATROL_MUTATION_ID]).toBeDefined();
    expect(store.getState().npcs.dialogueNodes[PUBLIC_CONCLUSION_ID]).toBeDefined();
    expect(store.getState().npcs.npcs[VALERIUS_ID]!.availableDialogues).toContain(PUBLIC_CONCLUSION_ID);
    expect(store.getState().npcs.npcs[GRONK_ID]!.availableDialogues).toContain(QUIET_CONCLUSION_ID);

    const npcThunkSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/NPCs/state/NPCThunks.ts'),
      'utf8'
    );
    expect(npcThunkSource).toContain("'/data/m24-world-state-content.json'");
    expect(npcThunkSource).toContain("'/data/m25-chapter-content.json'");
    expect(npcThunkSource).not.toContain('glob(');
    expect(npcThunkSource).not.toContain('import.meta.glob');

    for (const sourceFile of [
      'src/app/store.ts',
      'src/shared/utils/saveSchema.ts',
      'src/features/Quest/state/QuestTypes.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain('merchantCrisisComplete');
      expect(source).not.toContain('m25Route');
      expect(source).not.toContain('chapterResult');
    }
  });

  test('both route conclusions fail closed below UI before composed chapter evidence exists', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);

    const publicAttempt = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: PUBLIC_CONCLUSION_ID, selectedResponse: 'close' },
    })).unwrap();
    expect(publicAttempt.success).toBe(false);
    expect(publicAttempt.message).toContain('Missing relationship evidence');

    const quietAttempt = await store.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: QUIET_CONCLUSION_ID, selectedResponse: 'close' },
    })).unwrap();
    expect(quietAttempt.success).toBe(false);
    expect(quietAttempt.message).toContain('Missing relationship evidence');
  });

  test('Route A composes public-order friction through combat, Knowledge, Faction, World State, persistence and offline routine delegation', async () => {
    const store = makeStore();
    await seedChapterEntry(store);

    const silasBeforeCouncil = clone(selectBondProfileByNpcId(store.getState(), SILAS_ID));
    const valeriusBeforeCouncil = clone(selectBondProfileByNpcId(store.getState(), VALERIUS_ID));
    await interact(store, VALERIUS_ID, COUNCIL_ID, 'public_crackdown');
    expect(store.getState().relationships.experiencesById.silas_exp_aftermath_public_crackdown).toBeDefined();
    expect(store.getState().relationships.experiencesById.valerius_exp_aftermath_public_crackdown).toBeDefined();
    expect(selectBondProfileByNpcId(store.getState(), SILAS_ID).dimensions.trust)
      .toBeLessThan(silasBeforeCouncil.dimensions.trust);
    expect(selectBondProfileByNpcId(store.getState(), VALERIUS_ID).dimensions.trust)
      .toBeGreaterThan(valeriusBeforeCouncil.dimensions.trust);

    await interact(store, VALERIUS_ID, INQUIRY_ID, 'investigate');
    await interact(store, SILAS_ID, CONTRADICTED_CALLBACK_ID, 'confirm_limit');
    expect(store.getState().relationships.experiencesById.silas_exp_old_silence_reinterpreted).toBeDefined();

    await travel(store, CITY_GATE_LOCATION_ID);
    await travel(store, WHISPERING_WOODS_LOCATION_ID);
    await runCombat(store, false);
    await travel(store, CITY_GATE_LOCATION_ID);
    await travel(store, CITY_CENTER_LOCATION_ID);

    await performForgeKnowledgeAndDelegation(store);

    const valeriusBeforeOverride = clone(selectBondProfileByNpcId(store.getState(), VALERIUS_ID));
    await interact(store, VALERIUS_ID, PUBLIC_OVERRIDE_ID, 'own_override');
    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(-10);
    expect(selectBondProfileByNpcId(store.getState(), VALERIUS_ID).dimensions.trust)
      .toBeGreaterThan(valeriusBeforeOverride.dimensions.trust);
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(0);

    await interact(store, VALERIUS_ID, PATROL_MUTATION_ID, 'redeploy');
    expect(selectWatchPresence(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('heavy');
    expect(selectTradeFlow(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    await interact(store, SILAS_ID, PATROL_CONSUMER_ID, 'acknowledge');

    expect(store.getState().npcs.npcs[VALERIUS_ID]!.completedDialogues).not.toContain(PUBLIC_CONCLUSION_ID);
    const resumed = await saveRestoreAndSettleRoutine(store, 1_000_000);
    expect(selectFactionReputation(resumed.getState(), CITY_WATCH)).toBe(-10);
    expect(selectWatchPresence(resumed.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('heavy');
    expect(resumed.getState().relationships.experiencesById.silas_exp_old_silence_reinterpreted).toBeDefined();
    expect(resumed.getState().player.permanentTraits).toContain(WISDOM_ID);
    expect(selectNpcKnowsFact(resumed.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
    expect(resumed.getState().npcs.npcs[VALERIUS_ID]!.completedDialogues).not.toContain(PUBLIC_CONCLUSION_ID);

    const opposite = await resumed.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: QUIET_CONCLUSION_ID, selectedResponse: 'close' },
    })).unwrap();
    expect(opposite.success).toBe(false);

    const domainBeforeConclusion = {
      relationships: clone(resumed.getState().relationships),
      knowledge: clone(resumed.getState().knowledge),
      factions: clone(resumed.getState().factions),
      worldState: clone(resumed.getState().worldState),
      quest: clone(resumed.getState().quest),
    };
    await interact(resumed, VALERIUS_ID, PUBLIC_CONCLUSION_ID, 'close');
    expect(resumed.getState().relationships).toEqual(domainBeforeConclusion.relationships);
    expect(resumed.getState().knowledge).toEqual(domainBeforeConclusion.knowledge);
    expect(resumed.getState().factions).toEqual(domainBeforeConclusion.factions);
    expect(resumed.getState().worldState).toEqual(domainBeforeConclusion.worldState);
    expect(resumed.getState().quest).toEqual(domainBeforeConclusion.quest);
    expect(resumed.getState().npcs.npcs[VALERIUS_ID]!.completedDialogues).toContain(PUBLIC_CONCLUSION_ID);
  });

  test('Route B composes quiet rerouting through real travel work, long-horizon reciprocity, Wisdom combat, Guild standing, freight recovery and offline delegation', async () => {
    const store = makeStore();
    await seedChapterEntry(store);

    await interact(store, VALERIUS_ID, COUNCIL_ID, 'quiet_reroute');
    expect(store.getState().relationships.experiencesById.gronk_exp_aftermath_quiet_reroute).toBeDefined();
    expect(store.getState().relationships.experiencesById.silas_exp_aftermath_quiet_reroute).toBeDefined();
    expect(store.getState().npcs.npcs[VALERIUS_ID]!.availableQuests).toContain(QUIET_QUEST_ID);

    await store.dispatch(startQuestThunk(QUIET_QUEST_ID)).unwrap();
    expect(store.getState().quest.quests[QUIET_QUEST_ID].status).toBe('IN_PROGRESS');
    await travel(store, MERCHANT_DISTRICT_LOCATION_ID);
    await waitFor(() => {
      expect(store.getState().quest.quests[QUIET_QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });
    await store.dispatch(resolveQuestOutcomeThunk({
      questId: QUIET_QUEST_ID,
      resolutionId: 'prove_reroute',
    })).unwrap();
    expect(store.getState().relationships.experiencesById.gronk_exp_quiet_reroute_proven).toBeDefined();
    store.dispatch(setSelectedNPCId(VALERIUS_ID));
    await store.dispatch(turnInQuestThunk(QUIET_QUEST_ID)).unwrap();
    expect(store.getState().quest.quests[QUIET_QUEST_ID].status).toBe('COMPLETED');

    await interact(store, VALERIUS_ID, INQUIRY_ID, 'investigate');
    await interact(store, SILAS_ID, REINFORCED_CALLBACK_ID, 'risk_chain');
    expect(store.getState().relationships.experiencesById.silas_exp_old_silence_repaid).toBeDefined();

    await travel(store, CITY_CENTER_LOCATION_ID);
    await travel(store, CITY_GATE_LOCATION_ID);
    await travel(store, WHISPERING_WOODS_LOCATION_ID);
    await runCombat(store, true);
    await travel(store, CITY_GATE_LOCATION_ID);
    await travel(store, CITY_CENTER_LOCATION_ID);

    await performForgeKnowledgeAndDelegation(store);

    const gronkBeforeAudit = clone(store.getState().relationships);
    await interact(store, GRONK_ID, GUILD_AUDIT_ID, 'verify');
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(12);
    expect(store.getState().relationships).toEqual(gronkBeforeAudit);
    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(0);

    await interact(store, GRONK_ID, FREIGHT_MUTATION_ID, 'release');
    expect(selectTradeFlow(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('strong');
    expect(selectWatchPresence(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    await interact(store, VALERIUS_ID, FREIGHT_CONSUMER_ID, 'acknowledge');

    const resumed = await saveRestoreAndSettleRoutine(store, 2_000_000);
    expect(resumed.getState().quest.quests[QUIET_QUEST_ID].status).toBe('COMPLETED');
    expect(resumed.getState().relationships.experiencesById.silas_exp_old_silence_repaid).toBeDefined();
    expect(selectFactionReputation(resumed.getState(), MERCHANTS_GUILD)).toBe(12);
    expect(selectTradeFlow(resumed.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('strong');
    expect(selectNpcKnowsFact(resumed.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);

    const opposite = await resumed.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: PUBLIC_CONCLUSION_ID, selectedResponse: 'close' },
    })).unwrap();
    expect(opposite.success).toBe(false);

    const domainBeforeConclusion = {
      relationships: clone(resumed.getState().relationships),
      knowledge: clone(resumed.getState().knowledge),
      factions: clone(resumed.getState().factions),
      worldState: clone(resumed.getState().worldState),
      quest: clone(resumed.getState().quest),
    };
    await interact(resumed, GRONK_ID, QUIET_CONCLUSION_ID, 'close');
    expect(resumed.getState().relationships).toEqual(domainBeforeConclusion.relationships);
    expect(resumed.getState().knowledge).toEqual(domainBeforeConclusion.knowledge);
    expect(resumed.getState().factions).toEqual(domainBeforeConclusion.factions);
    expect(resumed.getState().worldState).toEqual(domainBeforeConclusion.worldState);
    expect(resumed.getState().quest).toEqual(domainBeforeConclusion.quest);
    expect(resumed.getState().npcs.npcs[GRONK_ID]!.completedDialogues).toContain(QUIET_CONCLUSION_ID);
  });
});
