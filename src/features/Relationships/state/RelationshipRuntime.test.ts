import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, replaceState, type RootState } from '../../../app/store';
import relationshipReducer, {
  formRelationshipMemory,
  recordConnectionQualification,
  recordRelationshipExperience,
} from './RelationshipSlice';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
} from './RelationshipSelectors';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from './RelationshipThunks';
import type {
  RelationshipDefinitionBundle,
  RelationshipExperience,
  RelationshipMemory,
} from './RelationshipTypes';
import { updateEssenceGenerationRateThunk } from '../../Essence/state/EssenceThunks';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { loadTraits, discoverTrait } from '../../Traits/state/TraitsSlice';
import { acquireTraitWithEssenceThunk } from '../../Traits/state/TraitThunks';
import type { Trait } from '../../Traits/state/TraitsTypes';
import { ESSENCE_GENERATION } from '../../../constants/gameConstants';

const WILLOW_ID = 'npc_elder_willow';
const WISDOM_ID = 'WillowsWisdom';

const relationshipBundle: RelationshipDefinitionBundle = {
  experiences: {
    willow_exp_first_question_admit: {
      id: 'willow_exp_first_question_admit',
      uniqueKey: 'willow:we01:first-question',
      title: 'She Saw Through the Question',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { affinity: 1, trust: 3, understanding: 4, sharedMeaning: 1 },
      connectionProgressDelta: 7,
      resonanceTags: ['Wisdom'],
      memoryCandidate: false,
    },
    willow_exp_first_lesson: {
      id: 'willow_exp_first_lesson',
      uniqueKey: 'willow:we02:first-lesson',
      title: 'The First Lesson',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { trust: 2, understanding: 6, sharedMeaning: 3 },
      connectionProgressDelta: 8,
      resonanceTags: ['Wisdom', 'PatternRecognition'],
      traitEffects: [{ traitId: WISDOM_ID, compatibilityDelta: 5, assimilationDelta: 10 }],
      memoryCandidate: false,
    },
    willow_exp_seed_offered: {
      id: 'willow_exp_seed_offered',
      uniqueKey: 'willow:we03:seed-offered',
      title: 'A Seed of Potential',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'meaningful',
      relationshipEffects: { understanding: 2, sharedMeaning: 1 },
      connectionProgressDelta: 4,
      resonanceTags: ['Choice'],
      memoryCandidate: false,
    },
    willow_exp_sunstone_decision_preserve: {
      id: 'willow_exp_sunstone_decision_preserve',
      uniqueKey: 'willow:we04:sunstone-decision',
      title: 'The Sunstone Decision',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'major',
      relationshipEffects: {
        affinity: 4,
        trust: 8,
        understanding: 10,
        sharedMeaning: 12,
        reciprocity: 3,
      },
      connectionProgressDelta: 22,
      resonanceTags: ['Application', 'Wisdom'],
      traitEffects: [{ traitId: WISDOM_ID, compatibilityDelta: 15 }],
      memoryCandidate: true,
      memoryDefinitionId: 'willow_memory_seed_preserved',
    },
    willow_exp_willow_disagrees: {
      id: 'willow_exp_willow_disagrees',
      uniqueKey: 'willow:we05:disagreement',
      title: 'Willow Disagrees',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { affinity: -3, trust: -1, understanding: 8, sharedMeaning: 5 },
      connectionProgressDelta: 10,
      resonanceTags: ['Contradiction', 'Wisdom'],
      memoryCandidate: false,
    },
    willow_exp_three_nights_teaching: {
      id: 'willow_exp_three_nights_teaching',
      uniqueKey: 'willow:we06:three-nights',
      title: 'Three Nights of Teaching',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'other',
      significance: 'meaningful',
      relationshipEffects: { trust: 3, understanding: 8, sharedMeaning: 5, reciprocity: 2 },
      connectionProgressDelta: 12,
      resonanceTags: ['Teaching', 'Practice'],
      traitEffects: [{ traitId: WISDOM_ID, assimilationDelta: 55 }],
      memoryCandidate: false,
    },
    willow_exp_independent_application: {
      id: 'willow_exp_independent_application',
      uniqueKey: 'willow:we07:independent-application',
      title: 'The Lesson Made Yours',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'defining',
      relationshipEffects: {
        affinity: 3,
        trust: 7,
        understanding: 12,
        sharedMeaning: 10,
        reciprocity: 4,
      },
      connectionProgressDelta: 20,
      resonanceTags: ['Application', 'Transformation'],
      traitEffects: [{ traitId: WISDOM_ID, compatibilityDelta: 20, assimilationDelta: 35 }],
      memoryCandidate: true,
      memoryDefinitionId: 'willow_memory_lesson_made_yours',
    },
    willow_exp_resonance_wisdom: {
      id: 'willow_exp_resonance_wisdom',
      uniqueKey: 'willow:we08:wisdom-resonance',
      title: "Resonance: Willow's Wisdom",
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'system',
      significance: 'defining',
      relationshipEffects: { sharedMeaning: 4 },
      connectionProgressDelta: 0,
      resonanceTags: ['Resonance'],
      memoryCandidate: false,
    },
  },
  memories: {
    willow_memory_seed_preserved: {
      id: 'willow_memory_seed_preserved',
      originExperienceId: 'willow_exp_sunstone_decision_preserve',
      title: 'The Seed Preserved',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      memoryType: 'shared',
      significance: 'major',
      playerVisible: true,
      summary: 'You chose uncertain long-horizon value over immediate extraction.',
      resonanceTags: ['Application', 'Wisdom'],
      traitRelevance: [WISDOM_ID],
      persistence: 'stable',
    },
    willow_memory_lesson_made_yours: {
      id: 'willow_memory_lesson_made_yours',
      originExperienceId: 'willow_exp_independent_application',
      title: 'The Lesson Made Yours',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      memoryType: 'shared',
      significance: 'defining',
      playerVisible: true,
      summary: "You applied Willow's pattern independently.",
      resonanceTags: ['Application', 'Transformation'],
      traitRelevance: [WISDOM_ID],
      persistence: 'stable',
    },
  },
  progression: {
    [WILLOW_ID]: {
      npcId: WILLOW_ID,
      connectionAuthority: 'relationships',
      startingProfile: {
        dimensions: { trust: 5 },
        connectionLevel: 0,
        connectionProgress: 0,
        tetherState: 'present',
      },
      qualificationRules: [
        {
          level: 1,
          minimumProgress: 10,
          minimumExperienceCount: 2,
          requiredExperienceIds: ['willow_exp_first_lesson'],
          anyOfExperienceIds: ['willow_exp_first_question_admit'],
          minimumDimensions: { understanding: 8 },
        },
        {
          level: 2,
          minimumProgress: 60,
          minimumExperienceCount: 6,
          requiredExperienceIds: [
            'willow_exp_three_nights_teaching',
            'willow_exp_independent_application',
          ],
          requiredMemoryTags: ['Application'],
          minimumDimensions: { understanding: 35, sharedMeaning: 20 },
        },
      ],
      essence: { enabled: true, startingTetherState: 'present' },
    },
  },
};

