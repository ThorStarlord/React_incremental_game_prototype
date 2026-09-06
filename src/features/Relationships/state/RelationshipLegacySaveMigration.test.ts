import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { replaceState, rootReducer, type RootState } from '../../../app/store';
import { setNPCs } from '../../NPCs/state/NPCSlice';
import { loadTraits, discoverTrait } from '../../Traits/state/TraitsSlice';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { acquireTraitWithEssenceThunk } from '../../Traits/state/TraitThunks';
import { initializeBondProfile } from './RelationshipSlice';
import { initializeRelationshipRuntimeThunk } from './RelationshipThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
} from './RelationshipSelectors';

const WILLOW_ID = 'npc_elder_willow';
const ELARA_ID = 'npc_scholar_elara';
const WISDOM_ID = 'WillowsWisdom';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const willowBundle = readJson('public/data/relationships/elder-willow.json');
const npcs = readJson('public/data/npcs.json');
const traits = readJson('public/data/traits.json');

const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });

const authoredCeiling = (npcId: string, bundle: any): number =>
  Math.max(
    0,
    ...(bundle.progression[npcId]?.qualificationRules ?? []).map(
      (rule: { level: number }) => rule.level
    )
  );

const replaceWithLegacyRelationshipState = (
  store: ReturnType<typeof makeStore>,
  overrides: Record<string, { affinity: number; connectionDepth: number }>
) => {
  const current = store.getState();
  const legacyNpcs = { ...current.npcs.npcs } as Record<string, any>;

  for (const [npcId, values] of Object.entries(overrides)) {
    legacyNpcs[npcId] = {
      ...legacyNpcs[npcId],
      affinity: values.affinity,
      connectionDepth: values.connectionDepth,
    };
  }

  // A pre-Relationships save has no relationship slice at all. replaceState is
  // intentionally allowed to install that historical shape; the first normal
  // Redux action will initialize missing additive reducers before migration.
  store.dispatch(
    replaceState({
      ...current,
      npcs: {
        ...current.npcs,
        npcs: legacyNpcs,
      },
      relationships: undefined as any,
    } as RootState)
  );
};

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/relationships/index.json') {
      return { ok: true, json: async () => manifest } as any;
    }
    if (bundleByUrl[url]) {
      return { ok: true, json: async () => bundleByUrl[url] } as any;
    }
    return { ok: false, statusText: `Unexpected test URL: ${url}` } as any;
  }) as unknown as typeof fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('M9 legacy relationship save migration', () => {
  test('preserves bounded legacy Connection and Affinity without fabricating modern evidence', async () => {
    const store = makeStore();
    store.dispatch(setNPCs(npcs));

    replaceWithLegacyRelationshipState(store, {
      [WILLOW_ID]: { affinity: 37, connectionDepth: 9 },
      [ELARA_ID]: { affinity: -12, connectionDepth: 1 },
    });

    const result = await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();

    expect(result.migratedNpcIds).toEqual(expect.arrayContaining([WILLOW_ID, ELARA_ID]));

    const willow = selectBondProfileByNpcId(store.getState(), WILLOW_ID);
    expect(willow.connectionLevel).toBe(authoredCeiling(WILLOW_ID, willowBundle));
    expect(willow.connectionLevel).toBeLessThan(9);
    expect(willow.connectionProgress).toBe(0);
    expect(willow.dimensions.affinity).toBe(37);
    expect(willow.dimensions.trust).toBe(0);
    expect(willow.dimensions.understanding).toBe(0);
    expect(willow.dimensions.sharedMeaning).toBe(0);
    expect(willow.dimensions.reliance).toBe(0);
    expect(willow.dimensions.vulnerability).toBe(0);
    expect(willow.dimensions.reciprocity).toBe(0);
    expect(willow.connectionQualificationEvidence).toEqual({});
    expect(willow.provenance).toEqual({
      legacyDerived: true,
      legacyConnectionDepth: 9,
    });

    expect(selectRelationshipExperiencesByNpcId(store.getState(), WILLOW_ID)).toEqual([]);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID)).toEqual([]);
    expect(selectTraitAssimilationState(store.getState(), WILLOW_ID, WISDOM_ID).progress).toBe(0);
    expect(selectTraitAssimilationState(store.getState(), WILLOW_ID, WISDOM_ID).compatibility).toBe(0);

    const elara = selectBondProfileByNpcId(store.getState(), ELARA_ID);
    expect(elara.connectionLevel).toBe(1);
    expect(elara.dimensions.affinity).toBe(-12);
    expect(elara.provenance.legacyDerived).toBe(true);
    expect(elara.connectionQualificationEvidence).toEqual({});
  });

  test('migration is idempotent and never overwrites an existing modern Bond Profile', async () => {
    const store = makeStore();
    store.dispatch(setNPCs(npcs));

    await store
      .dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: false }))
      .unwrap();

    store.dispatch(
      initializeBondProfile({
        npcId: WILLOW_ID,
        dimensions: { affinity: 11, trust: 22, understanding: 33 },
        connectionLevel: 1,
        connectionProgress: 17,
        tetherState: 'engaged',
      })
    );

    const before = selectBondProfileByNpcId(store.getState(), WILLOW_ID);

    const current = store.getState();
    store.dispatch(
      replaceState({
        ...current,
        npcs: {
          ...current.npcs,
          npcs: {
            ...current.npcs.npcs,
            [WILLOW_ID]: {
              ...current.npcs.npcs[WILLOW_ID],
              affinity: 99,
              connectionDepth: 9,
            },
          },
        },
      } as RootState)
    );

    const first = await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();
    const second = await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();

    expect(first.migratedNpcIds).not.toContain(WILLOW_ID);
    expect(second.migratedNpcIds).not.toContain(WILLOW_ID);
    expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID)).toEqual(before);
    expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID).provenance.legacyDerived).toBe(false);
  });

  test('legacy-derived Connection can preserve weak passive Essence but cannot mint balance or bypass Trait evidence', async () => {
    const store = makeStore();
    store.dispatch(setNPCs(npcs));
    store.dispatch(loadTraits(traits));
    store.dispatch(discoverTrait({ traitId: WISDOM_ID }));
    store.dispatch(gainEssence({ amount: 100, source: 'legacy-save-test' }));

    replaceWithLegacyRelationshipState(store, {
      [WILLOW_ID]: { affinity: 30, connectionDepth: 9 },
    });

    const balanceBefore = store.getState().essence.currentEssence;
    await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();

    const state = store.getState();
    const contribution = selectRelationshipEssenceContributionByNpcId(state, WILLOW_ID);
    expect(state.essence.currentEssence).toBe(balanceBefore);
    expect(contribution.enabled).toBe(true);
    expect(contribution.qualityBand).toBe('Weak');
    expect(contribution.effectiveRate).toBeGreaterThan(0);

    const acquisition = await store.dispatch(
      acquireTraitWithEssenceThunk({
        traitId: WISDOM_ID,
        essenceCost: traits[WISDOM_ID].essenceCost,
      })
    );
    expect(acquireTraitWithEssenceThunk.rejected.match(acquisition)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(balanceBefore);
    expect(store.getState().player.permanentTraits).not.toContain(WISDOM_ID);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID)).toEqual([]);
  });

  test('an older modern Relationship profile without provenance normalizes as non-legacy', () => {
    const store = makeStore();
    const current = store.getState();
    const modernProfile = {
      ...selectBondProfileByNpcId(current, WILLOW_ID),
      dimensions: {
        ...selectBondProfileByNpcId(current, WILLOW_ID).dimensions,
        trust: 15,
      },
      connectionLevel: 1,
      connectionProgress: 12,
    } as any;
    delete modernProfile.provenance;

    store.dispatch(
      replaceState({
        ...current,
        relationships: {
          ...current.relationships,
          bondProfilesByNpc: { [WILLOW_ID]: modernProfile },
        },
      } as RootState)
    );

    const normalized = selectBondProfileByNpcId(store.getState(), WILLOW_ID);
    expect(normalized.provenance).toEqual({ legacyDerived: false });
    expect(normalized.connectionLevel).toBe(1);
    expect(normalized.connectionProgress).toBe(12);
    expect(normalized.dimensions.trust).toBe(15);
    expect(selectRelationshipExperiencesByNpcId(store.getState(), WILLOW_ID)).toEqual([]);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID)).toEqual([]);
  });
});