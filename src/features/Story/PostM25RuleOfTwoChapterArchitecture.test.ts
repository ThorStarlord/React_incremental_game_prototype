import fs from 'fs';
import path from 'path';
import { rootReducer, type RootState } from '../../app/store';
import { getChapterDefinition } from './ChapterDefinitions';
import { selectChapterProgress } from './ChapterSelectors';
import {
  chapterRequirementKey,
  isChapterRequirementSatisfied,
  listChapterRouteRequirements,
} from './ChapterRequirements';

const initialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);

describe('post-M25 Rule-of-Two chapter architecture', () => {
  test('normalizes only the requirement kinds already repeated by the first two chapters', () => {
    const merchant = getChapterDefinition('merchant_district');
    const archive = getChapterDefinition('archive_inquiry');

    expect(listChapterRouteRequirements(merchant.routes[0])).toEqual([
      { kind: 'completed_dialogue', id: 'valerius_m25_public_order_conclusion' },
    ]);
    expect(listChapterRouteRequirements(archive.routes[0]).map(chapterRequirementKey)).toEqual(
      expect.arrayContaining([
        'experience:elara_exp_model_challenged',
        'experience:elara_exp_follow_evidence',
        'experience:elara_exp_independent_verification',
      ])
    );
  });

  test('shared evaluator reads canonical domain authorities without owning chapter state', () => {
    const state = initialState();
    const requirement = {
      kind: 'experience' as const,
      id: 'elara_exp_model_challenged',
    };

    expect(isChapterRequirementSatisfied(state, requirement)).toBe(false);

    const progressed: RootState = {
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          elara_exp_model_challenged: { id: 'elara_exp_model_challenged' } as any,
        },
      },
    };

    expect(isChapterRequirementSatisfied(progressed, requirement)).toBe(true);
    expect(selectChapterProgress(progressed, 'archive_inquiry').status).toBe('in_progress');
  });

  test('both chapter and insight selectors consume the bounded helper and no ChapterEngine is introduced', () => {
    const chapterSelectors = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/ChapterSelectors.ts'),
      'utf8'
    );
    const insightSelectors = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/PlayerInsightSelectors.ts'),
      'utf8'
    );
    const helper = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/ChapterRequirements.ts'),
      'utf8'
    );

    expect(chapterSelectors).toContain('listChapterRouteRequirements');
    expect(insightSelectors).toContain('listChapterRouteRequirements');
    expect(helper).not.toMatch(/createSlice\s*\(|combineReducers\s*\(|persistReducer\s*\(/);
    expect(fs.existsSync(path.join(process.cwd(), 'src/features/Story/ChapterEngine.ts'))).toBe(false);
  });
});