const willowWisdom: Trait = {
  id: WISDOM_ID,
  name: "Willow's Wisdom",
  category: 'Knowledge',
  description: 'Slow-pattern cognition.',
  rarity: 'Uncommon',
  effects: { learningSpeed: 0.15 },
  essenceCost: 40,
  sourceNpc: WILLOW_ID,
  minimumConnectionLevel: 2,
  requiredMemoryTags: ['Application'],
  assimilationThreshold: 100,
  minimumCompatibility: 20,
  resonanceExperienceId: 'willow_exp_resonance_wisdom',
};

const makeStore = () => configureStore({ reducer: rootReducer });

const initializeM4 = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true })).unwrap();
};

const recordAuthored = async (
  store: ReturnType<typeof makeStore>,
  experienceId: string
) => {
  return store.dispatch(recordAuthoredRelationshipExperienceThunk({ experienceId })).unwrap();
};

const recordFullWillowPath = async (store: ReturnType<typeof makeStore>) => {
  const ids = [
    'willow_exp_first_question_admit',
    'willow_exp_first_lesson',
    'willow_exp_seed_offered',
    'willow_exp_sunstone_decision_preserve',
    'willow_exp_willow_disagrees',
    'willow_exp_three_nights_teaching',
    'willow_exp_independent_application',
  ];
  for (const experienceId of ids) {
    await recordAuthored(store, experienceId);
  }
};

