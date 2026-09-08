import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, replaceState } from '../../../app/store';
import { gameEventListeners } from '../../../app/listeners/GameEventListeners';
import {
  initializeBondProfile,
  registerRelationshipProgressionDefinitions,
} from './RelationshipSlice';
import {
  selectBondProfileByNpcId,
  selectEffectiveRelationshipTether,
  selectRelationshipEssenceContributionByNpcId,
} from './RelationshipSelectors';
import { updateEssenceGenerationRateThunk } from '../../Essence/state/EssenceThunks';
import { setLocation } from '../../Player/state/PlayerSlice';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
} from '../../Exploration/LocationDefinitions';
import { travelToLocationThunk } from '../../Exploration/TravelThunks';
import {
  getNpcWorldLocationId,
  NPC_WORLD_LOCATION_IDS,
} from '../../NPCs/state/NPCWorldLocationDefinitions';
import { createSave, loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';

const WILLOW_ID = 'npc_elder_willow';
const GRONK_ID = 'npc_blacksmith_gronk';
const ELARA_ID = 'npc_scholar_elara';

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(gameEventListeners.middleware),
  });

const seedQualifiedRelationship = (
  store: ReturnType<typeof makeStore>,
  npcId: string,
  tetherState: 'present' | 'engaged' = 'present'
) => {
  store.dispatch(
    registerRelationshipProgressionDefinitions({
      [npcId]: {
        npcId,
        connectionAuthority: 'relationships',
        essence: { enabled: true, startingTetherState: tetherState },
      },
    })
  );

  store.dispatch(
    initializeBondProfile({
      npcId,
      dimensions: {
        affinity: 10,
        trust: 60,
        understanding: 60,
        sharedMeaning: 60,
        reliance: 30,
        vulnerability: 20,
        reciprocity: 60,
      },
      connectionLevel: 2,
      connectionProgress: 40,
      tetherState,
    })
  );
};

const cloneProfile = (store: ReturnType<typeof makeStore>, npcId: string) =>
  JSON.parse(JSON.stringify(selectBondProfileByNpcId(store.getState(), npcId)));

const expectProfileUnchanged = (
  store: ReturnType<typeof makeStore>,
  npcId: string,
  expected: unknown
) => {
  expect(selectBondProfileByNpcId(store.getState(), npcId)).toEqual(expected);
};

