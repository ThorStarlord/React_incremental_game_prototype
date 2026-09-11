import fs from 'fs';
import path from 'path';
import { rootReducer, type RootState } from '../../app/store';
import { CHAPTER_DEFINITIONS, getChapterDefinition } from './ChapterDefinitions';
import { selectChapterProgress } from './ChapterSelectors';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const lyraBundle = readJson('public/data/relationships/lyra.json');

const initialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);

const withExperiences = (experienceIds: string[]): RootState => {
  const base = initialState();
  return {
    ...base,
    relationships: {
      ...base.relationships,
      experiencesById: Object.fromEntries(
        experienceIds.map(id => [id, lyraBundle.experiences[id] ?? { id }])
      ) as RootState['relationships']['experiencesById'],
    },
  };
};

const LYRA_ARC = [
  'lyra_exp_strategic_defeat',
  'lyra_exp_coercion_reflected',
  'lyra_exp_reluctant_cotraining',
  'lyra_exp_ideological_friction',
  'lyra_exp_mutual_calibration',
  'lyra_exp_proto_bond',
];

describe('post-M25 third heterogeneous chapter qualification', () => {
  test('adds a structurally different one-route chapter instead of cloning the prior two-route shape', () => {
    const chapter = getChapterDefinition('adversarial_calibration');

    expect(CHAPTER_DEFINITIONS.map(candidate => candidate.id)).toEqual([
      'merchant_district',
      'archive_inquiry',
      'adversarial_calibration',
    ]);
    expect(chapter.title).toBe('Enemies in Phase');
    expect(chapter.routes).toHaveLength(1);
    expect(getChapterDefinition('merchant_district').routes).toHaveLength(2);
    expect(getChapterDefinition('archive_inquiry').routes).toHaveLength(2);
  });

  test('progress is projected entirely from the already-authored Lyra relationship history', () => {
    expect(LYRA_ARC.every(id => Boolean(lyraBundle.experiences[id]))).toBe(true);

    const partial = selectChapterProgress(
      withExperiences(LYRA_ARC.slice(0, 3)),
      'adversarial_calibration'
    );
    expect(partial.status).toBe('in_progress');
    expect(partial.routes[0].satisfiedRequirements).toBe(3);
    expect(partial.routes[0].totalRequirements).toBe(6);

    const complete = selectChapterProgress(
      withExperiences(LYRA_ARC),
      'adversarial_calibration'
    );
    expect(complete.status).toBe('complete');
    expect(complete.completedRouteId).toBe('calibrated_opposition');
  });

  test('the chapter preserves the authored adversarial-bond memory rather than fabricating chapter-owned history', () => {
    expect(lyraBundle.memories.lyra_memory_enemies_in_phase).toEqual(
      expect.objectContaining({
        originExperienceId: 'lyra_exp_proto_bond',
        playerVisible: true,
        resonanceTags: expect.arrayContaining([
          'AdversarialBond',
          'MutualCalibration',
          'IdeologicalFriction',
        ]),
      })
    );
  });

  test('no chapter state machine, reducer, or save root is introduced', () => {
    const definitions = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/ChapterDefinitions.ts'),
      'utf8'
    );
    const requirements = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/ChapterRequirements.ts'),
      'utf8'
    );

    expect(definitions).not.toMatch(/createSlice\s*\(|persistReducer\s*\(/);
    expect(requirements).not.toMatch(/createSlice\s*\(|persistReducer\s*\(/);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/ChapterEngine.ts'))).toBe(false);
  });
});
