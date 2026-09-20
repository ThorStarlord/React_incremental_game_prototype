import type { RootState } from '../../app/store';
import { selectChapterProgress } from './ChapterSelectors';

export const GC02_FIRST_LESSON_EXPERIENCE_ID = 'willow_exp_first_lesson';

export type OpeningCampaignStage =
  | 'PROLOGUE'
  | 'CHAPTER_1'
  | 'CHAPTER_2'
  | 'CHAPTER_3'
  | 'GC03_COMPLETE';

/**
 * Derive the opening Campaign One spine entirely from canonical domain evidence.
 * This selector owns no chapter state and deliberately enforces sequential
 * presentation: later evidence cannot skip an unfinished earlier chapter.
 */
export const selectOpeningCampaignStage = (state: RootState): OpeningCampaignStage => {
  if (!state.relationships.experiencesById[GC02_FIRST_LESSON_EXPERIENCE_ID]) {
    return 'PROLOGUE';
  }

  if (selectChapterProgress(state, 'merchant_district').status !== 'complete') {
    return 'CHAPTER_1';
  }

  if (selectChapterProgress(state, 'archive_inquiry').status !== 'complete') {
    return 'CHAPTER_2';
  }

  if (selectChapterProgress(state, 'adversarial_calibration').status !== 'complete') {
    return 'CHAPTER_3';
  }

  return 'GC03_COMPLETE';
};

export const selectOpeningCampaignSpineComplete = (state: RootState): boolean =>
  selectOpeningCampaignStage(state) === 'GC03_COMPLETE';