beforeEach(() => {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => relationshipBundle,
  })) as jest.Mock;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Relationship M4 reducer invariants', () => {
  test('stable unique Experience applies once while explicit unique runtime occurrences can repeat', () => {
    const base: RelationshipExperience = {
      id: 'stable-1',
      uniqueKey: 'stable-key',
      title: 'Stable',
      timestamp: 1,
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { affinity: 500, trust: -500 },
      connectionProgressDelta: 5,
      resonanceTags: [],
      memoryCandidate: false,
    };

    let state = relationshipReducer(undefined, recordRelationshipExperience(base));
    state = relationshipReducer(
      state,
      recordRelationshipExperience({ ...base, id: 'stable-replay', timestamp: 2 })
    );

    expect(state.experienceIdsByNpc[WILLOW_ID]).toEqual(['stable-1']);
    expect(state.bondProfilesByNpc[WILLOW_ID].dimensions.affinity).toBe(100);
    expect(state.bondProfilesByNpc[WILLOW_ID].dimensions.trust).toBe(0);

    const repeatableOne = {
      ...base,
      id: 'repeat-1',
      uniqueKey: undefined,
      relationshipEffects: { understanding: 2 },
    };
    const repeatableTwo = { ...repeatableOne, id: 'repeat-2', timestamp: 3 };
    state = relationshipReducer(state, recordRelationshipExperience(repeatableOne));
    state = relationshipReducer(state, recordRelationshipExperience(repeatableTwo));

    expect(state.experienceIdsByNpc[WILLOW_ID]).toEqual([
      'stable-1',
      'repeat-1',
      'repeat-2',
    ]);
    expect(state.bondProfilesByNpc[WILLOW_ID].dimensions.understanding).toBe(4);
  });

  test('Memory cannot reference a missing Experience and persists after later relationship loss', () => {
    const memory: RelationshipMemory = {
      id: 'memory-1',
      originExperienceId: 'experience-1',
      title: 'Landmark',
      timestamp: 2,
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      memoryType: 'shared',
      significance: 'major',
      playerVisible: true,
      summary: 'A landmark beat.',
      resonanceTags: ['Application'],
      persistence: 'stable',
    };

    let state = relationshipReducer(undefined, formRelationshipMemory(memory));
    expect(state.memoriesById['memory-1']).toBeUndefined();

    state = relationshipReducer(
      state,
      recordRelationshipExperience({
        id: 'experience-1',
        title: 'Cause',
        timestamp: 1,
        primaryTargetId: WILLOW_ID,
        participantIds: ['player', WILLOW_ID],
        sourceType: 'quest',
        significance: 'major',
        relationshipEffects: { trust: 20, affinity: 20 },
        resonanceTags: [],
        memoryCandidate: true,
      })
    );
    state = relationshipReducer(state, formRelationshipMemory(memory));
    state = relationshipReducer(
      state,
      recordRelationshipExperience({
        id: 'rupture',
        title: 'Conflict',
        timestamp: 3,
        primaryTargetId: WILLOW_ID,
        participantIds: ['player', WILLOW_ID],
        sourceType: 'dialogue',
        significance: 'meaningful',
        relationshipEffects: { trust: -100, affinity: -100 },
        resonanceTags: [],
        memoryCandidate: false,
      })
    );

    expect(state.memoriesById['memory-1']).toBeDefined();
    expect(state.bondProfilesByNpc[WILLOW_ID].activeMemoryIds).toContain('memory-1');
  });
});

