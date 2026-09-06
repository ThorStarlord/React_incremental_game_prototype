import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { initializeNPCsThunk } from '../../NPCs/state/NPCThunks';
import { calculateEssenceGenerationRate } from '../../Essence/utils/essenceRate';
import {
  recordAuthoredRelationshipExperienceThunk,
} from './RelationshipThunks';
import {
  selectAllRelationshipEssenceContributions,
  selectBondProfileByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';
import {
  createSave,
  createSaveFromPayload,
  decodeSavePayloadFromBase64,
  encodeSavePayloadToBase64,
  loadSavedGameWithMigration,
} from '../../../shared/utils/saveUtils';

const GRONK_ID = 'npc_blacksmith_gronk';
const SILAS_ID = 'npc_rogue_silas';
const VALERIUS_ID = 'npc_captain_valerius';

const EXPERIENCE_IDS: Record<string, string[]> = {
  [GRONK_ID]: [
    'gronk_exp_steel_not_flattery',
    'gronk_exp_measure_twice',
    'gronk_exp_quality_over_finish',
    'gronk_exp_blade_that_held',
  ],
  [SILAS_ID]: [
    'silas_exp_price_of_truth',
    'silas_exp_package_unopened',
    'silas_exp_leverage_named',
    'silas_exp_secret_neither_sold',
  ],
  [VALERIUS_ID]: [
    'valerius_exp_objective_before_obedience',
    'valerius_exp_report_without_theatre',
    'valerius_exp_order_questioned',
  ],
};

const MEMORY_IDS: Record<string, string> = {
  [GRONK_ID]: 'gronk_memory_blade_that_held',
  [SILAS_ID]: 'silas_memory_secret_neither_sold',
  [VALERIUS_ID]: 'valerius_memory_order_questioned',
};

const EXPECTED_PROGRESS: Record<string, number> = {
  [GRONK_ID]: 56,
  [SILAS_ID]: 58,
  [VALERIUS_ID]: 55,
};

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') {
      return { ok: true, json: async () => npcs } as any;
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
  jest.restoreAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('M12 multi-NPC production coexistence and persistence', () => {
  test('Gronk, Silas, and Valerius remain isolated, aggregate Essence generically, and survive local/save-code round trips', async () => {
    const store = makeStore();
    await store.dispatch(initializeNPCsThunk()).unwrap();

    // Legacy NPC fields exist in production data, but the M12 relationship paths
    // begin from Relationship authority rather than inheriting those old depths.
    expect(store.getState().npcs.npcs[GRONK_ID].connectionDepth).toBe(1);
    expect(store.getState().npcs.npcs[SILAS_ID].connectionDepth).toBe(3);
    expect(store.getState().npcs.npcs[VALERIUS_ID].connectionDepth).toBe(4);
    for (const npcId of [GRONK_ID, SILAS_ID, VALERIUS_ID]) {
      expect(selectBondProfileByNpcId(store.getState(), npcId).connectionLevel).toBe(0);
    }

    const essenceBefore = store.getState().essence.currentEssence;

    for (const npcId of [GRONK_ID, SILAS_ID, VALERIUS_ID]) {
      for (const experienceId of EXPERIENCE_IDS[npcId]) {
        await store.dispatch(
          recordAuthoredRelationshipExperienceThunk({ experienceId })
        ).unwrap();
      }
    }

    // Relationship Experiences can change the passive rate but cannot mint the
    // currently held resource balance merely by being recorded.
    expect(store.getState().essence.currentEssence).toBe(essenceBefore);

    for (const npcId of [GRONK_ID, SILAS_ID, VALERIUS_ID]) {
      const profile = selectBondProfileByNpcId(store.getState(), npcId);
      expect(profile.connectionLevel).toBe(2);
      expect(profile.connectionProgress).toBe(EXPECTED_PROGRESS[npcId]);

      const experiences = selectRelationshipExperiencesByNpcId(store.getState(), npcId);
      expect(experiences.map(experience => experience.id)).toEqual(EXPERIENCE_IDS[npcId]);
      expect(experiences.every(experience => experience.primaryTargetId === npcId)).toBe(true);

      const memories = selectRelationshipMemoriesByNpcId(store.getState(), npcId);
      expect(memories).toHaveLength(1);
      expect(memories[0].id).toBe(MEMORY_IDS[npcId]);
      expect(memories[0].primaryTargetId).toBe(npcId);

      const evidenceIds = Object.values(profile.connectionQualificationEvidence).flat();
      expect(
        evidenceIds.every(evidenceId =>
          evidenceId.startsWith(
            npcId === GRONK_ID ? 'gronk_' : npcId === SILAS_ID ? 'silas_' : 'valerius_'
          )
        )
      ).toBe(true);
    }

    const allExperienceIds = [GRONK_ID, SILAS_ID, VALERIUS_ID].flatMap(npcId =>
      selectRelationshipExperiencesByNpcId(store.getState(), npcId).map(experience => experience.id)
    );
    expect(new Set(allExperienceIds).size).toBe(allExperienceIds.length);

    const allMemoryIds = [GRONK_ID, SILAS_ID, VALERIUS_ID].flatMap(npcId =>
      selectRelationshipMemoriesByNpcId(store.getState(), npcId).map(memory => memory.id)
    );
    expect(new Set(allMemoryIds).size).toBe(allMemoryIds.length);

    const contributions = selectAllRelationshipEssenceContributions(store.getState());
    expect(contributions.map(contribution => contribution.npcId).sort()).toEqual(
      [GRONK_ID, SILAS_ID, VALERIUS_ID].sort()
    );
    expect(contributions.every(contribution => contribution.effectiveRate > 0)).toBe(true);

    const rate = calculateEssenceGenerationRate(store.getState());
    const summedRelationshipRate = contributions.reduce(
      (total, contribution) => total + contribution.effectiveRate,
      0
    );
    expect(rate.relationshipRate).toBeCloseTo(summedRelationshipRate, 10);
    expect(store.getState().essence.generationRate).toBeCloseTo(rate.newRate, 10);

    jest.spyOn(Date, 'now').mockReturnValue(12000);
    const saveId = createSave(store.getState(), 'M12 Mixed Relationships');
    expect(saveId).toBe('save_12000');

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();
    expect(loaded!.state.essence.currentEssence).toBe(essenceBefore);
    expect(loaded!.state.essence.generationRate).toBeCloseTo(rate.newRate, 10);

    for (const npcId of [GRONK_ID, SILAS_ID, VALERIUS_ID]) {
      expect(selectBondProfileByNpcId(loaded!.state, npcId)).toEqual(
        selectBondProfileByNpcId(store.getState(), npcId)
      );
      expect(selectRelationshipExperiencesByNpcId(loaded!.state, npcId)).toEqual(
        selectRelationshipExperiencesByNpcId(store.getState(), npcId)
      );
      expect(selectRelationshipMemoriesByNpcId(loaded!.state, npcId)).toEqual(
        selectRelationshipMemoriesByNpcId(store.getState(), npcId)
      );
    }

    const saveCode = encodeSavePayloadToBase64(loaded!.envelope);
    const decoded = decodeSavePayloadFromBase64(saveCode);

    (Date.now as jest.Mock).mockReturnValue(13000);
    const imported = createSaveFromPayload(decoded, 'M12 Imported Mixed Relationships');
    expect(imported).not.toBeNull();
    expect(imported!.saveId).toBe('save_13000');

    const importedLoaded = await loadSavedGameWithMigration(imported!.saveId);
    expect(importedLoaded).not.toBeNull();
    expect(importedLoaded!.state.essence.currentEssence).toBe(essenceBefore);
    expect(importedLoaded!.state.essence.generationRate).toBeCloseTo(rate.newRate, 10);

    for (const npcId of [GRONK_ID, SILAS_ID, VALERIUS_ID]) {
      expect(selectBondProfileByNpcId(importedLoaded!.state, npcId)).toEqual(
        selectBondProfileByNpcId(store.getState(), npcId)
      );
      expect(selectRelationshipExperiencesByNpcId(importedLoaded!.state, npcId)).toEqual(
        selectRelationshipExperiencesByNpcId(store.getState(), npcId)
      );
      expect(selectRelationshipMemoriesByNpcId(importedLoaded!.state, npcId)).toEqual(
        selectRelationshipMemoriesByNpcId(store.getState(), npcId)
      );
    }
  });
});
