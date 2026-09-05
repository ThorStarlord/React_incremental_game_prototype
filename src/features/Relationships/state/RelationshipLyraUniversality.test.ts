import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from './RelationshipThunks';
import type { RelationshipDefinitionBundle } from './RelationshipTypes';

const LYRA_ID = 'npc_lyra';

const willowStubBundle: RelationshipDefinitionBundle = {
  experiences: {},
  memories: {},
  progression: {},
};

const lyraBundle: RelationshipDefinitionBundle = {
  experiences: {
    lyra_exp_strategic_defeat: {
      id: 'lyra_exp_strategic_defeat',
      uniqueKey: 'lyra:lu01:strategic-defeat',
      title: 'Strategic Defeat, Not Submission',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      sourceType: 'other',
      significance: 'meaningful',
      relationshipEffects: {
        affinity: -18,
        trust: -8,
        understanding: 10,
        sharedMeaning: 2,
        vulnerability: 3,
      },
      connectionProgressDelta: 10,
      resonanceTags: ['Adversarial', 'Capture'],
      memoryCandidate: false,
    },
    lyra_exp_coercion_reflected: {
      id: 'lyra_exp_coercion_reflected',
      uniqueKey: 'lyra:lu02:coercion-reflected',
      title: 'Coercion Reflected',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      sourceType: 'other',
      significance: 'meaningful',
      relationshipEffects: {
        affinity: -12,
        trust: -4,
        understanding: 10,
        sharedMeaning: 3,
        vulnerability: 2,
      },
      connectionProgressDelta: 10,
      resonanceTags: ['Adversarial', 'Resistance'],
      memoryCandidate: false,
    },
    lyra_exp_reluctant_cotraining: {
      id: 'lyra_exp_reluctant_cotraining',
      uniqueKey: 'lyra:lu03:reluctant-cotraining',
      title: 'Reluctant Co-Training',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      sourceType: 'other',
      significance: 'major',
      relationshipEffects: {
        affinity: 4,
        trust: 8,
        understanding: 12,
        sharedMeaning: 10,
        reliance: 8,
        reciprocity: 3,
      },
      connectionProgressDelta: 15,
      resonanceTags: ['Adversarial', 'Cooperation'],
      memoryCandidate: false,
    },
    lyra_exp_ideological_friction: {
      id: 'lyra_exp_ideological_friction',
      uniqueKey: 'lyra:lu04:ideological-friction',
      title: 'Ideological Friction',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: {
        affinity: -10,
        trust: -2,
        understanding: 12,
        sharedMeaning: 9,
      },
      connectionProgressDelta: 12,
      resonanceTags: ['Adversarial', 'IdeologicalFriction'],
      memoryCandidate: false,
    },
    lyra_exp_mutual_calibration: {
      id: 'lyra_exp_mutual_calibration',
      uniqueKey: 'lyra:lu05:mutual-calibration',
      title: 'Mutual Calibration',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: {
        trust: 7,
        understanding: 12,
        sharedMeaning: 10,
        reciprocity: 7,
      },
      connectionProgressDelta: 16,
      resonanceTags: ['Adversarial', 'MutualCalibration'],
      memoryCandidate: false,
    },
    lyra_exp_proto_bond: {
      id: 'lyra_exp_proto_bond',
      uniqueKey: 'lyra:lu06:proto-bond',
      title: 'Enemies in Phase',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      sourceType: 'other',
      significance: 'defining',
      relationshipEffects: {
        affinity: 1,
        trust: 6,
        understanding: 8,
        sharedMeaning: 12,
        reliance: 8,
        vulnerability: 8,
        reciprocity: 8,
      },
      connectionProgressDelta: 20,
      resonanceTags: ['AdversarialBond', 'MutualCalibration'],
      memoryCandidate: true,
      memoryDefinitionId: 'lyra_memory_enemies_in_phase',
    },
  },
  memories: {
    lyra_memory_enemies_in_phase: {
      id: 'lyra_memory_enemies_in_phase',
      originExperienceId: 'lyra_exp_proto_bond',
      title: 'Enemies in Phase',
      primaryTargetId: LYRA_ID,
      participantIds: ['player', LYRA_ID],
      memoryType: 'shared',
      significance: 'defining',
      playerVisible: true,
      summary: 'Enemies aligned long enough to solve what neither could solve alone.',
      resonanceTags: ['AdversarialBond', 'MutualCalibration'],
      bondContribution: 'Dialectic Counterparts — emerging',
      persistence: 'contested',
    },
  },
  progression: {
    [LYRA_ID]: {
      npcId: LYRA_ID,
      connectionAuthority: 'relationships',
      qualificationRules: [
        {
          level: 1,
          minimumProgress: 18,
          minimumExperienceCount: 2,
          requiredExperienceIds: [
            'lyra_exp_strategic_defeat',
            'lyra_exp_coercion_reflected',
          ],
          minimumDimensions: { understanding: 18 },
        },
        {
          level: 2,
          minimumProgress: 70,
          minimumExperienceCount: 6,
          requiredExperienceIds: [
            'lyra_exp_reluctant_cotraining',
            'lyra_exp_proto_bond',
          ],
          requiredMemoryTags: ['AdversarialBond'],
          minimumDimensions: { understanding: 55, sharedMeaning: 40 },
        },
      ],
      essence: { enabled: false },
    },
  },
};