describe('Relationship M4 integration', () => {
  test('Affinity alone cannot level Willow Connection; qualifying evidence can', async () => {
    const store = makeStore();
    await initializeM4(store);

    store.dispatch(
      recordRelationshipExperience({
        id: 'affinity-only',
        title: 'Pleasant repetition',
        timestamp: 1,
        primaryTargetId: WILLOW_ID,
        participantIds: ['player', WILLOW_ID],
        sourceType: 'dialogue',
        significance: 'minor',
        relationshipEffects: { affinity: 100 },
        connectionProgressDelta: 0,
        resonanceTags: [],
        memoryCandidate: false,
      })
    );

    expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID).connectionLevel).toBe(0);

    await recordAuthored(store, 'willow_exp_first_question_admit');
    await recordAuthored(store, 'willow_exp_first_lesson');

    expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID).connectionLevel).toBe(1);
  });

  test('adversarial disagreement lowers Affinity while increasing Connection progress', async () => {
    const store = makeStore();
    await initializeM4(store);
    await recordAuthored(store, 'willow_exp_first_question_admit');
    await recordAuthored(store, 'willow_exp_first_lesson');

    const before = selectBondProfileByNpcId(store.getState(), WILLOW_ID);
    await recordAuthored(store, 'willow_exp_willow_disagrees');
    const after = selectBondProfileByNpcId(store.getState(), WILLOW_ID);

    expect(after.dimensions.affinity).toBeLessThan(before.dimensions.affinity);
    expect(after.connectionProgress).toBeGreaterThan(before.connectionProgress);
  });

  test('relationship Experience changes passive rate without minting current Essence or double-counting', async () => {
    const store = makeStore();
    await initializeM4(store);
    const balanceBefore = store.getState().essence.currentEssence;

    await recordAuthored(store, 'willow_exp_first_question_admit');
    await recordAuthored(store, 'willow_exp_first_lesson');
    await store.dispatch(updateEssenceGenerationRateThunk()).unwrap();

    const state = store.getState();
    const contribution = selectRelationshipEssenceContributionByNpcId(state, WILLOW_ID);
    expect(state.essence.currentEssence).toBe(balanceBefore);
    expect(contribution.effectiveRate).toBeGreaterThan(0);
    expect(state.essence.generationRate).toBeCloseTo(
      ESSENCE_GENERATION.BASE_RATE_PER_SECOND + contribution.effectiveRate,
      6
    );
  });

  test('Resonance blocks insufficient assimilation and missing Memory evidence', async () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [WISDOM_ID]: willowWisdom }));
    store.dispatch(discoverTrait({ traitId: WISDOM_ID }));
    store.dispatch(gainEssence({ amount: 100, source: 'test' }));
    await initializeM4(store);

    store.dispatch(
      recordConnectionQualification({ npcId: WILLOW_ID, level: 2, evidenceIds: ['test'] })
    );
    let result = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: WISDOM_ID, essenceCost: 40 })
    );
    expect(acquireTraitWithEssenceThunk.rejected.match(result)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(100);

    store.dispatch(
      recordRelationshipExperience({
        id: 'assimilation-only',
        title: 'Practice without landmark evidence',
        timestamp: 10,
        primaryTargetId: WILLOW_ID,
        participantIds: ['player', WILLOW_ID],
        sourceType: 'other',
        significance: 'meaningful',
        relationshipEffects: {},
        resonanceTags: [],
        traitEffects: [
          { traitId: WISDOM_ID, assimilationDelta: 100, compatibilityDelta: 25 },
        ],
        memoryCandidate: false,
      })
    );

    expect(
      selectTraitAssimilationState(store.getState(), WILLOW_ID, WISDOM_ID).progress
    ).toBe(100);
    result = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: WISDOM_ID, essenceCost: 40 })
    );
    expect(acquireTraitWithEssenceThunk.rejected.match(result)).toBe(true);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID)).toHaveLength(0);
    expect(store.getState().essence.currentEssence).toBe(100);
  });

  test('full Willow evidence permits Resonance and deducts Essence exactly once', async () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [WISDOM_ID]: willowWisdom }));
    store.dispatch(discoverTrait({ traitId: WISDOM_ID }));
    store.dispatch(gainEssence({ amount: 100, source: 'test' }));
    await initializeM4(store);
    await recordFullWillowPath(store);

    const profile = selectBondProfileByNpcId(store.getState(), WILLOW_ID);
    const assimilation = selectTraitAssimilationState(store.getState(), WILLOW_ID, WISDOM_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(assimilation.progress).toBe(100);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID).length).toBeGreaterThan(0);

    const first = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: WISDOM_ID, essenceCost: 40 })
    );
    expect(acquireTraitWithEssenceThunk.fulfilled.match(first)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(60);
    expect(
      store.getState().player.permanentTraits.filter(id => id === WISDOM_ID)
    ).toHaveLength(1);

    const second = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: WISDOM_ID, essenceCost: 40 })
    );
    expect(acquireTraitWithEssenceThunk.rejected.match(second)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(60);
    expect(
      store.getState().player.permanentTraits.filter(id => id === WISDOM_ID)
    ).toHaveLength(1);
  });

  test('M3-style save state upgrades lazily without fabricating Memories', async () => {
    const store = makeStore();
    const full = store.getState();
    const m3Profile = { ...selectBondProfileByNpcId(full, WILLOW_ID) } as any;
    delete m3Profile.connectionQualificationEvidence;
    delete m3Profile.tetherState;

    const m3Relationships = {
      shadowMode: true,
      experiencesById: {},
      experienceIdsByNpc: {},
      memoriesById: {},
      memoryIdsByNpc: {},
      bondProfilesByNpc: { [WILLOW_ID]: m3Profile },
      appliedUniqueKeys: {},
    } as any;

    store.dispatch(
      replaceState({
        ...full,
        relationships: m3Relationships,
      } as RootState)
    );

    await store
      .dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: false }))
      .unwrap();
    const repaired = selectBondProfileByNpcId(store.getState(), WILLOW_ID);

    expect(repaired.connectionQualificationEvidence).toEqual({});
    expect(repaired.tetherState).toBe('present');
    expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID)).toHaveLength(0);
  });
});
