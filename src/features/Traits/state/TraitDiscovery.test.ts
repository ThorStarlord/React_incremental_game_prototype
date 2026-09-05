import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import traitsReducer, {
  discoverTrait,
  loadTraits,
  resetTraitsState,
} from './TraitsSlice';
import type { Trait } from './TraitsTypes';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from '../../Relationships/state/RelationshipThunks';
import { recordRelationshipExperience } from '../../Relationships/state/RelationshipSlice';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const willowBundle = readJson('public/data/relationships/elder-willow.json');
const lyraBundle = readJson('public/data/relationships/lyra.json');
const elaraBundle = readJson('public/data/relationships/elara.json');
const productionTraits = readJson('public/data/traits.json');

const bundleByUrl: Record<string, any> = {
  '/data/relationships/elder-willow.json': willowBundle,
  '/data/relationships/lyra.json': lyraBundle,
  '/data/relationships/elara.json': elaraBundle,
};

const LEGACY_ID = 'LegacyKnownTrait';
const AUTHORED_ID = 'AuthoredHiddenTrait';
const WISDOM_ID = 'WillowsWisdom';
const INSIGHT_ID = 'ScholarlyInsight';

const makeTrait = (id: string, discoveryMode?: 'initial' | 'authored'): Trait => ({
  id,
  name: id,
  category: 'Knowledge',
  description: `${id} description`,
  rarity: 'Common',
  effects: {},
  ...(discoveryMode ? { discoveryMode } : {}),
});

const makeStore = () => configureStore({ reducer: rootReducer });

beforeEach(() => {
  global.fetch = jest.fn(async (input: any) => {
    const url = String(input);
    if (url === '/data/relationships/index.json') {
      return { ok: true, json: async () => manifest } as any;
    }
    if (bundleByUrl[url]) {
      return { ok: true, json: async () => bundleByUrl[url] } as any;
    }
    return { ok: false, statusText: `Unexpected test URL: ${url}` } as any;
  }) as jest.Mock;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Trait discovery state contract', () => {
  test('catalogue loading knows legacy Traits without auto-discovering authored patterns', () => {
    const definitions = {
      [LEGACY_ID]: makeTrait(LEGACY_ID),
      [AUTHORED_ID]: makeTrait(AUTHORED_ID, 'authored'),
    };

    const state = traitsReducer(undefined, loadTraits(definitions));

    expect(Object.keys(state.traits)).toEqual(expect.arrayContaining([LEGACY_ID, AUTHORED_ID]));
    expect(state.discoveredTraits).toContain(LEGACY_ID);
    expect(state.discoveredTraits).not.toContain(AUTHORED_ID);
  });

  test('reloading definitions preserves an authored discovery already earned in the save', () => {
    const definitions = {
      [LEGACY_ID]: makeTrait(LEGACY_ID),
      [AUTHORED_ID]: makeTrait(AUTHORED_ID, 'authored'),
    };

    let state = traitsReducer(undefined, loadTraits(definitions));
    state = traitsReducer(state, discoverTrait({ traitId: AUTHORED_ID }));
    state = traitsReducer(state, loadTraits(definitions));

    expect(state.discoveredTraits).toEqual(expect.arrayContaining([LEGACY_ID, AUTHORED_ID]));
    expect(state.discoveredTraits.filter(id => id === AUTHORED_ID)).toHaveLength(1);
  });

  test('New Game style reset keeps definitions and initial knowledge but clears authored discoveries', () => {
    const definitions = {
      [LEGACY_ID]: makeTrait(LEGACY_ID),
      [AUTHORED_ID]: makeTrait(AUTHORED_ID, 'authored'),
    };

    let state = traitsReducer(undefined, loadTraits(definitions));
    state = traitsReducer(state, discoverTrait({ traitId: AUTHORED_ID }));
    state = traitsReducer(state, resetTraitsState());

    expect(Object.keys(state.traits)).toEqual(expect.arrayContaining([LEGACY_ID, AUTHORED_ID]));
    expect(state.discoveredTraits).toEqual([LEGACY_ID]);
  });
});

describe('Authored relationship discovery integration', () => {
  test('production catalogue hides Willow and Elara relationship Traits until their authored recognition beats', async () => {
    const store = makeStore();
    store.dispatch(loadTraits(productionTraits));
    await store.dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true })).unwrap();

    expect(productionTraits[WISDOM_ID].discoveryMode).toBe('authored');
    expect(productionTraits[INSIGHT_ID].discoveryMode).toBe('authored');
    expect(
      willowBundle.experiences.willow_exp_first_lesson.traitEffects
        .find((effect: any) => effect.traitId === WISDOM_ID).discover
    ).toBe(true);
    expect(
      elaraBundle.experiences.elara_exp_contradictory_footnote.traitEffects
        .find((effect: any) => effect.traitId === INSIGHT_ID).discover
    ).toBe(true);

    expect(store.getState().traits.discoveredTraits).not.toContain(WISDOM_ID);
    expect(store.getState().traits.discoveredTraits).not.toContain(INSIGHT_ID);
    expect(store.getState().traits.discoveredTraits).toContain('BargainingMaster');

    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId: 'willow_exp_first_question_admit' })
    ).unwrap();
    expect(store.getState().traits.discoveredTraits).not.toContain(WISDOM_ID);

    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId: 'willow_exp_first_lesson' })
    ).unwrap();
    expect(store.getState().traits.discoveredTraits).toContain(WISDOM_ID);

    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId: 'elara_exp_model_challenged' })
    ).unwrap();
    expect(store.getState().traits.discoveredTraits).not.toContain(INSIGHT_ID);

    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId: 'elara_exp_contradictory_footnote' })
    ).unwrap();
    expect(store.getState().traits.discoveredTraits).toContain(INSIGHT_ID);

    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId: 'elara_exp_contradictory_footnote' })
    ).unwrap();
    expect(store.getState().traits.discoveredTraits.filter(id => id === INSIGHT_ID)).toHaveLength(1);
  });

  test('replaying existing authored evidence repairs a missing discovery flag without duplicating history', async () => {
    const store = makeStore();
    store.dispatch(loadTraits(productionTraits));
    await store.dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true })).unwrap();

    const definition = willowBundle.experiences.willow_exp_first_lesson;
    store.dispatch(
      recordRelationshipExperience({
        ...definition,
        timestamp: 1,
      })
    );

    expect(store.getState().traits.discoveredTraits).not.toContain(WISDOM_ID);
    expect(store.getState().relationships.experienceIdsByNpc.npc_elder_willow).toEqual([
      'willow_exp_first_lesson',
    ]);

    const replay = await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId: 'willow_exp_first_lesson' })
    ).unwrap();

    expect(replay.recorded).toBe(false);
    expect(store.getState().traits.discoveredTraits).toContain(WISDOM_ID);
    expect(store.getState().relationships.experienceIdsByNpc.npc_elder_willow).toEqual([
      'willow_exp_first_lesson',
    ]);
  });
});
