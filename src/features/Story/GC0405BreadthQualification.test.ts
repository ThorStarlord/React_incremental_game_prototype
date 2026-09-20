import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, replaceState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { loadTraits } from '../Traits/state/TraitsSlice';
import { acquireTraitWithEssenceThunk } from '../Traits/state/TraitThunks';
import { gainEssence } from '../Essence/state/EssenceSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { COPY_PRODUCTION_TASKS } from '../Copy/CopyTaskDefinitions';
import { updateCopy } from '../Copy/state/CopySlice';
import { startCopyProductionTaskThunk } from '../Copy/state/CopyThunks';
import { settleOfflineProgressThunk } from '../GameLoop/state/OfflineProgress';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import {
  CONTRADICTION_ECHO_ENCOUNTER,
  TELLURIC_ECHO_ENCOUNTER,
} from '../Combat/CombatEncounterDefinitions';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const traits = readJson('public/data/traits.json');
const quests = readJson('public/data/quests.json');
const gronk = readJson('public/data/relationships/gronk.json');
const lyra = readJson('public/data/relationships/lyra.json');
const elara = readJson('public/data/relationships/elara.json');

const mergedDefinitions = {
  experiences: {
    ...gronk.experiences,
    ...lyra.experiences,
    ...elara.experiences,
  },
  memories: {
    ...gronk.memories,
    ...lyra.memories,
    ...elara.memories,
  },
  progression: {
    ...gronk.progression,
    ...lyra.progression,
    ...elara.progression,
  },
};

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(gameEventListeners.middleware),
  });

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/relationships/index.json') {
      return {
        ok: true,
        json: async () => JSON.parse(JSON.stringify(mergedDefinitions)),
      } as any;
    }
    return {
      ok: false,
      statusText: `Unexpected URL: ${url}`,
      json: async () => ({}),
    } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  localStorage.clear();
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('GC-04 / GC-05 breadth qualification', () => {
  test('four relationship-derived capability identities span at least three anchors and retain the two existing cross-domain proofs', () => {
    const capabilityIds = [
      'WillowsWisdom',
      'ScholarlyInsight',
      'ConstraintSense',
      'AdversarialCalibration',
    ];

    const capabilities = capabilityIds.map(id => traits[id]);
    expect(capabilities.every(Boolean)).toBe(true);
    expect(new Set(capabilities.map((trait: any) => trait.sourceNpc))).toEqual(
      new Set([
        'npc_elder_willow',
        'npc_scholar_elara',
        'npc_blacksmith_gronk',
        'npc_lyra',
      ])
    );

    const willowQuest = quests.quest_m16_withering_grove.resolutionOptions.find(
      (resolution: any) => resolution.requiredPermanentTraitIds?.includes('WillowsWisdom')
    );
    const elaraQuest = quests.quest_m16_impossible_inventory.resolutionOptions.find(
      (resolution: any) => resolution.requiredPermanentTraitIds?.includes('ScholarlyInsight')
    );

    expect(willowQuest).toBeDefined();
    expect(TELLURIC_ECHO_ENCOUNTER.feedbackPattern?.requiredPermanentTraitIds)
      .toContain('WillowsWisdom');
    expect(elaraQuest).toBeDefined();
    expect(CONTRADICTION_ECHO_ENCOUNTER.feedbackPattern?.requiredPermanentTraitIds)
      .toContain('ScholarlyInsight');
  });

  test('Gronk and Lyra capability identities are earned through their real relationship evidence and can become permanent', async () => {
    const store = makeStore();
    store.dispatch(loadTraits(traits));
    store.dispatch(gainEssence({ amount: 200, source: 'gc04-test' }));

    for (const [index, experienceId] of [
      'gronk_exp_steel_not_flattery',
      'gronk_exp_measure_twice',
      'gronk_exp_quality_over_finish',
      'gronk_exp_blade_that_held',
    ].entries()) {
      await store.dispatch(recordAuthoredRelationshipExperienceThunk({
        experienceId,
        timestamp: 100 + index,
      })).unwrap();
    }

    expect(store.getState().traits.discoveredTraits).toContain('ConstraintSense');
    expect(store.getState().relationships.bondProfilesByNpc.npc_blacksmith_gronk.connectionLevel)
      .toBeGreaterThanOrEqual(2);
    expect(store.getState().relationships.traitAssimilationByKey[
      'npc_blacksmith_gronk::ConstraintSense'
    ]).toMatchObject({
      progress: 100,
      compatibility: 24,
    });
    expect(store.getState().relationships.traitAssimilationByKey[
      'npc_blacksmith_gronk::ConstraintSense'
    ].qualifyingMemoryIds).toContain('gronk_memory_blade_that_held');

    const gronkResonance = await store.dispatch(acquireTraitWithEssenceThunk({
      traitId: 'ConstraintSense',
      essenceCost: traits.ConstraintSense.essenceCost,
    }));
    expect(acquireTraitWithEssenceThunk.fulfilled.match(gronkResonance)).toBe(true);
    expect(store.getState().player.permanentTraits).toContain('ConstraintSense');
    expect(store.getState().relationships.experiencesById.gronk_exp_resonance_constraint_sense)
      .toBeDefined();

    for (const [index, experienceId] of [
      'lyra_exp_strategic_defeat',
      'lyra_exp_coercion_reflected',
      'lyra_exp_reluctant_cotraining',
      'lyra_exp_ideological_friction',
      'lyra_exp_mutual_calibration',
      'lyra_exp_proto_bond',
    ].entries()) {
      await store.dispatch(recordAuthoredRelationshipExperienceThunk({
        experienceId,
        timestamp: 200 + index,
      })).unwrap();
    }

    expect(store.getState().traits.discoveredTraits).toContain('AdversarialCalibration');
    expect(store.getState().relationships.bondProfilesByNpc.npc_lyra.connectionLevel)
      .toBeGreaterThanOrEqual(2);
    expect(store.getState().relationships.traitAssimilationByKey[
      'npc_lyra::AdversarialCalibration'
    ]).toMatchObject({
      progress: 100,
      compatibility: 26,
    });
    expect(store.getState().relationships.traitAssimilationByKey[
      'npc_lyra::AdversarialCalibration'
    ].qualifyingMemoryIds).toContain('lyra_memory_enemies_in_phase');

    const lyraResonance = await store.dispatch(acquireTraitWithEssenceThunk({
      traitId: 'AdversarialCalibration',
      essenceCost: traits.AdversarialCalibration.essenceCost,
    }));
    expect(acquireTraitWithEssenceThunk.fulfilled.match(lyraResonance)).toBe(true);
    expect(store.getState().player.permanentTraits).toContain('AdversarialCalibration');
    expect(store.getState().relationships.experiencesById.lyra_exp_resonance_adversarial_calibration)
      .toBeDefined();
  });

  test('Archive Verification is learned only from Elara independent verification and expands the bounded routine floor to three', async () => {
    const store = makeStore();

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'elara_exp_model_challenged',
      timestamp: 300,
    })).unwrap();
    expect(store.getState().player.routineFamiliarity?.archive_verification).toBeUndefined();

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'elara_exp_independent_verification',
      timestamp: 301,
    })).unwrap();

    expect(store.getState().player.routineFamiliarity?.archive_verification).toEqual({
      source: 'elara_independent_verification',
      learnedAt: 301,
    });
    expect(COPY_PRODUCTION_TASKS.map(task => task.id)).toEqual([
      'forge_assistance',
      'resonance_calibration',
      'archive_verification',
    ]);
  });

  test('the third routine requires explicit delegation and survives save/load plus bounded offline continuation', async () => {
    const store = makeStore();

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'elara_exp_independent_verification',
      timestamp: 400,
    })).unwrap();

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: {
        role: 'researcher',
        maturity: 90,
        loyalty: 90,
        activeTask: null,
      },
    }));

    expect(store.getState().copy.copies['copy-001'].activeTask).toBeNull();

    jest.spyOn(Date, 'now').mockReturnValue(500_000);
    const started = await store.dispatch(startCopyProductionTaskThunk({
      copyId: 'copy-001',
      taskId: 'archive_verification',
    }));
    expect(startCopyProductionTaskThunk.fulfilled.match(started)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'archive_verification',
      durationSeconds: 71,
      progressSeconds: 0,
      status: 'running',
    });

    const saveId = createSave(store.getState(), 'GC-05 Archive Verification');
    expect(saveId).toBe('save_500000');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(resumed.getState().player.routineFamiliarity?.archive_verification?.source)
      .toBe('elara_independent_verification');
    expect(resumed.getState().copy.copies['copy-001'].activeTask?.productionTaskId)
      .toBe('archive_verification');

    const settled = await resumed.dispatch(settleOfflineProgressThunk({
      savedTimestamp: loaded!.envelope.timestamp,
      resumeTimestamp: loaded!.envelope.timestamp + 30_000,
    })).unwrap();

    expect(settled.tasks).toEqual([
      expect.objectContaining({
        productionTaskId: 'archive_verification',
        taskName: 'Archive Verification',
        completed: false,
        progressSeconds: 30,
      }),
    ]);
    expect(resumed.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'archive_verification',
      progressSeconds: 30,
      status: 'running',
    });
  });
});
