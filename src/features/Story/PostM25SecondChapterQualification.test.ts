import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../app/store';
import { setNPCs } from '../NPCs/state/NPCSlice';
import { loadTraits } from '../Traits/state/TraitsSlice';
import { gainEssence } from '../Essence/state/EssenceSlice';
import { acquireTraitWithEssenceThunk } from '../Traits/state/TraitThunks';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from '../Relationships/state/RelationshipThunks';
import { selectRelationshipMemoriesByNpcId } from '../Relationships/state/RelationshipSelectors';
import {
  CHAPTER_DEFINITIONS,
  getChapterDefinition,
} from './ChapterDefinitions';
import { selectArchiveInquiryChapterProgress } from './ChapterSelectors';

const ELARA_ID = 'npc_scholar_elara';
const INSIGHT_ID = 'ScholarlyInsight';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const traits = readJson('public/data/traits.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

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

const initialize = async (store: TestStore) => {
  store.dispatch(setNPCs(npcs));
  store.dispatch(loadTraits(traits));
  await store.dispatch(initializeRelationshipRuntimeThunk({ seedProfiles: true })).unwrap();
};

const record = async (store: TestStore, experienceIds: string[]) => {
  for (const experienceId of experienceIds) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
};

const commonOpening = [
  'elara_exp_model_challenged',
  'elara_exp_contradictory_footnote',
  'elara_exp_tome_committed',
];

const commonLateArc = [
  'elara_exp_revision_mutual',
  'elara_exp_theory_neither_owned',
  'elara_exp_independent_verification',
];

const acquireInsight = async (store: TestStore) => {
  store.dispatch(gainEssence({ amount: 100 }));
  const result = await store.dispatch(
    acquireTraitWithEssenceThunk({ traitId: INSIGHT_ID, essenceCost: 30 })
  );
  expect(acquireTraitWithEssenceThunk.fulfilled.match(result)).toBe(true);
  expect(store.getState().player.permanentTraits).toContain(INSIGHT_ID);
};

describe('post-M25 second heterogeneous chapter qualification', () => {
  test('Archive Inquiry is a derived second chapter contract, not a new state authority', () => {
    expect(CHAPTER_DEFINITIONS.map(chapter => chapter.id)).toEqual([
      'merchant_district',
      'archive_inquiry',
    ]);
    const archive = getChapterDefinition('archive_inquiry');
    expect(archive.routes.map(route => route.id)).toEqual([
      'evidence_over_ownership',
      'cautious_then_reopened',
    ]);
    expect(archive.centerOfGravity).toContain('evidence interpretation');

    const initialState = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
    expect(Object.keys(initialState)).not.toContain('chapter');
    expect(Object.keys(initialState)).not.toContain('story');

    const definitionSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/ChapterDefinitions.ts'),
      'utf8'
    );
    expect(definitionSource).not.toContain('createSlice');
    expect(definitionSource).not.toContain('ChapterEngine');
  });

  test('Evidence Over Ownership completes the chapter with costly-correction memory and permanent Scholarly Insight', async () => {
    const store = makeStore();
    await initialize(store);

    await record(store, commonOpening);
    expect(selectArchiveInquiryChapterProgress(store.getState()).status).toBe('in_progress');

    await record(store, ['elara_exp_follow_evidence', ...commonLateArc]);

    const progress = selectArchiveInquiryChapterProgress(store.getState());
    expect(progress.status).toBe('complete');
    expect(progress.completedRouteId).toBe('evidence_over_ownership');
    expect(progress.routes.find(route => route.id === 'cautious_then_reopened')?.satisfied).toBe(false);

    const memoryIds = selectRelationshipMemoriesByNpcId(store.getState(), ELARA_ID)
      .map(memory => memory.id);
    expect(memoryIds).toContain('elara_memory_footnote_won');
    expect(memoryIds).toContain('elara_memory_theory_neither_owned');
    expect(memoryIds).toContain('elara_memory_result_held_without_her');

    await acquireInsight(store);
  });

  test('Cautious Consensus can reopen later, complete by a distinct history, and converge on the same learned capability', async () => {
    const store = makeStore();
    await initialize(store);

    await record(store, [...commonOpening, 'elara_exp_protect_consensus', ...commonLateArc]);

    const progress = selectArchiveInquiryChapterProgress(store.getState());
    expect(progress.status).toBe('complete');
    expect(progress.completedRouteId).toBe('cautious_then_reopened');
    expect(progress.routes.find(route => route.id === 'evidence_over_ownership')?.satisfied).toBe(false);

    const memoryIds = selectRelationshipMemoriesByNpcId(store.getState(), ELARA_ID)
      .map(memory => memory.id);
    expect(memoryIds).not.toContain('elara_memory_footnote_won');
    expect(memoryIds).toContain('elara_memory_theory_neither_owned');
    expect(memoryIds).toContain('elara_memory_result_held_without_her');

    await acquireInsight(store);
  });

  test('the two chapter routes preserve different relationship history instead of collapsing to one hidden completion flag', async () => {
    const evidenceStore = makeStore();
    const cautiousStore = makeStore();
    await initialize(evidenceStore);
    await initialize(cautiousStore);

    await record(evidenceStore, [...commonOpening, 'elara_exp_follow_evidence', ...commonLateArc]);
    await record(cautiousStore, [...commonOpening, 'elara_exp_protect_consensus', ...commonLateArc]);

    const evidenceExperiences = Object.keys(evidenceStore.getState().relationships.experiencesById);
    const cautiousExperiences = Object.keys(cautiousStore.getState().relationships.experiencesById);
    expect(evidenceExperiences).toContain('elara_exp_follow_evidence');
    expect(evidenceExperiences).not.toContain('elara_exp_protect_consensus');
    expect(cautiousExperiences).toContain('elara_exp_protect_consensus');
    expect(cautiousExperiences).not.toContain('elara_exp_follow_evidence');

    expect(selectArchiveInquiryChapterProgress(evidenceStore.getState()).completedRouteId)
      .toBe('evidence_over_ownership');
    expect(selectArchiveInquiryChapterProgress(cautiousStore.getState()).completedRouteId)
      .toBe('cautious_then_reopened');
  });
});
