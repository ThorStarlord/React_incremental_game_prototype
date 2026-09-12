import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../app/store';
import {
  initializeNPCsThunk,
  processNPCInteractionThunk,
} from '../NPCs/state/NPCThunks';
import { initializeQuestsThunk } from '../Quest/state/QuestThunks';
import { markDialogueCompleted } from '../NPCs/state/NPCSlice';
import { markRoutineFamiliarity } from '../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { CHAPTER_DEFINITIONS } from './ChapterDefinitions';
import { selectCampaignSpineProgress } from './CampaignSpine';
import { selectCampaignCompletion } from '../Meta/state/MetaSlice';
import { createSave, createSaveFromPayload, decodeSavePayloadFromBase64, encodeSavePayloadToBase64, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');
const campaignContent = readJson('public/data/campaign-one-content.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });
type QualificationStore = ReturnType<typeof makeStore>;

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') return { ok: true, json: async () => clone(npcs) } as any;
    if (url === '/data/dialogues.json') return { ok: true, json: async () => clone(dialogues) } as any;
    if (url === '/data/quests.json') return { ok: true, json: async () => clone(quests) } as any;
    if (url === '/data/campaign-one-content.json') return { ok: true, json: async () => clone(campaignContent) } as any;
    if (url === '/data/relationships/index.json') return { ok: true, json: async () => clone(manifest) } as any;
    if (bundleByUrl[url]) return { ok: true, json: async () => clone(bundleByUrl[url]) } as any;
    return { ok: false, statusText: `Unexpected test URL: ${url}` } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

const interact = async (
  store: QualificationStore,
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
};

const seedPreCampaignEvidence = async (store: QualificationStore) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();

  // Chapters 1–3 have independent qualification suites. This composition uses
  // their canonical relationship evidence and then executes every new Campaign
  // One decision through the production dialogue interaction thunk below.
  await store.dispatch(recordAuthoredRelationshipExperienceThunk({
    experienceId: 'willow_exp_first_lesson',
  })).unwrap();

  const earlierExperienceIds = CHAPTER_DEFINITIONS
    .slice(0, 3)
    .flatMap(chapter => chapter.routes.flatMap(route =>
      'requiredExperienceIds' in route ? route.requiredExperienceIds : []
    ));
  const campaignOpeningEvidence = [
    'valerius_exp_aftermath_public_crackdown',
    'gronk_exp_aftermath_quiet_reroute',
  ];
  for (const experienceId of Array.from(new Set([...earlierExperienceIds, ...campaignOpeningEvidence]))) {
    await store.dispatch(recordAuthoredRelationshipExperienceThunk({ experienceId })).unwrap();
  }

  store.dispatch(markDialogueCompleted({
    npcId: 'npc_captain_valerius',
    dialogueId: 'valerius_m25_public_order_conclusion',
  }));
  store.dispatch(markRoutineFamiliarity({
    routineId: 'archive_fieldwork',
    source: 'archive_fieldwork',
    learnedAt: 1,
  }));
};

const runHistory = async (route: 'institutional' | 'network') => {
  const store = makeStore();
  await seedPreCampaignEvidence(store);
  const checkpoints: Array<{ name: string; state: ReturnType<QualificationStore['getState']> }> = [
    { name: 'early', state: store.getState() },
  ];

  await interact(
    store,
    'npc_captain_valerius',
    'valerius_lattice_under_strain',
    route === 'institutional' ? 'visible' : 'quiet'
  );
  await interact(
    store,
    'npc_scholar_elara',
    'elara_chrono_crypt_briefing',
    route === 'institutional' ? 'verify' : 'simplify'
  );
  await interact(
    store,
    'npc_lyra',
    'lyra_chrono_crypt_entry',
    route === 'institutional' ? 'coordinate' : 'contest'
  );
  checkpoints.push({ name: 'mid', state: store.getState() });
  await interact(
    store,
    'npc_blacksmith_gronk',
    'gronk_network_load',
    route === 'institutional' ? 'audit' : 'rush'
  );
  await interact(
    store,
    'npc_rogue_silas',
    'silas_network_pressure',
    route === 'institutional' ? 'trusted' : 'sealed'
  );
  await interact(
    store,
    'npc_captain_valerius',
    'valerius_counterphase_commitment',
    route === 'institutional' ? 'institutional' : 'network'
  );
  checkpoints.push({ name: 'pre-finale', state: store.getState() });
  await interact(
    store,
    'npc_captain_valerius',
    'telluric_echo_confrontation',
    route === 'institutional' ? 'institutional_reckoning' : 'conditional_reprieve'
  );
  checkpoints.push({ name: 'post-complete', state: store.getState() });

  return { store, checkpoints };
};

describe('Campaign One whole-game qualification', () => {
  test('executes both legal Campaign One histories through production dialogue effects', async () => {
    const institutional = (await runHistory('institutional')).store;
    const network = (await runHistory('network')).store;

    const institutionalProgress = selectCampaignSpineProgress(institutional.getState());
    const networkProgress = selectCampaignSpineProgress(network.getState());
    expect(Object.values(institutionalProgress).every(unit => unit.status === 'complete')).toBe(true);
    expect(Object.values(networkProgress).every(unit => unit.status === 'complete')).toBe(true);

    expect(selectCampaignCompletion(institutional.getState())).toEqual(expect.objectContaining({
      epilogueVariant: 'institutional_reckoning',
    }));
    expect(selectCampaignCompletion(network.getState())).toEqual(expect.objectContaining({
      epilogueVariant: 'conditional_reprieve',
    }));

    expect(institutional.getState().relationships.experiencesById)
      .not.toEqual(network.getState().relationships.experiencesById);
    expect(institutional.getState().factions).not.toEqual(network.getState().factions);
  });

  test('preserves early, mid, pre-finale and post-complete saves through the canonical boundary', async () => {
    const checkpoints = (await runHistory('institutional')).checkpoints;
    const nowSpy = jest.spyOn(Date, 'now');

    for (let index = 0; index < checkpoints.length; index += 1) {
      const checkpoint = checkpoints[index];
      nowSpy.mockReturnValue(20000 + index);
      const saveId = createSave(checkpoint.state, `Qualification ${checkpoint.name}`);
      expect(saveId).toBe(`save_${20000 + index}`);
      const loaded = await loadSavedGameWithMigration(saveId!);
      expect(loaded?.state.meta.campaignCompletion).toEqual(checkpoint.state.meta.campaignCompletion);

      const exportCode = encodeSavePayloadToBase64(loaded?.envelope);
      const imported = createSaveFromPayload(decodeSavePayloadFromBase64(exportCode), `Imported ${checkpoint.name}`);
      expect(imported?.migration.envelope.schemaVersion).toBe(1);
    }

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(createSaveFromPayload({ invalid: true }, 'Invalid import')).toBeNull();
    errorSpy.mockRestore();
    nowSpy.mockRestore();
  });
});