const makeResponse = (payload: unknown) => ({
  ok: true,
  json: async () => payload,
});

describe('Relationship M6 Lyra universality', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('multi-bundle authoring supports high Connection with adversarial Affinity without Lyra-specific mechanics', async () => {
    const fetchMock = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === '/data/relationships/index.json') {
        return makeResponse({
          bundles: [
            '/data/relationships/elder-willow.json',
            '/data/relationships/lyra.json',
          ],
        });
      }
      if (url === '/data/relationships/elder-willow.json') {
        return makeResponse(willowStubBundle);
      }
      if (url === '/data/relationships/lyra.json') {
        return makeResponse(lyraBundle);
      }
      return { ok: false, json: async () => ({}) };
    });
    global.fetch = fetchMock as jest.Mock;

    const store = configureStore({ reducer: rootReducer });
    const initialized = await store
      .dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true }))
      .unwrap();

    expect(initialized.registeredNpcIds).toContain(LYRA_ID);
    expect(fetchMock).toHaveBeenCalledWith('/data/relationships/index.json');
    expect(fetchMock).toHaveBeenCalledWith('/data/relationships/elder-willow.json');
    expect(fetchMock).toHaveBeenCalledWith('/data/relationships/lyra.json');

    const sequence = [
      'lyra_exp_strategic_defeat',
      'lyra_exp_coercion_reflected',
      'lyra_exp_reluctant_cotraining',
      'lyra_exp_ideological_friction',
      'lyra_exp_mutual_calibration',
      'lyra_exp_proto_bond',
    ];

    for (const experienceId of sequence) {
      await store
        .dispatch(recordAuthoredRelationshipExperienceThunk({ experienceId }))
        .unwrap();
    }

    const state = store.getState();
    const profile = selectBondProfileByNpcId(state, LYRA_ID);
    const memories = selectRelationshipMemoriesByNpcId(state, LYRA_ID);
    const essenceContribution = selectRelationshipEssenceContributionByNpcId(
      state,
      LYRA_ID
    );

    expect(profile.connectionLevel).toBe(2);
    expect(profile.connectionProgress).toBe(83);
    expect(profile.dimensions.affinity).toBe(-35);
    expect(profile.dimensions.understanding).toBe(64);
    expect(profile.dimensions.sharedMeaning).toBe(46);
    expect(profile.stability).toBe('contested');
    expect(profile.connectionQualificationEvidence['2']).toEqual(
      expect.arrayContaining([
        'lyra_exp_reluctant_cotraining',
        'lyra_exp_proto_bond',
        'lyra_memory_enemies_in_phase',
      ])
    );
    expect(memories.map(memory => memory.id)).toContain('lyra_memory_enemies_in_phase');
    expect(essenceContribution.enabled).toBe(false);
    expect(essenceContribution.effectiveRate).toBe(0);
  });
});
