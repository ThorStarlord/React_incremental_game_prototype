import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { setNPCs } from '../../NPCs/state/NPCSlice';
import { loadTraits } from '../../Traits/state/TraitsSlice';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { acquireTraitWithEssenceThunk } from '../../Traits/state/TraitThunks';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from './RelationshipThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
  selectUsesRelationshipConnectionAuthority,
} from './RelationshipSelectors';

const ELARA_ID = 'npc_scholar_elara';
const INSIGHT_ID = 'ScholarlyInsight';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const willowBundle = readJson('public/data/relationships/elder-willow.json');
const lyraBundle = readJson('public/data/relationships/lyra.json');
const elaraBundle = readJson('public/data/relationships/elara.json');
const npcs = readJson('public/data/npcs.json');
const traits = readJson('public/data/traits.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');

const bundleByUrl: Record<string, any> = {
  '/data/relationships/elder-willow.json': willowBundle,
  '/data/relationships/lyra.json': lyraBundle,
  '/data/relationships/elara.json': elaraBundle,
};

const makeStore = () => configureStore({ reducer: rootReducer });

const initialize = async (store: ReturnType<typeof makeStore>) => {
  store.dispatch(setNPCs(npcs));
  store.dispatch(loadTraits(traits));
  await store.dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true })).unwrap();
};

const recordPath = async (
  store: ReturnType<typeof makeStore>,
  resolution: 'elara_exp_follow_evidence' | 'elara_exp_protect_consensus'
) => {
  const ids = [
    'elara_exp_model_challenged',
    'elara_exp_contradictory_footnote',
    'elara_exp_tome_committed',
    resolution,
    'elara_exp_revision_mutual',
    'elara_exp_theory_neither_owned',
    'elara_exp_independent_verification',
  ];
  for (const experienceId of ids) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
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

describe('M7 Elara collaborative relationship migration', () => {
  test('production content is manifest-driven and internally wired without an Elara engine exception', () => {
    expect(manifest.bundles).toContain('/data/relationships/elara.json');
    expect(elaraBundle.progression[ELARA_ID].connectionAuthority).toBe('relationships');
    expect(elaraBundle.progression[ELARA_ID].essence.enabled).toBe(true);

    const elara = npcs[ELARA_ID];
    expect(elara.availableDialogues.length).toBeGreaterThanOrEqual(6);
    for (const dialogueId of elara.availableDialogues) {
      expect(dialogues[dialogueId]).toBeDefined();
      expect(dialogues[dialogueId].npcId).toBe(ELARA_ID);
    }

    const tomeQuest = quests.quest_elara_lost_tome;
    const offerEffects = dialogues.elara_offer_tome.effects as any[];
    const givenItem = offerEffects.find(effect => effect.type === 'GIVE_ITEM');
    expect(givenItem.itemId).toBe(tomeQuest.objectives[0].target);
    for (const option of tomeQuest.resolutionOptions) {
      expect(elaraBundle.experiences[option.relationshipExperienceId]).toBeDefined();
    }

    const insight = traits[INSIGHT_ID];
    expect(insight.sourceNpc).toBe(ELARA_ID);
    expect(insight.minimumConnectionLevel).toBe(2);
    expect(insight.requiredMemoryTags).toContain('IndependentVerification');
    expect(insight.resonanceExperienceId).toBe('elara_exp_resonance_scholarly_insight');

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
    ]) {
      expect(fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8')).not.toContain(ELARA_ID);
    }
  });

  test('reciprocal inquiry reaches Connection II, passive Essence, full assimilation, and permanent Scholarly Insight', async () => {
    const store = makeStore();
    await initialize(store);

    expect(selectUsesRelationshipConnectionAuthority(store.getState(), ELARA_ID)).toBe(true);

    store.dispatch(gainEssence({ amount: 100 }));
    const premature = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: INSIGHT_ID, essenceCost: 30 })
    );
    expect(acquireTraitWithEssenceThunk.rejected.match(premature)).toBe(true);
    expect(store.getState().player.permanentTraits).not.toContain(INSIGHT_ID);
    expect(store.getState().essence.currentEssence).toBe(100);

    await recordPath(store, 'elara_exp_follow_evidence');

    const profile = selectBondProfileByNpcId(store.getState(), ELARA_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(profile.connectionProgress).toBe(87);
    expect(profile.dimensions.understanding).toBeGreaterThanOrEqual(50);
    expect(profile.dimensions.sharedMeaning).toBeGreaterThanOrEqual(40);
    expect(profile.dimensions.reciprocity).toBeGreaterThanOrEqual(30);

    const memories = selectRelationshipMemoriesByNpcId(store.getState(), ELARA_ID);
    expect(memories.map(memory => memory.title)).toEqual(expect.arrayContaining([
      'The Footnote That Won',
      'A Theory Neither Owned',
      'The Result Held Without Her',
    ]));

    const contribution = selectRelationshipEssenceContributionByNpcId(store.getState(), ELARA_ID);
    expect(contribution.enabled).toBe(true);
    expect(contribution.effectiveRate).toBeGreaterThan(0);

    const assimilation = selectTraitAssimilationState(store.getState(), ELARA_ID, INSIGHT_ID);
    expect(assimilation.progress).toBe(100);
    expect(assimilation.compatibility).toBeGreaterThanOrEqual(25);

    const essenceBefore = store.getState().essence.currentEssence;
    const resonance = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: INSIGHT_ID, essenceCost: 30 })
    );
    expect(acquireTraitWithEssenceThunk.fulfilled.match(resonance)).toBe(true);
    expect(store.getState().player.permanentTraits).toContain(INSIGHT_ID);
    expect(store.getState().essence.currentEssence).toBe(essenceBefore - 30);
    expect(store.getState().relationships.experiencesById.elara_exp_resonance_scholarly_insight).toBeDefined();
  });

  test('the cautious branch can recover through later reciprocal revision rather than becoming a permanent dead end', async () => {
    const store = makeStore();
    await initialize(store);
    await recordPath(store, 'elara_exp_protect_consensus');

    const profile = selectBondProfileByNpcId(store.getState(), ELARA_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(profile.dimensions.reciprocity).toBeGreaterThanOrEqual(25);

    const assimilation = selectTraitAssimilationState(store.getState(), ELARA_ID, INSIGHT_ID);
    expect(assimilation.progress).toBe(100);
    expect(assimilation.compatibility).toBeGreaterThanOrEqual(25);
    expect(
      selectRelationshipMemoriesByNpcId(store.getState(), ELARA_ID)
        .some(memory => memory.resonanceTags.includes('IndependentVerification'))
    ).toBe(true);
  });
});