const saveAndRestore = async (
  store: ReturnType<typeof makeStore>,
  now: number
): Promise<ReturnType<typeof makeStore>> => {
  jest.spyOn(Date, 'now').mockReturnValue(now);
  const saveId = createSave(store.getState(), 'M19 spatial tether save');
  expect(saveId).toBe(`save_${now}`);

  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();

  const resumedStore = makeStore();
  resumedStore.dispatch(replaceState(loaded!.state));
  return resumedStore;
};

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('M19 world-derived Relationship Tether', () => {
  test('architecture keeps NPC anchors authored and travel free of Relationship mutation', () => {
    expect(NPC_WORLD_LOCATION_IDS).toEqual({
      [WILLOW_ID]: WHISPERING_WOODS_LOCATION_ID,
      [GRONK_ID]: CITY_CENTER_LOCATION_ID,
    });
    expect(getNpcWorldLocationId(WILLOW_ID)).toBe(WHISPERING_WOODS_LOCATION_ID);
    expect(getNpcWorldLocationId(GRONK_ID)).toBe(CITY_CENTER_LOCATION_ID);
    expect(getNpcWorldLocationId(ELARA_ID)).toBeUndefined();

    const selectorSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Relationships/state/RelationshipSelectors.ts'),
      'utf8'
    );
    expect(selectorSource).not.toContain(WILLOW_ID);
    expect(selectorSource).not.toContain(GRONK_ID);
    expect(selectorSource).toContain('getNpcWorldLocationId');
    expect(selectorSource).toContain('areLocationsDirectlyConnected');

    const travelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Exploration/TravelThunks.ts'),
      'utf8'
    );
    expect(travelSource).not.toContain('setRelationshipTetherState');
    expect(travelSource).not.toContain('Relationship');

    const storeSource = fs.readFileSync(path.join(process.cwd(), 'src/app/store.ts'), 'utf8');
    expect(storeSource).not.toMatch(/world\s*:/);
    expect(storeSource).not.toMatch(/exploration\s*:/);
  });

  test('Willow spatial Tether changes Essence rate while historical Relationship state stays identical', async () => {
    const store = makeStore();
    seedQualifiedRelationship(store, WILLOW_ID);
    const historicalProfile = cloneProfile(store, WILLOW_ID);

    await store.dispatch(updateEssenceGenerationRateThunk()).unwrap();

    const remote = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    expect(store.getState().player.location).toBe(CITY_CENTER_LOCATION_ID);
    expect(remote.tetherState).toBe('remote');
    expect(remote.tetherSource).toBe('spatial');
    expect(remote.tetherMultiplier).toBe(0.4);
    expect(remote.effectiveRate).toBeCloseTo(0.05, 8);
    expectProfileUnchanged(store, WILLOW_ID, historicalProfile);

    await store.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID)).unwrap();
    const nearby = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    expect(nearby.tetherState).toBe('nearby');
    expect(nearby.tetherMultiplier).toBe(0.75);
    expect(nearby.effectiveRate).toBeCloseTo(0.09375, 8);
    expect(store.getState().essence.generationRate).toBeGreaterThan(remote.effectiveRate);
    expectProfileUnchanged(store, WILLOW_ID, historicalProfile);

    await store.dispatch(travelToLocationThunk(WHISPERING_WOODS_LOCATION_ID)).unwrap();
    const present = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    expect(present.tetherState).toBe('present');
    expect(present.tetherMultiplier).toBe(1);
    expect(present.effectiveRate).toBeCloseTo(0.125, 8);
    expect(store.getState().essence.generationRate).toBeGreaterThan(nearby.effectiveRate);
    expectProfileUnchanged(store, WILLOW_ID, historicalProfile);

    await store.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID)).unwrap();
    await store.dispatch(travelToLocationThunk(CITY_CENTER_LOCATION_ID)).unwrap();
    const restored = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    expect(restored.tetherState).toBe('remote');
    expect(restored.effectiveRate).toBeCloseTo(remote.effectiveRate, 8);
    expectProfileUnchanged(store, WILLOW_ID, historicalProfile);
  });

  test('Willow and Gronk exercise one generic Rule-of-Two projection with spatial opportunity cost', async () => {
    const store = makeStore();
    seedQualifiedRelationship(store, WILLOW_ID);
    seedQualifiedRelationship(store, GRONK_ID);
    const willowHistory = cloneProfile(store, WILLOW_ID);
    const gronkHistory = cloneProfile(store, GRONK_ID);

    await store.dispatch(updateEssenceGenerationRateThunk()).unwrap();

    let willow = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    let gronk = selectRelationshipEssenceContributionByNpcId(store.getState(), GRONK_ID);
    expect(willow.tetherState).toBe('remote');
    expect(gronk.tetherState).toBe('present');
    expect(gronk.effectiveRate).toBeGreaterThan(willow.effectiveRate);

    await store.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID)).unwrap();
    willow = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    gronk = selectRelationshipEssenceContributionByNpcId(store.getState(), GRONK_ID);
    expect(willow.tetherState).toBe('nearby');
    expect(gronk.tetherState).toBe('nearby');
    expect(willow.effectiveRate).toBeCloseTo(gronk.effectiveRate, 8);

    await store.dispatch(travelToLocationThunk(WHISPERING_WOODS_LOCATION_ID)).unwrap();
    willow = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    gronk = selectRelationshipEssenceContributionByNpcId(store.getState(), GRONK_ID);
    expect(willow.tetherState).toBe('present');
    expect(gronk.tetherState).toBe('remote');
    expect(willow.effectiveRate).toBeGreaterThan(gronk.effectiveRate);

    expectProfileUnchanged(store, WILLOW_ID, willowHistory);
    expectProfileUnchanged(store, GRONK_ID, gronkHistory);
  });

  test('unanchored Relationship-authority NPCs preserve authored/static Tether fallback', async () => {
    const store = makeStore();
    seedQualifiedRelationship(store, ELARA_ID, 'engaged');
    await store.dispatch(updateEssenceGenerationRateThunk()).unwrap();

    const before = selectRelationshipEssenceContributionByNpcId(store.getState(), ELARA_ID);
    expect(selectEffectiveRelationshipTether(store.getState(), ELARA_ID)).toEqual({
      tetherState: 'engaged',
      source: 'authored',
    });
    expect(before.tetherSource).toBe('authored');
    expect(before.tetherState).toBe('engaged');
    expect(before.tetherMultiplier).toBe(1.25);

    await store.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID)).unwrap();
    const after = selectRelationshipEssenceContributionByNpcId(store.getState(), ELARA_ID);
    expect(after.tetherSource).toBe('authored');
    expect(after.tetherState).toBe('engaged');
    expect(after.effectiveRate).toBeCloseTo(before.effectiveRate, 8);
  });

  test('save/load reconstructs spatial Tether and Essence from persisted world facts without a proximity flag', async () => {
    const store = makeStore();
    seedQualifiedRelationship(store, WILLOW_ID);
    seedQualifiedRelationship(store, GRONK_ID);
    await store.dispatch(travelToLocationThunk(CITY_GATE_LOCATION_ID)).unwrap();

    const willowHistory = cloneProfile(store, WILLOW_ID);
    const gronkHistory = cloneProfile(store, GRONK_ID);
    const beforeWillow = selectRelationshipEssenceContributionByNpcId(store.getState(), WILLOW_ID);
    const beforeGronk = selectRelationshipEssenceContributionByNpcId(store.getState(), GRONK_ID);
    const beforeRate = store.getState().essence.generationRate;
    expect(beforeWillow.tetherState).toBe('nearby');
    expect(beforeGronk.tetherState).toBe('nearby');

    const resumedStore = await saveAndRestore(store, 81000);
    expect(resumedStore.getState().player.location).toBe(CITY_GATE_LOCATION_ID);

    const afterWillow = selectRelationshipEssenceContributionByNpcId(resumedStore.getState(), WILLOW_ID);
    const afterGronk = selectRelationshipEssenceContributionByNpcId(resumedStore.getState(), GRONK_ID);
    expect(afterWillow.tetherState).toBe('nearby');
    expect(afterGronk.tetherState).toBe('nearby');
    expect(afterWillow.effectiveRate).toBeCloseTo(beforeWillow.effectiveRate, 8);
    expect(afterGronk.effectiveRate).toBeCloseTo(beforeGronk.effectiveRate, 8);
    expect(resumedStore.getState().essence.generationRate).toBeCloseTo(beforeRate, 8);
    expectProfileUnchanged(resumedStore, WILLOW_ID, willowHistory);
    expectProfileUnchanged(resumedStore, GRONK_ID, gronkHistory);

    const saveSchemaSource = fs.readFileSync(
      path.join(process.cwd(), 'src/shared/utils/saveSchema.ts'),
      'utf8'
    );
    expect(saveSchemaSource).not.toContain('nearWillow');
    expect(saveSchemaSource).not.toContain('gronkPresent');
    expect(saveSchemaSource).not.toContain('worldDerivedTether');
  });

  test('legacy City Center player values still resolve through M18 compatibility for spatial Tether', async () => {
    const store = makeStore();
    seedQualifiedRelationship(store, WILLOW_ID);
    seedQualifiedRelationship(store, GRONK_ID);
    store.dispatch(setLocation('City Center'));

    const willow = selectEffectiveRelationshipTether(store.getState(), WILLOW_ID);
    const gronk = selectEffectiveRelationshipTether(store.getState(), GRONK_ID);
    expect(willow.tetherState).toBe('remote');
    expect(willow.source).toBe('spatial');
    expect(gronk.tetherState).toBe('present');
    expect(gronk.source).toBe('spatial');
  });
});
