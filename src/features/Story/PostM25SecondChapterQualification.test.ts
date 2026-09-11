import fs from 'fs';
import path from 'path';
import { rootReducer, type RootState } from '../../app/store';
import {
  CHAPTER_DEFINITIONS,
  getChapterDefinition,
} from './ChapterDefinitions';
import { selectArchiveInquiryChapterProgress } from './ChapterSelectors';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const elaraBundle = readJson('public/data/relationships/elara.json');
const traits = readJson('public/data/traits.json');

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

const withExperiences = (experienceIds: string[]): RootState => {
  const base = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
  return {
    ...base,
    relationships: {
      ...base.relationships,
      experiencesById: Object.fromEntries(
        experienceIds.map(id => [id, { id }])
      ) as RootState['relationships']['experiencesById'],
    },
  };
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

  test('partial Archive Inquiry evidence derives in_progress without fabricating completion', () => {
    const state = withExperiences(commonOpening);
    const progress = selectArchiveInquiryChapterProgress(state);

    expect(progress.status).toBe('in_progress');
    expect(progress.completedRouteId).toBeNull();
    expect(progress.routes.every(route => route.satisfied === false)).toBe(true);
  });

  test('Evidence Over Ownership derives completion only from its required canonical experiences', () => {
    const state = withExperiences([
      ...commonOpening,
      'elara_exp_follow_evidence',
      ...commonLateArc,
    ]);
    const progress = selectArchiveInquiryChapterProgress(state);

    expect(progress.status).toBe('complete');
    expect(progress.completedRouteId).toBe('evidence_over_ownership');
    expect(progress.routes.find(route => route.id === 'evidence_over_ownership')?.satisfied).toBe(true);
    expect(progress.routes.find(route => route.id === 'cautious_then_reopened')?.satisfied).toBe(false);
  });

  test('Cautious Consensus Later Reopened derives a distinct completed route', () => {
    const state = withExperiences([
      ...commonOpening,
      'elara_exp_protect_consensus',
      ...commonLateArc,
    ]);
    const progress = selectArchiveInquiryChapterProgress(state);

    expect(progress.status).toBe('complete');
    expect(progress.completedRouteId).toBe('cautious_then_reopened');
    expect(progress.routes.find(route => route.id === 'cautious_then_reopened')?.satisfied).toBe(true);
    expect(progress.routes.find(route => route.id === 'evidence_over_ownership')?.satisfied).toBe(false);
  });

  test('production Elara authority preserves route-specific memory evidence and a shared Scholarly Insight boundary', () => {
    const followEvidence = elaraBundle.experiences.elara_exp_follow_evidence;
    const protectConsensus = elaraBundle.experiences.elara_exp_protect_consensus;
    const independentVerification = elaraBundle.experiences.elara_exp_independent_verification;
    const insight = traits.ScholarlyInsight;

    expect(followEvidence.memoryDefinitionId).toBe('elara_memory_footnote_won');
    expect(protectConsensus.memoryDefinitionId).toBeUndefined();
    expect(independentVerification.memoryDefinitionId).toBe('elara_memory_result_held_without_her');
    expect(elaraBundle.memories.elara_memory_result_held_without_her.resonanceTags)
      .toContain('IndependentVerification');

    expect(insight.sourceNpc).toBe('npc_scholar_elara');
    expect(insight.minimumConnectionLevel).toBe(2);
    expect(insight.assimilationThreshold).toBe(100);
    expect(insight.minimumCompatibility).toBe(25);
    expect(insight.requiredMemoryTags).toContain('IndependentVerification');
    expect(insight.resonanceExperienceId).toBe('elara_exp_resonance_scholarly_insight');
  });
});